import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector   : 'az-item_category',
  templateUrl: './item_category.component.html',
  styleUrls  : ['./item_category.component.scss']
})
export class Item_categoryComponent implements OnInit {

  rows               = [];
  temp               = [];
  detail_view        = [];
  selected           = [];
  category_list      = [];
  category_filter    = [];

  update_categogy_id : any;
  new_category_id    : any;

  loading :  boolean = false;
  public uid         = localStorage.getItem('uid');

  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild("new_category", { static: true }) new_category   : ElementRef;

  @ViewChild("update_categogy", { static: true }) update_categogy   : ElementRef;

  EditCategory = new FormGroup
  ({
    name              : new FormControl('', [Validators.required, Validators.minLength(3)]),
    type              : new FormControl('', [Validators.required]),
    HaveSerialNumber  : new FormControl(null),
    status            : new FormControl(null)
  });

  AddCategory = new FormGroup
  ({
    'created_by'      : new FormControl(this.uid),
    name              : new FormControl('', [Validators.required, Validators.minLength(3)]),
    type              : new FormControl('', [Validators.required]),
    HaveSerialNumber  : new FormControl(0),
    status            : new FormControl(1)
  });

  constructor(public api: ApiService, public toastrService: ToastrService, private modalService: NgbModal)
  { }

  ngOnInit()
  {
    this.load_item();
  }
  async load_item()
  {
    await this.api.get('get_data.php?table=item_category&asign_field=cat_id&asign_value=DESC&authToken='+environment.authToken).then((data: any) =>
    {
      this.category_list = data;
      this.category_filter = [...data];
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }
  OpenCatEdit()
  {
    this.update_categogy_id = this.modalService.open(this.update_categogy, { size: 'md' });
  }

  OpenCatAdd()
  {
    this.new_category_id = this.modalService.open(this.new_category, { size: 'md' });
  }

  updateFilter(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.category_filter.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });
    this.category_list = temp;
    this.table.offset = 0;
  }
  onActivate(event)
  {
    if(event.type === "click")
    {
      this.detail_view = event.row;
      this.EditCategory.controls['name'].setValue(this.detail_view['title']);
      this.EditCategory.controls['type'].setValue(this.detail_view['type']);
      this.EditCategory.controls['HaveSerialNumber'].setValue(this.detail_view['have_seriel_number']);
      this.EditCategory.controls['status'].setValue(this.detail_view['status']);
      this.OpenCatEdit();
    }
  }

  async EditSubmit(data)
  {
    this.loading = true;
    await this.api.post('post_update_data.php?table=item_category&field=cat_id&value='+this.detail_view['cat_id']+'&authToken=' + environment.authToken, this.EditCategory.value).then((data: any) =>
      {
        if(data.status == "success")
          {
            this.loading = false;
            this.toastrService.success('Item Category Updated Succesfully');
            this.load_item();
            this.update_categogy_id.close();
          }
        else
        { this.toastrService.error(data.status);
          this.loading = false;}

        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : Item Category Update');
          this.loading = false;
      });
  }
  async AddSubmit(data)
  {
    Object.keys(this.AddCategory.controls).forEach(field =>
      {
        const control = this.AddCategory.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if(this.AddCategory.valid)
    {
      function normalizeString(str : any) {
        return str.replace(/\s+/g, '').toLowerCase();
      }
      let checking :any
      await this.api.get('get_data.php?table=item_category&authToken=' + environment.authToken).then((data: any) =>

        {
          checking = data.some((item: { title: any; }) =>  normalizeString(item.title) ===  normalizeString(this.AddCategory.value.name) );
        }).catch(error =>
          {
              this.toastrService.error('API Faild : item checking failed');
              this.loading = false;
          });
        if(!checking)
         {
              this.loading=true;
              await this.api.post('post_insert_data.php?table=item_category&authToken=' + environment.authToken, this.AddCategory.value).then((data: any) =>
                {

                  if(data.status == "success")
                    {
                      this.loading = false;
                      this.toastrService.success('Item Category Added Succesfully');
                      this.AddCategory.controls['name'].reset();
                      this.AddCategory.controls['type'].reset();
                      this.AddCategory.controls['status'].setValue(1);
                      this.AddCategory.controls['HaveSerialNumber'].setValue(0);
                      this.load_item();
                      this.new_category_id.close();
                    }
                  else
                  { this.toastrService.error(data.status);  this.loading = false;}

                    return true;
                        }).catch(error =>
              {
                  this.toastrService.error('API Faild : Item Category Submit');
                  this.loading = false;
              });
            }
            else{ this.toastrService.error(' Item Category Already added'); }
    }
  }

}
