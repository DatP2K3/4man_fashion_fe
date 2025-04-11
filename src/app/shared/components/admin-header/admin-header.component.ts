import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Profile } from '../../../core/models/Profile.model';
import { KeycloakService } from 'keycloak-angular';
import { ProfileService } from '../../../core/services/Profile.service';
import { Subscription } from 'rxjs';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  imports: [
    CommonModule,
    DrawerModule,
    DividerModule,
    OverlayPanelModule,
    SidebarModule,
    RouterModule,
  ],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public sidebarVisible = false;
  public isLoggedIn = false;
  public profile: Profile | null = null;

  constructor(
    private readonly keycloak: KeycloakService,
    private profileService: ProfileService
  ) {}

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
  }

  public onToggleSidebar() {
    this.toggleSidebar.emit();
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
}
