import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Po_viewComponent } from './po_view.component';
import { NumtowordPipe } from 'src/app/pipe/WORD/numtoword.pipe';

@NgModule({
  imports: [
    CommonModule,
    NgModule,
    NumtowordPipe
  ],
  declarations: [Po_viewComponent]
})
export class Po_viewModule { }
