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
      },
      enableBearerInterceptor: true,
    });
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
    UnauthorizedModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    KeycloakService,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
