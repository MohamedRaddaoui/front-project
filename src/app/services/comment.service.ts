import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/env';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.baseUrl}/taskcomments`;

  constructor(private http: HttpClient) { }

  addComment(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, formData);
  }

  deleteComment(taskId: string, commentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${taskId}/${commentId}`);
  }

  deleteAttachment(commentId: string, attachmentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteAttachementFromComment/${commentId}/${attachmentId}`);
  }
} 