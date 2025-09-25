import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Unary } from '@angular/compiler';
import { hasOwnProp } from 'fullcalendar/src/util';

@Component({
  selector    : 'az-salary',
  templateUrl : './employee.component.html',
  styleUrls   : ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit
{
  public uid       = localStorage.getItem('uid');
  public user_type = localStorage.getItem('type');

  editing                   = {};
  rows                      = [];
  temp                      = [];
  selected                  = [];
  sal_selected              = [];
  detail_view               = [];
  price                     = '1000000';
  statement                 = [];
  employee                  = [];
  salary_group              = [];
  user_type_list            = [];
  SalGrpEdit                = [];
  createBank                = [];
  salary_details            : any;
  employee_details          : any;
  SalGrp_Edit               : any;
  SalGrp_Add                : any;
  fileURL                   : any;
  Upl_emp_file              : any;
  View_emp_doc              : any;
  emp_file_view             : any;
  Upl_emp_img               : any;
  emp_img                   : any;
  emp_id                    : any;
  updateEmployee            : any;
  emp_name                  : any;
  emp_doj                   : any;
  emp_designation           : any;
  emp_pan                   : any;
  emp_aadhar                : any;
  emp_status                : any;
  emp_bank_name             : any;
  emp_ifsc                  : any;
  emp_branch                : any;
  emp_basic_salary          : any;
  emp_portal_access         : any;
  emp_image                 : any;
  img_path                  : any;
  emp_bank_account_no       : any;
  emp_type_list             : any;
  emp_father_guardianName   : any;
  emp_maritalStatus         : any;
  emp_mobileNo              : any;
  emp_dob                   : any;
  emp_emailId               : any;
  emp_password              : any;
  emp_empRole               : any;
  emp_empType               : any;
  emp_esiNo                 : any;
  emp_pfNo                  : any;
  emp_salary                : any;
  emp_bank_access           : any;
  emp_userStatus            : any;
  emp_permenantAddress      : any;
  emp_AddressForCommunication: any;
  emp_jobLocation           : any;
  emp_lastWorkingDay        : any;
  emp_emergency_Con_Person  : any;
  emp_emergency_Con_PersonNo: any;
  emp_emergency_Con_PersonRelationship:any;
  emp_salaryGroup           : any;
  emp_ot                    : any;
  emp_bloodgroup            : any;
  emp_qualification         : any;
  emp_empType_name          : any;
  emp_salaryGroup_name      : any;
  emp_empRole_id            : any;
  emp_pl                    : any;
  emp_cl                    : any;
  salary_transaction        : any;
  emp_uan                   : any;
  emp_hra                   : any;
  emp_allowance             : any;
  emp_epf_amount            : any;
  emp_professional_tax      : any;
  emp_designation_name      : any;
  designation_list          : any;
  transeaction_det          : any;
  bank_details              : any;
  filter                    : any[];

  public file               : any;
  public image              : any;
  public editEmpDetails     : FormGroup;
  public createBank_FG      : FormGroup;
  public uploadDoc          : FormGroup;
  public form               : FormGroup;
  public sal_edit           : FormGroup;
  public sal_add            : FormGroup;

  view                      : boolean  = false;
  submitted                 : boolean  = false;
  collapsed                 : boolean  = true;
  stateShow                 : boolean  = true;
  loading                   : boolean  = false;
  show                      : boolean  = true;
  status                    : boolean  = true;
  dropdown                  : boolean  = true;
  Perssional_tax_edit       : boolean  = false;
  EPF_edit                  : boolean  = false;

  public SalEditName        : AbstractControl;
  public SalEditBasic       : AbstractControl;
  public SalEditConv        : AbstractControl;
  public SalEditSA          : AbstractControl;
  public SalEditTA          : AbstractControl;
  public SalEditFA          : AbstractControl;
  public SalEditEsi         : AbstractControl;
  public SalEditPf          : AbstractControl;
  public SalEditTax         : AbstractControl;
  public SalEditTcs         : AbstractControl;
  public SalEditStatus      : AbstractControl;

  public SalName            : AbstractControl;
  public SalBasic           : AbstractControl;
  public SalConv            : AbstractControl;
  public SalSA              : AbstractControl;
  public SalTA              : AbstractControl;
  public SalFA              : AbstractControl;
  public SalEsi             : AbstractControl;
  public SalPf              : AbstractControl;
  public SalTax             : AbstractControl;
  public SalTcs             : AbstractControl;
  public SalStatus          : AbstractControl;


  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild("edit_sal_group", { static: true }) edit_sal_group   : ElementRef;

  @ViewChild("add_sal_group", { static: true }) add_sal_group     : ElementRef;

  @ViewChild("upload_emp_file", { static: true }) upload_emp_file : ElementRef;

  @ViewChild("view_emp_file", { static: true }) view_emp_file     : ElementRef;

  @ViewChild("upload_emp_img", { static: true }) upload_emp_img   : ElementRef;


  myForm = new FormGroup
  ({
    type: new FormControl(''),
    name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
    file: new FormControl('', Validators.compose([Validators.required])),
    fileSource: new FormControl('', [Validators.required])
  });

  addEmployee = new FormGroup
  ({
      'created_by'    : new FormControl(this.uid),
      empPrefix       : new FormControl('Mr'),
      empName         : new FormControl('', [Validators.required, Validators.minLength(3)]),
      fatherPrefix    : new FormControl('Mr'),
      father_guardianName : new FormControl(null),
      designation     : new FormControl(null),
      panNo           : new FormControl('', Validators.compose([Validators.required ,Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")])),
      aadharNo        : new FormControl('', Validators.compose([Validators.required ,Validators.pattern("^[2-9]{1}[0-9]{11}$")])),
      bloodGroup      : new FormControl('A+', [Validators.required]),
      mobileNo        : new FormControl('',Validators.compose([Validators.required])),
      dob             : new FormControl(null),
      maritalStatus   : new FormControl(null),
      nationality     : new FormControl('Indian'),
      qualification   : new FormControl(null),
      emailId         : new FormControl('',Validators.compose([ Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])),
      password        : new FormControl(''),
      empRole         : new FormControl('', [Validators.required]),
      empType         : new FormControl('', [Validators.required]),
      bankAccountNo   : new FormControl(null),
      bankName        : new FormControl(null),
      ifsc            : new FormControl('',Validators.compose([Validators.pattern("^[A-Z]{4}[0][A-Z0-9]{6}$")])),
      branch          : new FormControl(null),
      doj             : new FormControl(null),
      esiNo           : new FormControl(null),
      pfNo            : new FormControl(null,Validators.compose([Validators.pattern(/^[A-Z]{2}\/[A-Z]{3}\/\d{7}\/\d{3}\/\d{7}$/)])),
      uan             : new FormControl(null),
      salary          : new FormControl(null),
      ot              : new FormControl(null),
      bank_access     : new FormControl('1'),
      bank_id         : new FormControl(null),
      userStatus      : new FormControl('1'),
      portalAccess    : new FormControl(''),
      status          : new FormControl('1'),
      permenantAddress: new FormControl('', [Validators.required]),
      jobLocation     : new FormControl('Chennai'),
      lastWorkingDay  : new FormControl(null),
      salaryGroup     :  new FormControl(null),
      AddressForCommunication         : new FormControl('', [Validators.required]),
      emergency_Con_Person            : new FormControl('', [Validators.required]),
      emergency_Con_PersonNo          : new FormControl('',Validators.compose([Validators.required])),
      emergency_Con_PersonRelationship: new FormControl('', [Validators.required]),
      hra             : new FormControl('', [Validators.required]),
      allowance       : new FormControl('', [Validators.required]),
      epf_amount      : new FormControl('', [Validators.required]),
      professional_tax: new FormControl('', [Validators.required]),
    })
  constructor(private modalService: NgbModal, public api: ApiService, public toastrService: ToastrService, fb: FormBuilder,private http: HttpClient)
  {
    this.sal_edit = fb.group
      (
        {
          'created_by'    : [this.uid],
          'SalEditName'   : [null],
          'SalEditBasic'  : [null],
          'SalEditConv'   : [null],
          'SalEditSA'     : [null],
          'SalEditTA'     : [null],
          'SalEditFA'     : [null],
          'SalEditEsi'    : [null],
          'SalEditPf'     : [null],
          'SalEditTax'    : [null],
          'SalEditTcs'    : [null],
          'SalEditStatus' : [1]
        }
      );

    this.SalEditName    = this.sal_edit.controls['SalEditName'];
    this.SalEditBasic   = this.sal_edit.controls['SalEditBasic'];
    this.SalEditConv    = this.sal_edit.controls['SalEditConv'];
    this.SalEditSA      = this.sal_edit.controls['SalEditSA'];
    this.SalEditTA      = this.sal_edit.controls['SalEditTA'];
    this.SalEditFA      = this.sal_edit.controls['SalEditFA'];
    this.SalEditEsi     = this.sal_edit.controls['SalEditEsi'];
    this.SalEditPf      = this.sal_edit.controls['SalEditPf'];
    this.SalEditTax     = this.sal_edit.controls['SalEditTax'];
    this.SalEditTcs     = this.sal_edit.controls['SalEditTcs'];

    this.sal_add = fb.group
      (
        {
          'created_by'  : [this.uid],
          'SalName'     : [null],
          'SalBasic'    : [null],
          'SalConv'     : [null],
          'SalSA'       : [null],
          'SalTA'       : [null],
          'SalFA'       : [null],
          'SalEsi'      : [null],
          'SalPf'       : [null],
          'SalTax'      : [null],
          'SalTcs'      : [null],
          'SalStatus'   : [1]
        }
      );

    this.SalName    = this.sal_add.controls['SalName'];
    this.SalBasic   = this.sal_add.controls['SalBasic'];
    this.SalConv    = this.sal_add.controls['SalConv'];
    this.SalSA      = this.sal_add.controls['SalSA'];
    this.SalTA      = this.sal_add.controls['SalTA'];
    this.SalFA      = this.sal_add.controls['SalFA'];
    this.SalEsi     = this.sal_add.controls['SalEsi'];
    this.SalPf      = this.sal_add.controls['SalPf'];
    this.SalTax     = this.sal_add.controls['SalTax'];
    this.SalTcs     = this.sal_add.controls['SalTcs'];

    this.editEmpDetails = fb.group
    ({
        'created_by'            : [this.uid],
        emp_id                  : [null],
        emp_name                : [null, Validators.compose([Validators.required])],
        emp_doj                 : [null, Validators.compose([Validators.required])],
        emp_designation         : [null, Validators.compose([Validators.required])],
        emp_pan                 : ['', Validators.compose([Validators.required ,Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")])],
        emp_aadhar              : [null, Validators.compose([Validators.required])],
        emp_status              : [null, Validators.compose([Validators.required])],
        emp_bank_account_no     : [null, Validators.compose([Validators.required])],
        emp_bank_name           : [null, Validators.compose([Validators.required])],
        emp_ifsc                : [null, Validators.compose([Validators.required])],
        emp_branch              : [null, Validators.compose([Validators.required])],
        emp_basic_salary        : [null, Validators.compose([Validators.required])],
        emp_portal_access       : [null, Validators.compose([Validators.required])],
        emp_father_guardianName : [null],
        emp_maritalStatus       : [null],
        emp_mobileNo            : [null],
        emp_dob                 : [null],
        emp_emailId             : [null],
        emp_password            : [null],
        emp_empRole             : [null],
        emp_empType             : [null],
        emp_esiNo               : [null],
        emp_pfNo                : [null, Validators.compose([Validators.pattern(/^[A-Z]{2}\/[A-Z]{3}\/\d{7}\/\d{3}\/\d{7}$/)])],
        emp_bank_access         : [null],
        emp_permenantAddress    : [null],
        emp_AddressForCommunication:[null],
        emp_jobLocation         : [null],
        emp_lastWorkingDay      : [null],
        emp_emergency_Con_Person  : [null],
        emp_emergency_Con_PersonNo: [null],
        emp_emergency_Con_PersonRelationship: [null],
        emp_salarygroup         : [null],
        emp_ot                  : [null],
        emp_qualification       : [null],
        emp_bloodgroup          : [null],
        emp_pl                  : [null],
        emp_cl                  : [null],
        emp_nationality         : [null],
        emp_uan                 : [null],
        emp_hra                 : new FormControl('', [Validators.required]),
        emp_allowance           : new FormControl('', [Validators.required]),
        emp_epf_amount          : new FormControl('', [Validators.required]),
        emp_professional_tax    : new FormControl('', [Validators.required]),
      })

      this.createBank_FG = fb.group
    ({
        'created_by'        : [this.uid],
        account_name        : [null],
        mode                : [3],
        opening_balance     : [0],
        type                : [1],
        status              : [1]
      })

    this.uploadDoc = fb.group
    ({
        name  : [],
        pan   : []
      })
  }

  ngOnInit()
  {
    this.loadData();
    this.emp_type();
  }

  fileChange(input)
  {
      const reader = new FileReader();
      if (input.files.length)
      {
          this.file = input.files[0].name;

      }
  }

  removeFile():void
  {
      this.file = '';
  }

  OpenSalGrp_edit()
  {
    this.SalGrp_Edit = this.modalService.open(this.edit_sal_group, { size: 'md' });
  }

  OpenSalGrp_add()
  {
    this.SalGrp_Add = this.modalService.open(this.add_sal_group, { size: 'md' });
  }

  uploadFiles()
  {
    this.Upl_emp_file = this.modalService.open(this.upload_emp_file, { size: 'md' });
  }

  uploadImg()
  {
    this.Upl_emp_img = this.modalService.open(this.upload_emp_img, { size: 'md' });
  }


  viewDoc(empid)
  {
    this.viewDocData(empid);
    this.View_emp_doc = this.modalService.open(this.view_emp_file, { size: 'lg'});
  }

  viewDocData(empid)
  {
    this.api.get('get_data.php?table=employee_file&find=emp_id&value=' +empid +'&authToken=' + environment.authToken).then((data: any) => {
      this.emp_file_view = data;
    }).catch(error => { this.toastrService.error('API Faild : viewDocData'); });
  }

  downloadMyFile(data : any)
  {
    this.fileURL = environment.baseURL+"download_file.php?path=upload/employee_files/"+data+"&authToken="+ environment.authToken;
    window.open(this.fileURL, '_blank');
  }

  async deleteFile(data)
  {
    await this.api.get('delete_data.php?authToken='+environment.authToken+'&table=employee_file&field=id&id='+data.id).then((data_rt: any) =>
    {
      if (data_rt.status == "success") { this.toastrService.success('Document Deleted Succesfully'); }
      else { this.toastrService.error(data_rt.status); }
      this.viewDocData(data.emp_id);
    }).catch(error => {this.toastrService.error('API Faild : deleteFile');});
  }

  async loadData()
  {
    await this.api.get('get_data.php?table=employee&authToken=' + environment.authToken).then((data: any) => {
      this.employee = data;
    }).catch(error => { this.toastrService.error('API Faild : loadData employee'); });

    // await this.api.get('get_data.php?table=salary_group&authToken=' + environment.authToken).then((data: any) => {
    //   this.salary_group = data;
    // }).catch(error => { this.toastrService.error('API Faild : loadData salary_group'); });

    await this.api.get('get_data.php?table=user_type&authToken=' + environment.authToken).then((data: any) => {
      this.user_type_list = data;
    }).catch(error => { this.toastrService.error('API Faild : loadData User type'); });


  }

  async emp_type()
  {
    await this.api.get('get_data.php?table=employee_type&find=status&value=1&authToken=' + environment.authToken).then((data: any) => {
      this.emp_type_list = data;
    }).catch(error => { this.toastrService.error('API Faild : loadData Employee type'); });
  }
  async onUpdate(data)
  {
    let id = this.SalGrpEdit['id'];
    let total = data.SalEditBasic+data.SalEditConv + data.SalEditSA +data.SalEditTA +data.SalEditFA+data.SalEditEsi+data.SalEditPf+data.SalEditTax+data.SalEditTcs;

    if(total == 100)
    {
        this.loading=true;
        await this.api.post('post_update_data.php?table=salary_group&field=id&value=' + id + '&authToken=' + environment.authToken, data).then((data_rt: any) => {
          if (data_rt.status == "success")
          {
            this.toastrService.success('salary group Updated Succesfully');
            this.loading=false;
          }
          else
          { this.toastrService.error(data_rt.status); }
          this.SalGrp_Edit.close();
          this.loadData();
          this.loading=false;
          return true;
        }).catch(error => {this.toastrService.error('API Faild : onUpdate');
        this.loading=false;});
      }
      else{
        this.toastrService.warning('Not Equal to 100%');
      }
  }
  get f()
  {
    return this.myForm.controls;
  }
  onFileChange(event:any)
  {
    if (event.target.files.length > 0)
    {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
      const fileSourceValue = this.myForm.get('fileSource')?.value;
    }
  }

  submitDoc(uploadDoc)
  {

  }

 async submit(data)
  {
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource')?.value);
    this.loading=true;
    if(this.myForm.valid)
    {
    // await  this.http.post("https://ppvserver.com/api/Athikalai_Bhakthi/ProfileImage?id=1", formData).subscribe(
    //     (response) => {
    //       console.log('Response from server:', response);
    //     },
    //     (error) => {
    //       console.error('Error occurred:', error);
    //     }
    //   );

    await  this.api.post('upload_file.php?user_id='+ this.emp_id+'&location=upload/employee_files/&table=employee_file&type='+data.type+'&file_name='+data.name+'&uid='+this.uid+'&authToken='+environment.authToken ,formData).then((data: any) =>
      {
        if(data.status == "success") { this.toastrService.success('Document Uploaded Succesfully');
        this.loading = false;
        this.Upl_emp_file.close();
        this.myForm.reset();
      }
        else { this.toastrService.error(data.status);
          this.loading=false; }
        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : Document Uploade');
          this.loading=false;
      });
    }
    else
    {
      this.toastrService.error('Fill the All Details');
      this.loading = false;
    }
  }

  async submitImg(data)
  {
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource')?.value);
    this.loading=true;
    await this.api.post('upload_file.php?mode=update&user_id='+ this.emp_id+'&location=upload/employee_images/&table=employee&authToken='+environment.authToken ,formData).then((data: any) =>
      {
        if(data.status == "success")
        {
          this.toastrService.success('Image Updated Succesfully');
          this.Upl_emp_img.close();
          this.myForm.reset();
          this.loading=false;
          this.employeeLoad(this.emp_id);
        }
        else { this.toastrService.error(data.status);
          this.loading=false;}
        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : Image Update');
          this.loading=false;
      });
  }

  async updateEmp(updateEmp)
  {
      this.SalEditConv    = this.sal_edit.controls['SalEditConv'];
      this.SalEditSA      = this.sal_edit.controls['SalEditSA'];
      this.SalEditTA      = this.sal_edit.controls['SalEditTA'];
      this.SalEditFA      = this.sal_edit.controls['SalEditFA'];
      this.SalEditEsi     = this.sal_edit.controls['SalEditEsi'];
      this.SalEditPf      = this.sal_edit.controls['SalEditPf'];
      this.SalEditTax     = this.sal_edit.controls['SalEditTax'];
      this.SalEditTcs     = this.sal_edit.controls['SalEditTcs'];

      this.updateEmployee = updateEmp;
      this.emp_id = updateEmp.emp_id

        this.loading=true;
          await this.api.post('post_update_data.php?authToken=' + environment.authToken + '&table=employee&field=emp_id&value=' + this.emp_id, this.updateEmployee).then((data: any) =>
          {
            console.log(data)
            if (data.status == "success")
            {
              this.toastrService.success('Employee Details Updated Succesfully');
              this.loading  = false;
              this.status   = true;
              this.dropdown = true;
              this.ngOnInit();
              this.employeeLoad(this.emp_id);
            }
            else {this.toastrService.error(data.status);
              this.loading=false;}
            return true;
          }).catch(error => {
            this.toastrService.error('API Faild : Update Employee');
            this.loading=false;
          });
  }

  async onInsert(data)
  {
        this.SalBasic    = this.sal_add.controls['SalBasic'];
        this.SalConv    = this.sal_add.controls['SalConv'];
        this.SalSA      = this.sal_add.controls['SalSA'];
        this.SalTA      = this.sal_add.controls['SalTA'];
        this.SalFA      = this.sal_add.controls['SalFA'];
        this.SalEsi     = this.sal_add.controls['SalEsi'];
        this.SalPf      = this.sal_add.controls['SalPf'];
        this.SalTax     = this.sal_add.controls['SalTax'];
        this.SalTcs     = this.sal_add.controls['SalTcs'];

        var total = data.SalBasic+data.SalConv + data.SalSA + data.SalFA + data.SalTA + data.SalEsi + data.SalPf + data.SalTax + data.SalTcs

        if(total == 100)
        {
            this.loading=true;
            await this.api.post('post_insert_data.php?table=salary_group&authToken=' + environment.authToken, data).then((data_rt: any) =>
            {
              if (data_rt.status == "success")
              {
                this.toastrService.success('salary added Succesfully');
                this.loading=false;
                }
              else { this.toastrService.error(data_rt.status);
                this.loading=false;}
              this.SalGrp_Add.close();
              this.loadData();
              return true;
            }).catch(error => {
              this.toastrService.error('API Faild : onInsert');
              this.loading=false;
            });
          }
          else{
            this.toastrService.warning('Not Equal to 100%');
          }
  }

  async onSubmit(employee)
  {
    console.log(employee);
    Object.keys(this.addEmployee.controls).forEach(field =>
    {
      const control = this.addEmployee.get(field);
      control.markAsTouched({ onlySelf: true });
    });

      if(this.addEmployee.valid)
      {
        this.loading = true;
        // if(employee['bank_access'] === true)
        // {
              this.createBank_FG.controls['account_name'].setValue(employee['empName']);
              await this.api.post('post_insert_data.php?table=bank&authToken=' + environment.authToken, this.createBank_FG.value).then((data: any) =>
              {
                if (data.status == "success")
                {
                  employee['bank_id'] = data.last_id;
                  this.addEmployee.controls['bank_id'].setValue(data.last_id);
                  this.call_api(employee);
                  this.loadData();
                  this.loading=false;
                }
                else { this.toastrService.error(data.status);
                  this.loading=false;}
                return true;
              }).catch(error => {
                this.toastrService.error('API Faild : Employee bank Creation');
                this.loading=false;
              });
            }
        // }
        // else
        // {
        //   employee['bank_id'] = 0;
        //   this.addEmployee.controls['bank_id'].setValue(0);
        //   this.call_api(employee);
        // }
  }

  async call_api(data)
  {
    if(this.addEmployee.valid)
    {
        this.loading=false;
        await this.api.post('post_insert_data.php?table=employee&authToken=' + environment.authToken, data).then((data: any) => {

          if (data.status == "success")
          {
            this.toastrService.success('Employee Added Succesfully');
            this.addEmployee.reset();
            this.loading=false;
            this.loadData();
          }
          else { this.toastrService.error(data.status);
            this.loading=false;}
          return true;
        }).catch(error => {
          this.toastrService.error('API Faild :Employee Added');
          this.loading=false;
        });
    }
    else
    {
      this.toastrService.error('Please Fill All Details');
    }
  }

  set_zero()
  {
    this.selected   = [];
    this.status     = false;
    this.show       = true;
  }

  CallSalEdit(event)
  {
    if (event.type === "click")
    {
      this.SalGrpEdit = event.row;

      this.sal_edit.controls['SalEditName'].setValue(this.SalGrpEdit['name']);
      this.sal_edit.controls['SalEditBasic'].setValue(this.SalGrpEdit['basic']);
      this.sal_edit.controls['SalEditConv'].setValue(this.SalGrpEdit['conveyance']);
      this.sal_edit.controls['SalEditSA'].setValue(this.SalGrpEdit['spl_allowance']);
      this.sal_edit.controls['SalEditTA'].setValue(this.SalGrpEdit['trl_allowance']);
      this.sal_edit.controls['SalEditFA'].setValue(this.SalGrpEdit['food_allowance']);
      this.sal_edit.controls['SalEditEsi'].setValue(this.SalGrpEdit['esi']);
      this.sal_edit.controls['SalEditPf'].setValue(this.SalGrpEdit['pf']);
      this.sal_edit.controls['SalEditTax'].setValue(this.SalGrpEdit['tax']);
      this.sal_edit.controls['SalEditTcs'].setValue(this.SalGrpEdit['tcs']);

      this.OpenSalGrp_edit();
    }
  }

  CallSalAdd(event)
  {
    if (event.type === "click")
    {
      this.SalGrpEdit = event.row;
      this.OpenSalGrp_add();
    }
  }


  async onActivate(event)
  {
    if (event.type === "click")
    {
      this.status      = true
      this.detail_view = event.row;
      let emp_id       = this.detail_view['emp_id'];

      await this.api.get('mp_employee_salary_transactions.php?emp_id=' + emp_id + '&authToken=' + environment.authToken).then((data: any) =>
      {
        if(data != null)
        {
              this.salary_details = data;
        }
        else{
          this.salary_details = null;
        }

      }).catch(error => { this.toastrService.error('API Faild : salary '); });

      await this.api.get('get_data.php?table=employee_file&find=emp_id&value=' + emp_id + '&authToken=' + environment.authToken).then((data: any) =>
      {
        if(data !== null)
        {
          this.fileURL = environment.baseURL+"download_file.php?path=upload/employee_images/"+data.source_name+"&authToken="+ environment.authToken;
        }
      }).catch(error => { this.toastrService.error('API Faild : employee_file'); });

     await this.employeeLoad(emp_id);
     await this.loadTranseaction()
     this.salary_transaction= null
     this.view = false;
    }
  }

  async employeeLoad(emp_id)
  {
    await this.api.get('mp_employee_view.php?id='+ emp_id +'&authToken=' + environment.authToken).then((data: any) =>
     {
      if(data != null)
      {
      this.employee_details     = data[0];


      this.emp_name                             = this.employee_details.name
      this.emp_doj                              = this.employee_details.doj
      this.emp_id                               = this.employee_details.emp_id
      this.emp_designation                      = this.employee_details.designation
      this.emp_pan                              = this.employee_details.pan
      this.emp_aadhar                           = this.employee_details.aadhar
      this.emp_status                           = this.employee_details.status
      this.emp_bank_account_no                  = this.employee_details.sal_bank_acc
      this.emp_bank_name                        = this.employee_details.sal_bank_name
      this.emp_ifsc                             = this.employee_details.sal_bank_ifsc
      this.emp_branch                           = this.employee_details.sal_bank_branch
      this.emp_basic_salary                     = this.employee_details.salary
      this.emp_portal_access                    = this.employee_details.portal_access
      this.emp_image                            = this.employee_details.image
      this.emp_father_guardianName              = this.employee_details.father_guardian_name
      this.emp_maritalStatus                    = this.employee_details.marital_status
      this.emp_mobileNo                         = this.employee_details.mobile_no
      this.emp_dob                              = this.employee_details.dob
      this.emp_emailId                          = this.employee_details.email_id
      this.emp_password                         = this.employee_details.password
      this.emp_empRole_id                       = this.employee_details.user_type_name
      this.emp_empRole                          = this.employee_details.user_type
      this.emp_empType_name                     = this.employee_details.emp_type_name
      this.emp_empType                          = this.employee_details.emp_type
      this.emp_esiNo                            = this.employee_details.esi_no
      this.emp_pfNo                             = this.employee_details.pf_no
      this.emp_salary                           = this.employee_details.salary
      this.emp_bank_access                      = this.employee_details.bank_access
      this.emp_userStatus                       = this.employee_details.status
      this.emp_permenantAddress                 = this.employee_details.permenent_address
      this.emp_AddressForCommunication           = this.employee_details.communication_address
      this.emp_jobLocation                      = this.employee_details.job_location
      this.emp_lastWorkingDay                   = this.employee_details.last_working_day
      this.emp_emergency_Con_Person             = this.employee_details.contact_person
      this.emp_emergency_Con_PersonNo           = this.employee_details.contact_personNo
      this.emp_emergency_Con_PersonRelationship = this.employee_details.contact_person_relationship
      this.img_path                             = environment.baseURL+"download_file.php?path=upload/employee_images/"+this.emp_image+"&authToken="+ environment.authToken;
      // this.emp_salaryGroup_name                 = this.employee_details.salary_group_name
      // this.emp_salaryGroup                      = this.employee_details.salary_group
      this.emp_ot                               = this.employee_details.ot
      this.emp_qualification                    = this.employee_details.edu_qualification
      this.emp_bloodgroup                       = this.employee_details.blood_group
      this.emp_pl                               = this.employee_details.pl_leave
      this.emp_cl                               = this.employee_details.com_off,
      this.emp_professional_tax                 = this.employee_details.professional_tax,
      this.emp_hra                              = this.employee_details.hra_amount,
      this.emp_allowance                        = this.employee_details.other_allowance,
      this.emp_epf_amount                       = this.employee_details.epf_amount,
      this.emp_uan                              = this.employee_details.uan,
      this.emp_designation_name                 = this.employee_details.designation_name
      }
      else
      {
         this.employee_details  =null;

      this.emp_name                             = null
      this.emp_doj                              = null
      this.emp_id                               = null
      this.emp_designation                      = null
      this.emp_pan                              = null
      this.emp_aadhar                           = null
      this.emp_status                           = null
      this.emp_bank_account_no                  = null
      this.emp_bank_name                        = null
      this.emp_ifsc                             = null
      this.emp_branch                           = null
      this.emp_basic_salary                     = null
      this.emp_portal_access                    = null
      this.emp_image                            = null
      this.emp_father_guardianName              = null
      this.emp_maritalStatus                    = null
      this.emp_mobileNo                         = null
      this.emp_dob                              = null
      this.emp_emailId                          = null
      this.emp_password                         = null
      this.emp_empRole_id                       = null
      this.emp_empRole                          = null
      this.emp_empType_name                     = null
      this.emp_empType                          = null
      this.emp_esiNo                            = null
      this.emp_pfNo                             = null
      this.emp_salary                           = null
      this.emp_bank_access                      = null
      this.emp_userStatus                       = null
      this.emp_permenantAddress                 = null
      this.emp_AddressForCommunication          = null
      this.emp_jobLocation                      = null
      this.emp_lastWorkingDay                   = null
      this.emp_emergency_Con_Person             = null
      this.emp_emergency_Con_PersonNo           = null
      this.emp_emergency_Con_PersonRelationship = null
      this.img_path                             = null
      this.emp_salaryGroup_name                 = null
      this.emp_salaryGroup                      = null
      this.emp_ot                               = null
      this.emp_qualification                    = null
      this.emp_bloodgroup                       = null
      this.emp_pl                               = null
      this.emp_cl                               = null
      }
    }).catch(error => { this.toastrService.error('API Faild : employeeLoad'); });
  }

  addEmp()
  {
    this.show = false;
  }

  editEmp()
  {
    this.status    = false;
    this.stateShow = false;
    this.dropdown  = false;
  }


 async viewSlip(event)
  {
    if (event.type === "click") {

    let id = event.row.payroll_id;
    console.log(event.row);
   await  this.api.get('get_data.php?table=salary_payment&find=payroll_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) =>
    {
      if(data != null)
      {
       this.salary_transaction = data;
       this.view = true;
       this.show = false;
      }
    }).catch(error => { this.toastrService.error('API Faild : salary transactions'); });
    }
  }

  cancel()
  {
    this.show    = true;
    this.status  = true;
    this.dropdown= true;
  }

  set_zero_1()
  {
    this.view = false;
    this.show = true;
  }

 async professional_tax_change()
  {
      await  this.api.get('single_field_update.php?table=employee&field=emp_id&value='+this.employee_details.emp_id+'&up_field=professional_tax&update='+this.emp_professional_tax+'&authToken='+environment.authToken).then((data: any) =>
              {
                console.log(data);
                if(data.status == "success")
                {
                  this.Perssional_tax_edit = false;
                  this.toastrService.success('Updated Succesfully');
                  this.employeeLoad(this.detail_view['emp_id']);

                }
                else { this.toastrService.error('Something went wrong : confirm');
                }
              }).catch(error =>
              {
              this.toastrService.error('API Faild : confirm');

              });
  }

  async epf_change()
  {
      await  this.api.get('single_field_update.php?table=employee&field=emp_id&value='+this.employee_details.emp_id+'&up_field=epf_amount&update='+this.emp_epf_amount+'&authToken='+environment.authToken).then((data: any) =>
              {
                console.log(data);
                if(data.status == "success")
                {
                  this.EPF_edit = false;
                  this.toastrService.success('Updated Succesfully');
                  this.employeeLoad(this.detail_view['emp_id']);

                }
                else { this.toastrService.error('Something went wrong : confirm');
                }
              }).catch(error =>
              {
              this.toastrService.error('API Faild : confirm');

              });
  }


 async loadTranseaction()
    {
      await this.api.get('get_data.php?table=bank&find=bank_id&value='+this.detail_view['bank_id']+'&authToken=' + environment.authToken).then((data: any) =>
            {
              this.bank_details = data[0];
            }).catch(error => {
              this.toastrService.error('API Faild : load edit Account ');
              this.selected = [];
            });
        await  this.api.get('bank_transaction_list.php?value='+this.detail_view['bank_id']+'&authToken=' + environment.authToken).then((data: any) =>
          {
            this.transeaction_det = data;
            if(data != null)
            this.filter= [...data];
          }).catch(error => {this.toastrService.error('API Faild : loadTranseaction');});
    }

    FilterLoan(event: any)
    {
      const val = event.target.value.toLowerCase();

    const temp = this.filter.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });

      this.transeaction_det = temp;
      this.table.offset = 0;
    }

     formattedInput: string = '';

  formatInput(event: any): void {
    let input = event.target as HTMLInputElement;
    let value = input.value || '';

    // 💡 Correct regex and formatting
    value = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      // Ensure the value is a string and strip out non-alphanumeric characters
    value = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    console.log(value);

    // Limit the length to 22 characters (AA/XXX/1234567/123/7654321)
    if (value.length > 22) {
      value = value.substring(0, 22);
    }
    let formatted = '';

    // Apply the specific format AA/XXX/1234567/123/7654321
    if (value.length > 1) formatted += value.substring(0, 2) + '/'; // Add first slash
    if (value.length > 3) formatted += value.substring(2, 5) + '/'; // Add second slash
    if (value.length > 10) formatted += value.substring(5, 12) + '/'; // Add third slash
    if (value.length > 15) formatted += value.substring(12, 15) + '/'; // Add fourth slash
    if (value.length > 18) formatted += value.substring(15, 22); // Add last part (no slash needed)

    this.formattedInput = formatted; // Update the input field with formatted value
  }

    formatInput_edit(event: any): void {
    let input = event.target as HTMLInputElement;
    let value = input.value || '';

    // 💡 Correct regex and formatting
    value = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      // Ensure the value is a string and strip out non-alphanumeric characters
    value = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    console.log(value);

    // Limit the length to 22 characters (AA/XXX/1234567/123/7654321)
    if (value.length > 22) {
      value = value.substring(0, 22);
    }
    let formatted = '';

    // Apply the specific format AA/XXX/1234567/123/7654321
    if (value.length > 1) formatted += value.substring(0, 2) + '/'; // Add first slash
    if (value.length > 3) formatted += value.substring(2, 5) + '/'; // Add second slash
    if (value.length > 10) formatted += value.substring(5, 12) + '/'; // Add third slash
    if (value.length > 15) formatted += value.substring(12, 15) + '/'; // Add fourth slash
    if (value.length > 18) formatted += value.substring(15, 22); // Add last part (no slash needed)

    this.emp_pfNo = formatted; // Update the input field with formatted value
  }
}
