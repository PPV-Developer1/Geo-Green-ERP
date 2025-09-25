import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptenceComponent } from './acceptence.component';
import { RouterModule } from '@angular/router';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'acceptence', pathMatch: 'full' as PathMatch},
  { path: 'acceptence', component: AcceptenceComponent},

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    NgbModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AcceptenceComponent]
})
export class AcceptenceModule { }
