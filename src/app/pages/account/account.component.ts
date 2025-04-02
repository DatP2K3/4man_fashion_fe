import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ProgressBar } from 'primeng/progressbar';
import { SHARED_COMPONENTS } from '../../shared/shared.config';
import { RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-account',
  imports: [...SHARED_COMPONENTS, ProgressBar, RouterOutlet],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  public percent: number = 80;
  activeItem: HTMLElement | null = null;
  constructor(private readonly keycloak: KeycloakService) {}

  changeColor(event: Event) {
    const clickedItem = event.target as HTMLElement;

    // Nếu có item đang active, gỡ bỏ class "active"
    if (this.activeItem) {
      this.activeItem.classList.remove('active-nav');
    }

    // Gán item mới vào biến và thêm class "active"
    clickedItem.classList.add('active-nav');
    this.activeItem = clickedItem;
  }

  public logout() {
    let redirectURI: string = 'http://localhost:4200/home';
    this.keycloak.logout(redirectURI);
  }
}
