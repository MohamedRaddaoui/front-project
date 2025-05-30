import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { QaService } from '../services/qa.service';
import { Answer, Question } from '../models/qa.model';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { TokenService } from '../services/token.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, NavBarComponent, SideBarComponent, HttpClientModule, DatePipe, RouterLink, FontAwesomeModule],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ForumComponent implements OnInit {
  questions: Question[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentUserId: string = '';
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

  constructor(
    private qaService: QaService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.currentUserId = this.tokenService.getCurrentUserId();
  }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(sort: string = 'newest'): void {
    this.loading = true;
    this.error = null;
    this.qaService.getQuestions({ sort }).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.loading = false;
        if (questions.length === 0) {
          console.warn('No questions returned from API');
        }
      },
      error: (err) => {
        this.error = `Failed to load questions: ${err.message || 'Unknown error'}`;
        this.loading = false;
        console.error('ForumComponent load questions error:', err);
      }
    });
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      this.loadQuestions(selectElement.value);
    }
  }

  askQuestion(): void {
    this.router.navigate(['/ask-question']).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  upvoteQuestion(questionId: string): void {
    if (!this.currentUserId) {
      this.error = 'Please log in to vote on questions';
      return;
    }
    this.qaService.voteQuestion(questionId,this.currentUserId, 'up').subscribe({
      next: (updatedQuestion) => {
        const index = this.questions.findIndex(q => q._id === questionId);
        if (index !== -1) {
          this.questions[index] = updatedQuestion;
        }
      },
      error: (err) => {
        this.error = 'Failed to upvote question. Please try again.';
        console.error('Upvote error:', err);
      }
    });
  }

  downvoteQuestion(questionId: string): void {
    if (!this.currentUserId) {
      this.error = 'Please log in to vote on questions';
      return;
    }
    this.qaService.voteQuestion(questionId,this.currentUserId, 'down').subscribe({
      next: (updatedQuestion) => {
        const index = this.questions.findIndex(q => q._id === questionId);
        if (index !== -1) {
          this.questions[index] = updatedQuestion;
        }
      },
      error: (err) => {
        this.error = 'Failed to downvote question. Please try again.';
        console.error('Downvote error:', err);
      }
    });
  }

  hasVoted(question: Question, voteType: 'up' | 'down'): boolean {
    if (!this.currentUserId) return false;
    return voteType === 'up' ? 
      question.upvotes?.includes(this.currentUserId) || false : 
      question.downvotes?.includes(this.currentUserId) || false;
  }

  refreshQuestions(): void {
    this.loadQuestions();
  }

  trackByQuestionId(index: number, question: Question): string {
    return question._id;
  }

  getAuthorName(author: any): string {
    if (!author) return 'Anonymous';
    if (typeof author === 'object' && author.firstname && author.lastname) {
      return `${author.firstname} ${author.lastname}`;
    }
    if (typeof author === 'string') {
      return author;
    }
    return 'Anonymous';
  }
}