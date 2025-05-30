import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('AuthGuard#canActivate called');
    if (!this.tokenService.isTokenValid()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = this.tokenService.getUserRole();
    const allowedRoles = route.data['roles'] as Array<string>;

    if (allowedRoles && allowedRoles.length > 0) {
      if (userRole && allowedRoles.includes(userRole)) {
        return true;
      } else {
        this.router.navigate(['/access-denied']);
        return false;
      }
    }

    // Si aucun rôle spécifié, on autorise l'accès
    return true;
  }
}
