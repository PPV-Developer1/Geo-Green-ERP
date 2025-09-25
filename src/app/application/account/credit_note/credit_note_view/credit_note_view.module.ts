import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { INRModule } from 'src/app/pipe/INR/INR.module';


@NgModule({
  imports: [
    CommonModule,NgxDatatableModule,INRModule
  ],
  declarations: []
})
export class Credit_note_viewModule { }
