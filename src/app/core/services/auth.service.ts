import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {
    // No need to subscribe to events here as they are handled in app.component.ts
  }

  /**
   * Handle successful login by checking user role and redirecting accordingly
   */
  async handleSuccessfulLogin(): Promise<void> {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();

      if (isLoggedIn) {
        // Lấy URL hiện tại
        const currentUrl = this.router.url;

        // Nếu URL hiện tại là '/', '/login', '/unauthorized' hoặc các trang không cần xác thực
        // thì mới thực hiện điều hướng dựa trên vai trò
        const publicPaths = ['/', '/login', '/unauthorized', '/auth'];
        const shouldRedirect = publicPaths.some(
          (path) => currentUrl === path || currentUrl.startsWith(path)
        );

        if (shouldRedirect) {
          // Check if user has ADMIN role
          const hasAdminRole = await this.hasRole('ADMIN');

          if (hasAdminRole) {
            console.log('User has ADMIN role, redirecting to admin module');
            this.router.navigate(['/admin']);
          } else {
            console.log('User does not have ADMIN role, redirecting to home');
            this.router.navigate(['/']);
          }
        } else {
          console.log(
            'User already on a valid page, staying on current page:',
            currentUrl
          );
        }
      }
    } catch (error) {
      console.error('Error during authentication handling:', error);
      this.router.navigate(['/']);
    }
  }

  /**
   * Check if the current user has a specific role
   * @param role Role to check
   * @returns Promise that resolves to true if user has the role, false otherwise
   */
  async hasRole(role: string): Promise<boolean> {
    try {
      return await this.keycloakService.isUserInRole(role);
    } catch (error) {
      console.error(`Error checking role ${role}:`, error);
      return false;
    }
  }

  /**
   * Get user profile
   * @returns Observable of the user profile
   */
  getUserProfile(): Observable<KeycloakProfile | null> {
    return from(this.keycloakService.loadUserProfile()).pipe(
      catchError((error) => {
        console.error('Error loading user profile:', error);
        return of(null);
      })
    );
  }

  /**
   * Manually login the user
   * @param redirectUri Optional URI to redirect after login
   */
  login(redirectUri?: string): void {
    this.keycloakService.login({
      redirectUri: redirectUri || window.location.origin,
    });
  }

  /**
   * Logout the user
   */
  logout(): void {
    this.keycloakService.logout(window.location.origin);
  }

  /**
   * Check if the user is authenticated
   * @returns Promise that resolves to true if authenticated, false otherwise
   */
  isAuthenticated(): Promise<boolean> {
    // Ensure we're returning a Promise
    return Promise.resolve(this.keycloakService.isLoggedIn());
  }
}
