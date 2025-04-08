import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Profile } from '../../../core/models/Profile';
import { KeycloakService } from 'keycloak-angular';
import { ProfileService } from '../../../core/services/Profile.service';
import { Subscription } from 'rxjs';
import { DrawerModule } from 'primeng/drawer';
import { ProgressBar } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-admin-header',
  imports: [
    CommonModule,
    DrawerModule,
    ProgressBar,
    DividerModule,
    OverlayPanelModule,
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent implements OnInit {
  public visible: boolean = false;
  public isLoggedIn = false;
  public profile: Profile | null = null;
  private profileSubscription: Subscription | null = null;

  constructor(
    private readonly keycloak: KeycloakService,
    private profileService: ProfileService
  ) {}

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
  }

  public login() {
    this.keycloak.login();
  }

  public accountManagement() {
    this.keycloak.getKeycloakInstance().accountManagement();
  }

  public logout() {
    this.keycloak.logout();
  }

  public async openProfileDrawer() {
    if (this.isLoggedIn) {
      if (!this.profile) {
        await this.profileService.getOrInit().subscribe(
          (response: any) => {
            if (response && response.data) {
              this.profile = response.data;
            }
            console.log('Profile data:', this.profile);
          },
          (error) => {
            console.error('Error fetching profile data:', error);
          }
        );
      }
    }
    this.visible = true;
  }
}
