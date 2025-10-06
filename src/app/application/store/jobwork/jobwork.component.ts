import { Item } from './../../purchase/class/dcItems';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent, id } from '@swimlane/ngx-datatable';
import { Model } from 'fullcalendar';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { Item_listModule } from '../../items/item_list/item_list.module';

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
  filter_data   : any;
  List          : any;
  selected      = []
  OpenModel     : any;
  loading       : boolean = false
  selected_data : any;
  ItemList      : any;
  category_list : any;
  batchList     : any;
  batchQty      : any;
  Jobsheet_items: any;
  Jobwork_list  : any

   edit_Outward = new FormGroup
    ({
      batch_id      : new FormControl(null, [Validators.required]),
      quantity      : new FormControl(null, [Validators.required]),
      notes         : new FormControl(null),
    })
  UpdateStatus = new FormGroup
    ({
      date_time       : new FormControl(null, [Validators.required]),
      status          : new FormControl('2')
    })
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("AddNew_Job", { static: true }) AddNew_Job   : ElementRef;
  @ViewChild("Edit_Job", { static: true }) Edit_Job   : ElementRef;
  @ViewChild("AddnewItem", { static: true }) AddnewItem   : ElementRef;
  @ViewChild("edititem",{static:true}) edititem:ElementRef;
  @ViewChild("delete",{static:true}) delete:ElementRef;
  @ViewChild("UpdateOutward",{static:true}) UpdateOutward:ElementRef;
   @ViewChild("bill",{static:true}) bill:ElementRef;

  constructor(
      public fb           : FormBuilder,
      private modalService: NgbModal,
      public api          : ApiService,
      public toastrService: ToastrService,
  ) {

    this.Jobsheet = fb.group(
      {
          created       : new FormControl(this.Uid),
          item_id       : new FormControl('', [Validators.required]),
          name          : new FormControl('', [Validators.required, Validators.minLength(3)]),
          description   : new FormControl('', [Validators.required, Validators.minLength(3)]),
          startDate     : new FormControl('', [Validators.required]),
          endDate       : new FormControl('', [Validators.required]),
          qty           : new FormControl('', [Validators.required]),
      }
    )

     this.JobsheetEdit = fb.group(
      {
          item_id       : new FormControl('', [Validators.required]),
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
      'Jobsheet_id' : new FormControl(null),
      item_id       : new FormControl(null, [Validators.required]),
      outward_at    : new FormControl(null, [Validators.required]),
      batch_id      : new FormControl(null, [Validators.required]),
      stock_id      : new FormControl(null, [Validators.required]),
      quantity      : new FormControl(null, [Validators.required]),
      notes         : new FormControl(null),
      'status'      : new FormControl('1')
    })

  }

 async ngOnInit() {
   await this.LoadData()
   await this.LoadItems()
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

 async onActivate(event)
  {
      if(event.type == "click")
      {
        this.selected_data = event.row
        // this.Edit()
        await  this.LoadItems()
        await  this.LoadJobsheet_item()
        await this.BillList()
      }
  }

  Edit()
  {
      this.JobsheetEdit.controls["item_id"].setValue(this.selected_data.item_id)
      this.JobsheetEdit.controls["name"].setValue(this.selected_data.name)
      this.JobsheetEdit.controls["description"].setValue(this.selected_data.description)
      this.JobsheetEdit.controls["startDate"].setValue(this.selected_data.start_date)
      this.JobsheetEdit.controls["endDate"].setValue(this.selected_data.end_date)
      this.JobsheetEdit.controls["qty"].setValue(this.selected_data.qty)

    this.OpenModel  = this.modalService.open(this.Edit_Job,{size:"md"})
  }

  CreateJobsheet()
  {
      this.Jobsheet.controls["created"].setValue(this.Uid)
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
               this.Jobsheet.reset()
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
               this.JobsheetEdit.reset()
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
      this.Item.controls["Jobsheet_id"].setValue(this.selected_data.id)
      this.Item.controls["created_by"].setValue(this.Uid)

        await this.LoadItems()
        this.OpenModel = this.modalService.open(this.AddnewItem,{size:"md"})
  }


 async  LoadItems()
  {
      await this.api.get('mp_item_list.php?&authToken='+environment.authToken).then((data: any) =>
          {

            function levelFilter(value) {
              if (!value) { return false; }
               return value.have_seriel_number === 0;
              }
                let get_data = data.filter(levelFilter);
                this.category_list  = get_data;
              function levelFilter2(value) {
              if (!value) { return false; }
               return value.jobworkmaterial === 1;
              }
                let get_data2 = data.filter(levelFilter2);
                this.Jobwork_list  = get_data2;
                console.log("Jobwork_list : ",this.Jobwork_list )

          }).catch(error => {this.toastrService.error('Something went wrong ');});

  }


  itemdata (event)
  {
    console.log(event)
    const item = this.Jobwork_list.find( i => i.item_id == event)
    this.Jobsheet.controls["name"].setValue(item.name)
    this.Jobsheet.controls["description"].setValue(item.description)
  }

  itemdata_edit (event)
  {
    console.log(event)
    const item = this.Jobwork_list.find( i => i.item_id == event)
    this.JobsheetEdit.controls["name"].setValue(item.name)
    this.JobsheetEdit.controls["description"].setValue(item.description)
  }

  edit_item(row)
  {
    this.select_item = row
    this.edit_Outward.controls["quantity"].setValue(row.qty)
    this.edit_Outward.controls["notes"].setValue(row.notes)
    this.OpenModel = this.modalService.open(this.edititem,{size:"md"})
  }

async  update(value)
  {

          this.loading=true;
              await this.api.post('mp_jobsheet_item_edit.php?id='+this.select_item.id+'&authToken='+environment.authToken,value).then((data: any) =>
                {

                  if(data.status == "success")
                  {
                    this.loading=false;
                    this.LoadJobsheet_item();
                    this.toastrService.success('Data updated Successfull');
                    this.OpenModel.close();
                    this.edit_Outward.reset()
                    return true;
                  }
                }).catch(error =>
                {
                    this.toastrService.error('Something went wrong');
                });
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
      this.api.get('get_data.php?table=stock_list&find=batch&value='+batch+'&authToken='+environment.authToken).then((data: any) =>
        {
            this.batchQty = data[0].stock;
            this.Item.controls['quantity'].setValue(this.batchQty);

        }).catch(error => {this.toastrService.error('Something went wrong ');});
    }


  async  ItemSubmit(value)
    {
       console.log(value)

       const stock = this.batchList.find(i => i.batch == this.Item.value.batch_id)
       console.log(stock)
       this.Item.controls["stock_id"].setValue(stock.stock_id)
     Object.keys(this.Item.controls).forEach(field =>
          {
            const control = this.Item.get(field);
            control.markAsTouched({ onlySelf: true });
          });
        if (this.Item.valid)
        {
          this.loading=true;

          await this.api.post('post_insert_data.php?table=jobsheet_items&authToken='+environment.authToken,this.Item.value).then(async(data: any) =>
          {
            console.log(data)
            if(data.status == "success")
            {
             await  this.LoadJobsheet_item()
               this.loading=false;
               this.toastrService.success('Item added succesfully');
               this.OpenModel.close()
                this.Item.reset()
                this.batchList = null
                this.batchQty = null
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

  async LoadJobsheet_item()
  {
    await this.api.get('get_data.php?table=jobsheet_items&find=jobsheet_id&value='+ this.selected_data.id +'&asign_field=id&asign_value=DESC&authToken='+environment.authToken).then((data: any) =>
        {

            if(data!= null)
            {
                for(let i = 0;i<data.length;i++){
                  console.log(data[i].item_id)
                  console.log(this.category_list)
                  const item = this.category_list.find( categoryItem  => categoryItem .item_id == data[i].item_id)
                  console.log(item)
                  data[i].item_name = item.name

                };

                this.Jobsheet_items  = data
                console.log(data)
            }
            this.Jobsheet_items  = data
        }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  onIntActive(event)
  {

  }

  select_item : any
  delete_item(row)
  {
    this.select_item = row
    this.OpenModel = this.modalService.open(this.delete,{size:"md"})
  }

  ReqDelete()
  {
       let id = this.select_item.id
        this.loading=true;
        this.api.get('mp_jobsheet_item_delete.php?id='+id+'&authToken='+environment.authToken).then(async(data: any) =>
        {
          this.loading=false;
         await this.LoadJobsheet_item();
         await this.toastrService.success('Data Deleted Successful');
          this.OpenModel.close();
        }).catch(error =>
        {
            this.toastrService.error('Something went wrong');
        });
  }


   OpenStatusUpdate()
  {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istTime = new Date(now.getTime() + offset);
    const formattedDate = istTime.toISOString().slice(0, 16).replace("T", "T");
     this.UpdateStatus.controls['date_time'].setValue(formattedDate)

    if(this.Jobsheet_items != null)
    {
      this.OpenModel = this.modalService.open(this.UpdateOutward,{size:"md"})
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

          this.loading=true;
          await this.api.post('post_update_data.php?table=jobsheet_items_update&field=id&value='+this.selected_data.id+'&authToken='+environment.authToken,value).then((data: any) =>
          {
            console.log(data)
            if(data.status == "success")
            {
              this.loading=false;
              this.toastrService.success('Product Completed Succesfully');
              this.OpenModel.dismiss();
              this.selected = [];
              this.LoadData();
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

    AddBill()
    {
      this.OpenModel = this.modalService.open(this.bill,{size:"md"})
    }

    bill_list : any
    Bill_id   : any

     async BillList()
    {

        await this.api.get('mp_vendor_bill.php?&authToken=' + environment.authToken).then((data: any) =>
          {
            function levelFilter(value) {
                    if (!value) { return false; }
                    return value.type === "service";
                    }
                      let get_data = data.filter(levelFilter);
                      this.bill_list = get_data
                      console.log(this.bill_list)
          }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorBills'); });
    }

  async  bill_submot()
    {
      console.log(this.Bill_id)
      const value ={
        bill_id : this.Bill_id,
        created : this.Uid,
        jobsheet_id : this.selected_data.id
      }
      console.log(value)

      this.loading=true;

          await this.api.post('post_insert_data.php?table=jobwork_bills&authToken='+environment.authToken,value).then(async(data: any) =>
          {
            console.log(data)
            if(data.status == "success")
            {
               this.loading=false;
               this.toastrService.success('Bill added succesfully');
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

}
