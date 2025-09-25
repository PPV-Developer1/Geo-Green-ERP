import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stock_listComponent } from './stock_list.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

type PathMatch = "full" | "prefix" | undefined;

export const routes = [
  { path: '', redirectTo: 'stock_list', pathMatch: 'full' as PathMatch},
  { path: 'stock_list', component: Stock_listComponent},
];
//RouterModule.forChild(routes)
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    INRModule,
    DirectivesModule,NgbModule,
    RouterModule.forChild(routes),
    NgMultiSelectDropDownModule,
    ReactiveFormsModule
  ],
  declarations: [Stock_listComponent]
})
export class Stock_listModule { }
