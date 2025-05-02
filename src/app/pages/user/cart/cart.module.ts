import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CartComponent } from './cart.component';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    // PrimeNG
    TableModule,
    ButtonModule,
    InputNumberModule,
    ToastModule,
    AvatarModule,
    ProgressBarModule,
    DividerModule,
    RouterModule.forChild([{ path: '', component: CartComponent }]),
  ],
  providers: [MessageService],
  exports: [CartComponent],
})
export class CartModule {}
