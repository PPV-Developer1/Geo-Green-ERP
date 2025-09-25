import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseComponent } from './expense.component';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'expense', pathMatch: 'full' as PathMatch},
  { path: 'expense', component: ExpenseComponent},
];
//RouterModule.forChild(routes)

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    INRModule,
    NgSelectModule,NgxDatatableModule
  ],
  declarations: [ExpenseComponent]
})
export class ExpenseModule { }
