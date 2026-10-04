import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Register } from '../register/register';
import { Login as LoginService } from '../../services/login';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Register],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  protected readonly showRegister = signal(false);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly isSubmitting = signal(false);

  private readonly authReason = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('reason') ?? '')),
    { initialValue: this.route.snapshot.queryParamMap.get('reason') ?? '' },
  );

  protected readonly requiresAuthMessage = computed(() =>
    this.authReason() === 'checkout'
      ? 'Para finalizar la compra debes iniciar sesión o registrarte.'
      : '',
  );

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Por favor, completa todos los campos.');
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.loginService.login(email, password).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudo iniciar sesión.');
      },
    });
  }

  protected openRegister() {
    this.showRegister.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  protected closeRegister() {
    this.showRegister.set(false);
    this.successMessage.set('Cuenta creada. Inicia sesión para continuar.');
  }
}
