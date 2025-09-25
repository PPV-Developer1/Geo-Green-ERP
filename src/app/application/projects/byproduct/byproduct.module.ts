import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ByproductComponent } from './byproduct.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'byproduct', pathMatch: 'full' as PathMatch},
  { path: 'byproduct', component: ByproductComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    DirectivesModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild(routes),
    NgbModule,
    INRModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  declarations: [ByproductComponent]
})
export class ByproductModule { }
