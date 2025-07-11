import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { Profile } from '@app/core/models/Profile.model';
import { ProfileService } from '@app/core/services/Profile.service';
import { AppStateService } from '@app/shared/state/AppState.service';

@Component({
  selector: 'app-account',
  standalone: false,
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
    if (this.profile?.avatarFileId) {
      this.profileService.getAvatar(this.profile.avatarFileId).subscribe({
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
          this.profile.avatarFileId = response.fileId;
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
