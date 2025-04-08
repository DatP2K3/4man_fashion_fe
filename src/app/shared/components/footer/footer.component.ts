import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    ButtonModule,
    DrawerModule,
    ProgressBar,
    DividerModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
