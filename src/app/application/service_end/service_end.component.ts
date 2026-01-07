import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-service_end',
  templateUrl: './service_end.component.html',
  styleUrls: ['./service_end.component.scss']
})
export class Service_endComponent  {
 @Input() title: string = '';
  @Input() message: string = '';
  constructor(public activeModal: NgbActiveModal) {}

  close(): void {
    this.activeModal.close();
  }


}
