import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import Aura from '@primeng/themes/aura';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { UnauthorizedModule } from './shared/components/unauthorized/unauthorized.module';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
// Thay thế import cũ
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { DeviceIdService } from './core/services/device-id.service';
import { DeviceRegistrationService } from './core/services/device-registration.service';
import { environment } from './environments/environment';
import { AuthService } from './core/services/auth.service';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8180',
        realm: 'IamService',
        clientId: 'iam_service',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: true,
        checkLoginIframeInterval: 5,
      },
      enableBearerInterceptor: true,
      bearerExcludedUrls: ['/assets'],
      loadUserProfileAtStartUp: true,
      bearerPrefix: 'Bearer',
    });
}

// Function to initialize AuthService after Keycloak
export function initializeAuthService(authService: AuthService) {
  return () => Promise.resolve();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    KeycloakAngularModule,
    AppRoutingModule,
    RouterModule, // Đảm bảo RouterModule được thêm vào đây
    UnauthorizedModule,
    // Thay thế các provider bằng modules tương ứng
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    // Initialize AuthService after Keycloak
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuthService,
      multi: true,
      deps: [AuthService],
    },
    KeycloakService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    providePrimeNG({
      ripple: true,
      zIndex: {
        modal: 1100,
        overlay: 1000,
        menu: 1000,
        tooltip: 1100,
      },
      theme: {
        preset: Aura,
      },
    }),
    MessageService,
    ConfirmationService,
    {
      provide: 'ZoneConfig',
      useValue: { eventCoalescing: true },
    },
    DeviceIdService,
    DeviceRegistrationService,
    // Thêm services của bạn ở đây
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
