import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Payment_recievedComponent } from './payment_recieved.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from "@ng-select/ng-select";
import { Payment_viewComponent } from './payment_view/payment_view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'payment_received', pathMatch: 'full'},
  { path: 'payment_received', component: Payment_recievedComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgxDatatableModule,
    DirectivesModule,
    INRModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  declarations: [Payment_recievedComponent,Payment_viewComponent]
})
export class Payment_recievedModule { }
