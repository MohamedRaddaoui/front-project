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

  getCommentsByTaskId(taskId: string): Observable<any> {
    console.log('Fetching comments for task:', taskId);
    return this.http.get(`${this.apiUrl}/getCommentsbyTaskId/${taskId}`);
  }

  addComment(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, formData);
  }

  deleteComment(taskId: string, commentId: string): Observable<any> {
    console.log(`Deleting comment. TaskID: ${taskId}, CommentID: ${commentId}`);
    console.log('Task ID:', taskId);
    console.log('Comment ID:', commentId);
    // Assurez-vous que les IDs sont des chaînes valides
    if (!taskId?.trim() || !commentId?.trim()) {
      throw new Error('Invalid task or comment ID');
    }
    return this.http.delete(`${this.apiUrl}/delete/${taskId}/${commentId}`);
  }

  deleteAttachment(commentId: string, attachmentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteAttachementFromComment/${commentId}/${attachmentId}`);
  }

  updateComment(commentId: string, commentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateComment/${commentId}`, commentData);
  }
} 