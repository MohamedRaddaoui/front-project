import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QAService } from '../services/qa.service';
import { Question } from '../models/qa.models';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
   standalone: true,
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css'],
  imports: [CommonModule, ReactiveFormsModule]  // ✅ Import this for standalone form support

})
export class CreateQuestionComponent {
  questionForm: FormGroup;
  userId: string = '682eab77d9111ae4d8447e5d'; 
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private questionService: QAService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      tags: ['']
    });
  }

  createQuestion(): void {
    if (this.questionForm.valid) {
      const question: Partial<Question> = {
        title: this.questionForm.get('title')?.value,
        content: this.questionForm.get('content')?.value,
        author: this.userId,
        tags: this.questionForm.get('tags')?.value
          ? this.questionForm.get('tags')?.value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
          : []
      };

      this.questionService.askQuestion(question).subscribe({
        next: (newQuestion) => {
          this.successMessage = 'Question created successfully!';
          this.errorMessage = null;
          this.questionForm.reset();
          setTimeout(() => {
            this.router.navigate(['/questions', newQuestion._id]);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = `Error creating question: ${error.message}`;
          this.successMessage = null;
        }
      });
    }
  }

  get title() { return this.questionForm.get('title'); }
  get content() { return this.questionForm.get('content'); }
}