import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Skip token for requests with the 'skipAuth' header or to specific domains
    if (request.headers.has('skipAuth') || this.isPublicEndpoint(request.url)) {
      // Remove the skipAuth header before sending the request
      const headers = request.headers.delete('skipAuth');
      const newRequest = request.clone({ headers });
      return next.handle(newRequest);
    }

    // For all other requests, add the auth token if available
    if (this.keycloak.isLoggedIn()) {
      // Convert Promise to Observable using from() and switchMap
      return from(this.keycloak.getToken()).pipe(
        switchMap((token) => {
          // Clone the request and add the token as Authorization header
          const authRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(authRequest);
        })
      );
    }

    return next.handle(request);
  }

  private isPublicEndpoint(url: string): boolean {
    // Define endpoints or domains where you don't want to send auth tokens
    const publicEndpoints = [
      'https://generativelanguage.googleapis.com', // Gemini API
      // Add other endpoints as needed
    ];

    return publicEndpoints.some((endpoint) => url.startsWith(endpoint));
  }
}
