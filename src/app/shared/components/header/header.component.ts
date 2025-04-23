import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Profile } from '../../../core/models/Profile.model';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../../core/services/Profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: false,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
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
