import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Debit_noteComponent } from './debit_note.component';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Debit_note_viewComponent } from './debit_note_view/debit_note_view.component';

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
    ReactiveFormsModule
  ],
  declarations: [Debit_noteComponent,Debit_note_viewComponent]
})
export class Debit_noteModule { }
