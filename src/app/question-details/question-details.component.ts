import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faChevronUp, faChevronDown, faReply } from '@fortawesome/free-solid-svg-icons';
import { QaService } from '../services/qa.service';
import { TokenService } from '../services/token.service';
import { Question, Answer } from '../models/qa.model';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { User } from '../models/user';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SideBarComponent,
    NavBarComponent
  ]
})
export class QuestionViewComponent implements OnInit {
  question!: Question;
  answers: Answer[] = [];
  editingAnswer: Answer | null = null; // Updated to track the full answer object
  editingQuestion: boolean = false;
  editQuestionForm: FormGroup;
  answerForm: FormGroup; // Added for the answer submission form
  replyForm: FormGroup;
  error: string | null = null; // For error messages
  success: string | null = null; // For success messages
  currentUserId: string = ''; // Current user ID from token service
  loading: boolean = false; // Loading state
  replyingToAnswer: Answer | null = null;

  // FontAwesome icons
  faEdit = faEdit;
  faTrash = faTrash;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faReply = faReply;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qaService: QaService,
    private tokenService: TokenService,
    private fb: FormBuilder
  ) {
    this.editQuestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      tags: ['', [Validators.maxLength(100)]]
    });
    this.answerForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]]
    });
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.currentUserId = this.tokenService.getCurrentUserId() || '';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.getQuestion(id);
      this.getAnswers(id);
    }
  }

  /** 
   * Determines if the current user is the author of a question or answer.
   */
  isAuthor(item: Question | Answer): boolean {
    if (!this.currentUserId || !item.author) return false;
    if (typeof item.author === 'string') return this.currentUserId === item.author;
    if (typeof item.author === 'object' && item.author !== null && '_id' in item.author) {
      return this.currentUserId === item.author._id;
    }
    console.error('Invalid author type or missing _id', item.author);
    return false;
  }

  /** 
   * Safely retrieves the author's name from a string or object.
   */
  getAuthorName(author: any): string {
    if (typeof author === 'string') return author;
    if (author?.firstName && author?.lastName) return `${author.firstName} ${author.lastName}`;
    return 'Anonymous';
  }

  getQuestion(id: string): void {
    this.qaService.getQuestion(id).subscribe({
      next: (question) => {
        this.question = question;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load question.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getAnswers(questionId: string): void {
    this.qaService.getAnswers(questionId).subscribe({
      next: (answers) => this.answers = answers,
      error: (err) => console.error('Failed to load answers:', err)
    });
  }

  upvoteQuestion(): void {
    if (!this.currentUserId) {
      this.error = 'Please log in to vote.';
      return;
    }
    this.qaService.voteQuestion(this.question._id,this.currentUserId, 'up').subscribe({
      next: (updatedQuestion) => this.question = updatedQuestion,
      error: (err) => console.error('Upvote failed:', err)
    });
  }

  downvoteQuestion(): void {
    if (!this.currentUserId) {
      this.error = 'Please log in to vote.';
      return;
    }
    this.qaService.voteQuestion(this.question._id,this.currentUserId, 'down').subscribe({
      next: (updatedQuestion) => this.question = updatedQuestion,
      error: (err) => console.error('Downvote failed:', err)
    });
  }

  hasVotedQuestion(voteType: 'up' | 'down'): boolean {
    // Placeholder: Implement actual voting logic based on your service/models
    return false;
  }

  upvoteAnswer(answerId: string): void {
    if (!this.currentUserId) {
      this.error = 'Please log in to vote.';
      return;
    }
    this.qaService.voteAnswer(answerId,this.currentUserId, 'up').subscribe({
      next: (updatedAnswer) => {
        const index = this.answers.findIndex(a => a._id === answerId);
        if (index > -1) this.answers[index] = updatedAnswer;
      },
      error: (err) => console.error('Upvote answer failed:', err)
    });
  }

  downvoteAnswer(answerId: string): void {
    if (!this.currentUserId) {
      this.error = 'Please log in to vote.';
      return;
    }
    this.qaService.voteAnswer(answerId,this.currentUserId, 'down').subscribe({
      next: (updatedAnswer) => {
        const index = this.answers.findIndex(a => a._id === answerId);
        if (index > -1) this.answers[index] = updatedAnswer;
      },
      error: (err) => console.error('Downvote answer failed:', err)
    });
  }

  hasVoted(answer: Answer, voteType: 'up' | 'down'): boolean {
    // Placeholder: Implement actual voting logic based on your service/models
    return false;
  }

  editQuestion(): void {
    if (!this.isAuthor(this.question)) {
      this.error = 'You can only edit your own questions.';
      return;
    }
    this.editingQuestion = true;
    this.editQuestionForm.patchValue({
      title: this.question.title,
      content: this.question.content,
      tags: this.question.tags?.join(', ') || ''
    });
  }

  updateQuestion(formValue: any): void {
    if (!this.isAuthor(this.question)) {
      this.error = 'You can only edit your own questions.';
      return;
    }
    const updatedQuestion = {
      title: formValue.title,
      content: formValue.content,
      tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : []
    };
    this.qaService.updateQuestion(this.question._id, updatedQuestion).subscribe({
      next: (question) => {
        this.question = question;
        this.editingQuestion = false;
        this.success = 'Question updated successfully.';
      },
      error: (err) => {
        this.error = 'Failed to update question.';
        console.error('Update question error:', err);
      }
    });
  }

  deleteQuestion(): void {
    if (!this.isAuthor(this.question)) {
      this.error = 'You can only delete your own questions.';
      return;
    }
    if (confirm('Are you sure you want to delete this question?')) {
      this.qaService.deleteQuestion(this.question._id).subscribe({
        next: () => this.router.navigate(['/forum']),
        error: (err) => {
          this.error = 'Failed to delete question.';
          console.error('Delete question error:', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.currentUserId) {
      this.error = 'Please log in to submit an answer.';
      return;
    }
    if (this.answerForm.invalid) return;
    this.loading = true;
    const answerData = {
      content: this.answerForm.get('content')?.value,
      author: this.currentUserId
    };
    this.qaService.createAnswer(this.question._id, answerData).subscribe({
      next: (newAnswer) => {
        this.answers.push(newAnswer);
        this.answerForm.reset();
        this.loading = false;
        this.success = 'Answer posted successfully.';
      },
      error: (err) => {
        this.error = 'Failed to post answer.';
        this.loading = false;
        console.error('Answer submission error:', err);
      }
    });
  }

  editAnswer(answer: Answer): void {
    if (!this.isAuthor(answer)) {
      this.error = 'You can only edit your own answers.';
      return;
    }
    this.editingAnswer = answer;
    this.answerForm.patchValue({ content: answer.content });
  }

  updateAnswer(): void {
    if (!this.editingAnswer || !this.isAuthor(this.editingAnswer)) {
      this.error = 'You can only edit your own answers.';
      return;
    }
    if (this.answerForm.invalid) return;
    const updateData = { content: this.answerForm.get('content')?.value };
    this.qaService.updateAnswer(this.editingAnswer._id, updateData).subscribe({
      next: (updatedAnswer) => {
        const index = this.answers.findIndex(a => a._id === updatedAnswer._id);
        if (index > -1) this.answers[index] = updatedAnswer;
        this.editingAnswer = null;
        this.answerForm.reset();
        this.success = 'Answer updated successfully.';
      },
      error: (err) => {
        this.error = 'Failed to update answer.';
        console.error('Update answer error:', err);
      }
    });
  }

  deleteAnswer(answerId: string): void {
    const answer = this.answers.find(a => a._id === answerId);
    if (!answer || !this.isAuthor(answer)) {
      this.error = 'You can only delete your own answers.';
      return;
    }
    this.qaService.deleteAnswer(answerId).subscribe({
      next: () => {
        this.answers = this.answers.filter(a => a._id !== answerId);
        this.success = 'Answer deleted successfully.';
      },
      error: (err) => {
        this.error = 'Failed to delete answer.';
        console.error('Delete answer error:', err);
      }
    });
  }

  startReply(answer: Answer): void {
    if (!this.currentUserId) {
      this.error = 'Please log in to reply.';
      return;
    }
    this.replyingToAnswer = answer;
    this.replyForm.reset();
  }

  submitReply(): void {
    if (!this.replyingToAnswer || !this.currentUserId) {
      this.error = 'Please log in to reply.';
      return;
    }
    if (this.replyForm.invalid) return;

    const replyData = {
      content: this.replyForm.get('content')?.value,
      author: this.currentUserId
    };

    this.qaService.createReply(this.replyingToAnswer._id, replyData).subscribe({
      next: (newReply) => {
        const answerIndex = this.answers.findIndex(a => a._id === this.replyingToAnswer?._id);
        if (answerIndex > -1) {
          this.answers[answerIndex].replies = [...this.answers[answerIndex].replies || [], newReply];
        }
        this.replyingToAnswer = null;
        this.replyForm.reset();
        this.success = 'Reply posted successfully.';
      },
      error: (err) => {
        this.error = 'Failed to post reply.';
        console.error('Reply submission error:', err);
      }
    });
  }

  cancelReply(): void {
    this.replyingToAnswer = null;
    this.replyForm.reset();
  }

  deleteReply(answerId: string, replyId: string): void {
    if (!this.currentUserId) {
      this.error = 'Please log in to delete replies.';
      return;
    }

    if (confirm('Are you sure you want to delete this reply?')) {
      this.qaService.deleteReply(replyId).subscribe({
        next: () => {
          const answerIndex = this.answers.findIndex(a => a._id === answerId);
          if (answerIndex > -1) {
            this.answers[answerIndex].replies = this.answers[answerIndex].replies.filter(r => r._id !== replyId);
          }
          this.success = 'Reply deleted successfully.';
        },
        error: (err) => {
          this.error = 'Failed to delete reply.';
          console.error('Delete reply error:', err);
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingQuestion = false;
    this.editingAnswer = null;
    this.replyingToAnswer = null;
    this.answerForm.reset();
    this.replyForm.reset();
  }
}