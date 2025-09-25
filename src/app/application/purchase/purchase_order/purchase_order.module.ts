import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Purchase_orderComponent } from './purchase_order.component';
import { RouterModule } from '@angular/router';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Po_viewComponent } from './po_view/po_view.component';
import { NTWModule } from 'src/app/pipe/WORD/NTW.module';

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'purchase_order', pathMatch: 'full' as PathMatch},
  { path: 'purchase_order', component: Purchase_orderComponent},

];

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
    NTWModule
  ],
  declarations: [Purchase_orderComponent,Po_viewComponent]
})
export class Purchase_orderModule { }
