import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/env';
import { Question, Answer, Reply } from '../models/qa.model'; // Use qa.model.ts

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private apiUrl = `${environment.baseUrl}/qa`;

  constructor(private http: HttpClient) { }

  // Question Methods
  getQuestions(params?: any): Observable<Question[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return this.http.get<Question[]>(`${this.apiUrl}/questions`, { params: httpParams });
  }

  getQuestion(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/questions/${id}`);
  }

  createQuestion(data: any): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions`, data);
  }

  updateQuestion(id: string, data: any): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/questions/${id}`, data);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/questions/${id}`);
  }
  voteQuestion(questionId: string, userId: string, voteType: 'up' | 'down'): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions/${questionId}/vote`, { userId, voteType });
  }

  // Answer Methods
  getAnswers(questionId: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/questions/${questionId}/answers`);
  }

  createAnswer(questionId: string, data: any): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiUrl}/questions/${questionId}/answers`, data);
  }

  updateAnswer(answerId: string, data: any): Observable<Answer> {
    return this.http.put<Answer>(`${this.apiUrl}/answers/${answerId}`, data);
  }

  deleteAnswer(answerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/answers/${answerId}`);
  }
  voteAnswer(answerId: string, userId: string, voteType: 'up' | 'down'): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiUrl}/answers/${answerId}/vote`, { userId, voteType });
  }

  // Reply Methods
  getReplies(answerId: string): Observable<Reply[]> {
    return this.http.get<Reply[]>(`${this.apiUrl}/answers/${answerId}/replies`);
  }

  createReply(answerId: string, data: any): Observable<Reply> {
    return this.http.post<Reply>(`${this.apiUrl}/answers/${answerId}/replies`, data);
  }

  updateReply(replyId: string, data: any): Observable<Reply> {
    return this.http.put<Reply>(`${this.apiUrl}/replies/${replyId}`, data);
  }

  deleteReply(replyId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/replies/${replyId}`);
  }
}