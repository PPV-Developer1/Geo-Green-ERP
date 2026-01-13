import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Serial_no_materialComponent } from './serial_no_material.component';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
type PathMatch = "full" | "prefix" | undefined;

export const routes = [
  { path: '', redirectTo: 'serial_material', pathMatch: 'full' as PathMatch},
  { path: 'serial_material', component: Serial_no_materialComponent},
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    ReactiveFormsModule,
    DirectivesModule,
    FormsModule,
    INRModule
  ],
  declarations: [Serial_no_materialComponent]
})
export class Serial_no_materialModule { }
