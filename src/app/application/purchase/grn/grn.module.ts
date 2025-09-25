import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnComponent } from './grn.component';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', redirectTo: 'grn', pathMatch: 'full'},
  { path: 'grn', component: GrnComponent},
];
//RouterModule.forChild(routes)

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GrnComponent]
})
export class GrnModule { }
