import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './components/info/info.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { AccountComponent } from './account.component';
import { AddressComponent } from './components/address/address.component';
import { SharedModule } from '@app/shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ManageOrderOfMeComponent } from './components/manage-order-of-me/manage-order-of-me.component';
import { FaqComponent } from './components/faq/faq.component';
import { MembershipComponent } from './components/membership/membership.component';
// Import additional PrimeNG modules
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip'; // Import TooltipModule
import { DialogModule } from 'primeng/dialog'; // Thêm dòng này

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: 'info', component: InfoComponent },
      { path: 'address', component: AddressComponent },
      { path: 'refer-friend', component: InfoComponent },
      { path: 'orders', component: InfoComponent },
      { path: '4mancash-point', component: InfoComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'manage-order-of-me', component: ManageOrderOfMeComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AccountComponent,
    InfoComponent,
    AddressComponent,
    ManageOrderOfMeComponent,
    FaqComponent,
    // MembershipComponent đã bị loại bỏ khỏi declarations
  ],
  imports: [
    RouterModule,
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    ProgressBarModule,
    AvatarModule,
    ButtonModule,
    DividerModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    IftaLabelModule,
    DatePickerModule,
    DropdownModule,
    // Add PrimeNG modules
    TableModule,
    CalendarModule,
    PaginatorModule,
    InputTextModule,
    TooltipModule, // Add TooltipModule
    DialogModule, // Thêm dòng này
  ],
  providers: [MessageService],
})
export class AccountModule {}
