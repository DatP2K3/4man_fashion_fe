import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-footer',
  imports: [CommonModule],
  templateUrl: './admin-footer.component.html',
  styleUrl: './admin-footer.component.scss',
})
export class AdminFooterComponent {
  currentYear = new Date().getFullYear();
}
