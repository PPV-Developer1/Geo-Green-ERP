import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';   // For API
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormGroup, Validators, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector   : 'az-planning',
  templateUrl: './planning.component.html',
  styleUrls  : ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  pipe                   = new DatePipe('en-US');
  public now             = Date.now();
  public myFormattedDate = this.pipe.transform(this.now, 'dd/MM/yyyy HH:mm:ss');
  public uid             = localStorage.getItem('uid');

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("add_product",{static:true}) add_product:ElementRef;
  @ViewChild("move_to_production",{static:true}) move_to_production:ElementRef;
  @ViewChild("delete",{static:true}) delete:ElementRef;

  selected        = [];
  product_details = [];
  filter_data     = [];
  category_list   = [];
  employee_list   = [];
  detail_view     : any;
  openModel       : any;
  Product_no      : any;
  loading:boolean = false;

  CategoryForm = new FormGroup
  ({
    'created_by'    : new FormControl(this.uid),
    'type'          : new FormControl(2),
    category_id     : new FormControl(null, [Validators.required]),
    notes           : new FormControl(null, [Validators.required, Validators.minLength(3)]),
    'level'         : new FormControl(1),
    'status'        : new FormControl(1),
    product_no      : new FormControl(null, [Validators.required]),

  })
  AssignTo = new FormGroup
  ({
    assign_to       : new FormControl(null,[Validators.required]),
    start_date_time : new FormControl(null,[Validators.required]),
    end_date_time   : new FormControl(null,[Validators.required]),
    notes           : new FormControl(null, [Validators.required, Validators.minLength(3)]),
    batch           : new FormControl(null),
    'level'         : new FormControl(2),
  })

  constructor(private modalService: NgbModal,public api: ApiService, public toastrService: ToastrService)
  {

  }

  ngOnInit()
  {
    this.getProductList();
  }

 async openSm(content)
  {

    this.openModel = this.modalService.open(content, { size: 'md'});
  }

  Prefix      : any
  Serial_no   : any
  Product_id  : any

 async Batch(event)
  {
    console.log(event)
      await this.api.get('production_batch_number.php?Product_id='+event+'&authToken='+environment.authToken).then((data: any) =>
      {
        console.log(data)
        this.Prefix     = data[0]['prefix'];
        this.Serial_no  = data[0]['serial_no'];
        this.Product_no = this.Prefix  + this.Serial_no ;
        this.Product_id = data[0]['product_prefix_id'];

      }).catch(error => {this.toastrService.error('Something went wrong');});
    // this.Product_no = formattedDate
  }
  async MoveToSubmit(FormData)
  {
    Object.keys(this.AssignTo.controls).forEach(field =>
      {
        const control = this.AssignTo.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if(this.AssignTo.valid)
    {
      this.loading=true;
      await this.api.post('post_update_data.php?table=production_material&field=id&value='+this.detail_view.id+'&authToken='+environment.authToken,FormData).then((data: any) =>
      {
        if(data.status == "success")
        {
          this.loading=false;
          this.AssignTo.controls['assign_to'].reset();
          this.AssignTo.controls['start_date_time'].reset();
          this.AssignTo.controls['end_date_time'].reset();
          this.AssignTo.controls['notes'].reset();
          this.AssignTo.controls['batch'].reset();
          this.getProductList();
          this.getProductList();
          this.openModel.dismiss();
          this.toastrService.success('Task Assign Succesfully');
          this.selected = [];
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
  }
  async getProductList()
  {
    await this.api.get('mp_production_view.php?mode=planning&authToken='+environment.authToken).then((data: any) =>
    {
      this.product_details  = data;
      console.log(data)
      if(data != null)
      this.filter_data      = [...data];

    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  async onActivate(event)
  {
    if(event.type === "click")
    {
      this.detail_view = event.row;
    }
  }

  async Submit(FormData)
  {
    Object.keys(this.CategoryForm.controls).forEach(field =>
      {
        const control = this.CategoryForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });

       let checking :any
         function normalizeString(str : any) {
              return str.replace(/\s+/g, '').toLowerCase();
            }
              console.log(normalizeString(this.Product_no))
                  await this.api.get('get_data.php?table=production_material&find=by_product_no&value='+normalizeString(this.Product_no)+'&authToken=' + environment.authToken).then((data: any) =>

                    {
                      // if(data != null)
                      //   {
                      //      checking = data.some((item: { invoice_number: any; }) =>  normalizeString(item.invoice_number) ===  normalizeString(this.Product_no) );
                      //   }
                    }).catch(error =>
                      {
                          this.toastrService.error('API Faild : Product number checking failed');
                          this.loading = false;
                      });
               if(checking)
               {
                  this.toastrService.error('Product Number already exist');
                  return
               }

              if(this.CategoryForm.valid)
              {
                this.loading=true;

                this.api.post('post_insert_data.php?table=production_material&authToken='+environment.authToken,FormData).then((data: any) =>
                {
                  if(data.status == "success")
                  {
                    this.loading=false;
                    this.toastrService.success('Byproduct Added Succesfully');
                    this.CategoryForm.controls['product_no'].reset();
                    this.CategoryForm.controls['category_id'].reset();
                    this.CategoryForm.controls['notes'].reset();
                      this.api.get('single_field_update.php?table=production_prefix&field=id&value='+this.Product_id+'&up_field=last_serial_no&update='+this.Serial_no+'&authToken='+environment.authToken)
                        .then((data:any) =>
                        { console.log(data) });
                    this.getProductList();
                    this.getProductList();
                    this.openModel.dismiss();
                    this.selected = [];
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
  }

  set_zero(content)
  {
    this.selected = [];
  }

  addNew()
  {
    this.api.get('get_data.php?table=project_level_category&authToken='+environment.authToken).then((data: any) =>
    {
      this.category_list = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});
    this.openSm(this.add_product);
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

  move_to_process(value)
  {
    this.api.get('mp_get_employee_type.php?table=employee&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
    {
      this.employee_list = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});

    this.AssignTo.controls['notes'].setValue(this.detail_view.notes);
    if(this.detail_view.type === 1)
    {
      this.AssignTo.controls['batch'].setValue(this.detail_view.product_id+'/'+this.detail_view.asso_id+'/'+this.detail_view.product_id+'/'+this.detail_view.id);
    }
    else if(this.detail_view.type === 2)
    {
      this.AssignTo.controls['batch'].setValue('Store/'+this.detail_view.product_id+'/'+this.detail_view.id);
    }
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(now.getTime() + offset);
    const formattedDate = istTime.toISOString().slice(0, 16).replace("T", "T");
     this.AssignTo.controls['start_date_time'].setValue(formattedDate)
    this.openSm(this.move_to_production);
  }

  delete_production()
  {
    this.openModel = this.modalService.open(this.delete,{size:"sm"})
  }

  ReqDelete()
  {
    this.api.get('delete_data.php?authToken='+environment.authToken+'&table=production_material&field=id&id='+this.detail_view.id).then((data: any) =>
        {
          this.getProductList();
          this.getProductList();
          this.selected = [];
          this.toastrService.success('Production Deleted Successfull');
          this.openModel.close()
          return true;
        }).catch(error =>
        {
            this.toastrService.error('Something went wrong');
        });
  }

}
