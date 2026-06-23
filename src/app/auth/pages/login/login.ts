import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Register } from '../register/register';
import { Login as LoginService } from '../../services/login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Register],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  protected readonly showRegister = signal(false);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly isSubmitting = signal(false);

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

    this.loginService.login(email, password).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        this.errorMessage.set(error.error.message);
      }
    });
  }

  protected openRegister() {
    this.showRegister.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  protected closeRegister() {
    this.showRegister.set(false);
  }
}
