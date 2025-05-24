import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ForumService, Question } from '../services/forum.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DatePipe, RouterLink],
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ForumComponent implements OnInit {
  questions: Question[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentUserId: string = '68312cd05f85d8f5a5ab243f'; // Hardcoded for testing

  constructor(private forumService: ForumService, private router: Router) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(sort: string = 'newest'): void {
    this.loading = true;
    this.error = null;
    this.forumService.getQuestions(sort).subscribe({
      next: (questions) => {
        console.log('ForumComponent questions loaded:', questions);
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
    console.log('Navigating to /ask-question');
    this.router.navigate(['/ask-question']).then(success => {
      console.log('Navigation success:', success);
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  upvoteQuestion(questionId: string): void {
    this.forumService.voteQuestion(questionId, this.currentUserId, 'up').subscribe({
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

  refreshQuestions(): void {
    this.loadQuestions();
  }
}