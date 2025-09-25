import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthComponent } from './unauth.component';
import { RouterModule } from '@angular/router';

type PathMatch = "full" | "prefix" | undefined;

export const routes = [
  { path: '', redirectTo: 'unauth', pathMatch: 'full' as PathMatch},
  { path: 'unauth', component: UnauthComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UnauthComponent]
})
export class UnauthModule { }
