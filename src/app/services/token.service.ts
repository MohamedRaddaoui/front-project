import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private jwtHelper = new JwtHelperService();

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }
}
