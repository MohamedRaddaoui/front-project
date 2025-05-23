import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/env';
import { Question, Answer, Reply } from '../models/qa.models';

@Injectable({
  providedIn: 'root'
})
export class QAService {
  private apiUrl = `${environment.baseUrl}/qa`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    // Assume token is stored in localStorage or provided by an auth service
    const token = localStorage.getItem('jwtToken') || ''; // Replace with your auth service logic
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all questions with optional sorting
  getAllQuestions(sort: string = 'newest'): Observable<Question[]> {
    let params = new HttpParams().set('sort', sort);
    return this.http.get<Question[]>(`${this.apiUrl}/questions`, { headers: this.getAuthHeaders(), params });
  }

  // Get question by ID
  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/questions/${id}`, { headers: this.getAuthHeaders() });
  }

  // Search questions by query or tags
  searchQuestions(query: string, tags?: string): Observable<{ success: boolean; count: number; data: Question[] }> {
    let params = new HttpParams().set('q', query);
    if (tags) {
      params = params.set('tags', tags);
    }
    return this.http.get<{ success: boolean; count: number; data: Question[] }>(
      `${this.apiUrl}/search/tags`,
      { headers: this.getAuthHeaders(), params }
    );
  }

  // Advanced search
  

  // Get frequent questions
  getFrequentQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/frequent`, { headers: this.getAuthHeaders() });
  }

  // Post a new question
  askQuestion(questionData: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions`, questionData, { headers: this.getAuthHeaders() });
  }

  // Update a question
  updateQuestion(questionId: string, questionData: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/questions/${questionId}`, questionData, { headers: this.getAuthHeaders() });
  }

  // Delete a question
  deleteQuestion(questionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/questions/${questionId}`, { headers: this.getAuthHeaders() });
  }

  // Vote on a question
  voteQuestion(questionId: string, userId: string, voteType: 'up' | 'down'): Observable<Question> {
    return this.http.post<Question>(
      `${this.apiUrl}/questions/${questionId}/vote`,
      { userId, voteType },
      { headers: this.getAuthHeaders() }
    );
  }

  // Post an answer to a question
  answerQuestion(questionId: string, answerData: Partial<Answer>): Observable<Answer> {
    return this.http.post<Answer>(
      `${this.apiUrl}/questions/${questionId}/answers`,
      answerData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update an answer
  updateAnswer(answerId: string, answerData: Partial<Answer>): Observable<Answer> {
    return this.http.put<Answer>(`${this.apiUrl}/answers/${answerId}`, answerData, { headers: this.getAuthHeaders() });
  }

  // Delete an answer
  deleteAnswer(answerId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/answers/${answerId}`, { headers: this.getAuthHeaders() });
  }

  // Vote on an answer
  voteAnswer(answerId: string, userId: string, voteType: 'up' | 'down'): Observable<Answer> {
    return this.http.post<Answer>(
      `${this.apiUrl}/answers/${answerId}/vote`,
      { userId, voteType },
      { headers: this.getAuthHeaders() }
    );
  }

  // Accept an answer
  acceptAnswer(answerId: string, questionAuthorId: string): Observable<Answer> {
    return this.http.post<Answer>(
      `${this.apiUrl}/answers/${answerId}/accept`,
      { questionAuthorId },
      { headers: this.getAuthHeaders() }
    );
  }

  // Create a reply
  createReply(answerId: string, replyData: Partial<Reply>): Observable<Reply> {
    return this.http.post<Reply>(
      `${this.apiUrl}/answers/${answerId}/replies`,
      replyData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update a reply
  updateReply(replyId: string, replyData: Partial<Reply>): Observable<Reply> {
    return this.http.put<Reply>(`${this.apiUrl}/replies/${replyId}`, replyData, { headers: this.getAuthHeaders() });
  }

  // Delete a reply
  deleteReply(replyId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/replies/${replyId}`, { headers: this.getAuthHeaders() });
  }
}