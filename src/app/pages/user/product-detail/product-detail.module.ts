import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ProductDetailComponent } from './product-detail.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { GalleriaModule } from 'primeng/galleria';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [ProductDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    ButtonModule,
    RatingModule,
    SharedModule,
    InputNumberModule,
    BadgeModule,
    TableModule,
    GalleriaModule,
    ToastModule,
    RouterModule.forChild([{ path: '', component: ProductDetailComponent }]),
  ],
  exports: [ProductDetailComponent],
})
export class ProductDetailModule {}
