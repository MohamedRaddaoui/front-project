import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private getDecodedToken(): DecodedToken | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      return jwtDecode(token) as DecodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getCurrentUserId(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.userId || null;
  }

  isAdmin(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) return false;
    return decodedToken.role === 'admin';
  }

  canModifyTask(taskUserId: string): boolean {
    const currentUserId = this.getCurrentUserId();
    return this.isAdmin() || currentUserId === taskUserId;
  }

  canAddTask(): boolean {
    return this.isAdmin();
  }

  canDeleteTask(taskUserId: string): boolean {
    return this.isAdmin() || this.getCurrentUserId() === taskUserId;
  }

  canEditTask(taskUserId: string): boolean {
    return this.isAdmin() || this.getCurrentUserId() === taskUserId;
  }

  canDeleteAttachment(commentUserId: string): boolean {
    return this.isAdmin() || this.getCurrentUserId() === commentUserId;
  }

  canEditComment(commentUserId: string): boolean {
    return this.isAdmin() || this.getCurrentUserId() === commentUserId;
  }

  isTokenExpired(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) return true;
    
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  }
} 