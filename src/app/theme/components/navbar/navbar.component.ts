import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from '../../../app.state';
import { SidebarService } from '../sidebar/sidebar.service';
import { Router } from '@angular/router';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'az-navbar',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [ SidebarService ]
})

export class NavbarComponent {
    public isMenuCollapsed:boolean = false;
    public user_prefix    = localStorage.getItem('prefix');
    public user_name    = localStorage.getItem('name');
    public designation  = localStorage.getItem('designation');
    public user_type    = localStorage.getItem('user_type');
    public user_image   = localStorage.getItem('image');
    public last_login   = localStorage.getItem('last_login');
    public logo         = localStorage.getItem('com_logo');
    public icon         = localStorage.getItem('com_icon');
    

    public img_call     = environment.baseURL+"upload/employee_images/"+this.user_image;
    public logo_call    = environment.baseURL+"upload/company/"+this.logo;
    public icon_call    = environment.baseURL+"upload/company/"+this.icon;
    
    
    constructor(private router: Router, private _state:AppState, private _sidebarService:SidebarService) 
    {
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
    }

    public closeSubMenus(){
       /* when using <az-sidebar> instead of <az-menu> uncomment this line */
      // this._sidebarService.closeAllSubMenus();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed; 
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);        
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
      }

}
