import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AdminHeaderComponent } from '../../shared/components/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../shared/components/admin-footer/admin-footer.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  public isSidebarCollapsed: boolean = false; // Sidebar state
  menuItems: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Bảng điều khiển',
        icon: 'pi pi-home',
        routerLink: '/admin/dashboard',
      },
      {
        label: 'Sản phẩm',
        icon: 'pi pi-shopping-bag',
        routerLink: '/admin/manage-products',
      },
      {
        label: 'Đơn hàng',
        icon: 'pi pi-shopping-cart',
        routerLink: '/admin/manage-orders',
      },
      {
        label: 'Khuyến mãi',
        icon: 'pi pi-percentage',
        routerLink: '/admin/manage-promotions',
      },
      {
        label: 'Banners',
        icon: 'pi pi-images',
        routerLink: '/admin/manage-banners',
      },
      {
        label: 'Địa chỉ cửa hàng',
        icon: 'pi pi-map-marker',
        routerLink: '/admin/manage-shop-address',
      },
    ];
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Toggle sidebar state
  }
}
