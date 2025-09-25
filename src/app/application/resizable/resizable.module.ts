import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizableComponent } from './resizable.component';
import { ResizableDirective } from './resizable.directive';

@NgModule({
  exports: [ResizableComponent],
  declarations: [ResizableComponent,ResizableDirective]
})
export class ResizableModule { }
