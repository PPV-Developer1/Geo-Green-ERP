import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoniterComponent } from './moniter.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'moniter', pathMatch: 'full' as PathMatch},
  { path: 'moniter', component: MoniterComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  declarations: [MoniterComponent]
})
export class MoniterModule { }
