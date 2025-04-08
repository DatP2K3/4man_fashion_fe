import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';
import { InfoComponent } from './pages/account/components/info/info.component';
import { AddressComponent } from './pages/account/components/address/address.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'account',
    component: AccountComponent,
    children: [
      { path: 'info', component: InfoComponent }, // Route cho thông tin tài khoản
      { path: 'address', component: AddressComponent }, // Route cho sổ địa chỉ
      { path: 'refer-friend', component: InfoComponent }, // Placeholder for refer-friend
      { path: 'orders', component: InfoComponent }, // Placeholder for orders
      { path: '4mancash-point', component: InfoComponent }, // Placeholder for 4mancash-point
      { path: 'faq', component: InfoComponent }, // Placeholder for FAQ
    ],
  },
  { path: 'admin', component: AdminComponent },
];
