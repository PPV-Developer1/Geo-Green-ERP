import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'project', pathMatch: 'full' as PathMatch},
  { path: 'project', component: ProjectComponent},
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
    INRModule,
    NgSelectModule
  ],
  declarations: [ProjectComponent],
  bootstrap: [ProjectComponent]
})
export class ProjectModule { }


