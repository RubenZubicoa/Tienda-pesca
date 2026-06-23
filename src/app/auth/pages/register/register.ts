import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../core/services/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddUser } from '../../../core/models/User';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  readonly goToLogin = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(User);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]{9,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    const user: AddUser = {
      name: this.form.value.name ?? '',
      lastName: this.form.value.lastName ?? '',
      phone: this.form.value.phone ?? '',
      email: this.form.value.email ?? '',
      address: '',
      role: 'user',
      password: this.form.value.password ?? '',

    }

    this.userService.createUser(user).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.successMessage.set('Cuenta creada correctamente.');
        this.isSubmitting.set(false);
        this.goToLogin.emit();
      },
      error: (error) => {
        this.errorMessage.set(error.error.message);
      }
    });
  }

  protected passwordsMismatch(): boolean {
    const confirm = this.form.controls.confirmPassword;
    return (confirm.touched || this.form.touched) && this.form.hasError('passwordsMismatch');
  }
}
