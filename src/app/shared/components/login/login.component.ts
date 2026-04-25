import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private static readonly USERNAME_MIN_LENGTH = 3;
  private static readonly PASSWORD_MIN_LENGTH = 3;

  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly isPasswordVisible = signal(false);

  protected readonly loginForm = this._fb.group({
    userName: ['', [Validators.required, Validators.minLength(LoginComponent.USERNAME_MIN_LENGTH)]],
    password: ['', [Validators.required, Validators.minLength(LoginComponent.PASSWORD_MIN_LENGTH)]],
  });

  protected readonly passwordInputType = computed(() =>
    this.isPasswordVisible() ? 'text' : 'password'
  );

  protected readonly isSubmitDisabled = computed(() => this.loginForm.invalid || this.isLoading());

  constructor() {
    this.loginForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.errorMessage()) {
        this.errorMessage.set('');
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const userName = this.loginForm.controls.userName.value?.trim() ?? '';
    const password = this.loginForm.controls.password.value ?? '';

    this._authService
      .login(userName, password)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this._router.navigate(['/dashboard']);
        },
        error: error => {
          this.errorMessage.set(this._resolveErrorMessage(error));
        },
      });
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update(value => !value);
  }

  protected userNameErrorMessage(): string {
    const control = this.loginForm.controls.userName;
    if (!control.touched && !control.dirty) {
      return '';
    }

    if (control.hasError('required')) {
      return 'El usuario es obligatorio';
    }

    if (control.hasError('minlength')) {
      return `El usuario debe tener al menos ${LoginComponent.USERNAME_MIN_LENGTH} caracteres`;
    }

    return '';
  }

  protected passwordErrorMessage(): string {
    const control = this.loginForm.controls.password;
    if (!control.touched && !control.dirty) {
      return '';
    }

    if (control.hasError('required')) {
      return 'La contraseña es obligatoria';
    }

    if (control.hasError('minlength')) {
      return `La contraseña debe tener al menos ${LoginComponent.PASSWORD_MIN_LENGTH} caracteres`;
    }

    return '';
  }

  private _resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = this._extractApiMessage(error.error);
      if (apiMessage) {
        return apiMessage;
      }

      if (error.status === 401 || error.status === 403) {
        return 'Credenciales incorrectas';
      }

      if (error.status === 0) {
        return 'No se pudo conectar con el servidor';
      }
    }

    return 'No se pudo iniciar sesión. Inténtalo nuevamente';
  }

  private _extractApiMessage(errorBody: unknown): string | null {
    if (!errorBody || typeof errorBody !== 'object') {
      return null;
    }

    const body = errorBody as Record<string, unknown>;
    const message = body['message'] ?? body['title'] ?? null;

    return typeof message === 'string' && message.trim() ? message : null;
  }
}
