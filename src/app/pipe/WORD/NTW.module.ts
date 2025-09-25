import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumtowordPipe } from './numtoword.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NumtowordPipe],
  exports: [NumtowordPipe]
})
export class NTWModule { }
