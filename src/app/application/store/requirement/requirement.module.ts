import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementComponent } from './requirement.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'requirement', pathMatch: 'full' as PathMatch},
  { path: 'requirement', component: RequirementComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule,
    INRModule,
    DirectivesModule,NgbModule,
    RouterModule.forChild(routes),
    NgMultiSelectDropDownModule ,
    ReactiveFormsModule
  ],
  declarations: [RequirementComponent]
})
export class RequirementModule { }
