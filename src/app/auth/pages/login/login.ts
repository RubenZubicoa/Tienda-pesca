import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Register } from '../register/register';

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

  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(6)]],
  });

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    // Simulación local hasta conectar la API.
    const ok = false

    if (!ok) {
      this.errorMessage.set('Correo o contraseña incorrectos. Usa los datos de prueba indicados abajo.');
      this.isSubmitting.set(false);
      return;
    }

    this.successMessage.set('Sesión iniciada correctamente (modo demo). Redirigiendo…');
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigateByUrl('/');
    }, 900);
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
