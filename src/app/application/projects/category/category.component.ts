import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector   : 'az-category',
  templateUrl: './category.component.html',
  styleUrls  : ['./category.component.scss']
})
export class CategoryComponent implements OnInit
{
  rows        = [];
  temp        = [];
  detail_view = [];
  selected    = [];
  openModel   : any;
  loading     : boolean  = false;
  pipe                   = new DatePipe('en-US');
  public now             = Date.now();
  public myFormattedDate = this.pipe.transform(this.now, 'dd/MM/yyyy hh:mm:ss');
  public uid             = localStorage.getItem('uid');

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("add_category",{static:true}) add_category:ElementRef;
  @ViewChild("edit_category",{static:true}) edit_category:ElementRef;

  CategoryForm = new FormGroup
    ({
        'created_by'  : new FormControl(this.uid),
        level         : new FormControl(1),
        name          : new FormControl(null, [Validators.required, Validators.minLength(3)]),
        byproduct     : new FormControl(1),
        status        : new FormControl(1)
      })

  constructor(public api: ApiService, public toastrService: ToastrService, private modalService: NgbModal)
  {}

  ngOnInit()
  {
    this.api.get('get_data.php?table=project_level_category&authToken='+environment.authToken).then((data: any) =>
    {
      this.temp = [...data];
      this.rows = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  openSm(content)
  {
    this.openModel = this.modalService.open(content, { size: 'md'});
  }

  set_zero(content)
  {
    this.selected = [];
  }

  updateFilter(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function(d)
    {
      return (d.name && d.name.toLowerCase().indexOf(val) !== -1) || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }
  OpenAddCat()
  {

    // this.CategoryForm.controls['created_by'].setValue(this.uid);
    // this.CategoryForm.controls['byproduct'].setValue(1);
    // this.CategoryForm.controls['status'].setValue(1);
    this.openSm(this.add_category);
  }
  onActivate(event)
  {
    if(event.type === "click")
    {
      let data = event.row;
      this.detail_view = data;
      this.CategoryForm.controls['level'].setValue(data.level);
      this.CategoryForm.controls['name'].setValue(data.name);
      this.CategoryForm.controls['byproduct'].setValue(data.has_sub_item);
      this.CategoryForm.controls['status'].setValue(data.status);
      this.openSm(this.edit_category);
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
      this.loading = true;
      await this.api.post('post_insert_data.php?table=project_level_category&authToken=' + environment.authToken, FormData).then((data_rt: any) =>
      {
        if (data_rt.status == "success")
        {
          this.loading = false;
          this.toastrService.success('Project Category Added Succesfully');
          this.CategoryForm.controls['level'].setValue(1);
          this.CategoryForm.controls['name'].setValue('');
          this.CategoryForm.controls['byproduct'].setValue(1);
          this.CategoryForm.controls['status'].setValue(1);
        }
        else
        {
          this.toastrService.error(data_rt.status);
          this.loading = false;
        }
        this.openModel.close();
        this.ngOnInit();
        return true;
      }).catch(error => {
        this.toastrService.error('API Faild : Submit');
        this.loading = false;
      });
   }
   else{
    this.toastrService.error('Fill the details');
    this.loading = false;
   }
  }
  Update(FormData)
  {

    // Object.keys(this.AddFromStr.controls).forEach(field =>
    //   {
    //     const control = this.AddFromStr.get(field);
    //     control.markAsTouched({ onlySelf: true });
    //   });
    this.loading = true;
    this.api.post('post_update_data.php?authToken=' + environment.authToken + '&table=project_level_category&field=id&value=' + this.detail_view['id'], FormData).then((data: any) =>
    {
      if (data.status == "success")
      {
        this.loading = false;
        this.toastrService.success('Project Category Updated Succesfully');
        this.openModel.close();
        this.CategoryForm.reset();
        this.ngOnInit();
      }
      else
      {
        this.toastrService.error(data.status);
        this.loading = false;
      }
      return true;
    }).catch(error => {
      this.toastrService.error('API Faild : update Project Category');
      this.loading = false;
    });
  }
}
