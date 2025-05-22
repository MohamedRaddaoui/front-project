import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/env';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.baseUrl}/projects`;

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  //cerate new project
  addProject(data:Project):Observable<Project[]>{
    return this.http.post<Project[]>(`${this.apiUrl}/addProject`,data);
  }

  getAllProject():Observable<Project[]>{
    return this.http.get<Project[]>(`${this.apiUrl}/listProject`);
  }

  getByIdProject(id:String):Observable<Project[]>{
    return this.http.get<Project[]>(`${this.apiUrl}/projectByID/${id}`);
  }

  updateProject(id:String,data:Project):Observable<Project[]>{
    return this.http.put<Project[]>(`${this.apiUrl}/updateProject/${id}`, data);
  }

  deleteProject(id:String):Observable<Project[]>{
    return this.http.delete<Project[]>(`${this.apiUrl}/deleteProjectremoveMember`);
  }
  
  assignUserToProject(data:Project):Observable<Project[]>{
    return this.http.post<Project[]>(`${this.apiUrl}/assignUserToProject`,data);
  }
  
  unassignUser(projectId:String,userId:String):Observable<Project[]>{
    return this.http.delete<Project[]>(`${this.apiUrl}/removeMember/${projectId}/${userId}`);
  }
  
  archiveProject(id:String, data:Project):Observable<Project[]>{
    return this.http.put<Project[]>(`${this.apiUrl}/archiveProject/${id}`,data);
  }
  restoreProject(id:String, data:Project):Observable<Project[]>{
    return this.http.put<Project[]>(`${this.apiUrl}/restoreProject/${id}`,data);
  }

  listOfArchiveProject():Observable<Project[]>{
    return this.http.get<Project[]>(`${this.apiUrl}/getArchProject`);  
  }

  getProjectByUser(id:String):Observable<Project[]>{
    return this.http.get<Project[]>(`${this.apiUrl}/getProjectByUser/${id}`);  
  }

  DeleteTaskByProject(id:String):Observable<Project[]>{
    return this.http.get<Project[]>(`${this.apiUrl}/DeleteTaskByProject/${id}`);  
  }
  calculateProgress(id:String):Observable<Project[]>{
    return this.http.get<Project[]>(`${this.apiUrl}/calculateProgress/${id}`);  
  }
  summaryTask(id:String):Observable<Project[]>{
    return this.http.get<Project[]>(`${this.apiUrl}/sumTask/${id}`);  
  }
  search():Observable<Project[]>{
    return this.http.get<Project[]>(`${this.apiUrl}/search`);  
  }
// router.get('/checkProjectOverdue/:id',projectCtrl.checkProjectOverdue)
}
