import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndianCurrency } from './indianCurrency.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IndianCurrency],
  exports: [IndianCurrency]
})
export class INRModule { }
