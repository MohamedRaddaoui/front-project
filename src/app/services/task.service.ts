import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/env';
import { Task } from '../models/task.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.baseUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // Create a new task
  createTask(taskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, taskData);
  }

  // Get task by ID
  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getbyId/${id}`);
  }

  // Update task
  updateTask(id: string, taskData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, taskData);
  }

  // Delete task
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Add comment to task
  addComment(taskId: string, commentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${taskId}/comments`, commentData);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<{ tasks: Task[] }>(`${this.apiUrl}/getAll`).pipe(
      map(response => response.tasks)
    );  
  }
}
