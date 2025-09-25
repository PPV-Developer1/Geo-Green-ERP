import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

type PathMatch = "full" | "prefix" | undefined; 
export const routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' as PathMatch}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [LoginComponent]
})

export class LoginModule { }
