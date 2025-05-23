import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const role = this.auth.getRole();

    if (this.auth.isLoggedIn() && role === expectedRole) {
      return true;
    }

    this.router.navigate(['/customer/login']);
    return false;
  }
}
