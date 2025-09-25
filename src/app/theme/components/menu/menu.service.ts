import { Injectable } from '@angular/core';
import { menu } from './menu';

@Injectable()
export class MenuService
{

  public getMenuItems():Array<Object>
  {
    const user_type = localStorage.getItem('type');
    return menu;
  }

}
