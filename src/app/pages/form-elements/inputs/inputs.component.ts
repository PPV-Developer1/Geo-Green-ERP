import { Component, ViewEncapsulation } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'az-inputs',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './inputs.component.html'
})
export class InputsComponent {
    public firstControlModel: number[];
    public firstControlData: {id: number, name: string}[] = [
      { id: 1, name: 'Option 1' },
      { id: 2, name: 'Option 2' },
      { id: 3, name: 'Option 3' },
    ]; 
    public firstControlSettings: IDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      enableCheckAll: false
    };

    public secondControlModel: number[];
    public secondControlData: {id: number, name: string}[] = [
      { id: 1, name: 'Sweden'},
      { id: 2, name: 'Norway' },
      { id: 3, name: 'Canada' },
      { id: 4, name: 'USA' }
    ]; 
    public secondControlSettings: IDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      enableCheckAll: true
    };
 

    public thirdControlModel: number[];
    public thirdControlData: {id: number, name: string}[] = [
      { id: 1, name: 'Sweden'},
      { id: 2, name: 'Norway' },
      { id: 3, name: 'Canada' },
      { id: 4, name: 'USA' }
    ]; 
    public thirdControlSettings: IDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: true
    };

    onItemSelect(item: any) {
      console.log(item);
    }
    onSelectAll(items: any) {
      console.log(items);
    }
}
