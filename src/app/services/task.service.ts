import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/env';
import { Task, TaskHistory } from '../models/task.model';
import { map } from 'rxjs/operators';

interface TaskResponse {
  tasks: any[];
  message?: string;
}

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
    return this.http.put(`${this.apiUrl}/updateTaskAndSendEmail/${id}`, taskData);
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

  getTaskHistory(taskId: string): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(`${this.apiUrl}/taskhistory/${taskId}`);
  }

  filterTasks(filters: {
    assignedUser?: string;
    status?: string;
    priority?: string;
    dueDate?: Date;
    inappropriateComments?: boolean;
  }): Observable<TaskResponse> {
    let queryParams = new URLSearchParams();
    
    if (filters.assignedUser) {
      queryParams.append('assignedUser', filters.assignedUser);
    }
    if (filters.status) {
      queryParams.append('status', filters.status);
    }
    if (filters.priority) {
      queryParams.append('priority', filters.priority);
    }
    if (filters.dueDate) {
      queryParams.append('dueDate', filters.dueDate.toISOString());
    }
    if (filters.inappropriateComments) {
      queryParams.append('inappropriateComments', 'true');
    }

    return this.http.get<TaskResponse>(`${this.apiUrl}/filter?${queryParams.toString()}`);
  }

  getTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}`);
  }
}
