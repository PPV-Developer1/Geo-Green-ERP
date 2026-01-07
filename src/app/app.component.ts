import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from './service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Service_endComponent } from './application/service_end/service_end.component';

@Component({
  selector: 'az-root',
  encapsulation: ViewEncapsulation.None,
  template:`<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  constructor(
    private router: Router,
    public api: ApiService,
    public modalService: NgbModal
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
      // const popupShown = localStorage.getItem('serviceEndNoticeShown');

    // if (!popupShown) {
    //   const modalRef = this.modalService.open(Service_endComponent, {
    //     backdrop: 'static', // user can’t close by clicking outside
    //     keyboard: false,    // user can’t close with Esc
    //     centered: true
    //   });

    //   modalRef.result.finally(() => {
    //     localStorage.setItem('serviceEndNoticeShown', 'true');
    //   });
    // }

    
    });
  }

  initializeApp() {
  }
}
