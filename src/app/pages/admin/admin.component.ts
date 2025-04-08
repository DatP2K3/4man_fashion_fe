import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../shared/components/admin-header/admin-header.component';
import { AdminFooterComponent } from '../../shared/components/admin-footer/admin-footer.component';

@Component({
  selector: 'app-admin',
  imports: [AdminHeaderComponent, AdminFooterComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {}
