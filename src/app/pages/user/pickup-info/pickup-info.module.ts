import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { PickupInfoComponent } from './pickup-info.component';

@NgModule({
  declarations: [PickupInfoComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    // PrimeNG
    TableModule,
    ButtonModule,
    ToastModule,
    DividerModule,
    ProgressBarModule,
    AvatarModule,
    DropdownModule,
    RouterModule.forChild([{ path: '', component: PickupInfoComponent }]),
  ],
  providers: [MessageService],
  exports: [PickupInfoComponent],
})
export class PickupInfoModule {}
