import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environment/env';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Question {
  _id: string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  upvotes: string[];
  downvotes: string[];
  voteScore: number;
  views: number;
  createdAt: string;
  answers?: Answer[];
  answerCount?: number;
}

export interface Answer {
  _id: string;
  content: string;
  author: User;
  questionId: string;
  upvotes: string[];
  downvotes: string[];
  voteScore: number;
  isAccepted: boolean;
  replies: Reply[];
  createdAt: string;
}

export interface Reply {
  _id: string;
  content: string;
  author: User;
  answerId: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = environment.baseUrl + '/qa';

  constructor(private http: HttpClient) {}

  getQuestions(sort: string = 'newest'): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`, { params: { sort } }).pipe(
      tap(questions => console.log('ForumService getQuestions response:', questions))
    );
  }

  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/questions/${id}`).pipe(
      tap(question => console.log('ForumService getQuestionById response:', question))
    );
  }

  getAnswers(questionId: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/questions/${questionId}/answers`).pipe(
      tap(answers => console.log('ForumService getAnswers response:', answers))
    );
  }

  createQuestion(question: { title: string; content: string; author: string; tags: string[] }): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions`, question).pipe(
      tap(newQuestion => console.log('ForumService createQuestion response:', newQuestion))
    );
  }

  voteQuestion(questionId: string, userId: string, voteType: 'up' | 'down'): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions/${questionId}/vote`, { userId, voteType }).pipe(
      tap(updatedQuestion => console.log('ForumService voteQuestion response:', updatedQuestion))
    );
  }

  createAnswer(questionId: string, answer: { content: string; author: string }): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiUrl}/questions/${questionId}/answers`, answer).pipe(
      tap(newAnswer => console.log('ForumService createAnswer response:', newAnswer))
    );
  }

  voteAnswer(answerId: string, userId: string, voteType: 'up' | 'down'): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiUrl}/answers/${answerId}/vote`, { userId, voteType }).pipe(
      tap(updatedAnswer => console.log('ForumService voteAnswer response:', updatedAnswer))
    );
  }
}