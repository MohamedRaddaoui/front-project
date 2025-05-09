import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/env';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

interface VerificationData {
  email: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.baseUrl}/users`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Add a new user
  addUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/adduser`, userData);
  }

  // Login route (with 2FA)
  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userData);
  }

  verify2FA(verificationData: VerificationData): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-2fa`, verificationData);
  }

  // Protected routes that require authentication
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/showuser`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/showById/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteuser/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateuser/${id}`, updatedData, {
      headers: this.getAuthHeaders()
    });
  }

  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    this.tokenService.removeToken();
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/${token}`, 
      { newPassword },
      { headers: this.getAuthHeaders() }
    );
  }
}
