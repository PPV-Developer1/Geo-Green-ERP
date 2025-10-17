import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';

type PathMatch = "full" | "prefix" | undefined;

export const routes = [
  { path: '', redirectTo: 'category', pathMatch: 'full' as PathMatch},
  { path: 'category', component: CategoryComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    DirectivesModule,
    NgbModule,
    INRModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild(routes),
    NgSelectModule
  ],
  declarations: [CategoryComponent]
})
export class CategoryModule { }
