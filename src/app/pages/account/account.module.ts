import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { InfoComponent } from './components/info/info.component';
import { AddressComponent } from './components/address/address.component';
import { SharedModule } from '../../shared/shared.module';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';

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
      { path: 'faq', component: InfoComponent },
    ],
  },
];

@NgModule({
  declarations: [AccountComponent, InfoComponent, AddressComponent],
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
    IftaLabelModule, // Add this for p-iftalabel component
    DatePickerModule, // Add this for p-datepicker component
    DropdownModule, // Add this if using dropdowns in address component
  ],
})
export class AccountModule {}
