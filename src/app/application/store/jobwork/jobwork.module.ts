import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsheetComponent } from './jobwork.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'src/app/theme/directives/directives.module';


type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'jobwork', pathMatch: 'full'  as PathMatch},
  { path: 'jobwork', component: JobsheetComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    INRModule,
    NgSelectModule,
    NgxDatatableModule,
    NgbModule,
    DirectivesModule
  ],
  declarations: [JobsheetComponent]
})
export class JobworkModule { }
