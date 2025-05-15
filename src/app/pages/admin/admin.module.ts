import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ManageProductComponent } from './components/manage-product/manage-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ManageBannerComponent } from './components/manage-banner/manage-banner.component';
import { ManagePromotionComponent } from './components/manage-promotion/manage-promotion.component';
import { ManageOrderComponent } from './components/manage-order/manage-order.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageShopAddressComponent } from './components/manage-shop-address/manage-shop-address.component';
import { RoleGuard } from '../../core/guards/role.guard';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { EditorModule } from 'primeng/editor';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EditPromotionComponent } from './components/edit-promotion/edit-promotion.component';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PaginatorModule } from 'primeng/paginator';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChartModule } from 'primeng/chart';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [RoleGuard],
    canActivateChild: [RoleGuard],
    data: {
      role: 'ADMIN',
    },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'manage-products', component: ManageProductComponent },
      { path: 'manage-products/edit', component: EditProductComponent },
      { path: 'manage-products/edit/:id', component: EditProductComponent },
      { path: 'manage-banners', component: ManageBannerComponent },
      { path: 'manage-promotions', component: ManagePromotionComponent },
      {
        path: 'manage-promotions/promotion',
        component: EditPromotionComponent,
      },
      {
        path: 'manage-promotions/flash-sale',
        component: EditPromotionComponent,
      },
      { path: 'manage-promotions/edit/:id', component: EditPromotionComponent },
      { path: 'manage-shop-address', component: ManageShopAddressComponent },
      { path: 'manage-orders', component: ManageOrderComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AdminComponent,
    ManageProductComponent,
    EditProductComponent,
    ManageBannerComponent,
    ManagePromotionComponent,
    EditPromotionComponent,
    ManageShopAddressComponent,
    ManageOrderComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    // PrimeNG modules
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    InputNumberModule,
    FileUploadModule,
    DropdownModule,
    CheckboxModule,
    DividerModule,
    EditorModule,
    DialogModule,
    ChipModule,
    ToastModule,
    CardModule,
    ConfirmDialogModule,
    TabViewModule,
    ProgressSpinnerModule,
    CalendarModule,
    RadioButtonModule,
    PaginatorModule,
    AccordionModule,
    IftaLabelModule,
    TabMenuModule,
    ChartModule,
  ],
  providers: [MessageService],
})
export class AdminModule {}
