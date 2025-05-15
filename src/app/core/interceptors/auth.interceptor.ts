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
    // Log URL để debug
    console.log('Intercepting request to:', request.url);

    // Kiểm tra nếu là public endpoint
    if (request.headers.has('skipAuth') || this.isPublicEndpoint(request.url)) {
      console.log('Skipping auth for public endpoint:', request.url);
      // Remove the skipAuth header before sending the request
      let headers = request.headers.delete('skipAuth');

      // Nếu là public endpoint, cũng nên xóa Authorization header nếu có
      if (headers.has('Authorization')) {
        console.log(
          'Removing existing Authorization token for public endpoint'
        );
        headers = headers.delete('Authorization');
      }

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
      'generativelanguage.googleapis.com', // Gemini API - sử dụng phần host thay vì toàn bộ URL
      // Add other endpoints as needed
    ];

    // Kiểm tra kỹ hơn để đảm bảo URL khớp với các endpoint công khai
    return publicEndpoints.some((endpoint) => {
      const match = url.includes(endpoint);
      if (match)
        console.log(
          `Endpoint ${url} matched public endpoint pattern ${endpoint}`
        );
      return match;
    });
  }
}
