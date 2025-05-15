import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { BrandStoryComponent } from './brand-story.component';

@NgModule({
  declarations: [BrandStoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    RouterModule.forChild([{ path: '', component: BrandStoryComponent }]),
  ],
})
export class BrandStoryModule {}
