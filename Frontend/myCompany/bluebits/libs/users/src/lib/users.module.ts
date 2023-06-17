//this users.module.ts will be used in app.module.ts , we'll import it in app.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { RouterModule, Routes } from '@angular/router';

import {InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent
    }
  ];

@NgModule({
    //since users.module.ts is a child of app.module.ts
    imports: [CommonModule,
       RouterModule.forChild(routes),
        InputTextModule,
         ButtonModule,
          FormsModule,
          ReactiveFormsModule ],
    declarations: [LoginComponent]
})
export class UsersModule {}
