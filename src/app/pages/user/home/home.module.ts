import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    ButtonModule,
    RatingModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
