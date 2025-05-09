import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatProgressSpinnerModule
  ],
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgetPasswordForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      this.userService.forgetPassword(this.forgetPasswordForm.value.email)
        .subscribe({
          next: (response) => {
            this.snackBar.open(
              'Reset link has been sent to your email!', 
              'Close', 
              {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
              }
            );
            
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (error: HttpErrorResponse) => {
            this.isSubmitting = false;
            if (error.status === 404) {
              this.errorMessage = 'Email address not found';
            } else {
              this.errorMessage = 'An error occurred. Please try again later.';
            }
            this.snackBar.open(this.errorMessage, 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
            console.error('Forget password error:', error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    } else {
      Object.keys(this.forgetPasswordForm.controls).forEach(key => {
        const control = this.forgetPasswordForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
