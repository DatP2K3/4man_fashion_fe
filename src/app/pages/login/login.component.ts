import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, OnInit, output } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    DividerModule,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  checked: boolean = false;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&-+=()!?"]).{8,128}$/
          ),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Đăng nhập thành công',
        life: 3000,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Đăng nhập không thành công',
        life: 3000,
      });
    }
  }
}
