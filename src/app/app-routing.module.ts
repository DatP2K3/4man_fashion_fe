import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { MembershipComponent } from './pages/user/account/components/membership/membership.component';

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
  {
    path: 'cart',
    loadChildren: () =>
      import('./pages/user/cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: 'pickup-info',
    loadChildren: () =>
      import('./pages/user/pickup-info/pickup-info.module').then(
        (m) => m.PickupInfoModule
      ),
  },
  {
    path: 'order-successed',
    loadChildren: () =>
      import('./pages/user/order-successed/order-successed.module').then(
        (m) => m.OrderSuccessedModule
      ),
  },
  {
    path: 'brand-story',
    loadChildren: () =>
      import('./pages/user/brand-story/brand-story.module').then(
        (m) => m.BrandStoryModule
      ),
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  // Add these routes for category display
  {
    path: 'ao',
    loadChildren: () =>
      import('./pages/user/category-products/category-products.module').then(
        (m) => m.CategoryProductsModule
      ),
    data: { type: 'ao' },
  },
  {
    path: 'quan',
    loadChildren: () =>
      import('./pages/user/category-products/category-products.module').then(
        (m) => m.CategoryProductsModule
      ),
    data: { type: 'quan' },
  },
  {
    path: 'ao/:id',
    loadChildren: () =>
      import('./pages/user/category-products/category-products.module').then(
        (m) => m.CategoryProductsModule
      ),
  },
  {
    path: 'quan/:id',
    loadChildren: () =>
      import('./pages/user/category-products/category-products.module').then(
        (m) => m.CategoryProductsModule
      ),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./pages/user/category-products/category-products.module').then(
        (m) => m.CategoryProductsModule
      ),
  },
  {
    path: 'membership',
    component: MembershipComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
