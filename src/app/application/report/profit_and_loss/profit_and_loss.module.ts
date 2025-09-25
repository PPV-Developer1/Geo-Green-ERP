import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profit_and_lossComponent } from './profit_and_loss.component';
import { RouterModule } from '@angular/router';

type PathMatch = "full" | "prefix" | undefined; 

export const routes = [
  { path: '', redirectTo: 'profit_and_loss', pathMatch: 'full' as PathMatch},
  { path: 'profit_and_loss', component: Profit_and_lossComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Profit_and_lossComponent]
})
export class Profit_and_lossModule { }