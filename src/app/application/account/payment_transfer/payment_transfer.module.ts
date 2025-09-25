import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Payment_transferComponent } from './payment_transfer.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

export const routes: Routes = [
  { path: '', redirectTo: 'payment', pathMatch: 'full'},
  { path: 'payment', component: Payment_transferComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    NgbModule,
    INRModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  declarations: [Payment_transferComponent],
  bootstrap: [Payment_transferModule]
})
export class Payment_transferModule { }
