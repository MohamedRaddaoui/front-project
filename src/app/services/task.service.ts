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
  private baseUrl = `${environment.baseUrl}/tasks`; 

  constructor(private http: HttpClient) {}
  updateTask(id: string, data: Task): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, data);
  }
  deleteTask(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, id);
  }
  getAllTasks(): Observable<Task[]> {
    return this.http.get<{ tasks: Task[] }>(`${this.baseUrl}/getAll`).pipe(
      map(response => response.tasks)
    );  
}
}
