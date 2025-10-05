import { Item } from './../../purchase/class/dcItems';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-jobwork',
  templateUrl: './jobwork.component.html',
  styleUrls: ['./jobwork.component.scss']
})
export class JobsheetComponent implements OnInit {
  Uid           = localStorage.getItem("uid")
  Jobsheet      : FormGroup
  JobsheetEdit  : FormGroup
  Item          : FormGroup
  filter_data   : any
  List          : any
  selected      = []
  OpenModel     : any
  loading       : boolean = false
  selected_data : any
  ItemList      : any
  category_list : any;
  batchList     : any;
  batchQty      : any;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("AddNew_Job", { static: true }) AddNew_Job   : ElementRef;
  @ViewChild("Edit_Job", { static: true }) Edit_Job   : ElementRef;
   @ViewChild("AddnewItem", { static: true }) AddnewItem   : ElementRef;
  constructor(
      public fb           : FormBuilder,
      private modalService: NgbModal,
      public api          : ApiService,
      public toastrService: ToastrService,
  ) {

    this.Jobsheet = fb.group(
      {
          created       : new FormControl(this.Uid),
          name          : new FormControl('', [Validators.required, Validators.minLength(3)]),
          description   : new FormControl('', [Validators.required, Validators.minLength(3)]),
          startDate     : new FormControl('', [Validators.required]),
          endDate       : new FormControl('', [Validators.required]),
          qty           : new FormControl('', [Validators.required]),
      }
    )

     this.JobsheetEdit = fb.group(
      {
          name          : new FormControl('', [Validators.required, Validators.minLength(3)]),
          description   : new FormControl('', [Validators.required, Validators.minLength(3)]),
          startDate     : new FormControl('', [Validators.required]),
          endDate       : new FormControl('', [Validators.required]),
          qty           : new FormControl('', [Validators.required]),
      }
    )

    this.Item = new FormGroup
    ({
      'created_by'  : new FormControl(this.Uid),
      'Jobsheet_id': new FormControl(null),
      item_id       : new FormControl(null, [Validators.required]),
      outward_at    : new FormControl(null, [Validators.required]),
      batch_id      : new FormControl(null, [Validators.required]),
      quantity      : new FormControl(null, [Validators.required]),
      notes         : new FormControl(null),
      'status'      : new FormControl('1')
    })

  }

 async ngOnInit() {
   await this.LoadData()
  }

 async LoadData()
  {
    await this.api.get('get_data.php?table=jobsheet&asign_field=id&asign_value=DESC&authToken='+environment.authToken).then((data: any) =>
        {
          this.List  = data
          if(data)
          {
             this.filter_data = [...data]
          }
        }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  async LoadItems()
  {
    await this.api.get('get_data.php?table=jobsheet&asign_field=id&asign_value=DESC&authToken='+environment.authToken).then((data: any) =>
        {
          this.List  = data
          if(data)
          {
             this.filter_data = [...data]
          }
        }).catch(error => {this.toastrService.error('Something went wrong');});
  }


   updateFilter(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.filter_data.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });
    this.List = temp;
    this.table.offset = 0;
  }

  onActivate(event)
  {
      if(event.type == "click")
      {
        this.selected_data = event.row
        // this.Edit()

      }
  }

  Edit()
  {
    this.JobsheetEdit.controls["name"].setValue(this.selected_data.name)
    this.JobsheetEdit.controls["description"].setValue(this.selected_data.description)
    this.JobsheetEdit.controls["startDate"].setValue(this.selected_data.start_date)
    this.JobsheetEdit.controls["endDate"].setValue(this.selected_data.end_date)
     this.JobsheetEdit.controls["qty"].setValue(this.selected_data.qty)

    this.OpenModel  = this.modalService.open(this.Edit_Job,{size:"md"})
  }

  CreateJobsheet()
  {
      this.OpenModel  = this.modalService.open(this.AddNew_Job,{size:"md"})
  }

 async SubmitJob(value)
  {
    console.log(value)
     Object.keys(this.Jobsheet.controls).forEach(field =>
          {
            const control = this.Jobsheet.get(field);
            control.markAsTouched({ onlySelf: true });
          });
        if (this.Jobsheet.valid)
        {
          this.loading=true;

          await this.api.post('post_insert_data.php?table=jobsheet&authToken='+environment.authToken,this.Jobsheet.value).then((data: any) =>
          {
            if(data.status == "success")
            {
               this.LoadData()
               this.loading=false;
               this.toastrService.success(' JobSheet created succesfully');
               this.OpenModel.close()
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
        else
        {
          this.toastrService.error('Please Fill The All Fields');
        }
  }


 async JobEditSubmit(value)
  {
     console.log(value)
     Object.keys(this.JobsheetEdit.controls).forEach(field =>
          {
            const control = this.JobsheetEdit.get(field);
            control.markAsTouched({ onlySelf: true });
          });
        if (this.JobsheetEdit.valid)
        {
          this.loading=true;

          await this.api.post('post_update_data.php?table=jobsheet&field=id&value='+this.selected_data.id+'&authToken='+environment.authToken,this.JobsheetEdit.value).then(async(data: any) =>
          {
            console.log(data)
            if(data.status == "success")
            {
             await  this.LoadData()
               this.loading=false;
               this.toastrService.success(' JobSheet updated succesfully');
               this.OpenModel.close()
               this.selected_data =await this.List.find(i => i.id == this.selected_data.id)
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
        else
        {
          this.toastrService.error('Please Fill The All Fields');
        }
  }

  set_zero()
  {
    this.selected = []
  }

 async AddItem()
  {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(now.getTime() + offset);
    const formattedDate = istTime.toISOString().slice(0, 16).replace("T", "T");
     this.Item.controls['outward_at'].setValue(formattedDate)


    await this.api.get('mp_item_list.php?&authToken='+environment.authToken).then((data: any) =>
          {

            function levelFilter(value) {
              if (!value) { return false; }
               return value.have_seriel_number === 0;
              }
                let get_data = data.filter(levelFilter);
                this.category_list  = get_data;

          }).catch(error => {this.toastrService.error('Something went wrong ');});

          this.OpenModel = this.modalService.open(this.AddnewItem,{size:"md"})
  }

  async LoadBatch(item_id)
    {
      this.Item.controls['batch_id'].reset();
      this.Item.controls['quantity'].reset();
      this.Item.controls['notes'].reset();
      this.api.get('get_data.php?table=stock_list&find=item_list_id&value='+item_id+'&find1=status&value1=1&authToken='+environment.authToken).then((data: any) =>
        {
              this.batchList = data;
              if(data== null)
              {
                this.toastrService.warning('Out of stock')
              }
        }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

    async LoadQty(batch)
    {
      this.batchQty = null;
      this.api.get('get_data.php?table=stock_list&find=stock_id&value='+batch+'&authToken='+environment.authToken).then((data: any) =>
        {
            this.batchQty = data[0].stock;
            this.Item.controls['quantity'].setValue(this.batchQty);

        }).catch(error => {this.toastrService.error('Something went wrong ');});
    }
}
