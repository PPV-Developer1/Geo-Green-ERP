import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WizardValidationService } from './wizard-validation.service';


type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'customer', pathMatch: 'full' as PathMatch},
  { path: 'customer', component: CustomerComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule ,
    NgSelectModule,
    NgxDatatableModule,
    INRModule,
    DirectivesModule,NgbModule,
    RouterModule.forChild(routes),
    
  ],
  declarations: [CustomerComponent]
})
export class CustomerModule { }
