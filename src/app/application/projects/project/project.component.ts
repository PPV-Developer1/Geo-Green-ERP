import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatatableComponent, id } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormGroup,  FormBuilder, Validators, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector   : 'az-project',
  templateUrl: './project.component.html',
  styleUrls  : ['./project.component.scss']
})
export class ProjectComponent implements OnInit
{
  pipe                   = new DatePipe('en-US');
  public now             = Date.now();
  public myFormattedDate = this.pipe.transform(this.now, 'dd/MM/yyyy hh:mm:ss');
  public uid             = localStorage.getItem('uid');

  rows                   = [];
  filter                 = [];
  selected               = [];
  detail_view            = [];
  detail_view1           = [];
  disp_data              = [];
  add_options            = [];
  full_view              = [];
  asso_view              = [];

  detail                  : any
  public modalRef         : any;
  public project_level    : any;
  public product_list     : any;
  public customer_list    : any;
  public serial_item_list : any;
  public item_list        : any;
  public item_category    : any;
  public router           : Router;
  select_id:any;
  current_stock:any;
  stock_id :any;
  edit_itemData:any

  pro_serial_item_list  : any;
  project_item_List     : any;
  public p_id           : number;
  public in_p_id        : number;
  public updateID       : number;
  public loading        : boolean = false;
  public create_page    : boolean = false;
  public Qty_disabled    : boolean = false;

  @ViewChild(DatatableComponent) table: DatatableComponent; // Data Table Congig

  @ViewChild("open_associations_serial",{static:true}) open_associations_serial:ElementRef;
  @ViewChild("open_associations",{static:true}) open_associations:ElementRef;  // For MODEL Open
  @ViewChild("open_dialogue",{static:true}) open_dialogue:ElementRef;  // For MODEL Open
  @ViewChild("create_project",{static:true}) create_project:ElementRef;  // For MODEL Open
  @ViewChild("edit_item",{static:true}) edit_item:ElementRef;
  @ViewChild("edit_project",{static:true})edit_project:ElementRef;

  editProject  = new FormGroup
  ({

      name          : new FormControl('', [Validators.required, Validators.minLength(3)]),
      type          : new FormControl('1', [Validators.required]),
      reff_number   : new FormControl('', [Validators.required]),
      description   : new FormControl('', [Validators.required, Validators.minLength(3)]),
      customer_id   : new FormControl('1', [Validators.required]),
      value         : new FormControl('', [Validators.required]),
      capacity      : new FormControl('', [Validators.required]),
      startDate     : new FormControl('', [Validators.required]),
      endDate       : new FormControl('', [Validators.required]),
      'status'      : new FormControl('1'),
      'level'       : new FormControl('0'),
      remark        : new FormControl('')
    })

  newProject  = new FormGroup
  ({
      'created_by'  : new FormControl(this.uid),
      name          : new FormControl('', [Validators.required, Validators.minLength(3)]),
      type          : new FormControl('1', [Validators.required]),
      reff_number   : new FormControl('', [Validators.required]),
      description   : new FormControl('', [Validators.required, Validators.minLength(3)]),
      customer_id   : new FormControl('1', [Validators.required]),
      value         : new FormControl('', [Validators.required]),
      capacity      : new FormControl('', [Validators.required]),
      startDate     : new FormControl('', [Validators.required]),
      endDate       : new FormControl('', [Validators.required]),
      'status'      : new FormControl('1'),
      'level'       : new FormControl('0'),
      remark        : new FormControl('')
    })

    AddAssociate = new FormGroup
    ({
        'created_by'  : new FormControl(this.uid),
        'project_id'  : new FormControl(''),
        category_id   : new FormControl('', [Validators.required]),
        description   : new FormControl('', [Validators.required]),
        'status'      : new FormControl('1'),
        serial_no     : new FormControl(''),
      })

      AddAssociate_item = new FormGroup
      ({
          'created_by'  : new FormControl(this.uid),
          'project_id'  : new FormControl(''),
           item_id      : new FormControl('', [Validators.required]),
           description  : new FormControl('', ),
           notes        : new FormControl('',),
          'status'      : new FormControl('1'),
          item_count    : new FormControl(''),
        })

        EditAssociate_item = new FormGroup
      ({
           item_id      : new FormControl('', [Validators.required]),
           description  : new FormControl('', ),
           notes        : new FormControl('',),
           item_count    : new FormControl('',[Validators.required]),
        })

        ProjectClone = new FormGroup
    ({
        'created_by'  : new FormControl(this.uid),
        'project_id'  : new FormControl('',[Validators.required]),
      })
  constructor
  (
    private modalService: NgbModal,
    public api          : ApiService,
    public toastrService: ToastrService,
    fb                  : FormBuilder,
    router              : Router
  )
  {
    this.router = router;
  }

  ngOnInit()
  {
    this.api.get('mp_project_list.php?authToken='+environment.authToken).then((data: any) =>
    {

      this.rows = data;
      if(data != null)
        this.filter = [...data];
    }).catch(error => {this.toastrService.error('Something went wrong');});

    this.api.get('get_data.php?table=item&authToken='+environment.authToken).then((data: any) =>
    {
      this.item_list = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});


    this.api.get('get_data.php?table=item_category&find=have_seriel_number&value=1&authToken='+environment.authToken).then((data: any) =>
    {
      this.item_category = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});

    this.api.get('get_data.php?table=product_type&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
        this.product_list = data;
      }).catch(error => {this.toastrService.error('Something went wrong');});
      this.api.get('get_data.php?table=customers&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
        this.customer_list = data;
      }).catch(error => {this.toastrService.error('Something went wrong');});
    this.item_load()

  }


  activePanel: string | null = "panel1";

  togglePanel(panel: string): void {
    console.log(panel)
  this.activePanel = this.activePanel === panel ? null : panel;
}

  selectitem(item_value)
  {

      const description = this.serial_item_list.find(item => item.item_id == item_value);
      console.log("description",description)

      if(description.have_seriel_number === 1)
      {
         console.log("have_serial_number",description.have_seriel_number)
        this.AddAssociate_item.controls['item_count'].setValue("1")
        this.EditAssociate_item.controls['item_count'].setValue("1")
        this.Qty_disabled=true
      }
      else{
         this.AddAssociate_item.controls['item_count'].setValue("")
        this.EditAssociate_item.controls['item_count'].setValue("")
         this.Qty_disabled=false
      }
      this.AddAssociate_item.controls['description'].setValue(description.description)
      this.EditAssociate_item.controls['description'].setValue(description.description)

  }
  async onSubmit(values)
  {
    Object.keys(this.AddAssociate.controls).forEach(field =>
      {
        const control = this.AddAssociate.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if (this.AddAssociate.valid)
    {
      this.loading=true;
      values['project_id'] = this.detail_view['id'];
      await this.api.post('post_insert_data.php?table=project_association&authToken='+environment.authToken,this.AddAssociate.value).then((data: any) =>
      {
        if(data.status == "success")
        {
           this.loading=false;
           this.toastrService.success('Association Added Succesfully');
           this.AddAssociate.controls['category_id'].setValue('');
           this.AddAssociate.controls['description'].reset();}
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
    this.AssoView();
  }


 async Clone(ID)
  {
      console.log("Project id : ",ID)
      this.ProjectClone.controls['project_id'].setValue(ID)
      if(this.ProjectClone.valid)
      {
          console.log("valid",this.ProjectClone.value)
        await  this.api.post('mp_project_clone_create.php?authToken='+environment.authToken,this.ProjectClone.value).then(async (data: any) =>
          {
            console.log("POSt:",data)
            if(data.status =="success")
            {
              await this.toastrService.success("Clone process successful")
               await this.api.get('mp_project_list.php?project_id='+data.last_id+'&authToken='+environment.authToken).then(async (data: any) =>
                {

                  this.detail_view = data[0];
                  this.detail=data[0];
                   await this.edit();

                }).catch(error => {this.toastrService.error('Something went wrong');});
            }
            else{
              this.toastrService.error('Something went wrong');
            }

          }).catch(error => {this.toastrService.error('Something went wrong');});
      }
  }
  async onUpdate(values)
  {

    if (this.AddAssociate.valid)
    {
      this.loading=true;
        await this.api.post('post_update_data.php?table=project_association&field=id&value='+this.updateID+'&authToken='+environment.authToken,values).then((data: any) =>
        {
          if(data.status == "success") {
            this.loading=false;
            this.toastrService.success('Association Updated Succesfully'); }
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
      this.toastrService.error('Please Fill The All Fields');
    }

    this.AssoView();
    this.AddAssociate.controls['category_id'].reset();
    this.AddAssociate.controls['description'].reset();
    this.modalRef.dismiss();
  }

  openSm(open_associations)
  {
    this.AddAssociate.controls['category_id'].reset();
    this.AddAssociate.controls['description'].reset();
    this.api.get('get_data.php?table=project_level_category&find=level&value=1&authToken='+environment.authToken).then((data: any) =>
    {
      this.add_options = data;
    }).catch(error => {this.toastrService.error('Something went wrong');});

    this.modalRef =  this.modalService.open(open_associations, { size: 'xl'});
  }

  openSm_serial(open_associations_serial)
  {
    this.AddAssociate.controls['category_id'].reset();
    this.AddAssociate.controls['description'].reset();

    //let name = this.item_list.find(u => u.item_id === data[i].item_id);


    this.modalRef =  this.modalService.open(open_associations_serial, { size: 'xl'});
  }

  openCreateProject()
  {

    this.create_page = true;
  }

  item_load()
  {
    this.api.get('mp_product_material.php?type=itemlist&authToken='+environment.authToken).then((data: any) =>
    {
      this.serial_item_list = data;

    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  opendialog(open_dialogue)
  {
    this.modalService.open(open_dialogue, { size: 'xl'});
  }

  async SubmitProject(data)
  {
    Object.keys(this.newProject.controls).forEach(field =>
      {
        const control = this.newProject.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      if (this.newProject.valid)
      {
        this.loading=true;
        await this.api.post('post_insert_data.php?table=projects&authToken=' + environment.authToken, this.newProject.value).then((data: any) =>
        {
          if(data.status == "success")
            {
              this.loading = false;
              this.toastrService.success('Project Added Succesfully');

              this.newProject.controls['created_by'].setValue(this.uid);
              this.newProject.controls['name'].reset();
              this.newProject.controls['type'].setValue('1');
              this.newProject.controls['reff_number'].reset();
              this.newProject.controls['description'].reset();
              this.newProject.controls['customer_id'].setValue('1');
              this.newProject.controls['value'].reset();
              this.newProject.controls['capacity'].reset();
              this.newProject.controls['startDate'].reset();
              this.newProject.controls['endDate'].reset();
              this.newProject.controls['level'].setValue('0');
              this.newProject.controls['remark'].reset();
              this.newProject.controls['status'].setValue('1');

              this.create_page = false;
              this.ngOnInit();
            }
          else
          { this.toastrService.error(data.status);
            this.loading = false; }
          return true;
        }).catch(error =>
        {
            this.toastrService.error('API Faild : SubmitProject');
            this.loading = false;
        });
      }
  }

  set_zero() { this.selected = [];
              this.ngOnInit(); }

  set_zero_back() { this.create_page = false; }

  call_add() { this.openSm(this.open_associations); }

  call_add_serial() { this.openSm_serial(this.open_associations_serial); }

  updateFilter(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.filter.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  async AssoView()
  {
    let p_id      = this.detail_view['id'];
    await this.api.get('mp_project_asso_list.php?authToken='+environment.authToken+'&project_id='+p_id).then((data: any) =>
    {
      if(data !=null)
      {
        this.asso_view     = data.asso_list;
        this.project_level = data.project_level;
        return true;
      }
      else
      {
        this.asso_view    = null;
        this.project_level= null;
      }
    }).catch(error =>
    {
        this.toastrService.error('Something went wrong');
    });


  await  this.api.get('mp_product_material.php?type=project_itemlist-serial&project_id='+p_id+'&authToken='+environment.authToken).then((data: any) =>
    {

      this.pro_serial_item_list = data;

    }).catch(error => {this.toastrService.error('Something went wrong');});


  await  this.api.get('mp_product_material.php?type=project_itemlist&project_id='+p_id+'&authToken='+environment.authToken).then((data: any) =>
    {

      this.project_item_List = data;
      console.log("data: ",data)

    }).catch(error => {this.toastrService.error('Something went wrong');});

  }

  onActivate(event)
  {
    if(event.type === "click")
    {
      this.detail_view = event.row;
      console.log("detail_view",this.detail_view)
      this.detail = event.row;
      this.AssoView();
      console.log(event.row)
    }
  }

  inonActivate(value)
  {
    this.in_p_id      = this.detail_view['id'];
    this.detail_view1 = value;
    this.updateID     = this.detail_view1['id'];
    setTimeout(() => {
      this.AddAssociate.controls['category_id'].setValue(value.category_id);
      this.AddAssociate.controls['description'].setValue(value.description);
    }, 100);
    this.openSm(this.open_dialogue);
  }

 async delete_associate(id)
  {
   await this.api.get('delete_data.php?authToken='+environment.authToken+'&table=project_association&field=id&id='+id).then((data: any) =>
        {
          this.AssoView();
          this.AssoView();
          this.toastrService.success('Data Deleted Successfull');
          return true;
        }).catch(error =>
        {
            this.toastrService.error('Something went wrong');
        });
  }

 async onSubmit_item(value)
  {

    value['project_id'] = this.detail_view['id'];
    Object.keys(this.AddAssociate_item.controls).forEach(field =>
      {
        const control = this.AddAssociate_item.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if (this.AddAssociate_item.valid)
    {
      this.loading=true;
        await this.api.post('post_insert_data.php?table=project_item_list&authToken='+environment.authToken,value).then((data: any) =>
        {

          if(data.status == "success")
           {
              this.loading=false;
               this.toastrService.success(' Updated Succesfully');
               this.AssoView();
              this.AddAssociate_item.controls['item_id'].reset();
              this.AddAssociate_item.controls['notes'].reset();
              this.AddAssociate_item.controls['description'].reset();
              this.AddAssociate_item.controls['item_count'].reset();
              this.modalRef.dismiss();
              this.Qty_disabled=false
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
      this.toastrService.error('Please Fill The All Fields');
    }

  }


 async item(id)
  {
    this.select_id = id;
   await this.api.get('get_data.php?table=serial_no_material&find=id&value='+id+'&authToken='+environment.authToken).then(async (data: any) =>
    {
       if(data != null)
       {
      await  this.api.get('get_data.php?table=stock_list&find=batch&value='+data[0].batch+'&authToken='+environment.authToken).then((data: any) =>
          {
            this.current_stock = data[0].stock-1;
            this.stock_id = data[0].stock_id

          }).catch(error => {this.toastrService.error('Something went wrong');});
      }
    }).catch(error => {this.toastrService.error('Something went wrong');});


  }


  itemActivate(value)
  {
    console.log("select :",value)
    this.edit_itemData = value

    if(value.status == 1)
    {
        const description = this.serial_item_list.find(item => item.item_id == value.item_id);

        this.EditAssociate_item.controls['description'].setValue(description.description)
        this.EditAssociate_item.controls['item_id'].setValue(value.item_id)
        this.EditAssociate_item.controls['notes'].setValue(value.notes)
        this.EditAssociate_item.controls['item_count'].setValue(value.value)
        this.modalRef =  this.modalService.open(this.edit_item, { size: 'xl'});
    }
    else{
      this.toastrService.error('not able to edit ');
    }
  }

 async delete_item(row)
  {console.log(row)

    if(row.status ===1)
    {
      await  this.api.get('delete_data.php?authToken='+environment.authToken+'&table=project_item_list&field=id&id='+row.id).then((data: any) =>
          {
            this.AssoView();
            this.AssoView();
            this.toastrService.success('Data Deleted Successfull');
            return true;
          }).catch(error =>
          {
              this.toastrService.error('Something went wrong');
          });
    }
    else{
      this.toastrService.error('not able to delete ');
    }
  }

async  onSubmit_edititem(value)
  {
    console.log("edit : ",value)


        this.loading=true;
          await this.api.post('post_update_data.php?table=project_item_list&field=id&value='+this.edit_itemData.id+'&authToken='+environment.authToken,value).then((data: any) =>
          {
            if(data.status == "success") {
              this.loading=false;
              this.AssoView();
              this.toastrService.success(' Updated Succesfully');
              this.modalRef.dismiss()
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


  edit()
  {
          this.editProject.controls['name'].setValue(this.detail.name)
          this.editProject.controls['value'].setValue(this.detail.value)
          this.editProject.controls['customer_id'].setValue(this.detail.customer_id)
          this.editProject.controls['description'].setValue(this.detail.description)
          this.editProject.controls['reff_number'].setValue(this.detail.reff)
          this.editProject.controls['remark'].setValue(this.detail.remark)
          this.editProject.controls['startDate'].setValue(this.detail.start)
          this.editProject.controls['endDate'].setValue(this.detail.end)
          this.editProject.controls['type'].setValue(this.detail.type_id)
          this.editProject.controls['capacity'].setValue(this.detail.capacity)

          this.modalRef =  this.modalService.open(this.edit_project, { size: 'md'});
  }

async  ediProject(event)
  {
    if(this.editProject.valid)
    {
      this.loading=true;
        await this.api.post('post_update_data.php?table=projects&field=project_id&value='+this.detail.id+'&authToken=' + environment.authToken, this.editProject.value).then((data: any) =>
        {
          console.log(data)
          if(data.status == "success")
            {
              this.loading = false;
              this.toastrService.success('Project updated Succesfully');
              this.editProject.reset();

              this.modalRef.close();

              this.api.get('mp_project_list.php?project_id='+this.detail.id+'&authToken='+environment.authToken).then((data: any) =>
                {

                  this.detail_view = data[0];
                  this.detail=data[0];

                }).catch(error => {this.toastrService.error('Something went wrong');});
            }
          else
          { this.toastrService.error(data.status);
            this.loading = false; }

        }).catch(error =>
        {
            this.toastrService.error('API Faild : SubmitProject');
            this.loading = false;
        });
    }
  }
}
