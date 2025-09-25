import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from "@ng-select/ng-select";
import { NTWModule } from 'src/app/pipe/WORD/NTW.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { InvoiceViewComponent } from './invoiceView/invoiceView.component';
import { ResizableModule } from 'angular-resizable-element';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'invoice', pathMatch: 'full'  as PathMatch},
  { path: 'invoice', component: InvoiceComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    INRModule,
    ReactiveFormsModule,
    NgSelectModule,
    NTWModule,
    NgbModule,
    ResizableModule,NgxSliderModule,NgMultiSelectDropDownModule
  ],
  declarations: [InvoiceComponent,InvoiceViewComponent]
})
export class InvoiceModule { }
