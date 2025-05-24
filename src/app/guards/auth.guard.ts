import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private jwtHelper = new JwtHelperService();

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) {}

  canActivate(): boolean {
    const token = this.tokenService.getToken();

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
