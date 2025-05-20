import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkAccess(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkAccess(childRoute);
  }

  private async checkAccess(
    route: ActivatedRouteSnapshot
  ): Promise<boolean | UrlTree> {
    // Check if user is authenticated
    if (!(await this.keycloakService.isLoggedIn())) {
      // Redirect to login page
      await this.keycloakService.login({
        redirectUri: window.location.origin + this.router.url,
      });
      return false;
    }

    // Get required role from route data
    const requiredRole = route.data['role'];

    if (!requiredRole) {
      return true; // No specific role required
    }

    // Check if user has the required role
    const hasRole = await this.keycloakService.isUserInRole(requiredRole);

    if (!hasRole) {
      console.log(`User doesn't have required role: ${requiredRole}`);
      return this.router.createUrlTree(['/unauthorized']);
    }

    return true;
  }
}
