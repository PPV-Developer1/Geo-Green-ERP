import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product_stock_listComponent } from './product_stock_list.component';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
type PathMatch = "full" | "prefix" | undefined;

export const routes = [
  { path: '', redirectTo: 'product_stock_list', pathMatch: 'full' as PathMatch},
  { path: 'product_stock_list', component: Product_stock_listComponent},
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule

  ],
  declarations: [Product_stock_listComponent]
})
export class Product_stock_listModule { }
