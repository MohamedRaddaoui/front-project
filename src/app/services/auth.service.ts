import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private tokenService: TokenService) { }

  getCurrentUserId(): string | null {
    return this.tokenService.getCurrentUserId() || null;
  }

  isAdmin(): boolean {
    const userRole = this.tokenService.getUserRole();
    return userRole === 'admin';
  }

  canModifyTask(taskUserId: string): boolean {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) return false;
    return this.isAdmin() || currentUserId === taskUserId;
  }

  canAddTask(): boolean {
    return this.isAdmin();
  }

  canDeleteTask(taskUserId: string): boolean {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) return false;
    return this.isAdmin() || currentUserId === taskUserId;
  }

  canEditTask(taskUserId: string): boolean {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) return false;
    return this.isAdmin() || currentUserId === taskUserId;
  }

  canDeleteAttachment(commentUserId: string): boolean {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) return false;
    return this.isAdmin() || currentUserId === commentUserId;
  }

  canEditComment(commentUserId: string): boolean {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) return false;
    return this.isAdmin() || currentUserId === commentUserId;
  }

  isTokenExpired(): boolean {
    return !this.tokenService.isTokenValid();
  }
} 