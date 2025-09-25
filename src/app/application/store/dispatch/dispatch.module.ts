import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispatchComponent } from './dispatch.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'dispatch', pathMatch: 'full' as PathMatch},
  { path: 'dispatch', component: DispatchComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    DirectivesModule,
    NgSelectModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgbModule,
    NgMultiSelectDropDownModule
  ],
  declarations: [DispatchComponent]
})
export class DispatchModule { }
