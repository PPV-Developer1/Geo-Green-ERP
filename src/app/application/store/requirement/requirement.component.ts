import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import {formatDate } from '@angular/common';

@Component({
  selector: 'az-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.scss']
})
export class RequirementComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("AddReq",{static:true}) AddReq:ElementRef;
  @ViewChild("delete",{static:true}) delete:ElementRef;

  public uid       = localStorage.getItem('uid');
  selected         = [];
  requirement_list = [];
  filter_data      = [];
  item_list = [];
  detail_view: any;
  openModel: any;


  AddReqForm = new FormGroup
    ({
        'created_by'  : new FormControl(this.uid),
        item_id       : new FormControl(null, [Validators.required]),
        description   : new FormControl(null, [Validators.required, Validators.minLength(3)]),
        qty           : new FormControl(null, [Validators.required]),
        notes         : new FormControl(null, [Validators.required]),
        'status'      : new FormControl(1)
      })

  constructor
  (
    public fb: FormBuilder,
    public toastrService: ToastrService,
    private modalService: NgbModal,
    private api: ApiService
  )
  { }

  ngOnInit()
  {
    this.getProductList();
  }

  async getProductList()
  {
    await this.api.get('mp_store_requirement_list.php?authToken='+environment.authToken).then((data: any) =>
    {
      if(data != null)
      {
        this.requirement_list = data;
        this.filter_data      = [...data];
      }
      else
      {
        this.requirement_list = null;
        this.filter_data = null;
      }
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }
  updateFilter(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.filter_data.filter(function(d)
    {
      return d.item_name.toLowerCase().indexOf(val) !== -1 || !val || d.item_description.toLowerCase().indexOf(val) !== -1 || !val || d.notes.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.requirement_list = temp;
    this.table.offset = 0;
  }
  async onActivate(event)
  {
    if(event.type === "click")
    {
      this.detail_view = event.row;
      this.openMd(this.delete);
    }
  }
  async ReqDelete()
  {
    let id = this.detail_view.id
    this.api.get('delete_data.php?authToken='+environment.authToken+'&table=requirement_by_store&field=id&id='+id).then((data: any) =>
    {
      this.getProductList();
      this.getProductList();
      this.toastrService.success('Data Deleted Successfull');
      this.openModel.close();
      return true;
    }).catch(error =>
    {
        this.toastrService.error('Something went wrong');
    });
  }
  async OnSubmit(value)
  {
    Object.keys(this.AddReqForm.controls).forEach(field =>
      {
        const control = this.AddReqForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      if(this.AddReqForm.valid)
      {
        await this.api.post('post_insert_data.php?table=requirement_by_store&authToken='+environment.authToken,value).then((data: any) =>
        {
          if(data.status == "success")
          {
            this.toastrService.success('Requirement Added Succesfully');
            this.getProductList();
            this.getProductList();
            this.AddReqForm.controls['item_id'].reset();
            this.AddReqForm.controls['description'].reset();
            this.AddReqForm.controls['qty'].reset();
            this.AddReqForm.controls['notes'].reset();
            this.openModel.dismiss();
          }
          else { this.toastrService.error('Something went wrong'); }
          return true;
        }).catch(error => { this.toastrService.error('Something went wrong');});
      }
  }


  openMd(content)
  {
    this.openModel = this.modalService.open(content, { size: 'md'});
  }
  openXl(content)
  {
    this.openModel = this.modalService.open(content, { size: 'xl'});
  }
  AddRequBtn()
  {
    this.api.get('get_data.php?table=item&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
    {
      this.item_list = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});
    this.openXl(this.AddReq);
  }
}
