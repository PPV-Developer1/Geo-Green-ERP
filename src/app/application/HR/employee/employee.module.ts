import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'employee', pathMatch: 'full' as PathMatch},
  { path: 'employee', component: EmployeeComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    NgbModule,
    INRModule
  ],
  declarations: [EmployeeComponent],
  bootstrap: [EmployeeComponent]
})
export class EmployeeModule { }


