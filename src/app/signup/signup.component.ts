import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  imports: [
    RouterModule,
    MatInputModule,
    MatIcon,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [MatFormFieldModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string = '';

  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get formControls() {
    return this.signupForm.controls;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    const formData = new FormData();

    formData.append('firstname', this.signupForm.value.firstname);
    formData.append('lastname', this.signupForm.value.lastname);
    formData.append('email', this.signupForm.value.email);
    formData.append('password', this.signupForm.value.password);

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.userService.addUser(formData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.errorMessage =
            'This email is already registered. Please use a different email.';
        } else {
          this.errorMessage =
            'An error occurred during registration. Please try again.';
        }
        console.error('Registration error:', error);
      },
    });
  }
}
