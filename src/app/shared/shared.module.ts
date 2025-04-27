import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminFooterComponent } from './components/admin-footer/admin-footer.component';

// PrimeNG Components
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    // PrimeNG modules
    OverlayPanelModule,
    DrawerModule,
    DividerModule,
    SidebarModule,
    ProgressBarModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
  ],
})
export class SharedModule {}
