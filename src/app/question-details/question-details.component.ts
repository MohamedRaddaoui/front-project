import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForumService, Question, Answer } from '../services/forum.service';

@Component({
  selector: 'app-question-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionDetailsComponent implements OnInit {
  question: Question | null = null;
  answers: Answer[] = [];
  answerForm: FormGroup;
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  currentUserId: string = '68312cd05f85d8f5a5ab243f'; // Hardcoded for testing

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private forumService: ForumService
  ) {
    this.answerForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]]
    });
  }

  ngOnInit(): void {
    const questionId = this.route.snapshot.paramMap.get('questionId');
    if (questionId) {
      this.loadQuestion(questionId);
      this.loadAnswers(questionId);
    }
  }

  loadQuestion(id: string): void {
    this.loading = true;
    this.error = null;
    this.forumService.getQuestionById(id).subscribe({
      next: (question) => {
        console.log('Question loaded:', question);
        this.question = question;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load question. Please try again later.';
        this.loading = false;
        console.error('Load question error:', err);
      }
    });
  }

  loadAnswers(questionId: string): void {
    this.forumService.getAnswers(questionId).subscribe({
      next: (answers) => {
        console.log('Answers loaded:', answers);
        this.answers = answers;
      },
      error: (err) => {
        this.error = 'Failed to load answers. Please try again later.';
        console.error('Load answers error:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.answerForm.invalid) {
      this.answerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const { content } = this.answerForm.value;
    const payload = {
      content,
      author: this.currentUserId
    };

    this.forumService.createAnswer(this.question!._id, payload).subscribe({
      next: (answer) => {
        console.log('Answer posted:', answer);
        this.loading = false;
        this.success = 'Answer posted successfully!';
        this.answerForm.reset();
        this.loadAnswers(this.question!._id); // Refresh answers
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to post answer. Please try again.';
        console.error('Post answer error:', err);
      }
    });
  }

  upvoteAnswer(answerId: string): void {
    this.forumService.voteAnswer(answerId, this.currentUserId, 'up').subscribe({
      next: (updatedAnswer) => {
        console.log('Answer upvoted:', updatedAnswer);
        this.loadAnswers(this.question!._id); // Refresh answers
      },
      error: (err) => {
        this.error = 'Failed to upvote answer. Please try again.';
        console.error('Upvote answer error:', err);
      }
    });
  }

  downvoteAnswer(answerId: string): void {
    this.forumService.voteAnswer(answerId, this.currentUserId, 'down').subscribe({
      next: (updatedAnswer) => {
        console.log('Answer downvoted:', updatedAnswer);
        this.loadAnswers(this.question!._id); // Refresh answers
      },
      error: (err) => {
        this.error = 'Failed to downvote answer. Please try again.';
        console.error('Downvote answer error:', err);
      }
    });
  }
}