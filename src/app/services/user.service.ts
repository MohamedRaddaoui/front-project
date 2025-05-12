import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/env';
import { Observable } from 'rxjs';
import { User } from '../models/user'; 

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.baseUrl}/users`;
  private token = environment.jwtToken;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  // Ajouter un user
  addUser(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, userData, {
      headers: this.getAuthHeaders(),
    });
  }

  // Afficher users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Afficher userbyID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getUserById/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // update user
  updateUser(id: string, updatedData: Partial<User>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/updateUserById/${id}`, updatedData, {
      headers: this.getAuthHeaders(),
    });
  }

  // delete user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUserById/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
