import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.hasRequiredRole(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.hasRequiredRole(childRoute);
  }

  private hasRequiredRole(route: ActivatedRouteSnapshot): boolean {
    // Get the required role from the route data if it exists
    const requiredRole = route.data['role'] as string;

    // If no role is required, allow access
    if (!requiredRole) {
      return true;
    }

    // Check if user is authenticated and has the required role
    if (
      this.keycloakService.isLoggedIn() &&
      this.keycloakService.isUserInRole(requiredRole)
    ) {
      return true;
    }

    // If user doesn't have the required role, redirect to unauthorized page
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
