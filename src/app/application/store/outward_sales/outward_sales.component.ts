import { Component, ViewChild, OnInit, ElementRef, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';   // For API
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-outward_sales',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './outward_sales.component.html',
  styleUrls: ['./outward_sales.component.scss']
})
export class Outward_salesComponent implements OnInit {

  today              = new Date();
  selected           = [];
  product_details    = [];
  filter_data        = [];
  detail_view        = [];
  outwardList        = [];
  ItemList           = [];
  stock_list         = [];
  item               = [];
  checkedList : any[];
  currentSelected : {};
  category_list      : any;
  batchList          : any;
  batchQty           : any;
  openModel          : any;
  quantity           : any;
  outward_quantity   : any;
  item_list          : any;
  InOnActive         : any;
  total              : any = 0;
  detail_view_item   : any;
  item_category      : any;
  show_list          : any;
  totalSelectedCount = 0;
  dropdownSettings: any = {};
  productsSelectedItems: any[];
  showDropDown       : boolean = false
  show_dropdown      : boolean = false
  have_serial_number : boolean = false;
  public formGroup   : FormGroup;
  public loadContent : boolean = false;
  QtyError           : boolean = false;
  show               : boolean = false;
  loading            : boolean = false;

  public uid       = localStorage.getItem('uid');
  public user_type = localStorage.getItem('type');
  update_stock    : FormGroup ;
  Outward = new FormGroup
    ({
      'created_by'    : new FormControl(this.uid),
      'production_id' : new FormControl(null),
      'assign_to'     : new FormControl(''),
      item_id         : new FormControl(null, [Validators.required]),
      outward_at      : new FormControl(null, [Validators.required]),
      batch_id        : new FormControl(null, [Validators.required]),
      quantity        : new FormControl(null, [Validators.required]),
      notes           : new FormControl(null),
      'status'        : new FormControl('1')
    })

    UpdateStatus = new FormGroup
    ({
      date_time       : new FormControl(null, [Validators.required]),
      'level'         : new FormControl('4')
    })
    @Input() list:any[];

    @Output() shareCheckedList = new EventEmitter();
    @Output() shareIndividualCheckedList = new EventEmitter();

  @ViewChild("AddOutward",{static:true}) AddOutward:ElementRef;
  @ViewChild("UpdateOutward",{static:true}) UpdateOutward:ElementRef;
  @ViewChild("approve",{static:true}) approve:ElementRef;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private modalService: NgbModal,public api: ApiService, public toastrService: ToastrService,public fb: FormBuilder)
  {
    this.update_stock = this.fb.group(
      {
        product: this.fb.array([]),
      })
      this.checkedList = [];
  }
  ngOnInit()
  {
    this.getProductList();
    this.Loadlist();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'serial_no',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }
  openMd(content)
  {
    this.openModel = this.modalService.open(content, { size: 'xl'});
  }
  openSm(content)
  {
    this.openModel = this.modalService.open(content, { size: 'md'});
  }

  Loadlist()
  {
    this.api.get('get_data.php?table=item&authToken='+environment.authToken).then((data: any) =>
    {
      this.item_list = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  async LoadQty(batch)
  {
    this.api.get('get_data.php?table=stock_list&find=stock_id&value='+batch+'&authToken='+environment.authToken).then((data: any) =>
      {
        this.batchQty = data[0].stock;
        this.Outward.controls['quantity'].setValue(this.batchQty);
      }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  async getProductList()
  {
    await this.api.get('mp_items_view.php?authToken='+environment.authToken).then((data: any) =>
    {
      if(data != null)
      {
        function levelFilter(value) { return (value.status === 2); }
        let get_data = data.filter(levelFilter)
        this.product_details = get_data;
        this.filter_data     = [...get_data];
      }
      else
      {
        this.product_details = null;
      }
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

async onActivate1 (event)
{
  if(event.type === "click")
  {
    this.detail_view = event.row;
    this.loadOutward_list();
  }
}

loadOutward_list()
{
  var type = this.detail_view['delivery_against'];
  var id   = this.detail_view['id'];
  if( type == "Invoice")
  {
    this.api.get('get_data.php?table=invoice_item&find=dispatch_id&value='+id+'&find1=status&value1=2&authToken=' + environment.authToken).then((data: any) =>
      {
        if(data != null)
        {
          this.outwardList = data;
          let data_length  = data.length;
          for(let i=0;i<data_length;i++)
          {
            var list_id = this.outwardList[i].item_list_id;
            var data    = this.item_list.find(t=>t.item_id == list_id);
            this.outwardList[i]['itemname'] =data.name;
          }
        }
      else
        {
          this.outwardList = null;
          this.selected=[];
        }
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  if( type == "DC")
  {
    this.api.get('get_data.php?table=dc_item&find=dispatch_id&value='+id+'&find1=status&value1=2&authToken=' + environment.authToken).then((data: any) =>
      {
        if(data != null)
        {
          this.outwardList = data;
          let data_length  = data.length;
          for(let i=0;i<data_length;i++)
          {
            var list_id = this.outwardList[i].item_list_id;
            var data    = this.item_list.find(t=>t.item_id == list_id);
            this.outwardList[i]['itemname'] =data.name;
          }
        }
        else
        {
          this.outwardList = null;
          this.selected=[];
        }
      }).catch(error => { this.toastrService.error('Something went wrong'); });
  }
}


async onActivate(event)
  {
    if(event.type === "click")
    {
      this.detail_view_item = event.row;
      var item_id           = event.row.item_list_id;
      this.outward_quantity = event.row.qty;
      this.LoadBatch(item_id);
    }
  }

  async LoadBatch(item_id)
  {
    await this.api.get('get_data.php?table=item_category&authToken='+environment.authToken).then((data: any) =>
      {
        this.item_category = data
      }).catch(error => {this.toastrService.error('Something went wrong');});

    await this.api.get('get_data.php?table=stock_list&find=item_list_id&value='+item_id+'&find1=status&value1=1&authToken='+environment.authToken).then((data: any) =>
      {
        this.batchList = data;
         if(data != null)
          {
            this.have_serial_number = false;
                  for(let i=0;i<data.length;i++)
                    {
                    var value = this.item_category.find(t=>t.cat_id == this.batchList[i]['item_cat_id']);
                    this.batchList[i].have_serial_number = value.have_seriel_number;

                  if(value.have_seriel_number == 1)
                    {
                      this.have_serial_number = true;
                    this.api.get('get_data.php?table=serial_no_material&find=batch&value='+this.batchList[i]['batch']+'&find1=item_id&value1='+this.batchList[i]['item_list_id']+'&authToken='+environment.authToken).then((data: any) =>
                      {
                        if(data != null)
                          {

                            function levelFilter(value) {
                              if (!value) { return false; }
                              return value.status  == 1 }
                            let get_data = data.filter(levelFilter);

                            this.batchList[i].serial_itemList = get_data
                            this.item = this.item.concat(data);
                          }
                      }).catch(error => {this.toastrService.error('Something went wrong');});
                    }
                  }
            }
      }).catch(error => {this.toastrService.error('Something went wrong 1');});
      this.loaddata();

  }

  loaddata()
  {
    this.totalSelectedCount = 0;
    this.openMd(this.approve);
    this.item = [];
    const product = this.update_stock.get('product') as FormArray;
    product.clear();
    if(this.batchList != null)
    {
      this.batchList.forEach((item,j) => {
        product.push(this.fb.group({
        items       : [item.item_name],
        descriptions: [item.item_description],
        batch       : [item.batch],
        quantity    : [0],
        stock       : [item.stock],
        select      : [item.serial_itemList]
        }));
      });
    }
    else{
      this.toastrService.warning('Selected Item Out of Stock');
    }
  }

  set_zero(content)
  {
    this.selected = [];
    this.have_serial_number = false;
  }

  updateFilter(event)
  {
    const val               = event.target.value.toLowerCase();
    const temp              = this.filter_data.filter(function(d) {
    const document_no       = d.document_no ? d.document_no .toLowerCase() : '';
    const incharge_name     = d.incharge_name ? d.incharge_name.toLowerCase() : '';
    const dispatch_datetime = d.dispatch_datetime ? d.dispatch_datetime.toLowerCase() : '';

    const numericVal     = parseInt(val, 10);
    const matchesNumeric =!isNaN(numericVal) &&(d.id === numericVal );
    return document_no.includes(val)||  incharge_name.includes(val)  ||  dispatch_datetime.includes(val) || matchesNumeric ||!val;
    });
    this.product_details = temp;
    this.table.offset = 0;
  }

  ReqApprove()
  {
    var value = this.detail_view;
    let id    = this.detail_view['id'];
    let type  = this.detail_view['delivery_against'];

    Object.keys(this.update_stock.controls).forEach(field =>
      {
        const control = this.update_stock.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if( type == "Invoice")
    {
       var item_id = this.detail_view_item['invoice_item_id'];
    }
    if( type == "DC")
    {
     var item_id = this.detail_view_item['dc_item_id'];
    }

    this.loading = true;
     this.api.post('mp_outward_stocklist_update.php?value='+id+'&type='+type+'&item_id='+item_id+'&authToken=' + environment.authToken, this.update_stock.value).then((data: any) =>
    {

      if (data.status == "success")
      {
        this.toastrService.success(' Updated Succesfully');
        this.close();
        this.getProductList();
        this.loadOutward_list();
        this.loading = false;
      }
      else { this.toastrService.error('Something went wrong');
      this.loading = false; }
      return true;

    }).catch(error =>
      {
      this.toastrService.error('Something went wrong');
      this.loading = false;
    });
  }


  ReqApprove_serial()
  {
    var value = this.detail_view;
    let id    = this.detail_view['id'];
    let type  = this.detail_view['delivery_against'];

    Object.keys(this.update_stock.controls).forEach(field =>
      {
        const control = this.update_stock.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if( type == "Invoice")
    {
       var item_id = this.detail_view_item['invoice_item_id'];
    }
    if( type == "DC")
    {
     var item_id = this.detail_view_item['dc_item_id'];
    }

    this.total = 0
    let products = (<FormArray>this.update_stock.controls['product']).value;
      products.forEach(product => {
        let total = 0
        if(product.select != null)
          {
             total = product.select.length;
          }
          product.quantity = total
        this.total = this.total+total;
      });

    if(this.total == this.outward_quantity)
      {
        this.loading = true;
         this.api.post('mp_outward_stocklist_update.php?value='+id+'&type='+type+'&item_id='+item_id+'&authToken=' + environment.authToken, this.update_stock.value).then((data: any) =>
        {

          if (data.status == "success")
          {
            this.toastrService.success(' Updated Succesfully');
            this.close();
            this.getProductList();
            this.loadOutward_list();
            this.loading = false;
          }
          else { this.toastrService.error('Something went wrong');
          this.loading = false; }
          return true;

        }).catch(error =>
          {
          this.toastrService.error('Something went wrong');
          this.loading = false;
        });
      }
      if(this.total != this.outward_quantity)
        {
          this.toastrService.warning('Select value not matched ');
        }
  }


 edit_quantity(qty: number, j: number)
  {
    if(qty <= this.batchList[j].stock)
    {
      this.show_dropdown = false
      this.total=0;
      let products = (<FormArray>this.update_stock.controls['product']).value;
      products.forEach(product => {
        let total = product.quantity;
        this.total = this.total+total;
      });
      var select = this.batchList[j];
      if(select.have_serial_number == 1)
       {
        function levelFilter(value) {
          if (!value) { return false; }
          return value.status  == 1 }
        let get_data = this.item.filter(levelFilter);
        this.item  = get_data;
        this.show_dropdown = true
      }
      if (this.outward_quantity == this.total)
      {
        this.show = true;
      }
    else if (this.outward_quantity < this.total)
      {
        this.show = false;
        this.toastrService.warning('selected  quantity is not matched')
      }
      else{
        this.show = false;
      }
     }
   else
      {
        this.toastrService.warning('select correct quantity')
        this.show = false;
      }
  }

clear()
 {
  this.total = 0;
  const productArray = this.update_stock.get('product') as FormArray;
  for (let i = 0; i < productArray.length; i++)
  {
    const productGroup    = productArray.at(i) as FormGroup;
    const quantityControl = productGroup.get('quantity');
    const selectControl = productGroup.get('select');
    selectControl.patchValue(null);
    quantityControl.patchValue(0);
  }
  this.show = false;
 }

close()
  {
  this.openModel.close();
  this.clear();
  }
  select_data(value)
  {

  }


 getSelectValue(checked: boolean, id: any) {

  this.totalSelectedCount += checked ? 1 : -1;

  this.checkedList = this.checkedList.concat(id);

  const item = this.item.find(item => item.id === id);
  if (item) {
      item.checked = checked;
  }
}

isCheckboxDisabled(itemId: any): boolean {
  const isMaxSelected = this.totalSelectedCount >= this.outward_quantity;
  const isItemSelected = this.item.find(item => item.id === itemId)?.checked;
  return isMaxSelected && !isItemSelected;
}

onItemSelect(event,j)
  {
      this.show = true;
  }
  onSelectAll(event)
  {
  }
}

