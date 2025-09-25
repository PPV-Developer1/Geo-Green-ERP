
import { Component, ElementRef, HostBinding } from "@angular/core";
@Component({
  selector: 'app-resizable',
  templateUrl: './resizable.component.html',
  styleUrls: ['./resizable.component.css']
})
export class ResizableComponent  {

  @HostBinding("style.width.px")
  width: number | null = null;

  onResize(width: number) {
    this.width = width;
  }

}
