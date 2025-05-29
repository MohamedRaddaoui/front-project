import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private jwtHelper = new JwtHelperService();
  private tokenKey = 'auth_token';

  constructor(private router: Router) {}

  // Route guard method (optional - better to use separate AuthGuard service)
  canActivate(): boolean {
    if (this.isTokenValid()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      return null;
    }
  }

  getCurrentUserId(): string {
    const decoded = this.decodeToken();
    return decoded?.userId || '';
  }

  getCurrentUser(): { id: string; email: string; role: string } | null {
    const decoded = this.decodeToken();
    if (!decoded) return null;
    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  }
}
