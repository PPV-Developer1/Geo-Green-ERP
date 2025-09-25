import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Payment_viewComponent } from './payment_view.component';
import { INRModule } from 'src/app/pipe/INR/INR.module';
@NgModule({
  imports: [
    CommonModule,
    NgModule,
    INRModule
  ],
  declarations: [Payment_viewComponent]
})
export class Payment_viewModule { }
