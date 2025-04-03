import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/User';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { ProgressBar } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-header',
  imports: [
    NgIf,
    RouterModule,
    ButtonModule,
    DrawerModule,
    ProgressBar,
    DividerModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public user = new User();
  public visible: boolean = false;
  public percent: number = 80;
  public isLoggedIn = false;
}
