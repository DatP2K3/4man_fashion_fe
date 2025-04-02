import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SHARED_COMPONENTS } from '../../shared/shared.config';

@Component({
  selector: 'app-home',
  imports: [...SHARED_COMPONENTS],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
