import { Component, OnInit } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { SHARED_COMPONENTS } from '../../shared/shared.config';
import { RouterModule, RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AppStateService } from '../../shared/state/AppState.service';
import { Profile } from '../../core/models/Profile';
import { AvatarModule } from 'primeng/avatar';
import { ProfileService } from '../../core/services/Profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [
    ...SHARED_COMPONENTS,
    ProgressBar,
    RouterOutlet,
    AvatarModule,
    RouterModule,
  ], // Đảm bảo RouterOutlet được import
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  activeItem: HTMLElement | null = null;
  profileSubscription: any;
  public profile: Profile | null = null;
  public avatarUrl: string | undefined = undefined; // Đổi null thành undefined

  constructor(
    private readonly keycloak: KeycloakService,
    private profileService: ProfileService,
    private appState: AppStateService,
    private router: Router // Inject Router
  ) {}
  async ngOnInit() {
    if (!this.profile) {
      await this.profileService.getOrInit().subscribe(
        (response: any) => {
          if (response && response.data) {
            this.profile = response.data;
            this.appState.updateProfile(this.profile as Profile);

            // Kiểm tra avatar_fileId
            if (this.profile?.avatar_file_id) {
              // Gọi API để lấy URL ảnh đại diện
              this.profileService
                .getAvatar(this.profile.avatar_file_id)
                .subscribe(
                  (res) => {
                    this.avatarUrl = res.data.url; // Lấy URL từ response
                  },
                  (error) => {
                    console.error('Error fetching avatar URL:', error);
                    this.avatarUrl = undefined; // Sử dụng undefined thay vì null
                  }
                );
            } else {
              this.avatarUrl = undefined; // Sử dụng undefined thay vì null
            }
          }
          console.log('Profile data:', this.profile);
        },
        (error) => {
          console.error('Error fetching profile data:', error);
        }
      );
    } else {
      // Kiểm tra avatar_fileId
      if (this.profile?.avatar_file_id) {
        // Gọi API để lấy URL ảnh đại diện
        this.profileService.getAvatar(this.profile.avatar_file_id).subscribe(
          (res) => {
            this.avatarUrl = res.data.url; // Lấy URL từ response
          },
          (error) => {
            console.error('Error fetching avatar URL:', error);
            this.avatarUrl = undefined; // Sử dụng undefined thay vì null
          }
        );
      } else {
        this.avatarUrl = undefined; // Sử dụng undefined thay vì null
      }
    }
  }

  changeColor(event: Event) {
    const clickedItem = event.target as HTMLElement;

    // Nếu có item đang active, gỡ bỏ class "active"
    if (this.activeItem) {
      this.activeItem.classList.remove('active-nav');
    }

    // Gán item mới vào biến và thêm class "active"
    clickedItem.classList.add('active-nav');
    this.activeItem = clickedItem;

    // Điều hướng đến route tương ứng
    const route = clickedItem.getAttribute('routerLink');
    if (route) {
      this.router.navigate([route]);
    }
  }

  public logout() {
    let redirectURI: string = 'http://localhost:4200/home';
    this.keycloak.logout(redirectURI);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Hiển thị ảnh demo
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.avatarUrl = e.target?.result as string; // Gán URL ảnh demo
      };
      reader.readAsDataURL(file);

      // Gửi file lên backend
      this.profileService.uploadAvatar(file).subscribe(
        (response) => {
          console.log('Avatar uploaded successfully:', response);
          // Cập nhật avatar_fileId nếu cần
          if (this.profile) {
            this.profile.avatar_file_id = response.fileId; // Giả định backend trả về fileId
          }
        },
        (error) => {
          console.error('Error uploading avatar:', error);
        }
      );
    }
  }

  triggerFileInput() {
    const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }
}
