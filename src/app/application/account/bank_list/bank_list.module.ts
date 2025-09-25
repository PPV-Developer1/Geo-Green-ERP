import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bank_listComponent } from './bank_list.component';
import { RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

type PathMatch = "full" | "prefix" | undefined;

export const routes = [
  { path: '', redirectTo: 'bank', pathMatch: 'full' as PathMatch},
  { path: 'bank', component: Bank_listComponent},
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
    NgSelectModule
  ],
  declarations: [Bank_listComponent],
  bootstrap: [Bank_listModule]
})
export class Bank_listModule { }
