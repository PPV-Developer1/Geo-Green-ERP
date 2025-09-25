import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorComponent } from './vendor.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";


type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'vendor', pathMatch: 'full' as PathMatch},
  { path: 'vendor', component: VendorComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule ,
    NgSelectModule,
    NgxDatatableModule,
    INRModule,
    DirectivesModule,
    NgxSkeletonLoaderModule
  ],
  declarations: [VendorComponent]
})
export class VendorModule { }
