import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CodeInputModule } from 'angular-code-input';
import { CoreCommonModule } from '@core/common.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


// routing
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login-otp',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule,CodeInputModule]
})
export class AuthModule {}
