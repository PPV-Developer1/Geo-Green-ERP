import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Outward_salesComponent } from './outward_sales.component';
import { RouterModule,Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'outward_sales', pathMatch: 'full' as PathMatch},
  { path: 'outward_sales', component: Outward_salesComponent},
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgxDatatableModule,
    DirectivesModule,
    NgMultiSelectDropDownModule,
    NgbModule,
    INRModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  declarations: [Outward_salesComponent]
})
export class Outward_salesModule { }
