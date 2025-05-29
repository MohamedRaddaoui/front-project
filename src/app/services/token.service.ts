import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private jwtHelper = new JwtHelperService();

  constructor(private router: Router) {}

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
}
