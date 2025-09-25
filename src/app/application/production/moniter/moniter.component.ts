import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormGroup,  Validators, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-moniter',
  templateUrl: './moniter.component.html',
  styleUrls: ['./moniter.component.scss']
})
export class MoniterComponent implements OnInit {
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




  ClearError()
  {
    this.QtyError = false;
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


}
