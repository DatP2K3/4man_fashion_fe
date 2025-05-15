import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderSuccessedComponent } from './order-successed.component';

// PrimeNG Modules
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [OrderSuccessedComponent],
  imports: [
    SharedModule,
    CommonModule,
    ProgressBarModule,
    ButtonModule,
    ToastModule,
    RouterModule.forChild([{ path: '', component: OrderSuccessedComponent }]),
  ],
  providers: [MessageService],
})
export class OrderSuccessedModule {}
