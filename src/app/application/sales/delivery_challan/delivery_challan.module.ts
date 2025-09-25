import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Delivery_challanComponent } from './delivery_challan.component';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from "@ng-select/ng-select";
import { NTWModule } from 'src/app/pipe/WORD/NTW.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Delivery_challen_viewComponent } from './delivery_challen_view/delivery_challen_view.component';

type PathMatch = "full" | "prefix" | undefined;

export const routes = [
  { path: '', redirectTo: 'delivery_challan', pathMatch: 'full' as PathMatch},
  { path: 'delivery_challan', component: Delivery_challanComponent},
];
//RouterModule.forChild(routes)

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    INRModule,
    ReactiveFormsModule,
    NgSelectModule,
    NTWModule,
    NgbModule
  ],
  declarations: [Delivery_challanComponent,Delivery_challen_viewComponent]
})
export class Delivery_challanModule { }
