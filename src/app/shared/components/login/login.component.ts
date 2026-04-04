import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '@shared/services/auth.service';
import { ButtonComponent } from '../button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly loginForm = this._fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.loginForm.value;

    this._authService.login(username!, password!).subscribe({
      next: (user: User | null) => {
        this.isLoading.set(false);
        if (user) {
          this._router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Credenciales incorrectas');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al iniciar sesión');
      },
    });
  }
}
