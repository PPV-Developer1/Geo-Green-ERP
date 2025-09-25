import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormGroup, Validators, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';


@Component({
  selector: 'az-byproduct',
  templateUrl: './byproduct.component.html',
  styleUrls: ['./byproduct.component.scss']
})
export class ByproductComponent implements OnInit
{
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("move_to_pro",{static:true}) move_to_pro:ElementRef;
  @ViewChild("content",{static:true}) content:ElementRef;
  @ViewChild("AddStore",{static:true}) AddStore:ElementRef;

  project_id          : any;
  project_full_view   : any;
  byproduct_full_view : any;
  byproduct_id        : any;
  level               : any;
  modalRef            : any;
  add_options         : any;
  production_id       : any;
  store_list          : any;

  rows                = [];
  temp                = [];
  selected            = [];
  detail_view         = [];
  production_view     = [];
  disp_data           = [];
  byproduct_details   = [];

  loading         : boolean=false;
  filteredOptions : Observable<string[]>;
  myControl       = new FormControl();
  Product_no      : any
  AddFromStr = new FormGroup
  ({
    store_id   : new FormControl(null, [Validators.required]),
  })
  constructor(private modalService: NgbModal,public api: ApiService, public toastrService: ToastrService)
  {
  }
  ngOnInit()
  {
    this.getAsso();
  }
  getAsso()
  {
    this.api.get('mp_byproduct_list.php?authToken='+environment.authToken).then((data: any) =>
    {
      this.byproduct_details  = data.asso_data;
      this.temp               = [...data.asso_data];
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  set_zero(content)
  {
    this.selected = [];
  }
  async AddStoreItem()
  {
    Object.keys(this.AddFromStr.controls).forEach(field =>
      {
        const control = this.AddFromStr.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if(this.AddFromStr.valid)
    {
      let id = this.detail_view['id'];
      this.loading = true;
      await this.api.post('mp_prodiction_move_byproduct.php?id='+id+'&authToken=' + environment.authToken, this.AddFromStr.value).then((data: any) =>
      {
        if(data.status == "success")
          {
            this.loading = false;
            this.toastrService.success('Succesfully Linked');
            this.modalRef.close();
            this.selected = [];
            this.getAsso();
            this.getAsso();
          }
        else
        { this.toastrService.error(data.status);
          this.loading = false;}
        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : newAccount');
          this.loading = false;
      });
    }
  }

  AddFromStore()
  {
    this.api.get('mp_production_view.php?mode=without&authToken='+environment.authToken).then((data: any) =>
    {
      this.store_list = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});
    this.openXl(this.AddStore);
  }


  move_to_production()
  {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');       // "14"
    const month = String(today.getMonth() + 1).padStart(2, '0'); // "09" (months are 0-based)
    const year = String(today.getFullYear()).slice(-2);         // "25"

    const formattedDate = day + month + year+'/'+ this.detail_view['id'];

    console.log(formattedDate); // e.g., "140925"
    this.Product_no = formattedDate
    this.openSm(this.move_to_pro);
  }


  async confirm()
  {
    this.detail_view['product_no'] = this.Product_no
    this.loading=true;
    await this.api.post('mp_move_to_production.php?authToken=' + environment.authToken, this.detail_view).then((data: any) =>
      {
        if(data.status == "success")
          {
            this.loading = false;
            this.toastrService.success('Succesfully Moved to Production');
            this.getAsso();
            this.selected = [];
          }
        else
          { this.toastrService.error(data.status);
            this.loading = false; }
        return true;
      }).catch(error =>
      {
        this.toastrService.error('API Faild : confirm');
        this.loading = false;
      });
    this.modalRef.dismiss();
  }
  openSm(value)
  {
    this.modalRef =  this.modalService.open(value, { size: 'md'});
  }
  openXl(value)
  {
    this.modalRef =  this.modalService.open(value, { size: 'xl'});
  }

  updateFilter(event)
  {
    const val = event.target.value.toLowerCase();

        const temp = this.temp.filter((d) => {
          return Object.values(d).some(field =>
            field != null && field.toString().toLowerCase().indexOf(val) !== -1
          );
        });
        this.byproduct_details = temp;
        this.table.offset = 0;
  }

  async onActivate(event)
  {
    console.log(event.type)
    if(event.type === "click"  )
    {
      this.level=0;
      this.detail_view = event.row;
      console.log(event.row)
      this.production_id = this.detail_view['production_id'];
      if(this.detail_view['production_id'] != null)
      {
        await this.api.get('mp_production_view.php?production_id='+this.production_id+'&authToken=' + environment.authToken).then((data: any) =>
        {
          this.production_view = data[0];
          this.level=data[0].level;
        }).catch(error => {this.toastrService.error('API Faild : confirm');});
      }
    }
  }
}
