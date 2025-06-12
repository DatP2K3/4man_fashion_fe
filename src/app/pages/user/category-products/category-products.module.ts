import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryProductsComponent } from './category-products.component';
import { SharedModule } from '@app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [CategoryProductsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    ButtonModule,
    RatingModule,
    DropdownModule,
    PaginatorModule,
    RouterModule.forChild([{ path: '', component: CategoryProductsComponent }]),
  ],
  exports: [CategoryProductsComponent],
})
export class CategoryProductsModule {}
