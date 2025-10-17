import { routes } from './../../pages/ui/ui.module';
import { Component, ViewChild, OnInit, ElementRef, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'az-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {

  selected      = [];
  projects      = [];
  filter        = [];
  tracking_view = [];
  detail_view   : any;
  asso_view     = [];
  track_data    = [];

  p_id             : any;
  value            : any;
  association_list : any
  total_projectCost: any
  expense_list     : any
  itemWithoutAsso  : any
  itemWithoutAsso_length:any
  byproduct_list   : any
  asso_detail_show : boolean=false
  asso_details     : any
  product_list     : any
  byproduct_detail_show:boolean=false
  byproduct_details:any
  product_detail_show:boolean=false
  loading:boolean=false
  product_details  :any
  modalRef         :any
  customer_list    :any
  vendor_list      :any
  Model             : any

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("details",{static:true}) details:ElementRef;

  gfg: { status: string; }[];


  constructor
  (
    public api: ApiService,
    public toastrService: ToastrService,
    private modalService: NgbModal,
  )
  {}

  ngOnInit()
  {
    this.loadData();
  }

  updateFilter(event)
  {
        const val = event.target.value.toLowerCase();
        const temp = this.filter.filter((d) => {
              return Object.values(d).some(field =>
                field != null && field.toString().toLowerCase().indexOf(val) !== -1
              );
            });
        this.projects = temp;
        this.table.offset = 0;
  }


  async loadData()
  {
   await this.api.get('mp_project_list.php?authToken='+environment.authToken).then((data: any) =>
    {
      this.projects = data;
      this.filter = [...data];
    }).catch(error => {this.toastrService.error('Something went wrong');});

   await this.api.get('get_data.php?table=product_type&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
        this.product_list = data;
      }).catch(error => {this.toastrService.error('Something went wrong');});
   await   this.api.get('get_data.php?table=customers&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
        console.log("customer_list : ",data)
        this.customer_list = data;
      }).catch(error => {this.toastrService.error('Something went wrong');});

     await  this.api.get('get_data.php?table=vendor&authToken='+environment.authToken).then((data: any) =>
        {
          console.log("vendor_list : ",data)
          this.vendor_list = data;
        }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  onActivate(event)
  {
    if(event.type === "click")
    {

      this.detail_view = event.row;
      this.p_id = this.detail_view['id'];
      this.api.get('mp_project_tracking.php?authToken='+environment.authToken+'&project_id='+this.p_id).then((data: any) =>
        {
              console.log(data)
              this.track_data = data[0];
              this.expense_list = data[0].expense_list
              this.association_list =data[0].project_asso_list
              this.total_projectCost =  data[0].total_project_cost
              this.itemWithoutAsso = data[0].project_items
              this.itemWithoutAsso_length = this.itemWithoutAsso.length
               let asso_cost = 0;
                if(data[0].project_asso_con_cost != undefined)
                {
                    asso_cost = data[0].project_asso_con_cost;
                }
              this.value =((parseInt(data[0].project_asso_cost) + asso_cost + parseInt(data[0].expense_total_amount))/(parseInt(data[0].project_value)/100)).toFixed(2) ;
              return true;

        }).catch(error =>
        {
            this.toastrService.error('Something went wrong');
        });
    }
  }

  project_item_list_dispatch : any
 async item_data(event)
  {
    if(event.type =="click")
    {
      console.log(event.row)
      await this.api.get('get_data.php?table=project_item_list_dispatch&find=project_item_id&value='+event.row.id+'&authToken='+environment.authToken).then((data: any) =>
      {
        console.log("data :",data)
      this.project_item_list_dispatch = data;this.itemWithoutAsso
      if(data != null)
      {
          for(let i =0;i<data.length;i++)
          {
            this.project_item_list_dispatch[i]['uom'] = event.row.uom
          }
       }

      }).catch(error => {this.toastrService.error('Something went wrong');});

      this.Model = this.modalService.open(this.details,{size:"md"})
    }
  }

  set_zero()
  {
        if( this.selected.length >0 && !this.asso_detail_show && !this.byproduct_detail_show)
        {
          this.selected = [];
        }

        if( this.asso_detail_show)
        {
          this.asso_detail_show = false
        }
        if(this.byproduct_detail_show)
        {
          this.asso_detail_show = true
          this.byproduct_detail_show=false
        }
        if(this.product_detail_show)
          {
            this.byproduct_detail_show = true
            this.product_detail_show=false
          }
  }


  asso_select(event)
  {
    if(event.type == "click")
    {
        this.asso_detail_show=true
        this.asso_details=event.row
        this.byproduct_list= event.row.byproduct_list
    }
  }

  expense_select(event)
  {

  }


  bypro_select(event)
  {
    if(event.type == "click")
      {
          this.byproduct_detail_show=true
          this.asso_detail_show = false
          this.byproduct_details=event.row
          this.product_list= event.row.production_list[0].outward_list
          console.log("product_list : ",this.product_list)
      }
  }


  pro_select(event)
  {
    if(event.type == "click")
      {
        this.product_detail_show=true
        this.byproduct_detail_show=false
        this.asso_detail_show = false
        this.product_details=event.row

      }
  }


}
