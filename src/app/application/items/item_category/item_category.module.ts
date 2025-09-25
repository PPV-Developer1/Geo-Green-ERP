import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item_categoryComponent } from './item_category.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

type PathMatch = "full" | "prefix" | undefined; 
export const routes = [
  { path: '', redirectTo: 'category', pathMatch: 'full' as PathMatch},
  { path: 'category', component: Item_categoryComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [Item_categoryComponent]
})
export class Item_categoryModule { }
