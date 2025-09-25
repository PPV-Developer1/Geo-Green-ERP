import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project_expensesComponent } from './project_expenses.component';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { INRModule } from 'src/app/pipe/INR/INR.module';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'expense', pathMatch: 'full' as PathMatch},
  { path: 'expense', component: Project_expensesComponent},
];
@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    INRModule
  ],
  declarations: [Project_expensesComponent]
})
export class Project_expensesModule { }
