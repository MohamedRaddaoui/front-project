import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Question, Answer } from '../models/qa.models';
import { QAService } from '../services/qa.service';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './question-detail.component.html',
  styleUrl: './question-detail.component.css'
})
export class QuestionDetailComponent implements OnInit {
  question: Question | null = null;
  answers: Answer[] = [];
  sortBy: string = 'newest';
  answerForm: FormGroup;
  loading = true;
  error = '';
  currentUserId = 'user123'; // Temporary, should come from auth service
  replyForms: { [key: string]: FormGroup } = {};

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private qaService: QAService
  ) {
    this.answerForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const questionId = params['id'];
      this.loadQuestion(questionId);
      this.loadAnswers(questionId);
    });
  }

  private loadQuestion(questionId: string): void {
    this.loading = true;
    this.qaService.getQuestionById(questionId).subscribe({
      next: (question: Question) => {
        this.question = question;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error loading question';
        this.loading = false;
        console.error(error);
      }
    });
  }
  private loadAnswers(questionId: string): void {
    // Use getQuestionById to get the answers as they are part of the question
    this.qaService.getQuestionById(questionId).subscribe({
      next: (question: Question) => {
        this.answers = question.answers || [];
        // Initialize reply forms for each answer
        this.answers.forEach(answer => {
          if (answer._id) {
            this.replyForms[answer._id] = this.fb.group({
              content: ['', Validators.required]
            });
          }
        });
      },
      error: (error: any) => {
        console.error('Error loading answers:', error);
      }
    });
  }

  onSubmitAnswer(): void {
    if (this.answerForm.valid && this.question?._id) {
      const answer = {
        content: this.answerForm.value.content,
        questionId: this.question._id,
        author: this.currentUserId
      };

      this.qaService.answerQuestion(this.question._id, answer).subscribe({
        next: (newAnswer: Answer) => {
          this.answers.push(newAnswer);
          this.answerForm.reset();
        },
        error: (error: any) => {
          console.error('Error posting answer:', error);
        }
      });
    }
  }

 

 


}
