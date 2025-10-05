import { Component, ViewChild, OnInit, ElementRef} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/service/api.service';   // For API
import { environment } from 'src/environments/environment.prod';
import { ToastrService, } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import * as XLSX from "xlsx";
import { dispatch } from 'd3';
import { formatDate } from 'fullcalendar';
import { error } from 'console';

@Component({
  selector: 'az-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})

export class DispatchComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("AddDispatchModel_type",{static:true}) AddDispatchModel_type:ElementRef;
  @ViewChild("AddDispatchModel_Invoice",{static:true}) AddDispatchModel_Invoice:ElementRef;
  @ViewChild("AddDispatchModel_Dc",{static:true}) AddDispatchModel_Dc:ElementRef;
  @ViewChild("approval",{static:true}) approval:ElementRef;
  @ViewChild("RemoveFromDispatch",{static:true}) RemoveFromDispatch:ElementRef;
  @ViewChild("RemoveFromDispatch_item",{static:true}) RemoveFromDispatch_item:ElementRef;
  @ViewChild("approve_item_list",{static:true}) approve_item_list:ElementRef;
  @ViewChild("Transport",{static:true}) Transport:ElementRef;

  public uid       = localStorage.getItem('uid');
  public user_type = localStorage.getItem('type');
  public select_pro_id  : any;

  invoice_list          = [];
  dc_list               = [];
  project_asso_list     = [];
  selected              = [];
  selected_item         = [];
  dispatch_list         = [];
  addnew_form           : boolean = false;
  editdispatch_form     : boolean = false;
  loading               : boolean = false;
  showdetails           : boolean = false;
  filter_data           : any;
  detail_view           : any;
  openModel             : any;
  LoadType              : any;
  LoadBy                : any;
  invoice_data          : any;
  temp                  : any;
  customer_id           : any;
  project_id            : any;
  customer_details      : any;
  employee_list         : any;
  tax_list              : any;
  EditAssoList          : any;
  invoiceitem_list      : any;
  project_details       : any;
  length_item           : any;
  EdititemList          : any;
  dispatch_pro_item_list: any;
  project_dispatch_item : any;
  item_length           : any;

  dispatch_type         : any;
  invoice_type          : any;
  invoice_id            : any;
  inv_OR_dc             : any;
  edit_type             : any;
  data_list             : any;
  id                    : any;
  edit_project_id       : any;
  filter_data_project   : any;
  filter_data_2         : any;
  project_asso_list_edit: any;
  total                 : any
  show                  : boolean
  outward_quantity      : any;
  have_serial_number    : boolean = false
  outwardList           : any
  item_list             : any
  product_details       : any
  item_category         : any
  batchList             : any
  item                  : any
  totalSelectedCount    : any
  show_dropdown         : boolean = false
  today                 : Date   = new Date();
  jstoday               = '';
  project_item_list     : any;
  checkedList           : any
  update_stock          : FormGroup;
  DispatchForm          : FormGroup;
  DispatchEditForm      : FormGroup;
  DriverDetails         : FormGroup;
  dropdownSettings      : any = {};
  list_view             : Boolean = false

  Outward = new FormGroup
  ({
    'created_by'    : new FormControl(this.uid),
    'production_id' : new FormControl(null),
    'assign_to'     : new FormControl(''),
    item_id         : new FormControl(null, [Validators.required]),
    outward_at      : new FormControl(null, [Validators.required]),
    batch_id        : new FormControl(null, [Validators.required]),
    quantity        : new FormControl(null, [Validators.required]),
    notes           : new FormControl(null),
    'status'        : new FormControl('1')
  })
  DispatchType      = new FormGroup
  ({
    type  : new FormControl(1)
  })
  DispatchBy = new FormGroup
  ({
    dispatch_by  : new FormControl(null, Validators.compose([Validators.required]))
  })

  constructor
  (
    public fb           : FormBuilder,
    public toastrService: ToastrService,
    private modalService: NgbModal,
    private api         : ApiService
  )
  {

    this.update_stock = this.fb.group(
      {
        product: this.fb.array([]),
      })
      this.checkedList = [];

    this.DispatchForm = fb.group(
      {

        'created_by'      : [this.uid],
        datetime          : [ null],
        type              : [null, Validators.compose([Validators.required])],
        invoice_id        : [null],
        dc_id             : [null],
        project_id        : [null],
        projectname       : [null],
        customer_id       : [null],
        customername      : [null],
        dispatch_incharge : [null, Validators.compose([Validators.required])],
        transport_type    : ['Company', Validators.compose([Validators.required])],
        dispatch_type     : [null],
        notes             : [null],

        'asso_list'       : this.fb.array([]),
        'status'          : [1]
      })

    this.DispatchEditForm = fb.group(
      {
        datetime          : [null, Validators.compose([Validators.required])],
        dispatch_incharge : [null, Validators.compose([Validators.required])],
        transport_type    : ['Company', Validators.compose([Validators.required])],
        'asso_list'       : this.fb.array([]),
         notes             : [null],
      })

      this.DriverDetails = fb.group(
        {
        transporter_name  : [null, Validators.compose([Validators.required, ])],
        vehicle_type      : [null, Validators.compose([Validators.required,])],
        vehicle_number    : [null, Validators.compose([Validators.required])],
        document_number   : [null, Validators.compose([Validators.required,])],
        tran_in_name      : [null, Validators.compose([Validators.required, ])],
        tran_in_mobile    : [null, Validators.compose([Validators.required, Validators.minLength(10)])],
        driver_name       : [null, Validators.compose([Validators.required, ])],
        driver_mobile     : [null, Validators.compose([Validators.required, Validators.minLength(10)])],
        amount            : [null, Validators.compose([Validators.required])],
        tax_percent       : [null, Validators.compose([Validators.required])],
        }
      )
   }

   Edit_Button()
   {
    this.showdetails = false;
    let id = this.detail_view['id'];
    this.LoadAssoEdit();
    this.LoadAssoEdit();
    this.editdispatch_form = true;
    this.addnew_form = false;
    this.selected = [];
    this.DispatchEditForm.controls['datetime'].setValue(this.detail_view['dispatch_datetime']);
    this.DispatchEditForm.controls['dispatch_incharge'].setValue(this.detail_view['dispatch_incharge']);
    this.DispatchEditForm.controls['transport_type'].setValue(this.detail_view['tran_scope']);
    // this.DispatchEditForm.controls['transporter_name'].setValue(this.detail_view['tran_name']);
    // this.DispatchEditForm.controls['vehicle_type'].setValue(this.detail_view['vehicle_type']);
    // this.DispatchEditForm.controls['vehicle_number'].setValue(this.detail_view['vehicle_number']);
    // this.DispatchEditForm.controls['document_number'].setValue(this.detail_view['document_number']);
    // this.DispatchEditForm.controls['tran_in_name'].setValue(this.detail_view['tran_inc_name']);
    // this.DispatchEditForm.controls['tran_in_mobile'].setValue(this.detail_view['tran_inc_mobile']);
    // this.DispatchEditForm.controls['driver_name'].setValue(this.detail_view['tran_driver_name']);
    // this.DispatchEditForm.controls['driver_mobile'].setValue(this.detail_view['tran_driver_mobile']);
    this.DispatchEditForm.controls['notes'].setValue(this.detail_view['note']);
    // this.DispatchEditForm.controls['amount'].setValue(this.detail_view['amount']);
    // this.DispatchEditForm.controls['tax_percent'].setValue(this.detail_view['tax_percent']);
   }

  ngOnInit()
  {
    this.LoadDispatch();
    this.Loadtax();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'serial_no',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }

  async LoadDispatch()
  {
    this.api.get('mp_dispatch_list.php?authToken='+environment.authToken).then((data: any) =>
    {
      if(data != null)
      {

        this.dispatch_list = data;
        this.filter_data =[...data];
      }
      else
      {
        this.dispatch_list = null;
      }
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  async OnUpdate(value)
  {
    let id        = this.detail_view['id'];
    let type      = this.detail_view['type'];
    let delivery  = this.detail_view['delivery_against'];
    let project_id= this.detail_view['project_id'];

    if(delivery =="Invoice")
    {
      var status_id = this.detail_view['invoice_id'];
    }

    if(delivery =="DC")
    {
      var status_id = this.detail_view['dc_id'];
    }
    value['asso_list'] = this.selected;
    value['item_list'] = this.selected_item;
    this.loading = true;
    await this.api.post('mp_dispatch_edit.php?id='+id+'&type='+type+'&delivery='+delivery+'&authToken=' + environment.authToken, value).then((data: any) =>
    {
      if(data.status == "success")
        {

          this.api.get('mp_invoice_status_update.php?value='+status_id+'&project_id='+project_id+'&type='+type+'&delivery='+delivery+'&authToken='+environment.authToken).then((data: any) =>
          {
            if(data.status == "success")
            {
                this.loading = false;
                this.toastrService.success('Dispatch Updated Succesfully');
                this.LoadDispatch();
                // this.LoadDispatch();

                // this.addnew_form = false;
                this.showdetails = true
                this.selected = [this.detail_view];
                // this.selected_item = [];
                // this.showdetails = false;
               setTimeout(async() => {
                   this.detail_view = await this.dispatch_list.find(i => i.id == this.detail_view.id)
                    this.editdispatch_form = false;
                }, 100);
            }
            else
             { this.toastrService.error(data);
              this.loading = false;}
               return true;
            }).catch(error => {this.toastrService.error('API Faild : OnUpdate');
            this.loading = false;});
        }
      else
        { this.toastrService.error(data.status);}
        return true;
    }).catch(error => {this.toastrService.error('API Faild : OnUpdate');
        this.loading = false;});
  }


  approval_button()
  {


      if(this.dispatch_pro_item_list != undefined)
      {
            if(this.dispatch_pro_item_list.length > 0)
            {
                this.list_view = true
            }
      }
      if(this.dispatch_pro_item_list == undefined)
      {
        this.openSm(this.approval);
      }

  }


  async Update_tran()
  {
     await this.Loadtax()
    this.DriverDetails.controls['transporter_name'].setValue(this.detail_view['tran_name']);
    this.DriverDetails.controls['vehicle_type'].setValue(this.detail_view['vehicle_type']);
    this.DriverDetails.controls['vehicle_number'].setValue(this.detail_view['vehicle_number']);
    this.DriverDetails.controls['document_number'].setValue(this.detail_view['document_number']);
    this.DriverDetails.controls['tran_in_name'].setValue(this.detail_view['tran_inc_name']);
    this.DriverDetails.controls['tran_in_mobile'].setValue(this.detail_view['tran_inc_mobile']);
    this.DriverDetails.controls['driver_name'].setValue(this.detail_view['tran_driver_name']);
    this.DriverDetails.controls['driver_mobile'].setValue(this.detail_view['tran_driver_mobile']);
    this.DriverDetails.controls['amount'].setValue(this.detail_view['amount']);
    this.DriverDetails.controls['tax_percent'].setValue(this.detail_view['tax_percent']);
    this.openModel = this.modalService.open(this.Transport,{ size: 'md'});
    console.log("tax list ",this.tax_list)

  }

  async Tranportdata(value)
  {
    console.log(value)
     console.log("details : ",this.detail_view.id)
    Object.keys(this.DriverDetails.controls).forEach(field =>
      {
        const control = this.DriverDetails.get(field);
        control.markAsTouched({ onlySelf: true });
      });

    if(this.DriverDetails.valid)
    {
      this.loading = true
      await  this.api.post('post_update_data.php?table=dispatch&field=id&value='+this.detail_view.id+'&authToken='+environment.authToken,this.DriverDetails.value).then(async (data: any) =>
      {
        console.log(data)
        if(data.status == "success")
        {
           await this.LoadDispatch();
            this.loading = false
            this.toastrService.success('Dispatch Updated Succesfully');
            this.openModel.close()

            console.log("detail_view : ",this.detail_view)
            setTimeout(async() => {
                this.detail_view = await this.dispatch_list.find(i => i.id == this.detail_view.id)
            }, 100);

            // this.LoadDispatch();
            // this.editdispatch_form = false;
            // this.addnew_form = false;
            // this.selected = [];
            // this.selected_item = [];
            // this.showdetails = false;
        }
      }).catch(error=> {
            this.toastrService.error('Something went wrong');
            this.loading = false
      })

    }
    else{
       this.toastrService.error('Fill the required details');
    }
  }
  async approval_submit()
  {
    let type =this.detail_view['delivery_against'];
    const Id = this.detail_view.id
    this.loading=true;
      await   this.api.get('single_field_update.php?table=dispatch&field=id&value='+this.detail_view.id+'&up_field=approved_by&update='+this.uid+'&authToken='+environment.authToken).then(async (data: any) =>
          {
            if(data.status == "success")
            {
          await   this.api.get('single_field_update.php?table=dispatch&field=id&value='+this.detail_view.id+'&up_field=status&update=2&authToken='+environment.authToken).then(async (data: any) =>
              {
            if(data.status == "success")
            {
              if(this.dispatch_pro_item_list == undefined)
                {
                this.openModel.dismiss()
                  await  this.api.get('mp_dispatch_list.php?authToken='+environment.authToken).then((data: any) =>
                        {

                            console.log("List data ",data)
                            this.dispatch_list = data;
                            this.filter_data =[...data];
                            this.detail_view  = data.find( s => s.id == Id)
                            console.log("detail_view",this.detail_view)
                        }).catch(error => {this.toastrService.error('Something went wrong');});
                                  }
          }
        }).catch(error =>
        {
        this.toastrService.error('API Faild : Approval Submit');
        this.loading = false;
        });

        if(this.item_length > 0)
        {
        await this.api.get('single_field_update.php?table=serial_no_material&field=dispatch_id&value='+this.detail_view.id+'&up_field=status&update=0&authToken='+environment.authToken).then((data: any) =>
            {
              if(data.status == "success")
              {

              }
            }).catch(error =>
            {
            this.toastrService.error('API Faild : Approval Submit Project Item');
            this.loading = false;
            });

        // this.api.get('single_field_update.php?table=project_item_list&field=dispatch_id&value='+this.detail_view.id+'&up_field=status&update=0&authToken='+environment.authToken).then((data: any) =>
        //   {
        //     if(data.status == "success")
        //     {

        //     }
        //   }).catch(error =>
        //   {
        //   this.toastrService.error('API Faild : Approval Submit Project Item');
        //   this.loading = false;
        //   });
        }


      }
      else { this.toastrService.error('Something went wrong : confirm');
       this.loading = false; }
    }).catch(error =>
    {
      this.toastrService.error('API Faild : confirm');
      this.loading = false;
    });
    this.loading = false;
  }


async  update(Batch)
  {
   const batch={
    batch:Batch
   }
  await  this.api.post('post_update_data_2.php?table=project_item_list&field=id&value='+this.approved_item.id+'&authToken='+environment.authToken,batch).then(async (data: any) =>
      {
        if(data.status == "success")
        {
          console.log("edit_project_id",this.edit_project_id)
      await  this.api.get('mp_project_item_list.php?project_id='+ this.edit_project_id+'&authToken='+environment.authToken).then((data: any) =>
            {
              console.log("After update item load",data)
              if(data != null)
              {

                  var id  = this.detail_view['id'];
                  function levelFilter1(value) { return ( value.dispatch_id == id); }
                  let get_data1 = data.filter(levelFilter1);
                  this.dispatch_pro_item_list = get_data1;
                  this.item_length = get_data1.length

                  function levelFilter2(value) { return ( value.status == 1  ); }
                  let get_data2 = data.filter(levelFilter2);
                  this.project_dispatch_item = get_data2;
                  this.openModel.dismiss();
                  if(get_data2.length== 0){
                       this.approval_submit()
                       this.inv_dc()
                    }
              }


            }).catch(error => {this.toastrService.error('Something went wrong ');});
        }
      }).catch(error =>
      {
      this.toastrService.error('API Faild : Approval Submit');
      this.loading = false;
      });





  }
  set_zero()
  {
    this.showdetails       = false;
    this.addnew_form       = false;
    this.editdispatch_form = false;
    this.selected          = [];
    this.DispatchForm.reset();

    this.DispatchForm.controls['created_by'].setValue[this.uid];
    this.DispatchForm.controls['status'].setValue[1];
    this.LoadDispatch();
  }

  DispatchSubmit(value)
  {}

  async OnSubmit(data)
  {

    this.DispatchForm.controls['created_by'].setValue(this.uid);
    this.DispatchForm.controls['status'].setValue(1);
    this.DispatchForm.controls['created_by'].setValue(this.uid);
    this.DispatchForm.controls['status'].setValue(1);
    Object.keys(this.DispatchForm.controls).forEach(field =>
      {
        const control = this.DispatchForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });

      data['asso_list']  = this.selected;
      data['item_list']  = this.selected_item;
      if(this.LoadType == 1)
      {
        data['invoice_id'] = this.LoadBy;
      }
      else if(this.LoadType == 2)
      {
        data['dc_id'] = this.LoadBy;
      }
      data['customer_id'] = this.customer_id;
      data['status']     = 1;
      data['created_by'] = this.uid;
      if(this.DispatchForm.valid && this.selected.length > 0)
    {

      console.log("work")
      this.loading =true;

      await this.api.post('mp_dispatch_entry.php?authToken=' + environment.authToken, data).then((data_rt: any) =>
      {
        console.log(data_rt)
        if(data_rt.status == "success")
          {
            this.loading = false;
            this.toastrService.success('Dispatch Added Succesfully');
            this.LoadDispatch();
            this.LoadDispatch();
            this.DispatchForm.reset();
            this.DispatchForm.controls['created_by'].setValue(this.uid);
            this.DispatchForm.controls['transport_type'].setValue('company');
            this.DispatchForm.controls['status'].setValue(1);
            this.addnew_form = false;
            this.selected = [];
          }
        else
          { this.toastrService.error(data_rt.status);
            this.loading = false;}
          return true;
      }).catch(error => {this.toastrService.error('API Faild : OnSubmit');
      this.loading = false;});
    }
   else if(this.DispatchForm.valid && this.selected_item.length > 0)
    {
      this.loading =true;

      await this.api.post('mp_dispatch_entry.php?authToken=' + environment.authToken, data).then((data_rt: any) =>
      {
         console.log(data_rt)
        if(data_rt.status == "success")
          {
            this.loading = false;
            this.toastrService.success('Dispatch Added Succesfully');
            this.LoadDispatch();
            this.LoadDispatch();
            this.DispatchForm.reset();
            this.DispatchForm.controls['created_by'].setValue(this.uid);
            this.DispatchForm.controls['transport_type'].setValue('company');
            this.DispatchForm.controls['status'].setValue(1);
            this.addnew_form = false;
            this.selected = [];
          }
        else
          { this.toastrService.error(data_rt.status);
            this.loading = false;}
          return true;
      }).catch(error => {this.toastrService.error('API Faild : OnSubmit');
      this.loading = false;});
    }
    else
    {
      this.toastrService.error('No Association Selected or Field May Icorrect/Empty');
    }
  }

 async TypeLoad(value)
  {
    this.LoadType = value.type;
     this.loading = true;
    if(this.LoadType == 1)
    {
      this.openModel.close();
     await   this.api.get('get_data.php?table=invoice&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
        this.invoice_data = data;
      }).catch(error => {this.toastrService.error('Something went wrong');});
      this.openModel = this.modalService.open(this.AddDispatchModel_Invoice, { size: 'md'});
    }
    else if(this.LoadType == 2)
    {
      this.openModel.close();
     await this.api.get('get_data.php?table=dc&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
        this.dc_list = data;
      }).catch(error => {this.toastrService.error('Something went wrong');});
      this.openModel = this.modalService.open(this.AddDispatchModel_Dc, { size: 'md'});
    }
    this.DispatchType.controls['type'].setValue(1);
    this.loading = false;
  }

  async LoadFrom(value)
  {

    if(this.DispatchBy.valid)
    {
      this.LoadBy  = value.dispatch_by;
      this.loading = true;
      if(this.LoadType == 1)
      {
        var data = this.invoice_data.find(t=>t.invoice_id == this.LoadBy);
        this.DispatchForm.controls['invoice_id'].setValue(data['invoice_id']);
        this.invoice_id=data.invoice_id;
        await this.api.get('mp_dispatch_item_list.php?type=Invoice&find=invoice_id&value='+this.invoice_id+'&authToken='+environment.authToken).then((data: any) =>
        {

          this.invoiceitem_list = data;
          this.project_id = this.invoiceitem_list[0].item_list_id;
          var data = this.invoice_data.find(t=>t.invoice_id == this.invoice_id);
          this.invoice_type = data.inv_type;
          this.DispatchForm.controls['dispatch_type'].setValue( this.invoice_type);
          const now = new Date();
          // Format the current date and time to match datetime-local format (YYYY-MM-DDTHH:mm)
          const formattedDate = now.toISOString().slice(0, 16);
          this.DispatchForm.controls['datetime'].setValue(formattedDate);


            if(this.invoice_type =='project')
            {
              this.Loadproject(this.project_id);
            }
            if(this.invoice_type =='items')
            {

              this.LoadItems();
              this.DispatchForm.controls['projectname'].setValue('item');
              this.DispatchForm.controls['project_id'].setValue(0);
            }
        }).catch(error => {this.toastrService.error('Something went wrong ');});
      }
      else if(this.LoadType == 2)
        {
          var data = this.dc_list.find(t=>t.dc_id == this.LoadBy);
          this.DispatchForm.controls['dc_id'].setValue(data['dc_id']);
          this.invoice_id=data.dc_id;
          await this.api.get('mp_dispatch_item_list.php?type=DC&find=dc_id&value='+this.invoice_id+'&authToken='+environment.authToken).then((data: any) =>
          {

            this.invoiceitem_list = data;

            this.project_id = this.invoiceitem_list[0].item_list_id;
            var data = this.dc_list.find(t=>t.dc_id == this.invoice_id);

            this.invoice_type = data.dc_type;

            this.DispatchForm.controls['dispatch_type'].setValue( this.invoice_type);

            const now = new Date();
            // Format the current date and time to match datetime-local format (YYYY-MM-DDTHH:mm)
            const formattedDate = now.toISOString().slice(0, 16);
            this.DispatchForm.controls['datetime'].setValue(formattedDate);
              if(this.invoice_type =='project')
              {
                this.Loadproject(this.project_id);
              }
              if(this.invoice_type =='items')
              {
                this.DispatchForm.controls['project_id'].setValue(0);
                this.LoadItems();
                this.DispatchForm.controls['projectname'].setValue('item');
              }
          }).catch(error => {this.toastrService.error('Something went wrong');});
        }
    this.openModel.close();
    this.project_id = data.project_id;
    this.customer_id = data.customer_id;
    this.DispatchForm.controls['type'].setValue(this.LoadType);

 await  this.api.get('get_data.php?table=customers&find=customer_id&value='+this.customer_id+'&authToken='+environment.authToken).then((data: any) =>
      {
        this.customer_details = data;
      }).catch(error => {this.toastrService.error('Something went wrong');});
      this.DispatchForm.controls['customer_id'].setValue(this.customer_id);
      this.DispatchForm.controls['customername'].setValue(this.customer_details[0]['company_name']);
      this.LoadList();
      if(this.invoice_type =='project')
      {
         this.LoadAssoFull();
      }
      if(this.invoice_type =='items')
      {
        this.LoadItems();
      }
      this.loading = false;
      this.addnew_form = true;
      this.DispatchBy.controls['dispatch_by'].reset();
      this.project_id = this.invoiceitem_list[0].item_list_id;
    }
    else{
      this.toastrService.warning('Select the list');
    }
  }

 async Loadproject(id)
  {
    await this.api.get('get_data.php?table=projects&find=project_id&value='+id+'&authToken='+environment.authToken).then((data: any) =>
    {

      this.project_details = data;
      this.DispatchForm.controls['projectname'].setValue(this.project_details[0].name);
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

 async Loadtax()
  {
   await this.api.get('get_data.php?table=tax&authToken='+environment.authToken).then((data: any) =>
    {
      this.tax_list  = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});

   await this.api.get('get_data.php?table=employee&authToken='+environment.authToken).then((data: any) =>
    {
      this.employee_list = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  async LoadList()
  {
    let data2 = this.invoiceitem_list;

    if ( data2.length > 0)
    {
      function levelFilter(value) {
        if (!value) { return false; }
         return value.status == 1;
        }
          let get_data     = data2.filter(levelFilter);
          this.filter_data_2 = [...get_data];
          this.project_asso_list  = get_data;
    }
    else
    {
      this.toastrService.warning('No Data');
    }
  }

  async LoadAssoFull()
  {
    let id = this.invoiceitem_list[0].item_list_id;
    this.DispatchForm.controls['project_id'].setValue(id);
    await this.api.get('mp_project_association.php?project_id='+id+'&authToken='+environment.authToken).then((data: any) =>
    {

      let data2 = data;
      if(data != null)
      {
          if (data.status != 'no data')
          {
            function levelFilter(value) {
              if (!value) { return false; }
              return value.status === 1;
              }
                let get_data = data2.filter(levelFilter);
                this.filter_data_2 = [...get_data];
                this.project_asso_list_edit  = get_data;
          }
          if (data.status == 'no data'||data== null)
          {
            this.toastrService.warning('No Data');
          }
        }
    }).catch(error => {this.toastrService.error('Something went wrong  ');});

    await this.api.get('mp_project_item_list.php?project_id='+this.project_id +'&authToken='+environment.authToken).then((data: any) =>
    {
        //  this.project_item_list = data

        if(data != null)
        {
         function levelFilter(value) {
          if (!value) { return false; }
           return value.dispatch_id  == null && value.status == 1;
          }
         let get_data = data.filter(levelFilter);
         this.project_item_list  = get_data;
         this.length_item = get_data.length
        }
    }).catch(error => {this.toastrService.error('Something went wrong ');});

  }

  async LoadAssoEdit()
  {
    let dispatch_id = this.detail_view['id'];
    let invoice_id  = this.detail_view['invoice_id'];
    var dc_id       = this.detail_view['dc_id'];
    let project_id  = this.detail_view['project_id'];
    this.edit_type  = this.detail_view['type'];
    if(this.edit_type =='project')
    {
       await this.api.get('mp_project_association.php?project_id='+project_id+'&authToken='+environment.authToken).then((data: any) =>
      {
        if(data != null)
        {
        let data_list=data;
        function levelFilter1(value) { return (value.status == 1 && value.project_id == project_id ); }
        let get_data1 = data_list.filter(levelFilter1);

        function levelFilter2(value) { return (value.dispatch_id == dispatch_id ); }
        let get_data2 = data_list.filter(levelFilter2);

        get_data1 = get_data1.concat(get_data2);

        this.filter_data_2 = [...get_data1];
        this.project_asso_list_edit  = get_data1;

        }

      }).catch(error => {this.toastrService.error('Something went wrong');});
     }
     if(this.edit_type =='items')
     {
        if(this.inv_OR_dc =='Invoice')
        {
          await this.api.get('mp_dispatch_item_list.php?type='+this.inv_OR_dc+'&find=invoice_id&value='+invoice_id+'&authToken='+environment.authToken).then((data: any) =>
          {
            this.data_list=data;
          }).catch(error => {this.toastrService.error('Something went wrong');});
        }

      if(this.inv_OR_dc =='DC')
        {
          await this.api.get('mp_dispatch_item_list.php?type='+this.inv_OR_dc+'&find=dc_id&value='+dc_id+'&authToken='+environment.authToken).then((data: any) =>
          {
            this.data_list=data;
          }).catch(error => {this.toastrService.error('Something went wrong');});
        }
      if(this.inv_OR_dc =='Invoice')
        {
          if(this.data_list != null)
          {

            var id  = this.detail_view['invoice_id'];
            function levelFilter1(value) { return (value.status == 1 && value.invoice_id == id); }
            let get_data1 = this.data_list.filter(levelFilter1);
            function levelFilter2(value) { return (value.dispatch_id == dispatch_id ); }
            let get_data2 = this.data_list.filter(levelFilter2)

            get_data1 = get_data1.concat(get_data2);

            this.filter_data_2 = [...get_data1];
            this.project_asso_list  = get_data1;

          }

        }
       if(this.inv_OR_dc =='DC')
        {
          if(this.data_list != null)
          {
            var id  = this.detail_view['dc_id'];
            function levelFilter1(value) { return (value.status == 1 && value.dc_id == id); }
            let get_data1 = this.data_list.filter(levelFilter1);

            function levelFilter2(value) { return (value.dispatch_id == dispatch_id ); }
            let get_data2 = this.data_list.filter(levelFilter2)

            get_data1 = get_data1.concat(get_data2);

            this.filter_data_2 = [...get_data1];
            this.project_asso_list  = get_data1;

          }

        }
    }
  }

  set_zero_back()
  {
    this.addnew_form = false;
    this.showdetails = false;
  }

  AssoEditOnActive(event)
  {
    if(event.type === "click")
    {
      this.addnew_form = false;

      this.EditAssoList = event.row;
      if(this.EditAssoList.status == 2)
      {
        this.openSm(this.RemoveFromDispatch);
      }
    }
  }


  AssoItemEditOnActive(event)
  {
    if(event.type === "click")
    {
      this.addnew_form = false;

      this.EdititemList = event.row;
     if( this.EdititemList.dispatch_id > 0)
     {
        this.openSm(this.RemoveFromDispatch_item);
     }

    }
  }

  RemoveAssoFromDispatch_item()
  {

     let value = null;
    this.api.get('single_field_update.php?table=project_item_list&field=id&value='+this.EdititemList.id+'&up_field=dispatch_id&update='+value+'&authToken='+environment.authToken).then((data: any) =>
    {
      if(data.status == "success")
      {
        this.openModel.close();
        this.openModel.close();
        this.loading = false;
        this.LoadAssoEdit();
        this.editdispatch_form = false;
        this.addnew_form = false;
        this.selected_item = [];
        this.toastrService.success('Item Removed Succesfully');
      }
    }).catch(error =>
    {
    this.toastrService.error('API Faild : Approval Submit');
    this.loading = false;
    });
  }
  RemoveAssoFromDispatch()
  {
    let type      = this.detail_view['type'];
    let delivery_against = this.detail_view['delivery_against'];
    let project_id = this.detail_view['project_id'];

    if(type == 'items')
    {
      var id = this.EditAssoList.item_list_id;
    }
    if(type == 'project')
    {
      var id = this.EditAssoList.id;
    }

    if(delivery_against == 'Invoice')
    {
     var value  =this.detail_view['invoice_id'];
    }

    if(delivery_against == 'DC')
    {
     var value  =this.detail_view['dc_id'];
    }
    this.loading = true;
    this.api.get('mp_dispatch_asso_remove.php?id='+id+'&type='+type+'&delivery='+delivery_against+'&authToken='+environment.authToken).then((data: any) =>
    {
      if(data.status == "success")
      {
        this.api.get('mp_invoice_status_update.php?value='+value+'&project_id='+project_id+'&type='+type+'&delivery='+delivery_against+'&authToken='+environment.authToken).then((data: any) =>
        {
            if(data.status == "success")
            {

                this.loading = false;
                this.LoadAssoEdit();
                this.openModel.close();
                this.editdispatch_form = false;
                this.addnew_form = false;
                this.selected = [];
                this.toastrService.success('Association Removed Succesfully');
            }
        }).catch(error => {this.toastrService.error('Something went wrong');
            this.loading = false;});
      }
    }).catch(error => {this.toastrService.error('Something went wrong');
    this.loading = false;});
  }

  AddButton()
  {
    this.api.get('get_data.php?table=item&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
    {
      this.invoice_list = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});
    this.openSm(this.AddDispatchModel_type);
  }

 openSm(content)
  {
    this.openModel = this.modalService.open(content, { size: 'md'});
  }

  updateFilter(event)
  {
    const val  = event.target.value.toLowerCase();
    const temp = this.filter_data.filter(function(d) {
      const invoice_number = d.invoice_number ? d.invoice_number .toLowerCase() : '';
      const dc_number      = d.dc_number ? d.dc_number.toLowerCase() : '';
      const project_name   = d.project_name ? d.project_name.toLowerCase() : '';
      const customer_name  = d.customer_name ? d.customer_name.toLowerCase() : '';
      return invoice_number.includes(val) || dc_number.includes(val)|| project_name.includes(val) || customer_name.includes(val)|| !val;
    });
    this.dispatch_list = temp;
    this.table.offset  = 0;

  }

  async LoadItems()
  {
      await  this.api.get('get_data.php?table=item&authToken='+environment.authToken).then((data: any) =>
      {
        this.project_details = data;
        if(this.invoiceitem_list[0].item_list_id != null)
        {
          this.project_id = this.invoiceitem_list[0].item_list_id;
          const name      = this.project_details.find(t=>t.item_id === this.project_id);
        }
      }).catch(error => {this.toastrService.error('Something went wrong ');});
 }



 async onActivate(event)
  {
    if(event.type === "click")
    {
      this.showdetails = true;
      this.detail_view = event.row;
      console.log (event.row)
      let dispatch_id  = this.detail_view['id'];
      this.edit_type   = this.detail_view['type'];
      this.inv_OR_dc   = this.detail_view['delivery_against'];
      this.edit_project_id = this.detail_view['project_id'];
      if(this.edit_type == 'project')
      {
      await this.api.get('mp_dispatch_asso_list.php?dispatch_id='+dispatch_id+'&authToken='+environment.authToken).then((data: any) =>
      {

        if(data != null)
        {
          this.project_asso_list  = data;
          this.filter_data_2      = [...data]
        }
        else
        {
          this.project_asso_list  = null;
        }
      }).catch(error => {this.toastrService.error('Something went wrong ');});

      await this.api.get('mp_project_item_list.php?project_id='+ event.row.project_id+'&authToken='+environment.authToken).then((data: any) =>
      {

         if(data != null)
         {
            var id  = this.detail_view['id'];
            function levelFilter1(value) { return ( value.dispatch_id == id); }
            let get_data1 = data.filter(levelFilter1);
            this.dispatch_pro_item_list = get_data1;
            this.item_length = get_data1.length

            function levelFilter2(value) { return ( value.status == 1  ); }
            let get_data2 = data.filter(levelFilter2);
            this.project_dispatch_item = get_data2;
         }

      }).catch(error => {this.toastrService.error('Something went wrong ');});

      }
    else if(this.edit_type == 'items')
      {
       await this.api.get('mp_dispatch_item_list.php?type='+this.inv_OR_dc+'&find=dispatch_id&value='+dispatch_id+'&authToken='+environment.authToken).then((data: any) =>
        {
          if(data != null)
          {
          this.project_asso_list = data ;
          }
          else
          {
            this.project_asso_list = null ;
          }
        }).catch(error => {this.toastrService.error('Something went wrong ' );});
      }
      }
  }

updateFilter_project (event)
  {
    const val  = event.target.value.toLowerCase();
    const temp = this.filter_data_2.filter(function(d) {
      return d.category_name.toLowerCase().indexOf(val) !== -1 || !val || d.description.toLowerCase().indexOf(val) !== -1 || !val;
    });
     this.project_asso_list_edit = temp;

    this.table.offset = 0;
  }
updateFilter_item (event)
  {
    const val  = event.target.value.toLowerCase();
    const temp = this.filter_data_2.filter(function(d) {
      return d.item_name.toLowerCase().indexOf(val) !== -1 || !val || d.item_description.toLowerCase().indexOf(val) !== -1 || !val;
    });
     this.project_asso_list = temp;
    this.table.offset = 0;
  }

  async packing_list()
  {
    let today = new Date();
    let year  = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day   = String(today.getDate()).padStart(2, '0');

    let formattedDate = `${year}-${month}-${day}`;

    let id            = this.detail_view['id'];
    let mode          = this.detail_view['type'];
    let delivery_type = this.detail_view['delivery_against'];
    if(mode =="project")
      {
        var project       = this.detail_view['project_name'];
      }
    if(mode =="items")
      {
        if(delivery_type =="Invoice")
        {
        var project       = this.detail_view['invoice_number'];
        }
        if(delivery_type =="DC")
        {
        var project       = this.detail_view['dc_number'];
        }
      }
    await this.api.get('mp_print_dispatchList.php?type='+mode+'&value='+id+'&delivery_type='+delivery_type+'&authToken='+environment.authToken).then((data: any) =>
    {
      if(data != null)
      {
        const value=Object.values(data)
         this.exportToExcel(value, ''+project+'Dispatch List'+formattedDate+'.xlsx');
      }
      // else{
      //   this.toastrService.warning('No Data ' );
      // }
    }).catch(error => {this.toastrService.error('Something went wrong ' );});
  }

  exportToExcel(data: any[], filename: string)
  {

    console.log(data)
    const ws = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const excelBlob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })],
                      {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url = URL.createObjectURL(excelBlob);

    const downloadLink    = document.createElement('a');
    downloadLink.href     = url;
    downloadLink.download = filename;
    downloadLink.click();

    URL.revokeObjectURL(url);
  }
 // exportToExcel(data: any[], filename: string) {
    // const ws = XLSX.utils.json_to_sheet(data);

    // // Apply styling to the title (header) row
    // const titleStyle = { font: { bold: true, color: { rgb: 'FF0000' } } }; // Change 'FF0000' to the desired color code
    // ws['A1'].s = titleStyle; // Apply style to A1 cell (title in this case)

    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // const excelBlob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })],
    //                   {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    //   const url = URL.createObjectURL(excelBlob);

    // const downloadLink = document.createElement('a');
    // downloadLink.href = url;
    // downloadLink.download = filename;
    // downloadLink.click();

    // URL.revokeObjectURL(url);
 // }


 close()
  {
  this.openModel.close();
  this.clear();
  }


  clear()
 {
  this.total = 0;
  const productArray = this.update_stock.get('product') as FormArray;
  for (let i = 0; i < productArray.length; i++)
  {
    const productGroup    = productArray.at(i) as FormGroup;
    const quantityControl = productGroup.get('quantity');
    const selectControl = productGroup.get('select');
    selectControl.patchValue(null);
    quantityControl.patchValue(0);
  }
  this.show = false;
 }


 approved_item : any

 quantity_select(event)
    {

        if(event.type =="click")
        {
          this.approved_item = event.row

          this.outward_quantity = event.row.value
          this.LoadBatch(event.row.item_id)
        }
    }


    async LoadBatch(item_id)
    {
      await this.api.get('get_data.php?table=item_category&authToken='+environment.authToken).then((data: any) =>
        {
          this.item_category = data
        }).catch(error => {this.toastrService.error('Something went wrong');});

      await this.api.get('get_data.php?table=stock_list&find=item_list_id&value='+item_id+'&find1=status&value1=1&authToken='+environment.authToken).then((data: any) =>
        {
          this.batchList = data;
           if(data != null)
            {
              this.have_serial_number = false;
                    for(let i=0;i<data.length;i++)
                      {
                        var value = this.item_category.find(t=>t.cat_id == this.batchList[i]['item_cat_id']);
                        this.batchList[i].have_serial_number = value.have_seriel_number;

                          if(value.have_seriel_number == 1)
                            {
                              this.have_serial_number = true;
                            this.api.get('get_data.php?table=serial_no_material&find=batch&value='+this.batchList[i]['batch']+'&find1=item_id&value1='+this.batchList[i]['item_list_id']+'&authToken='+environment.authToken).then((data: any) =>
                              {
                                if(data != null)
                                  {

                                    function levelFilter(value) {
                                      if (!value) { return false; }
                                      return value.status  == 1 }
                                    let get_data = data.filter(levelFilter);

                                    this.batchList[i].serial_itemList = get_data
                                    this.item = this.item.concat(data);
                                  }
                              }).catch(error => {this.toastrService.error('Something went wrong');});
                            }
                    }
              }
        }).catch(error => {this.toastrService.error('Something went wrong ');});
        this.loaddata();

    }


    loaddata()
    {
      this.totalSelectedCount = 0;
      this.openMd(this.approve_item_list);
      this.item = [];
      const product = this.update_stock.get('product') as FormArray;
      product.clear();
      if(this.batchList != null)
      {
        this.batchList.forEach((item,j) => {
          product.push(this.fb.group({
          items       : [item.item_name],
          descriptions: [item.item_description],
          batch       : [item.batch],
          quantity    : [0],
          stock       : [item.stock],
          select      : [item.serial_itemList]
          }));
        });
      }
      else{
        this.toastrService.warning('Selected Item Out of Stock');
      }
    }


    openMd(content)
    {
      this.openModel = this.modalService.open(content, { size: 'xl'});
    }

    edit_quantity(qty: number, j: number)
    {
      if(qty <= this.batchList[j].stock)
      {
        this.show_dropdown = false
        this.total=0;
        let products = (<FormArray>this.update_stock.controls['product']).value;
        products.forEach(product => {
          let total = product.quantity;
          this.total = this.total+total;
        });
        var select = this.batchList[j];

        if(select.have_serial_number == 1)
         {
          function levelFilter(value) {
            if (!value) { return false; }
            return value.status  == 1 }
          let get_data = this.item.filter(levelFilter);
          this.item  = get_data;
          this.show_dropdown = true
        }
        if (this.outward_quantity == this.total)
        {
          this.show = true;
        }
      else if (this.outward_quantity < this.total)
        {
          this.show = false;
          this.toastrService.warning('selected  quantity is not matched')
        }
        else{
          this.show = false;
        }
       }
     else
        {
          this.toastrService.warning('select correct quantity')
          this.show = false;
        }
    }


 async ReqApprove()
    {
      var value = this.detail_view;
      let id    = this.detail_view['id'];
      let type  = this.detail_view['delivery_against'];

      Object.keys(this.update_stock.controls).forEach(field =>
        {
          const control = this.update_stock.get(field);
          control.markAsTouched({ onlySelf: true });
        });
         var item_id :any
        console.log("detail_view : ",this.detail_view)
        console.log("update_stock: ",this.update_stock.value)

        const selectedBatches = this.update_stock.value.product
          .filter(item => item.quantity > 0)
          .map(item => item.batch);

        console.log(selectedBatches);
        const batchString =`Batch : ${selectedBatches.join(',')}` ;
      console.log(batchString); // "220224/18,240224/18"

          if( type == "Invoice")
          {

             await this.api.get('get_data.php?table=invoice_item&find=invoice_id&value='+this.detail_view['invoice_id']+'&find1=status&value1=1&authToken=' + environment.authToken).then((data: any) =>
              {
                 console.log("invoice item : ",data)
                 if(data != null)
                 {
                 item_id = data[0]['invoice_item_id'];
                 }
                  console.log("item_id 1: ",item_id)
              }).catch(error => { this.toastrService.error('Something went wrong'); });
          }
          if( type == "DC")
          {
           item_id = this.detail_view['dc_item_id'];
          }
          console.log("item_id 2: ",item_id)
              this.loading = true;
                 await    this.api.post('mp_outward_stocklist_update.php?value='+id+'&type='+type+'&item_id='+item_id+'&authToken=' + environment.authToken, this.update_stock.value).then((data: any) =>
                  {

                          if (data.status == "success")
                          {
                            this.toastrService.success(' Updated Succesfully');
                          //  this.close();
                          //  this.inv_dc()
                            this.update(batchString)
                          // this.getProductList();
                          //  this.loadOutward_list();

                          this.loading = false;
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

   async inv_dc()
    {
      let type  = this.detail_view['delivery_against'];
      if( type == "Invoice")
        {


        await   this.api.get('single_field_update.php?table=invoice&field=invoice_id&value='+this.detail_view.invoice_id+'&up_field=status&update=2&authToken='+environment.authToken).then((data: any) =>
            {

              if(data.status == "success")
              {
                this.list_view = false
                this.project_dispatch_item = null
                this.loading= false;
                this.LoadDispatch();
                this.LoadDispatch();
                this.openModel.dismiss();
                this.toastrService.success('Dispatch Approved Succesfully');
                this.addnew_form = false;
                this.selected = [];
                this.ngOnInit();
                this.showdetails = false;
                this.editdispatch_form =false;
              }
            }).catch(error =>
            {
            this.toastrService.error('API Faild : Approval Invoice  Submit');
            this.loading = false;
            });
        }
        if( type == "DC")
        {

    await     this.api.get('single_field_update.php?table=dc&field=dc_id&value='+this.detail_view.dc_id+'&up_field=status&update=2&authToken='+environment.authToken).then((data: any) =>
          {
            if(data.status == "success")
            {
              this.list_view = false
              this.project_dispatch_item = null
              this.loading= false;
              this.LoadDispatch();
              this.LoadDispatch();
              this.openModel.dismiss();
              this.toastrService.success('Dispatch Approved Succesfully');
              this.addnew_form = false;
              this.selected = [];
              this.ngOnInit();
              this.showdetails = false;
              this.editdispatch_form =false;
            }
          }).catch(error =>
          {
          this.toastrService.error('API Faild : Approval Dc Submit');
          this.loading = false;
          });
        }
    }

    ReqApprove_serial()
    {
      var value = this.detail_view;
      let id    = this.detail_view['id'];
      let type  = this.detail_view['delivery_against'];

      Object.keys(this.update_stock.controls).forEach(field =>
        {
          const control = this.update_stock.get(field);
          control.markAsTouched({ onlySelf: true });
        });
              if( type == "Invoice")
              {
                var item_id = this.detail_view['invoice_item_id'];
              }
              if( type == "DC")
              {
              var item_id = this.detail_view['dc_item_id'];
              }

                    this.total = 0
                      let products = (<FormArray>this.update_stock.controls['product']).value;
                        products.forEach(product => {
                          let total = 0
                          if(product.select != null)
                            {
                              total = product.select.length;

                            }
                            product.quantity = total
                          this.total = this.total+total;
                        });


                   console.log(this.update_stock.value)
                         const selectedBatches = this.update_stock.value.product
                        .filter(item => item.quantity > 0)
                        .map(item => item.batch);
                          const batchString = selectedBatches.join(',');
                         console.log(batchString); // "220224/18,240224/18"

                    const selectedSerials = this.update_stock.value.product
                .filter(item => item.quantity > 0 && Array.isArray(item.select))
                .flatMap(item => item.select.map(serial => serial.serial_no));

                   console.log(selectedSerials);
                 const SerialsString = `Serial No : ${selectedSerials.join(',')}`;
                         console.log(SerialsString)
                        if(this.total == this.outward_quantity)
                          {
                            this.loading = true;
                            this.api.post('mp_outward_stocklist_update.php?project_id='+this.edit_project_id+'&value='+id+'&type='+type+'&item_id='+item_id+'&authToken=' + environment.authToken, this.update_stock.value).then(async (data: any) =>
                            {

                              if (data.status == "success")
                              {
                                 this.loading = false;
                                 this.toastrService.success(' Updated Succesfully');
                              //   this.close();
                              await  this.update(SerialsString)
                              //  await this.inv_dc()
                              //  this.getProductList();
                              //   this.loadOutward_list();


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
                        if(this.total != this.outward_quantity)
                          {
                            this.toastrService.warning('Select value not matched ');
                          }
    }


    async getProductList()
  {
        await this.api.get('mp_items_view.php?authToken='+environment.authToken).then((data: any) =>
        {
          if(data != null)
          {
            function levelFilter(value) { return (value.status === 2); }
            let get_data = data.filter(levelFilter)
            this.product_details = get_data;
            this.filter_data     = [...get_data];
          }
          else
          {
            this.product_details = null;
          }
        }).catch(error => {this.toastrService.error('Something went wrong');});
  }


  loadOutward_list()
{
      var type = this.detail_view['delivery_against'];
      var id   = this.detail_view['id'];
          if( type == "Invoice")
          {
            this.api.get('get_data.php?table=invoice_item&find=dispatch_id&value='+id+'&find1=status&value1=2&authToken=' + environment.authToken).then((data: any) =>
              {
                if(data != null)
                {
                  this.outwardList = data;
                  let data_length  = data.length;
                  for(let i=0;i<data_length;i++)
                  {
                    var list_id = this.outwardList[i].item_list_id;
                    var data    = this.item_list.find(t=>t.item_id == list_id);
                    this.outwardList[i]['itemname'] =data.name;
                  }
                }
              else
                {
                  this.outwardList = null;
                  this.selected=[];
                }
            }).catch(error => { this.toastrService.error('Something went wrong'); });
          }


        if( type == "DC")
        {
          this.api.get('get_data.php?table=dc_item&find=dispatch_id&value='+id+'&find1=status&value1=2&authToken=' + environment.authToken).then((data: any) =>
            {
              if(data != null)
              {
                this.outwardList = data;
                let data_length  = data.length;
                for(let i=0;i<data_length;i++)
                {
                  var list_id = this.outwardList[i].item_list_id;
                  var data    = this.item_list.find(t=>t.item_id == list_id);
                  this.outwardList[i]['itemname'] =data.name;
                }
              }
              else
              {
                this.outwardList = null;
                this.selected=[];
              }
            }).catch(error => { this.toastrService.error('Something went wrong'); });
        }
}

set_zero_2()
    {
      this.list_view = false
    }

    onItemSelect(event,j)
  {
      this.show = true;
  }
  onSelectAll(event)
  {
  }
}


