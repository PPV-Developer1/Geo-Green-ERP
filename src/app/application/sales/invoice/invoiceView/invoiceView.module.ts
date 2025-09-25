import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceViewComponent } from './invoiceView.component';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    NgModule,INRModule,
    NgSelectModule
  ],
  declarations: [InvoiceViewComponent]
})
export class InvoiceViewModule { }
