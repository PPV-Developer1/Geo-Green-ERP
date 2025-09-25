import { TypographyComponent } from './../../../pages/ui/typography/typography.component';
import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder,  Validators,  FormControl } from '@angular/forms';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector   : 'az-stock_list',
  templateUrl: './stock_list.component.html',
  styleUrls  : ['./stock_list.component.scss']
})
export class Stock_listComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("AmendStock",{static:true}) AmendStock:ElementRef;
  @ViewChild("purchaseorder",{static:true}) purchaseorder:ElementRef;
  public user_type = localStorage.getItem('type');
  public uid       = localStorage.getItem('uid');

  openModel    : any;
  openpo       : any;
  detail_view  : any;
  TotalAmount  : any;
  item_list    : any;
  serial_number_list:any
  stock_list   = [];
  filter_data  = [];
  selected     = [];
  loading      : boolean = false;
  Type        : boolean = false;
  StockAmd = new FormGroup
    ({
      'created_by'  : new FormControl(this.uid),
      'old_stock'   : new FormControl(null),
      new_stock     : new FormControl(null, [Validators.required, Validators.min(1)]),
      reason        : new FormControl(null, [Validators.required, Validators.minLength(3)]),
    })

    po = new FormGroup
    ({
      'created_by'  : new FormControl(this.uid),
      quantity      : new FormControl(null, [Validators.required]),
      description   : new FormControl(null),
      item          : new FormControl(null, [Validators.required]),
      'type'        : new FormControl('store'),
      project_id    : new FormControl(null)
    })
  constructor
  (
    public fb   : FormBuilder,
    public toastrService: ToastrService,
    private modalService: NgbModal,
    private api : ApiService
  )
  { }

  ngOnInit()
  {
    this.getProductList();
  }
  stockamend()
  {
    this.StockAmd.controls['old_stock'].setValue(this.detail_view['stock']);
    this.StockAmd.controls['new_stock'].setValue(this.detail_view['stock']);
    this.openSm(this.AmendStock);
  }
  async SubmitAmendment(value)
  {

    let id = this.detail_view['id'];
    if(this.StockAmd.valid)
    {
        this.loading=true;
        await this.api.post('mp_stock_amendment.php?stock_id='+id+'&authToken=' + environment.authToken, value).then((data_rt: any) =>
        {
          if (data_rt.status == "success")
          {
            this.loading=false;
            this.toastrService.success('Stock Updated Succesfully');
            this.StockAmd.controls['new_stock'].setValue(null);
            this.StockAmd.controls['reason'].setValue(null);

            }
          else { this.toastrService.error(data_rt.status);
            this.loading = false;}
          this.openModel.close();
          this.getProductList();
          this.selected = [];
          return true;
        }).catch(error => {this.toastrService.error('API Faild : SubmitAmendment');
        this.loading = false;});
  }
  else{
    this.toastrService.error('Fill the Details');
  }
  }
  async getProductList()
  {
    await this.api.get('mp_stock_list.php?format=status&authToken='+environment.authToken).then((data: any) =>
    {
      if(data != null)
      {
        this.stock_list  = data;
        this.filter_data = [...data];
      }
      else
      {
        this.stock_list = null;
        this.filter_data = null;
      }
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  openSm(content)
  {
    this.openModel = this.modalService.open(content, { size: 'md'});
  }


  onActivate(event)
  {
    if(event.type === "click")
    {
      this.detail_view = event.row;
      this.TotalAmount = this.detail_view.stock*this.detail_view.amount;
      if(event.row.have_serial_number == 1)
      {
        this.api.get('get_data.php?table=serial_no_material&find=batch&value='+event.row.batch+'&authToken='+environment.authToken).then((data: any) =>
        {
        this.serial_number_list = data
        }).catch(error => {this.toastrService.error('Something went wrong');});
      }
    }
  }

  updateFilter(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.filter_data.filter((d) => {
          return Object.values(d).some(field =>
            field != null && field.toString().toLowerCase().indexOf(val) !== -1
          );
        });
    this.stock_list = temp;
    this.table.offset = 0;
  }

  updateFilter_group(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.filter_data.filter((d) => {
          return Object.values(d).some(field =>
            field != null && field.toString().toLowerCase().indexOf(val) !== -1
          );
        });
    this.stock_list = temp;
    this.table.offset = 0;
  }


  set_zero()
  {
    this.selected =[];
  }

  create_pur_request()
  {
    this.openpr(this.purchaseorder);
    this.loadItem()
  }

  openpr(value)
  {
    this.openpo = this.modalService.open(value,{ size: 'md'});
  }

  loadItem()
  {
   this.api.get('get_data.php?table=item&find=purchase&value=1&authToken='+environment.authToken).then((data: any) =>
    {
      this.item_list = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  Submit(value)
  {
    Object.keys(this.po.controls).forEach(field =>
      {
        const control = this.po.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      if(this.po.valid)
      {
        this.api.post('post_insert_data.php?table=purchase_request&authToken='+environment.authToken,value).then((data: any) =>
        {

          if(data.status == "success")
          {
            this.loading = false;
            this.toastrService.success('Purchase Created Succesfully');
            this.openpo.dismiss();
            this.po.controls['item'].reset(0);
            this.po.controls['description'].reset();
            this.po.controls['quantity'].reset();
            this.po.controls['project_id'].reset();
          }
          else { this.toastrService.error('Something went wrong : PO Create');
          this.loading = false;}
          return true;
        }).catch(error =>
        {
            this.toastrService.error('API Faild : PO Create');
            this.loading = false;
        });
      }
 }

  Order_by_Item()
  {
    this.Type = false
    this.getProductList()
  }

 async Order_by_Group()
  {
   await  this.api.get('stock_list_by_grouping.php?authToken='+environment.authToken).then((data: any) =>
    {
      console.log(data)
      this.stock_list = data;
      this.filter_data = [...data];
       this.Type = true
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }
}
