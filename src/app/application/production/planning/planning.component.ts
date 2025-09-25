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

  selected        = [];
  product_details = [];
  filter_data     = [];
  category_list   = [];
  employee_list   = [];
  detail_view     : any;
  openModel       : any;
  loading:boolean = false;

  CategoryForm = new FormGroup
  ({
    'created_by'    : new FormControl(this.uid),
    'type'          : new FormControl(2),
    category_id     : new FormControl(null, [Validators.required]),
    notes           : new FormControl(null, [Validators.required, Validators.minLength(3)]),
    'level'         : new FormControl(1),
    'status'        : new FormControl(1)
  })
  AssignTo = new FormGroup
  ({
    assign_to       : new FormControl(null,[Validators.required]),
    start_date_time : new FormControl(null,[Validators.required]),
    end_date_time   : new FormControl(null,[Validators.required]),
    notes           : new FormControl(null, [Validators.required, Validators.minLength(3)]),
    batch           : new FormControl(null),
    'level'         : new FormControl(2)
  })

  constructor(private modalService: NgbModal,public api: ApiService, public toastrService: ToastrService)
  {

  }

  ngOnInit()
  {
    this.getProductList();
  }
  openSm(content)
  {
    this.openModel = this.modalService.open(content, { size: 'md'});
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
    await this.api.get('mp_production_view.php?authToken='+environment.authToken).then((data: any) =>
    {
      function levelFilter(value) { return (value.level === 1); }
      let get_data          = data.filter(levelFilter)
      this.product_details  = get_data;
      this.filter_data      = [...get_data];
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
    if(this.CategoryForm.valid)
    {
      this.loading=true;
      this.api.post('post_insert_data.php?table=production_material&authToken='+environment.authToken,FormData).then((data: any) =>
      {
        if(data.status == "success")
        {
          this.loading=false;
          this.toastrService.success('Byproduct Added Succesfully');
          this.CategoryForm.controls['notes'].reset();
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

  delete_production(id)
  {
    this.api.get('delete_data.php?authToken='+environment.authToken+'&table=production_material&field=id&id='+id).then((data: any) =>
        {
          this.getProductList();
          this.getProductList();
          this.selected = [];
          this.toastrService.success('Production Deleted Successfull');
          return true;
        }).catch(error =>
        {
            this.toastrService.error('Something went wrong');
        });
  }

}
