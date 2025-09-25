import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillsComponent } from './bills.component';
import { RouterModule } from '@angular/router';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BillviewComponent } from './billview/billview.component';
import { NTWModule } from 'src/app/pipe/WORD/NTW.module';

import { ResizableModule } from 'angular-resizable-element';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'bills', pathMatch: 'full' as PathMatch},
  { path: 'bills', component: BillsComponent},
  { path: 'billview', component: BillviewComponent },
];
//RouterModule.forChild(routes)

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    NgbModule,
    INRModule,
    ReactiveFormsModule,
    NgSelectModule,
    NTWModule,
    ResizableModule,NgxSliderModule
  ],
  declarations: [BillsComponent, BillviewComponent],
  bootstrap:    [ BillsComponent ]
})
export class BillsModule { }
