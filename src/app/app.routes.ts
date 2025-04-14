import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';
import { InfoComponent } from './pages/account/components/info/info.component';
import { AddressComponent } from './pages/account/components/address/address.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ManageProductComponent } from './pages/admin/components/manage-product/manage-product.component';
import { EditProductComponent } from './pages/admin/components/edit-product/edit-product.component';
// Fix the import statement by being more specific with the path
import { ManageBannerComponent } from './pages/admin/components/manage-banner/manage-banner.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'account',
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
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'manage-products', component: ManageProductComponent },
      { path: 'manage-product/edit', component: EditProductComponent },
      { path: 'manage-products/edit/:id', component: EditProductComponent },
      { path: 'manage-banners', component: ManageBannerComponent },
    ],
  },
];
