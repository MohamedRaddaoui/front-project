import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private jwtHelper = new JwtHelperService();
  token: any;
  userId: any;

  constructor(private router: Router) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.userId = this.getUserId();
    }
  }

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

  setToken(token: string): void {    localStorage.setItem('token', token);  }  getToken(): string | null {    return localStorage.getItem('token');  }  removeToken(): void {    localStorage.removeItem('token');  }

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

  // Nouvelle méthode pour extraire le rôle du token
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      // Ici, adapte "role" selon la clé exacte dans ton token
      return decodedToken?.role || null;
    } catch {
      return null;
    }
  }
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.userId || null;
    } catch {
      return null;
    }
  }
}
