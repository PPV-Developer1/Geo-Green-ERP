import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormGroup,  Validators, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'az-association',
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss']
})
export class AssociationComponent implements OnInit
{
  pipe                   = new DatePipe('en-US');
  public now             = Date.now();
  public myFormattedDate = this.pipe.transform(this.now, 'dd/MM/yyyy hh:mm:ss');
  public uid             = localStorage.getItem('uid');

  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild("level1_add",{static:true}) level1_add:ElementRef;

  @ViewChild("level1_edit",{static:true}) level1_edit:ElementRef;

  @ViewChild("AddStore",{static:true}) AddStore:ElementRef;

  @ViewChild("content",{static:true}) content:ElementRef;

  @ViewChild("purchaseorder",{static:true}) purchaseorder:ElementRef;

  project_id          : any;
  asso_id             : any;
  level_1_id          : any;
  project_full_view   : any;
  level1_full_view    : any;
  leve_1_id           : any;
  byproduct_details   : any;
  connection_id       : any;
  modalRef            : any;
  add_options         : any;
  asso_percentage     : any;
  openpo              : any;
  item_list           : any;

  temp                = [];
  selected            = [];
  detail_view         = [];
  disp_data           = [];
  asso_view           = [];
  stock_list          = [];
  loading             : boolean = false;
  myControl           = new FormControl();

  AddByProduct        = new FormGroup
  ({
    'created_by'    : new FormControl(this.uid),
    'project_id'    : new FormControl(null),
    'asso_id'       : new FormControl(null),
    category_id     : new FormControl('', [Validators.required]),
    description     : new FormControl('', [Validators.required, Validators.minLength(3)]),
    'batch'         : new FormControl(null),
    'production_id' : new FormControl(null),
    'status'        : new FormControl('1')
  })
  AddFromStore   = new FormGroup
  ({
    stock_id     : new FormControl(null)
  })

  po = new FormGroup
  ({
    'created_by'  : new FormControl(this.uid),
    project_id    : new FormControl(null,[Validators.required]),
    quantity      : new FormControl(null,[Validators.required]),
    description   : new FormControl(null),
    item          : new FormControl(0,[Validators.required]),
    'type'        : new FormControl('association')
  })
  constructor(private modalService: NgbModal,public api: ApiService, public toastrService: ToastrService)
  {
  }

  ngOnInit()
  {
    this.getAsso();
  }

  async getAsso()
  {
    await this.api.get('mp_project_asso_list.php?authToken='+environment.authToken).then((data: any) =>
    {
      this.temp       = [...data.asso_list];
      this.asso_view  = data.asso_list;
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  set_zero()
  {

    this.selected = [];
  }
  add_from_store()
  {
    this.api.get('get_data.php?table=stock_list&find=type&value=2&authToken='+environment.authToken).then((data: any) =>
    {
      this.stock_list = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});
    this.openSm(this.AddStore);
  }
  UpdateToStore(value)
  {
    let id       = this.detail_view['id'];
    this.loading = true;
    this.api.post('mp_project_asso_store.php?asso_id='+id+'&authToken='+environment.authToken,value).then((data: any) =>
      {
        if(data.status == "success")
        {
          this.loading=false;
          this.getAsso();
          this.getAsso();
          this.modalRef.dismiss();
          this.toastrService.success('Store Product Linked Succesfully');
          this.selected = [];
        }
        else { this.toastrService.error('Something went wrong');
        this.loading = false;}

        return true;
      }).catch(error =>
      {
          this.toastrService.error('Something went wrong');
          this.loading = false;
      });
  }
  call_add_level1() { this.openSm(this.level1_add); }

  call_edit_level1(row)
  {
    this.level_1_id = row.id;
    this.AddByProduct.controls['category_id'].setValue(row.category_id);
    this.AddByProduct.controls['description'].setValue(row.description);
    this.openSm(this.level1_edit);
  }

  public onSubmit(): void
  {
    Object.keys(this.AddByProduct.controls).forEach(field =>
      {
        const control = this.AddByProduct.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if (this.AddByProduct.valid)
    {
      this.AddByProduct.controls['project_id'].setValue(this.detail_view['project_id']);
      this.AddByProduct.controls['asso_id'].setValue(this.detail_view['id']);

      this.loading=true;
      this.api.post('post_insert_data.php?table=project_byproduct&authToken='+environment.authToken,this.AddByProduct.value).then((data: any) =>
      {
        if(data.status == "success")
        {
          this.toastrService.success('Byproduct Added Succesfully');
          this.loading=false;
          this.level_1(this.asso_id);
          this.level_1(this.asso_id);

          this.AddByProduct.controls['project_id'].reset();
          this.AddByProduct.controls['asso_id'].reset();
          this.AddByProduct.controls['category_id'].reset();
          this.AddByProduct.controls['description'].reset();
        }
        else {
          this.toastrService.error('Something went wrong');
          this.loading = false;}

        return true;
      }).catch(error =>
      {
          this.toastrService.error('Something went wrong');
          this.loading = false;
      });

    }
  }
  public onUpdate(values): void
  {
    if (this.AddByProduct.valid)
    {
       this.loading=true;
        this.api.post('post_update_data.php?table=project_byproduct&field=id&value='+this.level_1_id+'&authToken='+environment.authToken,values).then((data: any) =>
        {
          if(data.status == "success") { this.toastrService.success('Byproduct Updated Succesfully');
          this.loading=false; }
          else { this.toastrService.error('Something went wrong : onUpdate');
          this.loading = false; }

          return true;
        }).catch(error =>
        {
            this.toastrService.error('API Faild : OnUpdate');
            this.loading = false;
        });
        this.level_1(this.asso_id);
        this.level_1(this.asso_id);
        this.AddByProduct.controls['category_id'].reset();
        this.AddByProduct.controls['description'].reset();
        this.modalRef.dismiss();
    }
  }
  openSm(value)
  {
    this.api.get('get_data.php?table=project_level_category&find=status&value=1&find1=level&value1=2&authToken='+environment.authToken).then((data: any) =>
    {
      this.add_options = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});

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
    this.asso_view = temp;
    this.table.offset = 0;
  }

  onActivate(event)
  {
    if(event.type === "click")
    {
      this.detail_view = event.row;
      this.project_id = this.detail_view['project_id'];
      this.asso_id  =  this.detail_view['id'];
      this.asso_percentage=0;
      if(this.detail_view['has_sub_item'] == 1)
      {
        this.level_1(this.asso_id);
      }
      if(this.detail_view['has_sub_item'] == 0)
      {
        this.level_2(this.asso_id);
      }

    }
  }

  async level_2(asso_id)
  {
    this.api.get('get_data.php?table=project_association&find=id&value='+ asso_id +'&authToken='+environment.authToken).then((data: any) =>
    {
      var asso_data = data[0].connection;
      if(asso_data > 0)
      {
        this.connection_id  =100;
      }
      else{
        this.connection_id  =0;
      }
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  async level_1(asso_id)
  {
    this.api.get('mp_byproduct_list.php?authToken='+environment.authToken+'&asso_id='+asso_id).then((data: any) =>
    {
      if(data != null)
      {
        this.byproduct_details = data.asso_data;
        this.asso_percentage   = data.asso_level;
      }
      else
      {
        this.byproduct_details = null;
      }
      return true;
    }).catch(error =>
    {
        this.toastrService.error('Something went wrong');
    });
  }

  async delete_level_1(id)
  {
    await this.api.get('delete_data.php?authToken='+environment.authToken+'&table=project_byproduct&field=id&id='+id).then((data: any) =>
        {
          this.level_1(this.asso_id);
          this.level_1(this.asso_id);
          this.toastrService.success('Data Deleted Successfull');
          return true;
        }).catch(error =>
        {
            this.toastrService.error('Something went wrong');
        });
  }

  create_pur_request()
  {
    this.openpr(this.purchaseorder);
    this.loadItem()
    this.po.controls['project_id'].setValue(this.project_id);
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
              this.toastrService.success('PO Created Succesfully');
              this.openpo.dismiss();
              this.po.controls['item'].reset(0);
              this.po.controls['description'].reset();
              this.po.controls['quantity'].reset();
              this.po.controls['project_id'].reset();
            }
            else { this.toastrService.error('Something went wrong : PO Create');
            this.loading = false; }
            return true;
          }).catch(error =>
          {
              this.toastrService.error('API Faild : PO Create');
              this.loading = false;
          });
       }
}
}
