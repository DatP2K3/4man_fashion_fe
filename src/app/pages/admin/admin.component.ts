import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../shared/components/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../shared/components/admin-footer/admin-footer.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    AdminHeaderComponent,
    AdminFooterComponent,
    RouterOutlet,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  public isSidebarCollapsed: boolean = false; // Sidebar state

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Toggle sidebar state
  }
}
