import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgSelectModule } from '@ng-select/ng-select';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full'  as PathMatch},
  { path: 'main', component: SettingsComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgxDatatableModule,
    INRModule,
    NgSelectModule
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule { }
