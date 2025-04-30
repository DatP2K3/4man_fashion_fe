import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Main application routes
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/user/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./pages/user/account/account.module').then(
        (m) => m.AccountModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'product-detail/:id',
    loadChildren: () =>
      import('./pages/user/product-detail/product-detail.module').then(
        (m) => m.ProductDetailModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
