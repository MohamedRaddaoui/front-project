import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/env';
import { Task, TaskHistory } from '../models/task.model';
import { map } from 'rxjs/operators';
import { TokenService } from './token.service';

interface TaskResponse {
  tasks: any[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.baseUrl}/tasks`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}
  private getAuthHeaders(isFormData = false): HttpHeaders {
      const token = this.tokenService.getToken();
      const headersConfig: any = {
        Authorization: `Bearer ${token}`,
      };
      if (!isFormData) {
        headersConfig['Content-Type'] = 'application/json';
      }
      return new HttpHeaders(headersConfig);
    }

  // Create a new task
  createTask(taskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, taskData, {
      headers: this.getAuthHeaders()
    });
  }

  // Get task by ID
  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getbyId/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update task
  updateTask(id: string, taskData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateTaskAndSendEmail/${id}`, taskData, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete task
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Add comment to task
  addComment(taskId: string, commentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${taskId}/comments`, commentData, {
      headers: this.getAuthHeaders()
    });
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<{ tasks: Task[] }>(`${this.apiUrl}/getAll`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.tasks)
    );  
  }

  getTaskHistory(taskId: string): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(`${this.apiUrl}/taskhistory/${taskId}`, {
      headers: this.getAuthHeaders()
    });
  }

  filterTasks(filters: {
    assignedUser?: string;
    projectTitle?: string;
    status?: string;
    priority?: string;
    dueDate?: Date;
    inappropriateComments?: boolean;
  }): Observable<TaskResponse> {
    let queryParams = new URLSearchParams();
    
    if (filters.assignedUser) {
      queryParams.append('assignedUser', filters.assignedUser);
    }
    if (filters.projectTitle) {
      console.log('Filtering by project title:', filters.projectTitle); // Debug
      queryParams.append('projectTitle', filters.projectTitle);
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

    const url = `${this.apiUrl}/filter?${queryParams.toString()}`;
    console.log('Filter URL:', url); // Debug
    return this.http.get<TaskResponse>(url, {
      headers: this.getAuthHeaders()
    });
  }

  getTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders()
    });
  }
}
