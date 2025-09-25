import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './attendance.component';
import { RouterModule } from '@angular/router';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';

type PathMatch = "full" | "prefix" | undefined; 
export const routes = [
  { path: '', redirectTo: 'attendance', pathMatch: 'full' as PathMatch},
  { path: 'attendance', component: AttendanceComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    NgxDatatableModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    NgbModule,
    INRModule
  ],
  declarations: [AttendanceComponent],
  bootstrap: [AttendanceComponent]
})
export class AttendanceModule { }