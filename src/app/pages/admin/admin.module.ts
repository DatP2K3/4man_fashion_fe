import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ManageProductComponent } from './components/manage-product/manage-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ManageBannerComponent } from './components/manage-banner/manage-banner.component';
import { ManagePromotionComponent } from './components/manage-promotion/manage-promotion.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { ToastModule } from 'primeng/toast'; // Ensure ToastModule is imported
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EditPromotionComponent } from './components/edit-promotion/edit-promotion.component';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PaginatorModule } from 'primeng/paginator';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'manage-products', component: ManageProductComponent },
      { path: 'manage-products/edit', component: EditProductComponent },
      { path: 'manage-products/edit/:id', component: EditProductComponent },
      { path: 'manage-banners', component: ManageBannerComponent },
      { path: 'manage-promotions', component: ManagePromotionComponent },
      { path: 'manage-promotions/edit', component: EditPromotionComponent },
      { path: 'manage-promotions/edit/:id', component: EditPromotionComponent },
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
    EditPromotionComponent, // Make sure EditPromotionComponent is declared here
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    ButtonModule, // Ensure ButtonModule is included here
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
    ToastModule, // Make sure ToastModule is included here
    CardModule,
    ConfirmDialogModule,
    TabViewModule,
    ProgressSpinnerModule,
    CalendarModule,
    RadioButtonModule,
    PaginatorModule,
  ],
})
export class AdminModule {}
