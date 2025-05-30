import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  verificationForm: FormGroup;
  hidePassword = true;
  errorMessage: string = '';
  showVerificationStep = false;
  userEmail: string = '';
  isVerifying: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      termsAccepted: [false],
    });

    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      if (!this.loginForm.get('termsAccepted')?.value) {
        this.errorMessage = 'Please accept the Terms & Conditions to continue';
        return;
      }

      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.userService.login(credentials).subscribe({
        next: (response: any) => {
          if (response.message) {
            this.userEmail = credentials.email;
            this.showVerificationStep = true;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Failed to send verification code';
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.status === 401
            ? 'Invalid email or password'
            : 'An error occurred. Please try again.';
          console.error('Login error:', error);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      if (!this.loginForm.get('termsAccepted')?.value) {
        this.errorMessage = 'Please accept the Terms & Conditions to continue';
      }
    }
  }

  verifyCode(): void {
    if (this.verificationForm.valid && !this.isVerifying) {
      this.isVerifying = true;
      const trimmedCode = this.verificationForm.value.code.trim();

      const verificationData = {
        email: this.userEmail,
        code: trimmedCode,
      };

      console.log('Sending verification data:', verificationData);

      this.userService.verify2FA(verificationData).subscribe({
        next: (response: any) => {
          console.log('Login response:', response);
          this.isVerifying = false;
          if (response && response.token) {
            this.tokenService.setToken(response.token);
            this.router.navigate(['/project']);
          } else {
            this.errorMessage = 'Invalid verification code';
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isVerifying = false;
          this.errorMessage = 'Invalid verification code';
          console.error('Verification error:', error);
        },
      });
    } else {
      this.verificationForm.markAllAsTouched();
    }
  }

  forgotPassword(): void {
    this.router.navigate(['/forget-password']);
  }

  signUp(): void {
    this.router.navigate(['/signup']);
  }

  logout(): void {
    this.tokenService.removeToken();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
