import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormGroup,  Validators, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'az-outward',
  templateUrl: './outward.component.html',
  styleUrls: ['./outward.component.scss']
})
export class OutwardComponent implements OnInit
{
  today= new Date();
  selected        = [];
  product_details = [];
  filter_data     = [];
  detail_view     = [];
  outwardList     = [];

  category_list   : any;
  batchList       : any;
  batchQty        : any;
  openModel       : any;
  InOnActive      : any;

  QtyError        : boolean = false;
  loading         : boolean = false;
  public uid      = localStorage.getItem('uid');
  public user_type= localStorage.getItem('type');

  Outward = new FormGroup
    ({
      'created_by'  : new FormControl(this.uid),
      'production_id': new FormControl(null),
      'assign_to'   : new FormControl(''),
      item_id       : new FormControl(null, [Validators.required]),
      outward_at    : new FormControl(null, [Validators.required]),
      batch_id      : new FormControl(null, [Validators.required]),
      quantity      : new FormControl(null, [Validators.required]),
      notes         : new FormControl(null),
      'status'      : new FormControl('1')
    })

    edit_Outward = new FormGroup
    ({
      batch_id      : new FormControl(null, [Validators.required]),
      quantity      : new FormControl(null, [Validators.required]),
      notes         : new FormControl(null),
    })


    UpdateStatus = new FormGroup
    ({
      date_time       : new FormControl(null, [Validators.required]),
      'level'        : new FormControl('4')
    })
  @ViewChild("AddOutward",{static:true}) AddOutward:ElementRef;

  @ViewChild("editOutward",{static:true}) editOutward:ElementRef;

  @ViewChild("UpdateOutward",{static:true}) UpdateOutward:ElementRef;

  @ViewChild("delete",{static:true}) delete:ElementRef;

  @ViewChild(DatatableComponent) table: DatatableComponent;


  constructor(private modalService: NgbModal,public api: ApiService, public toastrService: ToastrService)
  {}

  ngOnInit()
  {
    this.getProductList();
  }
  openMd(content)
  {
    this.openModel = this.modalService.open(content, { size: 'md'});
  }
  openSm(content)
  {
    this.openModel = this.modalService.open(content, { size: 'xl'});
  }


  AddOutwardButton()
  {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(now.getTime() + offset);
    const formattedDate = istTime.toISOString().slice(0, 16).replace("T", "T");
     this.Outward.controls['outward_at'].setValue(formattedDate)

    this.api.get('mp_item_list.php?&authToken='+environment.authToken).then((data: any) =>
      {

        function levelFilter(value) {
          if (!value) { return false; }
           return value.have_seriel_number === 0;
          }
            let get_data = data.filter(levelFilter);
            this.category_list  = get_data;

      }).catch(error => {this.toastrService.error('Something went wrong ');});
    this.openSm(this.AddOutward);
  }

  async LoadBatch(item_id)
  {
    this.Outward.controls['batch_id'].reset();
    this.Outward.controls['quantity'].reset();
    this.Outward.controls['notes'].reset();
    this.api.get('get_data.php?table=stock_list&find=item_list_id&value='+item_id+'&find1=status&value1=1&authToken='+environment.authToken).then((data: any) =>
      {
            this.batchList = data;
      }).catch(error => {this.toastrService.error('Something went wrong ');});
  }

  async LoadQty(batch)
  {
    this.batchQty = null;
    this.api.get('get_data.php?table=stock_list&find=stock_id&value='+batch+'&authToken='+environment.authToken).then((data: any) =>
      {
          this.batchQty = data[0].stock;
          this.Outward.controls['quantity'].setValue(this.batchQty);

      }).catch(error => {this.toastrService.error('Something went wrong ');});
  }

  ClearError()
  {
    this.QtyError = false;
  }

  async OutwardSubmit(FormData)
  {
    Object.keys(this.Outward.controls).forEach(field =>
    {
      const control = this.Outward.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    this.Outward.controls['production_id'].setValue(this.detail_view['id']);
    this.Outward.controls['assign_to'].setValue(this.detail_view['assign_id']);
    if(FormData.quantity <= this.batchQty)
    {
     this.loading=true;
      this.api.post('mp_outward_entry.php?authToken='+environment.authToken, this.Outward.value).then((data: any) =>
      {
        if(data.status == "success")
        {
          this.loading=false;
          this.toastrService.success('Inward Added Succesfully');
          this.Outward.controls['item_id'].reset();
          this.Outward.controls['outward_at'].reset();
          this.Outward.controls['batch_id'].reset();
          this.Outward.controls['quantity'].reset();
          this.Outward.controls['notes'].reset();
      //    this.Outward.reset();
          this.batchList = null;
          this.batchQty  = null;
          this.openModel.dismiss();
          this.LoadOutward();
          this.LoadOutward();
          setTimeout(() => {}, 500);
        }
        else { this.toastrService.error('Something went wrong');
        this.loading = false; }
        return true;
      }).catch(error =>
      {
          this.toastrService.error('Something went wrong ');
          this.loading = false;
      });
    }
    else
    {
      this.QtyError = true;
    }
  }
  OpenStatusUpdate()
  {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(now.getTime() + offset);
    const formattedDate = istTime.toISOString().slice(0, 16).replace("T", "T");
     this.UpdateStatus.controls['date_time'].setValue(formattedDate)

    if(this.outwardList != null)
    {
    this.openSm(this.UpdateOutward);
    }
    else{
      this.toastrService.error('Not added the Outward Item');
    }
  }
  async Complete(value)
  {
    Object.keys(this.UpdateStatus.controls).forEach(field =>
      {
        const control = this.UpdateStatus.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if(this.UpdateStatus.valid)
    {
        let id = this.detail_view['id'];
        this.loading=true;
        await this.api.post('post_update_data.php?table=production_material_update&field=id&value='+id+'&authToken='+environment.authToken,value).then((data: any) =>
        {
          if(data.status == "success")
          {
            this.loading=false;
            this.toastrService.success('Product Completed Succesfully');
            this.openModel.dismiss();
            this.selected = [];
            this.getProductList();
            this.getProductList();
          }
          else { this.toastrService.error('Something went wrong : onUpdate');
          this.loading = false;}
          return true;
        }).catch(error =>
        {
            this.toastrService.error('API Faild : onUpdate');
            this.loading = false;
        });
   }
   else
   {
    this.toastrService.warning('Please Fill The Details');
   }
  }
  async LoadOutward()
  {
    let id = this.detail_view['id'];
    await this.api.get('mp_outward_list.php?production_id='+id+'&authToken='+environment.authToken).then((data: any) =>
      {
        this.outwardList = data;
      }).catch(error => {this.toastrService.error('Something went wrong ');});

  }
  async getProductList()
  {
    await this.api.get('mp_production_view.php?authToken='+environment.authToken).then((data: any) =>
    {
      if(data != null)
      {
        function levelFilter(value) { return (value.level === 3); }
        let get_data = data.filter(levelFilter)
        this.product_details = get_data;
        this.filter_data      = [...get_data];
      }
      else
      {
        this.product_details = null;
      }
    }).catch(error => {this.toastrService.error('Something went wrong 1');});
  }
  async onActivate(event)
  {
    if(event.type === "click")
    {
      this.detail_view = event.row;
      await this.LoadOutward();
    }
  }
  onIntActive(event)
  {
    if(event.type === "click")
    {

      if(this.user_type === "super_admin")
      {

        this.InOnActive = event.row;
       // this.openMd(this.delete);
      }
      else
      {
        this.toastrService.warning('Contact Admin to Delete It!');
      }
    }
  }
  async ReqDelete()
  {
    let id = this.InOnActive.id
    this.loading=true;
    this.api.get('mp_outward_delete.php?id='+id+'&authToken='+environment.authToken).then((data: any) =>
    {
      this.loading=false;
      this.getProductList();
      this.getProductList();
      this.selected=[];
      this.toastrService.success('Data Deleted Successfull');
      this.openModel.close();
      return true;
    }).catch(error =>
    {
        this.toastrService.error('Something went wrong');
    });
  }
  set_zero(content)
  {
    this.selected = [];
  }

  updateFilter(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.filter_data.filter((d) => {
          return Object.values(d).some(field =>
            field != null && field.toString().toLowerCase().indexOf(val) !== -1
          );
        });
    this.product_details = temp;
    this.table.offset = 0;
  }

  delete_item(row)
  {

     this.openMd(this.delete);
  }

  edit(row)
  {

    this.openMd(this.editOutward)
    this.edit_Outward.controls['quantity'].setValue(row.qty)
    this.edit_Outward.controls['notes'].setValue(row.notes)
  }
  update(value)
  {
          let id = this.InOnActive.id
          this.loading=true;
          this.api.post('mp_outward_item.php?id='+id+'&authToken='+environment.authToken,value).then((data: any) =>
          {

            if(data.status == "success")
            {
              this.loading=false;
              this.LoadOutward();
              this.toastrService.success('Data updated Successfull');
              this.openModel.close();
              return true;
            }
          }).catch(error =>
          {
              this.toastrService.error('Something went wrong');
          });
  }
}
