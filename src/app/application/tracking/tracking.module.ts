import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingComponent } from './tracking.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'src/app/theme/directives/directives.module';
//import { TimelineModule } from "primeng/timeline";
//import { CardModule } from "primeng/card";

type PathMatch = "full" | "prefix" | undefined;

export const routes = [
  { path: '', redirectTo: 'order_tracking', pathMatch: 'full' as PathMatch},
  { path: 'order_tracking', component: TrackingComponent},
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
    NgbModule,
    INRModule,
    DirectivesModule,NgSelectModule
  ],
  declarations: [TrackingComponent],
  bootstrap: [TrackingComponent]
})
export class TrackingModule { }
