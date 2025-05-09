import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) {}

  canActivate(): boolean {
    return this.canActivateAdmin();
  }

  private isAdmin(): boolean {
    const token = this.tokenService.getToken();
    
    if (!token) {
      return false;
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.role === 'admin';
    } catch {
      return false;
    }
  }

  private canActivateAdmin(): boolean {
    const token = this.tokenService.getToken();

    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.isAdmin()) {
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  }
}
