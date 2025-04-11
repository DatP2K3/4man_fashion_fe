import { Component, OnInit } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { SHARED_COMPONENTS } from '../../shared/shared.config';
import { RouterModule, RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AppStateService } from '../../shared/state/AppState.service';
import { Profile } from '../../core/models/Profile.model';
import { AvatarModule } from 'primeng/avatar';
import { ProfileService } from '../../core/services/Profile.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  imports: [
    ...SHARED_COMPONENTS,
    CommonModule,
    ProgressBar,
    RouterOutlet,
    AvatarModule,
    RouterModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  activeItem: HTMLElement | null = null;
  public profile: Profile | null = null;
  public avatarUrl: string | undefined = undefined;

  constructor(
    private readonly keycloak: KeycloakService,
    private profileService: ProfileService,
    private appState: AppStateService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadProfile();
  }

  private async loadProfile() {
    if (!this.profile) {
      this.profileService.getOrInit().subscribe({
        next: (response: any) => {
          if (response?.data) {
            this.profile = response.data;
            this.appState.updateProfile(this.profile as Profile);
            this.loadAvatar();
          }
        },
        error: (error) => console.error('Error fetching profile data:', error),
      });
    } else {
      this.loadAvatar();
    }
  }

  private loadAvatar() {
    if (this.profile?.avatar_file_id) {
      this.profileService.getAvatar(this.profile.avatar_file_id).subscribe({
        next: (res) => (this.avatarUrl = res.data.url),
        error: (error) => {
          console.error('Error fetching avatar URL:', error);
          this.avatarUrl = undefined;
        },
      });
    } else {
      this.avatarUrl = undefined;
    }
  }

  public logout() {
    const redirectURI: string = 'http://localhost:4200/home';
    this.keycloak.logout(redirectURI);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.displayPreviewAndUpload(file);
    }
  }

  private displayPreviewAndUpload(file: File) {
    // Hiển thị ảnh demo
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.avatarUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Gửi file lên backend
    this.profileService.uploadAvatar(file).subscribe({
      next: (response) => {
        if (this.profile) {
          this.profile.avatar_file_id = response.fileId;
        }
      },
      error: (error) => console.error('Error uploading avatar:', error),
    });
  }

  triggerFileInput() {
    const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }
}
