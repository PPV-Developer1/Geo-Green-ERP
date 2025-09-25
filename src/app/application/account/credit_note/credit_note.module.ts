import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Credit_noteComponent } from './credit_note.component';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Credit_note_viewComponent } from './credit_note_view/credit_note_view.component';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'src/app/theme/directives/directives.module';
import { NgSelectModule } from "@ng-select/ng-select";

type PathMatch = "full" | "prefix" | undefined;
export const routes = [
  { path: '', redirectTo: 'credit_note', pathMatch: 'full'  as PathMatch},
  { path: 'credit_note', component: Credit_noteComponent},
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
  declarations: [Credit_noteComponent,Credit_note_viewComponent]
})
export class Credit_noteModule { }
