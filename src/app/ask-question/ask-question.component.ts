import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QaService } from '../services/qa.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-ask-question',
  standalone: true,
  imports: [CommonModule, NavBarComponent, HttpClientModule, RouterLink, ReactiveFormsModule, SideBarComponent],
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AskQuestionComponent {
  questionForm: FormGroup;
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  currentUserId: string = '68312cd05f85d8f5a5ab243f'; // Replace with TokenService integration

  constructor(
    private fb: FormBuilder,
    private qaService: QaService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      tags: ['', [Validators.maxLength(100)]]
    });
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = null;
    this.success = null;
    const { title, content, tags } = this.questionForm.value;
    const payload = {
      title,
      content,
      author: this.currentUserId,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : []
    };
    this.qaService.createQuestion(payload).subscribe({
      next: (question) => {
        this.loading = false;
        this.success = 'Question posted successfully!';
        this.questionForm.reset();
        setTimeout(() => this.router.navigate(['/forum']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to post question. Please try again.';
        console.error('Create question error:', err);
      }
    });
  }
}