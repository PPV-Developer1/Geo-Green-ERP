import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { Location } from '@angular/common';
import { AppState } from '../app.state';
import { ApiService } from 'src/app/service/api.service';   // For Page Validation
import { ToastrService } from 'ngx-toastr';                 // For Page Validation
import { Router , NavigationEnd} from '@angular/router';    // For Page Validation
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Service_endComponent } from './service_end/service_end.component';
@Component({
  selector: 'az-pages',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
  providers: [ AppState ]
})
export class ApplicationComponent implements AfterViewInit
{
    private isLogicExecuting = false;
    public isMenuCollapsed:boolean = false;
    public page:any = "";

    currentYear: number = new Date().getFullYear();
    constructor
    (
        private activatedRoute: ActivatedRoute,
        private _state:AppState,
        private _location:Location,
        public api: ApiService,               // For Page Validation
        public toastrService: ToastrService,  // For Page Validation
        private router: Router ,               // For Page Validation
         public modalService: NgbModal
        )
        {
        this._state.subscribe('menu.isCollapsed', (isCollapsed) =>
        {
            this.isMenuCollapsed = isCollapsed;
        });
    }

    ngOnInit()
    {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {

          if (!this.isLogicExecuting) {
          //this.handleRouteChanges();
          this.getpageaccess();
          this.getCurrentPageName();
          }
        }
      });
        // this.service_end()
        
      //  const popupShown = localStorage.getItem('serviceEndNoticeShown');
      //   // if (!popupShown) {
      //       const modalRef = this.modalService.open(Service_endComponent, {
      //         backdrop: 'static', // user can’t close by clicking outside
      //         keyboard: false,    // user can’t close with Esc
      //         centered: true
      //       });

            // modalRef.result.finally(() => {
            //   localStorage.setItem('serviceEndNoticeShown', 'false');
            // });
    // }
  }

  async service_end()
  {
    console.log("enter")
    const serviceEndDate = new Date('2025-11-20'); // 📅 your actual end date
    const today = new Date();

    // Calculate days remaining
    const diffDays = Math.ceil((serviceEndDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
console.log("diffDays",diffDays)
    if (diffDays <= 0) {
      // Service period has ended
      const modalRef = this.modalService.open(Service_endComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true
      });
      modalRef.componentInstance.title = '🚫 Service Period Ended';
      modalRef.componentInstance.message =
        'Your service period ended on 20 November 2025.';
    } else if (diffDays <= 12) {
      // Within 7 days of end date → show warning
      const modalRef = this.modalService.open(Service_endComponent, {
        centered: true
      });
      modalRef.componentInstance.title = '⚠️ Service Period Ending Soon';
      modalRef.componentInstance.message =
        `Your service period will end on 20 November 2025 (in ${diffDays} day${diffDays > 1 ? 's' : ''}).`;
    }

  }

    // handleRouteChanges() {

    //   this.isLogicExecuting = true;
    //   this.getpageaccess();
    //   this.getCurrentPageName();

    //   setTimeout(() => {
    //     this.isLogicExecuting = false;
    //   }, 500);
    // }

    public getCurrentPageName():void
    {
        this.isLogicExecuting = true;

        let url = this._location.path();
        let hash = (window.location.hash) ? '#' : '';
        setTimeout(function(){
            let subMenu = jQuery('a[href="'+ hash + url + '"]').closest("li").closest("ul");
            window.scrollTo(0, 0);
            subMenu.closest("li").addClass("sidebar-item-expanded");
            subMenu.slideDown(250);
        });

        setTimeout(() => {
          this.isLogicExecuting = false;
        }, 500);
    }

// Page Validation for User Access
    async getpageaccess()
    {
        const user_id = localStorage.getItem('uid');
        const user_type = localStorage.getItem('type_id');
        let url = this._location.path();
      //  console.log("Unauth :", url);
        url = url.substring(5);
      //  console.log("Unauth Sub :", url);

        await this.api.get('user_role.php?user_role='+user_type).then((data: any) =>
        {
        //  console.log(data)
          let found = data.some(item => {
            if (item.routerLink == url) {
              //this.page = "ok";
              return true;           // Stop the iteration
            } else {
              return false;           // Continue the iteration
            }
          });


          // let found = false;

          //   for (let i = 0; i < data.length; i++) {
          //       const item = data[i];
          //       if (item.routerLink == url) {
          //        /// this.page = "ok";
          //         console.log('ok  ', item.routerLink);
          //         found = true;
          //         break;           // Break out of the loop
          //       } else {
          //         console.log('reject  ', item.routerLink);
          //       }
          //   }

          if(found)
          {
            this.page = "ok"
          }
          else{
            this.page = ""
          }

        if ( this.page == "ok" ) { }

        else if ( this.page == "" )
        {
            this.api.get('unauth.php?user_id='+user_id+'&page='+url).then((data: any) =>
            {
           //  console.log(data)
                if (data.status == "success")
                {
                    this.toastrService.success('Bad Request Posted');
                }
            }).catch(error => {console.log('Error : ', error);});

            this.router.navigate(['/app/unauth']);
            this.toastrService.error('Unauthorized Usage');
        }
        }).catch(error => {console.log('Error : ', error);});
    }
// Page Validation for User Access
    public hideMenu():void{
        this._state.notifyDataChanged('menu.isCollapsed', true);
    }

    public ngAfterViewInit(): void {
        document.getElementById('preloader').style['display'] = 'none';
    }

}
