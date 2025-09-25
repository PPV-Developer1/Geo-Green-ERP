import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { CkeditorComponent } from './ckeditor/ckeditor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'ckeditor', pathMatch: 'full'},
  { path: 'ckeditor', component: CkeditorComponent, data: { breadcrumb: 'Ckeditor' } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule,    
    RouterModule.forChild(routes)
  ],
  declarations: [
    CkeditorComponent
  ]
})
export class EditorsModule { }
