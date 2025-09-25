import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Debit_noteComponent } from './debit_note.component';
import { Debit_note_viewComponent } from './debit_note_view/debit_note_view.component';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'src/app/theme/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';


type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'debit_note', pathMatch: 'full'  as PathMatch},
  { path: 'debit_note', component: Debit_noteComponent},
];

@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(routes),
         NgxDatatableModule,
         INRModule,
         FormsModule,
         NgbModule,
         ReactiveFormsModule,
         DirectivesModule,
         NgSelectModule
  ],
  declarations: [Debit_noteComponent,Debit_note_viewComponent]
})
export class Debit_noteModule { }
