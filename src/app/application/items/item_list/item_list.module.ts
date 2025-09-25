import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { Item_listComponent } from './item_list.component';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { INRModule } from 'src/app/pipe/INR/INR.module';


type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' as PathMatch},
  { path: 'list', component: Item_listComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    DirectivesModule,
    NgSelectModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgbModule,
    INRModule,
  ],
  declarations: [Item_listComponent]
})
export class Item_listModule { }
