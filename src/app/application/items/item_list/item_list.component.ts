import { Component, ViewChild, OnInit, ElementRef} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector   : 'az-item_list',
  templateUrl: './item_list.component.html',
  styleUrls  : ['./item_list.component.scss']
})
export class Item_listComponent implements OnInit
{

  public uid        = localStorage.getItem('uid');
  public user_type  = localStorage.getItem('type');

  update_item_id    : any;
  new_item_id       : any;
  category          : any;
  item_list         : any;
  item_filter       : any;

  selected_item     : any;
  selected          = [];
  detail_view       = [];
  uom_list          = [];
  tax_list          = [];
  loading           : boolean = false;
  add_item          : boolean = false;
  SerialStatus      : boolean;

  searchText = '';
  isDropdownOpen = false;
  items = ['Item 1', 'Item 2', 'Item 3'];
  filteredItems: string[] = [];
  selectedValue = '';
  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild("update_item", { static: true }) update_item   : ElementRef;

  @ViewChild("AddNew_item", { static: true }) AddNew_item   : ElementRef;


  EditItem = new FormGroup
  ({
    name           : new FormControl('', [Validators.required, Validators.minLength(3)]),
    hsnsac         : new FormControl('', [Validators.required, Validators.minLength(3)]),
    item_cat       : new FormControl('', [Validators.required]),
    uom            : new FormControl('', [Validators.required]),
    tax            : new FormControl('', [Validators.required]),
    purchase       : new FormControl(null),
    sale           : new FormControl(null),
    price          : new FormControl('', [Validators.required]),
    description    : new FormControl(null),
    status         : new FormControl('')
  });

  NewItem = new FormGroup
  ({
    created_by      : new FormControl(this.uid),
    name            : new FormControl('', [Validators.required, Validators.minLength(3)]),
    item_cat        : new FormControl('', [Validators.required]),
    hsnsac          : new FormControl('', [Validators.required, Validators.minLength(4)]),
    uom             : new FormControl('Nos', [Validators.required]),
    purchase        : new FormControl(0),
    sale            : new FormControl(0),
    price           : new FormControl('', [Validators.required]),
    tax_percent     : new FormControl('18'),
    description     : new FormControl(null),
    status          : new FormControl(1)
  });


  constructor(public api: ApiService, public toastrService: ToastrService, private modalService: NgbModal)
  {

  }

  ngOnInit()
  {
    this.load_item();
  }

  OpenItemEdit()
  {
    this.update_item_id = this.modalService.open(this.update_item, { size: 'md' });
  }

  OpenItemNew()
  {
    this.new_item_id = this.modalService.open(this.AddNew_item, { size: 'md' });
  }

  updateFilter(event)
  {
      const val = event.target.value.toLowerCase();
      const temp = this.item_filter.filter((d) => {
        return Object.values(d).some(field =>
          field != null && field.toString().toLowerCase().indexOf(val) !== -1
        );
      });
      this.item_list = temp;
      this.table.offset = 0;

  }
  onActivate(event)
  {
    if(event.type === "click")
    {
      this.detail_view = event.row;
      this.EditItem.controls['name'].setValue(this.detail_view['item_name']);
      this.EditItem.controls['item_cat'].setValue(this.detail_view['item_cat_id']);
      this.EditItem.controls['hsnsac'].setValue(this.detail_view['hsnsac']);
      this.EditItem.controls['uom'].setValue(this.detail_view['uom']);
      this.EditItem.controls['purchase'].setValue(this.detail_view['purchase']);
      this.EditItem.controls['sale'].setValue(this.detail_view['sales']);
      this.EditItem.controls['price'].setValue(this.detail_view['price']);
      this.EditItem.controls['tax'].setValue(this.detail_view['tax_percent']);
      this.EditItem.controls['description'].setValue(this.detail_view['description']);
      this.EditItem.controls['status'].setValue(this.detail_view['status']);
      this.OpenItemEdit();
    }
  }

  async EditSubmit(data)
  {
    this.loading=true;
    await this.api.post('post_update_data.php?table=item&field=item_id&value=' + this.detail_view['item_id'] + '&authToken=' + environment.authToken, data).then((data_rt: any) =>
    {
      if (data_rt.status == "success")
      {
        this.toastrService.success('Item Updated Succesfully');
        this.loading=false;
      }
      else { this.toastrService.error(data_rt.status);
        this.loading = false; }
        this.update_item_id.close();
        this.load_item();
      return true;
    }).catch(error => {this.toastrService.error('API Faild : Item Updated');
    this.loading = false;});
  }

  NewSubmitBtn()
  {
    this.add_item = true;
    this.OpenItemNew();
  }

  async NewSubmit(data)
  {
    this.NewItem.controls['created_by'].setValue(this.uid);
    Object.keys(this.NewItem.controls).forEach(field =>
      {
        const control = this.NewItem.get(field);
        control.markAsTouched({ onlySelf: true });
      });

    if (this.NewItem.valid)
    {

      function normalizeString(str : any) {
        return str.replace(/\s+/g, '').toLowerCase();
      }
      let checking :any
      await this.api.get('get_data.php?table=item&authToken=' + environment.authToken).then((data: any) =>

        {
          checking = data.some((item: { name: any; }) =>  normalizeString(item.name) ===  normalizeString(this.NewItem.value.name) );
        }).catch(error =>
          {
              this.toastrService.error('API Faild : item checking failed');
              this.loading = false;
          });
        if(!checking)
         {
              this.loading = true;
              this.NewItem.controls['created_by'].setValue(this.uid);
              await this.api.post('post_insert_data.php?table=item&authToken=' + environment.authToken, this.NewItem.value).then((data: any) =>
              {
                if(data.status == "success")
                  {
                    this.loading = false;
                    this.toastrService.success('Item Added Succesfully');
                    this.NewItem.controls['created_by'].setValue(this.uid);
                    this.NewItem.controls['name'].reset();
                    this.NewItem.controls['item_cat'].reset();
                    this.NewItem.controls['purchase'].setValue(0);
                    this.NewItem.controls['sale'].setValue(0);
                    this.NewItem.controls['hsnsac'].reset();
                    this.NewItem.controls['uom'].setValue('NOS');
                    this.NewItem.controls['tax_percent'].setValue('18');
                    this.NewItem.controls['description'].reset();
                    this.NewItem.controls['price'].reset();
                    this.NewItem.controls['status'].setValue(1);
                    this.load_item();
                    this.new_item_id.close();
                  }
                else
                {
                  this.toastrService.error(data.status);
                  this.loading = false;
                }
                return true;
              }).catch(error =>
              {
                  this.toastrService.error('API Faild : Item Added failed');
                  this.loading = false;
              });
            }
            else{
              this.toastrService.error(' Item was already Added ');
            }
    }
  }

  async load_item()
  {
    await this.api.get('mp_item_list.php?&authToken='+environment.authToken).then((data: any) =>
    {
      this.item_list    = data;
      this.item_filter  = [...data];

    }).catch(error => {this.toastrService.error('API Faild : load item ');});

    await this.api.get('get_data.php?table=unit&authToken='+environment.authToken).then((data: any) =>
    {
      this.uom_list    = data;
    }).catch(error => {this.toastrService.error('API Faild : load item unit');});

    await this.api.get('get_data.php?table=tax&authToken='+environment.authToken).then((data: any) =>
    {
      this.tax_list    = data;
    }).catch(error => {this.toastrService.error('API Faild : load item tax');});

    await this.api.get('get_data.php?table=item_category&authToken='+environment.authToken).then((data: any) =>
    {
      this.category    = data;
    }).catch(error => {this.toastrService.error('API Faild : load item category');});
  }

  load_list(data)
  {

  }


}
