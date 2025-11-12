import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation,Input,Output,EventEmitter } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment.prod';
import { FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector     : 'az-invoice',
  encapsulation: ViewEncapsulation.None,
  templateUrl  : './attendance.component.html',
  styleUrls    : ['./attendance.component.scss'],
  providers    : [DatePipe]
})

export class AttendanceComponent implements OnInit
{
  @Input() list:any[];

  @Output() shareCheckedList = new EventEmitter();
  @Output() shareIndividualCheckedList = new EventEmitter();
  employee               : any;
  modaladdatt            : any;
  modaleditatt           : any;
  Today_Date             : any;
  select_date_value      : any;
  edit_att_value         : any;
  edit_att_value_id      : any;
  employee_list          : any;
  Admin_employee_list    : any;
  days                   : any;
  com_off_data           : any;
  length                 : any;
  employee_data          : any;
  emp_type_list          : any;
  employee_type          : any;
  checkedList            : any[];
  currentSelected : {};
  selected               = [];
  add_options            = [];
  att_list               = [];
  att_post               = [];
  att_window             = 0;
  designation            :any
  public uid             = localStorage.getItem('uid');
  public user_type       = localStorage.getItem('type');
  public router          : Router;
  public form_date       : FormGroup;
  public form_att        : FormGroup;
  public form_att_edit   : FormGroup;
  public date_form       : FormGroup;
  public com_off         : FormGroup;
  public emp_id          : number;
  public date_val        : AbstractControl;

  public att_val_hr      : AbstractControl;
  public att_val_ot      : AbstractControl;
  public att_val_pl      : AbstractControl;
  public att_val_sl      : AbstractControl;
  public att_val_cl      : AbstractControl;
  public att_notes       : AbstractControl;

  public att_edit_val_ot : AbstractControl;
  public att_edit_val_hr : AbstractControl;
  public att_edit_val_pl : AbstractControl;
  public att_edit_val_sl : AbstractControl;
  public att_edit_val_cl : AbstractControl;
  public att_edit_notes  : AbstractControl;
  public loading         : boolean=false;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild("add_att",{static:true})  add_att :ElementRef;
  @ViewChild("edit_att",{static:true}) edit_att:ElementRef;
  @ViewChild("addcom_off",{static:true}) addcom_off:ElementRef;
  @ViewChild("addpaid_laeve",{static:true}) addpaid_laeve:ElementRef;

  constructor(private modalService: NgbModal, public api: ApiService, private datePipe: DatePipe, public toastrService: ToastrService, fb:FormBuilder, router:Router)
  {
    let date = new Date();
    let d    = date.getDate();
    let m    = date.getMonth();
    let y    = date.getFullYear();

    this.checkedList = [];
    this.Today_Date = this.datePipe.transform(date, 'yyyy-MM-dd', 'en_US');

    // const today = new Date();
    // let date = today.toISOString().split('T')[0];
    this.router    = router;
    this.form_date = fb.group
    (
      {
        'date_val'  : [this.Today_Date, Validators.compose([Validators.required,])]
      }
    );
    this.date_val  = this.form_date.controls['date_val'];


    this.form_att = fb.group
    (
      {
        'att_val_hr'  : ['', Validators.compose([Validators.required,Validators.min(0), Validators.max(8)])],
        'att_val_ot'  : [0,Validators.compose([Validators.min(0), Validators.max(24)])],
        'att_val_pl'  : [0,Validators.compose([Validators.min(0), Validators.max(8)])],
        'att_val_sl'  : [0],
        'att_val_cl'  : [0,Validators.compose([Validators.min(0), Validators.max(8)])],
        'att_notes'   : [null],
      }
    );
    this.att_val_hr          = this.form_att.controls['att_val_hr'];
    this.att_val_ot          = this.form_att.controls['att_val_ot'];
    this.att_val_pl          = this.form_att.controls['att_val_pl'];
    this.att_val_sl          = this.form_att.controls['att_val_sl'];
    this.att_val_cl          = this.form_att.controls['att_val_cl'];
    this.att_notes           = this.form_att.controls['att_notes'];

    this.form_att_edit = fb.group
    (
      {
        'att_edit_val_hr'   : ['',Validators.compose([Validators.required,Validators.min(0), Validators.max(8)])],
        'att_edit_val_ot'   : [0,Validators.compose([Validators.min(0), Validators.max(24)])],
        'att_edit_val_pl'   : [0,Validators.compose([Validators.min(0), Validators.max(8)])],
        'att_edit_val_sl'   : [null],
        'att_edit_val_cl'   : [0,Validators.compose([Validators.min(0), Validators.max(8)])],
        'att_edit_notes'    : [null],
      }
    );
    this.att_edit_val_hr    = this.form_att_edit.controls['att_edit_val_hr'];
    this.att_edit_val_ot    = this.form_att_edit.controls['att_edit_val_ot'];
    this.att_edit_val_pl    = this.form_att_edit.controls['att_edit_val_pl'];
    this.att_edit_val_sl    = this.form_att_edit.controls['att_edit_val_sl'];
    this.att_edit_val_cl    = this.form_att_edit.controls['att_edit_val_cl'];
    this.att_edit_notes     = this.form_att_edit.controls['att_edit_notes'];

    this.com_off  = fb.group
    ({
      total_days : [null],
      emp_list   : fb.array([])
    })
  };

  ngOnInit(): void
  {
    this.api.get('get_data.php?table=employee&authToken='+environment.authToken).then((data: any) =>
    {
      this.employee_list = data;
      this.Admin_employee_list = this.employee_list.filter(d => d.emp_type == 2)
      console.log(this.Admin_employee_list)
    }).catch(error => {this.toastrService.error('Something went wrong');
    this.loading=false;});
    this.emp_type();
  }

   async emp_type()
  {
    await this.api.get('get_data.php?table=employee_type&find=status&value=1&authToken=' + environment.authToken).then((data: any) => {
      this.emp_type_list = data;

    }).catch(error => { this.toastrService.error('API Faild : loadData Employee type'); });
  }

  onActivate(event)
  {
    if(event.type === "click")
    {
      console.log("on click : ",event.row)
      this.employee = event.row.emp_id;
      this.employee_data = this.employee_list.find(e => e.emp_id == event.row.emp_id);
      console.log(" employee_data",this.employee_data)
       console.log("emp_type_list",this.emp_type_list)
      const employee_type = this.emp_type_list.find(e => e.id == this.employee_data.emp_type);
      this.employee_type = employee_type.type;
      console.log(" employee_type",employee_type.type)
        this.form_att.controls['att_val_ot'].setValue(0)
        this.form_att.controls['att_val_cl'].setValue(0)
         this.form_att.controls['att_val_hr'].setValue(0)
          this.form_att.controls['att_val_pl'].setValue(0)

      if(event.row.att_hr == "Not Found" && event.row.att_ot == "Not Found")
      {
        this.call_add();
      }
      else
      {
        if (this.user_type == "super_admin")
        {
          this.call_edit();
        }
        else
        {
          this.toastrService.error('Already Attendance Added!');
        }
      }
    }
  }

  call_add()
  {
     this.openSm();
  }

  async call_edit()
  {
    let status;
    await this.api.get('get_data.php?table=attendance&find=emp_id&value='+this.employee+'&find1=for_date&value1='+this.select_date_value+'&authToken='+environment.authToken).then((data: any) =>
      {
        this.edit_att_value_id = data[0].id;
        status = data[0].status;
        console.log(data[0])
        this.form_att_edit.controls['att_edit_val_hr'].setValue(data[0].hours);
        this.form_att_edit.controls['att_edit_val_ot'].setValue(data[0].ot);
        this.form_att_edit.controls['att_edit_val_pl'].setValue(data[0].pl);
        this.form_att_edit.controls['att_edit_val_sl'].setValue(data[0].sl);
        this.form_att_edit.controls['att_edit_val_cl'].setValue(data[0].cl);
        this.form_att_edit.controls['att_edit_notes'].setValue(data[0].notes);

        this.att_window = 1;
      }).catch(error => {this.toastrService.error('Something went wrong');});
      if (status === 0)
      {
        this.openSm1();
      }
      else
      {
        this.toastrService.error('Sorry, Salary Generated for this Attendance');
      }
  }

  openSm()
  {
    this.modaladdatt = this.modalService.open(this.add_att, { size: 'md'});
  }
  openSm1()
  {
    this.modaleditatt = this.modalService.open(this.edit_att, { size: 'md'});
  }

  onSubmit_date(data)
  {

    this.select_date_value = data.date_val;
    if(this.form_date.valid)
    {
      if(this.Today_Date < this.select_date_value)
      {
        this.toastrService.error('Future date cannot be called !');
        this.att_window = 0;
      }
      else
      {
        this.loading=true;
        this.api.get('mp_attendance.php?date='+data.date_val+'&authToken='+environment.authToken).then((data: any) =>
        {
          this.att_list   = data;
          this.att_window = 1;
          this.loading=false;
        }).catch(error => {this.toastrService.error('Something went wrong');
        this.loading=false;});
      }
    }
    else{this.toastrService.error('Select date');
    this.loading=false;};
  }

  async onSubmit(data)
  {
    data.created_by = this.uid;
    data.emp_id     = this.employee;
    data.date_val   = this.select_date_value;

    Object.keys(this.form_att.controls).forEach(field =>
      {
        const control = this.form_att.get(field);
        control.markAsTouched({ onlySelf: true });
      });

    if(this.form_att.valid)
    {
        const hours   = Number(this.form_att.controls['att_val_hr'].value) || 0;
        const ot      = Number(this.form_att.controls['att_val_ot'].value) || 0;
        const leave   = Number(this.form_att.controls['att_val_pl'].value) || 0;
        const com_off = Number(this.form_att.controls['att_val_cl'].value) || 0;
        let valid = false;
            if (this.employee_type != 'Admin') {
                valid = (hours + leave === 8);
              if (!valid) {
                this.toastrService.error('Attendance (Leave + Hours) 8 Hours');
                return;
              }
            } else {
            valid = (hours + leave + com_off === 8);
            if (!valid) {
              this.toastrService.error('Attendance (Leave + Hours + Com-off) 8 Hours');
              return;
            }
          }
            console.log(valid)
            this.loading    = true;
            await this.api.post('post_insert_data.php?table=attendance&authToken='+environment.authToken,data).then((data_rt: any) =>
            {
              if(data_rt.status == "success") { this.toastrService.success('Attendance Added Succesfully');
                this.loading=false;}
              else { this.toastrService.error('Something went wrong ');
              this.loading=false;}
              this.onSubmit_date(data);
              this.form_att.controls['att_val_hr'].setValue(null);
              this.form_att.controls['att_val_ot'].setValue(0);
              this.form_att.controls['att_val_pl'].setValue(0);
              this.form_att.controls['att_val_sl'].setValue(0);
              this.form_att.controls['att_val_cl'].setValue(0);
              this.form_att.controls['att_notes'].setValue(null);
              this.modaladdatt.close();
              return true;
            }).catch(error =>
            {
                this.toastrService.error('Something went wrong ');
                this.loading=false;
            });
          }
    else{
      this.toastrService.error('Fill the Attendance ');
    }
 }

  async onUpdate(data)
  {
    data.created_by = this.uid;
    data.emp_id     = this.employee;
    data.date_val   = this.select_date_value;
      const hours   = Number(this.form_att_edit.controls['att_edit_val_hr'].value) || 0;
      const ot      = Number(this.form_att_edit.controls['att_edit_val_ot'].value) || 0;
      const leave   = Number(this.form_att_edit.controls['att_edit_val_pl'].value) || 0;
      const com_off = Number(this.form_att_edit.controls['att_edit_val_cl'].value) || 0;
        let valid = false;
            if (this.employee_type != 'Admin') {
                valid = (hours + leave === 8);
              if (!valid) {
                this.toastrService.error('Attendance (Leave + Hours) 8 Hours');
                return;
              }
            } else {
            valid = (hours + leave + com_off === 8);
            if (!valid) {
              this.toastrService.error('Attendance (Leave + Hours + Com-off) 8 Hours');
              return;
            }
          }
            console.log(valid)

        const confirmed = confirm("Do you want to proceed with the update?");
       console.log(confirmed)
      if (!confirmed) {
          //  this.modaleditatt.close();
        return;
      }
      this.loading    =true;
      await this.api.post('post_update_data.php?table=attendance&field=id&value='+this.edit_att_value_id+'&authToken='+environment.authToken,data).then((data_rt: any) =>
      {
        if(data_rt.status == "success") { this.toastrService.success('Attendance Updated Succesfully');
          this.loading=false;}
        else { this.toastrService.error('Something went wrong');
        this.loading=false;}
        this.modaleditatt.close();
        this.onSubmit_date(data);
        this.form_att_edit.controls['att_edit_val_hr'].reset();
        this.form_att_edit.controls['att_edit_val_ot'].reset();
        this.form_att_edit.controls['att_edit_val_pl'].reset();
        this.form_att_edit.controls['att_edit_val_sl'].reset();
        this.form_att_edit.controls['att_edit_val_cl'].reset();
        this.form_att_edit.controls['att_edit_notes'].reset();
        return true;
      }).catch(error =>
      {
          this.toastrService.error('Something went wrong');
          this.loading=false;
      });
   }


  WorkingHours() {
      const hours   = Number(this.form_att.controls['att_val_hr'].value) || 0;
      const ot      = Number(this.form_att.controls['att_val_ot'].value) || 0;
      const leave   = Number(this.form_att.controls['att_val_pl'].value) || 0;
      const com_off = Number(this.form_att.controls['att_val_cl'].value) || 0;

      console.log("att_edit_val_hr:", hours);
      console.log("att_edit_val_ot:", ot);
      console.log("att_edit_val_pl:", leave);
      console.log("att_edit_val_cl:", com_off);

      // Rule 1: Working hours max 8
      if (hours > 8) {
        this.form_att.controls['att_val_hr'].setValue(8);
        alert("Working hours cannot exceed 8!");
        return;
      }

      // Rule 2: Leave hours max 8
      if (leave > 8) {
        this.form_att.controls['att_val_pl'].setValue(8);
        alert("Leave hours cannot exceed 8!");
        return;
      }

      // Rule 3: Comp Off max 8
      if (com_off > 8) {
        this.form_att.controls['att_val_cl'].setValue(8);
        alert("Comp Off hours cannot exceed 8!");
        return;
      }

      // Rule 4: Leave + Working ≤ 8
      if (hours + leave > 8 && this.employee_type != 'Admin') {
        const allowed = Math.max(0, 8 - hours );
        if(allowed+hours+ot <= 24)
        {
        this.form_att.controls['att_val_pl'].setValue(allowed);
        }
         if(allowed+hours+ot > 24)
        {
            this.form_att.controls['att_val_hr'].setValue(0);
            if(ot>16)
            {
               this.form_att.controls['att_val_ot'].setValue(16);
            }
        }
        alert("Leave + Working hours  cannot exceed 8!");
        return;
      }

       if (hours + leave + com_off > 8 && this.employee_type == 'Admin') {
        const allowed = Math.max(0, 8 - (leave + com_off));
        alert("Leave + Working hours + com-off cannot exceed 8!");
           this.form_att.controls['att_val_hr'].setValue(allowed);
        return;
      }
      // Rule 5: No negatives
      if (hours < 0 || ot < 0 || leave < 0 || com_off < 0) {
        this.form_att.controls['att_val_hr'].setValue(0);
        this.form_att.controls['att_val_ot'].setValue(0);
        this.form_att.controls['att_val_pl'].setValue(0);
        this.form_att.controls['att_val_cl'].setValue(0);
        alert("Hours cannot be negative!");
        return;
      }

      // Rule 6: Total must not exceed 24
      const total = hours + ot + leave + com_off;
      if (total > 24) {
        const allowed = Math.max(0, 24 - (hours + leave + com_off));
       if(this.employee_type != 'Admin')
        {
          this.form_att.controls['att_val_ot'].setValue(allowed);
        }

        alert("Total hours (working + OT + leave + comp off) cannot exceed 24!");
        return;
      }

      // Optional: Auto-balance OT if it exceeds remaining hours
      // const balance = 24 - (hours + leave + com_off);
      // if (ot > balance) {
      //   if(this.employee_type != 'Admin')
      //   {
      //     this.form_att.controls['att_val_ot'].setValue(balance);
      //   }

      // }
    }

    WorkingHoursEdit() {
      const hours   = Number(this.form_att_edit.controls['att_edit_val_hr'].value) || 0;
      const ot      = Number(this.form_att_edit.controls['att_edit_val_ot'].value) || 0;
      const leave   = Number(this.form_att_edit.controls['att_edit_val_pl'].value) || 0;
      const com_off = Number(this.form_att_edit.controls['att_edit_val_cl'].value) || 0;

      console.log("att_edit_val_hr:", hours);
      console.log("att_edit_val_ot:", ot);
      console.log("att_edit_val_pl:", leave);
      console.log("att_edit_val_cl:", com_off);

      // Rule 1: Working hours max 8
      if (hours > 8) {
        this.form_att_edit.controls['att_edit_val_hr'].setValue(8);
        alert("Working hours cannot exceed 8!");
        return;
      }

      // Rule 2: Leave hours max 8
      if (leave > 8) {
        this.form_att_edit.controls['att_edit_val_pl'].setValue(8);
        alert("Leave hours cannot exceed 8!");
        return;
      }

      // Rule 3: Comp Off max 8
      if (com_off > 8) {
        this.form_att_edit.controls['att_edit_val_cl'].setValue(8);
        alert("Comp Off hours cannot exceed 8!");
        return;
      }

      // Rule 4: Leave + Working ≤ 8
      if (hours + leave > 8 && this.employee_type != 'Admin') {
        const allowedLeave = Math.max(0, 8 - hours);
         if(allowedLeave+hours+ot <= 24)
        {
         this.form_att_edit.controls['att_edit_val_pl'].setValue(allowedLeave);
        }
         if(allowedLeave+hours+ot > 24)
        {
            this.form_att_edit.controls['att_edit_val_hr'].setValue(0);
            if(ot>16)
            {
               this.form_att_edit.controls['att_edit_val_ot'].setValue(16);
            }
        }
        alert("Leave + Working hours  cannot exceed 8!");
        return;
      }

       if (hours + leave + com_off > 8 && this.employee_type == 'Admin') {
        const allowedhours = Math.max(0, 8 - (leave + com_off));
        alert("Leave + Working hours + com-off cannot exceed 8!");
           this.form_att_edit.controls['att_edit_val_hr'].setValue(allowedhours);
        return;
      }
      // Rule 5: No negatives
      if (hours < 0 || ot < 0 || leave < 0 || com_off < 0) {
        this.form_att_edit.controls['att_edit_val_hr'].setValue(0);
        this.form_att_edit.controls['att_edit_val_ot'].setValue(0);
        this.form_att_edit.controls['att_edit_val_pl'].setValue(0);
        this.form_att_edit.controls['att_edit_val_cl'].setValue(0);
        alert("Hours cannot be negative!");
        return;
      }

      // Rule 6: Total must not exceed 24
      const total = hours + ot + leave + com_off;
      if (total > 24) {
        const allowed = Math.max(0, 24 - (hours + leave + com_off));
       if(this.employee_type != 'Admin')
        {
          this.form_att_edit.controls['att_edit_val_ot'].setValue(allowed);
        }

        alert("Total hours (working + OT + leave + comp off) cannot exceed 24!");
        return;
      }

      // Optional: Auto-balance OT if it exceeds remaining hours
      // const balance = 24 - (hours + leave + com_off);
      // if (ot > balance) {
      //   if(this.employee_type != 'Admin')
      //   {
      //     this.form_att_edit.controls['att_edit_val_ot'].setValue(balance);
      //   }

      // }
    }

    WorkingOT()
    {
        const hours   = Number(this.form_att.controls['att_val_hr'].value) || 0;
      const ot      = Number(this.form_att.controls['att_val_ot'].value) || 0;
      const leave   = Number(this.form_att.controls['att_val_pl'].value) || 0;
      // const com_off = Number(this.form_att.controls['att_val_cl'].value) || 0;

      console.log("att_edit_val_hr:", hours);
      console.log("att_edit_val_ot:", ot);
      console.log("att_edit_val_pl:", leave);
      // console.log("att_edit_val_cl:", com_off);

      // Rule 1: Working hours max 8
      if (hours > 8) {
        this.form_att.controls['att_val_hr'].setValue(8);
        alert("Working hours cannot exceed 8!");
        return;
      }

      // Rule 2: Leave hours max 8
      if (leave > 8) {
        this.form_att.controls['att_val_pl'].setValue(8);
        alert("Leave hours cannot exceed 8!");
        return;
      }

       if (hours + leave > 8) {
        const allowedLeave = Math.max(0, 8 - hours );
        this.form_att.controls['att_val_pl'].setValue(allowedLeave);
        alert("Leave + Working hours cannot exceed 8!");
        return;
      }

       const total = hours + ot + leave ;
      if (total > 24) {
        const allowedOT = Math.max(0, 24 - (hours+ leave));
        this.form_att.controls['att_val_ot'].setValue(allowedOT);
        alert("Total hours (working + OT + leave + comp off) cannot exceed 24!");
        return;
      }

      //  const balance = 24 - (hours + leave);
      // if ( ot + balance <= 24) {
      //   if(this.employee_type != 'Admin')
      //   {
      //     this.form_att.controls['att_val_ot'].setValue(balance);
      //   }

      // }
    }


      WorkingOTEdit()
    {
        const hours   = Number(this.form_att_edit.controls['att_edit_val_hr'].value) || 0;
      const ot      = Number(this.form_att_edit.controls['att_edit_val_ot'].value) || 0;
      const leave   = Number(this.form_att_edit.controls['att_edit_val_pl'].value) || 0;
      // const com_off = Number(this.form_att.controls['att_val_cl'].value) || 0;

      console.log("att_edit_val_hr:", hours);
      console.log("att_edit_val_ot:", ot);
      console.log("att_edit_val_pl:", leave);
      // console.log("att_edit_val_cl:", com_off);

      // Rule 1: Working hours max 8
      if (hours > 8) {
        this.form_att_edit.controls['att_edit_val_hr'].setValue(8);
        alert("Working hours cannot exceed 8!");
        return;
      }

      // Rule 2: Leave hours max 8
      if (leave > 8) {
        this.form_att_edit.controls['att_edit_val_pl'].setValue(8);
        alert("Leave hours cannot exceed 8!");
        return;
      }
       if (hours + leave > 8) {
        const allowedLeave = Math.max(0, 8 - hours);
        this.form_att_edit.controls['att_edit_val_pl'].setValue(allowedLeave);
        alert("Leave + Working hours cannot exceed 8!");
        return;
      }

       const total = hours + ot + leave ;
      if (total > 24) {
        const allowedOT = Math.max(0, 24 - (hours + leave ));
        this.form_att_edit.controls['att_edit_val_ot'].setValue(allowedOT);
        alert("Total hours (working + OT + leave + comp off) cannot exceed 24!");
        return;
      }

      //  const balance = 24 - (hours + leave);
      // if (ot > balance) {
      //   if(this.employee_type != 'Admin')
      //   {
      //     this.form_att_edit.controls['att_edit_val_ot'].setValue(balance);
      //   }

      // }
    }

     LeaveCalculate()
    {
        const hours   = Number(this.form_att.controls['att_val_hr'].value) || 0;
      const ot      = Number(this.form_att.controls['att_val_ot'].value) || 0;
      const leave   = Number(this.form_att.controls['att_val_pl'].value) || 0;
      const com_off = Number(this.form_att.controls['att_val_cl'].value) || 0;
      const total = hours + ot + leave + com_off ;
      console.log("att_edit_val_hr:", hours);
      console.log("att_edit_val_ot:", ot);
      console.log("att_edit_val_pl:", leave);
      // console.log("att_edit_val_cl:", com_off);

      // Rule 1: Working hours max 8
      if (hours > 8) {
        this.form_att.controls['att_val_hr'].setValue(8);
        alert("Working hours cannot exceed 8!");
        return;
      }

      // Rule 2: Leave hours max 8
      if (leave > 8) {
        this.form_att.controls['att_val_pl'].setValue(8);
        alert("Leave hours cannot exceed 8!");
        return;
      }



       if (hours + leave > 8 && this.employee_type != 'Admin') {
        const allowedLeave = Math.max(0, 8 - leave);
        if(allowedLeave+leave+ot <= 24)
        {
            this.form_att.controls['att_val_hr'].setValue(allowedLeave);
        }
        if(allowedLeave+leave+ot > 24)
        {
            this.form_att.controls['att_val_hr'].setValue(0);
            if(ot>16)
            {
               this.form_att.controls['att_val_ot'].setValue(16);
            }
        }
        alert("Leave + Working hours cannot exceed 8!");
        return;
      }

      if (hours + leave + com_off > 8 && this.employee_type == 'Admin') {
              const allowedLeave = Math.max(0, 8 - (hours+com_off));
              console.log("Leave add hours+com_off ",allowedLeave)
             alert("Leave + Working hours + com-off cannot exceed 8!");
                this.form_att.controls['att_val_pl'].setValue(allowedLeave);
              return;
            }



      if (total > 24 && this.employee_type != 'Admin') {
        const allowed = Math.max(0, 24 - (hours + leave ));
          this.form_att.controls['att_val_ot'].setValue(allowed);
        alert("Total hours (working + OT + leave + comp off) cannot exceed 24!");
        return;
      }

       if (total > 8 && this.employee_type == 'Admin') {
          const allowed = Math.max(0, 8 - (hours + com_off ));
          console.log("Leave add admin",allowed)
          this.form_att.controls['att_val_pl'].setValue(allowed);
         alert("Total hours (working + OT + leave + comp off) cannot exceed 8!");
         return;
      }

      //  const balance = 24 - (hours + leave);
      // if (ot > balance && this.employee_type != 'Admin') {
      //   this.form_att.controls['att_val_ot'].setValue(balance);
      // }
    }


     LeaveCalculateEdit()
    {
        const hours   = Number(this.form_att_edit.controls['att_edit_val_hr'].value) || 0;
      const ot      = Number(this.form_att_edit.controls['att_edit_val_ot'].value) || 0;
      const leave   = Number(this.form_att_edit.controls['att_edit_val_pl'].value) || 0;
      const com_off = Number(this.form_att_edit.controls['att_edit_val_cl'].value) || 0;

      console.log("att_edit_val_hr:", hours);
      console.log("att_edit_val_ot:", ot);
      console.log("att_edit_val_pl:", leave);
      // console.log("att_edit_val_cl:", com_off);

      // Rule 1: Working hours max 8
      if (hours > 8) {
        this.form_att_edit.controls['att_edit_val_hr'].setValue(8);
        alert("Working hours cannot exceed 8!");
        return;
      }

      // Rule 2: Leave hours max 8
      if (leave > 8) {
        this.form_att_edit.controls['att_edit_val_pl'].setValue(8);
        alert("Leave hours cannot exceed 8!");
        return;
      }



       if (hours + leave > 8 && this.employee_type != 'Admin') {
        const allowedLeave = Math.max(0, 8 - leave);
        if(allowedLeave + leave + ot <= 24)
        {
          this.form_att_edit.controls['att_edit_val_hr'].setValue(allowedLeave);
        }
        if(allowedLeave+leave+ot > 24)
        {
            this.form_att.controls['att_val_hr'].setValue(0);
        }
        alert("Leave + Working hours cannot exceed 8!");
        return;
      }

      if (hours + leave + com_off > 8 && this.employee_type == 'Admin') {
              const allowedLeave = Math.max(0, 8 - (hours+com_off));
             alert("Leave + Working hours + com-off cannot exceed 8!");
                this.form_att_edit.controls['att_edit_val_pl'].setValue(allowedLeave);
              return;
            }

       const total = hours + ot + leave + com_off ;

      if (total > 24 && this.employee_type != 'Admin') {
        const allowed = Math.max(0, 24 - (hours + leave ));

          this.form_att_edit.controls['att_edit_val_ot'].setValue(allowed);

        alert("Total hours (working + OT + leave + comp off) cannot exceed 24!");
        return;
      }


      if (total > 8 && this.employee_type == 'Admin') {
        const allowed = Math.max(0, 8 - (hours + com_off ));
          this.form_att_edit.controls['att_edit_val_pl'].setValue(allowed);
        alert("Total hours (working + OT + leave + comp off) cannot exceed 8!");
        return;
      }


      //  const balance = 24 - (hours + leave);
      // if (ot > balance) {
      //    if (ot > balance && this.employee_type != 'Admin') {
      //            this.form_att_edit.controls['att_edit_val_ot'].setValue(balance);
      //    }
      // }
    }


     ComoffCalculate()
    {
        const hours   = Number(this.form_att.controls['att_val_hr'].value) || 0;
      // const ot      = Number(this.form_att.controls['att_val_ot'].value) || 0;
      const leave   = Number(this.form_att.controls['att_val_pl'].value) || 0;
      const com_off = Number(this.form_att.controls['att_val_cl'].value) || 0;

      console.log("att_edit_val_hr:", hours);
      // console.log("att_edit_val_ot:", ot);
      console.log("att_edit_val_pl:", leave);
      console.log("att_edit_val_cl:", com_off);

      // Rule 1: Working hours max 8
      if (hours > 8) {
        this.form_att.controls['att_val_hr'].setValue(8);
        alert("Working hours cannot exceed 8!");
        return;
      }

      // Rule 2: Leave hours max 8
      if (leave > 8) {
        this.form_att.controls['att_val_pl'].setValue(8);
        alert("Leave hours cannot exceed 8!");
        return;
      }

      if (com_off > 8) {
        this.form_att.controls['att_val_cl'].setValue(8);
        alert("Leave hours cannot exceed 8!");
        return;
      }
       if (hours + leave + com_off > 8) {
         const allowed = Math.max(0, 8 - (hours + leave ));
        alert("Leave + Working hours + com-off cannot exceed 8!");
          this.form_att.controls['att_val_cl'].setValue(allowed);
        return;
      }

    }

        ComoffCalculateEdit()
    {
        const hours   = Number(this.form_att_edit.controls['att_edit_val_hr'].value) || 0;
      // const ot      = Number(this.form_att.controls['att_val_ot'].value) || 0;
      const leave   = Number(this.form_att_edit.controls['att_edit_val_pl'].value) || 0;
      const com_off = Number(this.form_att_edit.controls['att_edit_val_cl'].value) || 0;

      console.log("att_edit_val_hr:", hours);
      // console.log("att_edit_val_ot:", ot);
      console.log("att_edit_val_pl:", leave);
      console.log("att_edit_val_cl:", com_off);

      // Rule 1: Working hours max 8
      if (hours > 8) {
        this.form_att.controls['att_edit_val_hr'].setValue(8);
        alert("Working hours cannot exceed 8!");
        return;
      }

      // Rule 2: Leave hours max 8
      if (leave > 8) {
        this.form_att_edit.controls['att_edit_val_pl'].setValue(8);
        alert("Leave hours cannot exceed 8!");
        return;
      }

      if (com_off > 8) {
        this.form_att_edit.controls['att_edit_val_cl'].setValue(8);
        alert("Leave hours cannot exceed 8!");
        return;
      }

       if (hours + leave + com_off > 8) {
          const allowed = Math.max(0, 8 - (hours + leave ));
        alert("Leave + Working hours + com-off cannot exceed 8!");
          this.form_att_edit.controls['att_edit_val_cl'].setValue(allowed);
        return;
      }

    }

   add_com_off()
   {
    this.days='';
    this.clearCheckboxes();
    this.currentSelected = { checked: false, emp_id: '' };
    this.shareCheckedlist();
    this.shareIndividualStatus();
    this.modaleditatt = this.modalService.open(this.addcom_off, { size: 'md'});
   }

   add_paid_leave()
   {
    this.days='';
    this.clearCheckboxes();
        this.currentSelected = { checked: false, emp_id: '' };
        this.shareCheckedlist();
        this.shareIndividualStatus();
    this.modaleditatt = this.modalService.open(this.addpaid_laeve, { size: 'md'});
   }

   getSelectedValue(status:Boolean,value:String){
    if(status)
    {
      this.checkedList.push(value);
    }
    else
    {
        var index = this.checkedList.indexOf(value);
        this.checkedList.splice(index,1);
    }
    this.currentSelected = {checked : status,name:value};
    this.shareCheckedlist();
    this.shareIndividualStatus();
  }

 shareCheckedlist(){
     this.shareCheckedList.emit(this.checkedList);
 }

 shareIndividualStatus(){
    this.shareIndividualCheckedList.emit(this.currentSelected);
 }

 update()
 {
  if(this.days != ''  && this.checkedList.length != 0)
  {
  this.length = 0;
    const confirmed = confirm("Are you sure you want to add a compensatory off to this employee?");
       console.log(confirmed)
      if (!confirmed) {
        return;
      }
  // Use Promise.all to handle multiple asynchronous calls
  const promises = this.checkedList.map(async empId =>
  await  this.api.post(`mp_employee_com_off_update.php?table=employee&field=emp_id&value=${empId}&up_field=com_off&update=${this.days}&authToken=${environment.authToken}`, null));

  Promise.all(promises)
    .then(results => {

      results.forEach(data_rt => {
        if (data_rt.status === 'success') {
          this.length++;
        } else {
          this.toastrService.error('Something went wrong');
        }
      });

      if (this.checkedList.length === this.length)
      {
        this.toastrService.success('Com Off Added Successfully');
         this.ngOnInit()
        this.clearCheckboxes();
        this.currentSelected = { checked: false, emp_id: '' };
        this.shareCheckedlist();
        this.shareIndividualStatus();
        this.days = '';
        this.modaleditatt.close();
      }
      else
      {
        this.toastrService.warning('Com Off Not Assigned to All');
      }
    }).catch(error => {
      this.toastrService.error('Something went wrong');
      this.loading = false;
    });
  }
  else{
    this.toastrService.warning('Enter the days and Select the Employee List');
  }
 }

 clearCheckboxes() {
  this.employee_list.forEach(employee => {
    employee.checked = false;
  });

  // Clear the checkedList array
  this.checkedList = [];
}


async update_pl()
{
      if(this.days != ''  && this.checkedList.length != 0)
      {
      this.length = 0;

      // Use Promise.all to handle multiple asynchronous calls
      const promises = this.checkedList.map(async empId =>
      await  this.api.post(`mp_employee_pl_update.php?table=employee&field=emp_id&value=${empId}&up_field=pl_leave&update=${this.days}&authToken=${environment.authToken}`, null));

      Promise.all(promises)
        .then(results => {

          results.forEach(data_rt => {

            if (data_rt.status === 'success') {
              this.length++;

            } else {
              this.toastrService.error('Something went wrong');
            }
          });

          if (this.checkedList.length === this.length)
          {
            this.toastrService.success('Paid Leave Added Successfully');
             this.ngOnInit()
            this.clearCheckboxes();
            this.currentSelected = { checked: false, emp_id: '' };
            this.shareCheckedlist();
            this.shareIndividualStatus();
            this.days = '';
            this.modaleditatt.close();
          }
          else
          {
            this.toastrService.warning('Paid Laeve Not Assigned to All');
          }
        }).catch(error => {
          this.toastrService.error('Something went wrong');
          this.loading = false;
        });
      }
      else{
        this.toastrService.warning('Enter the days and Select the Employee List');
      }
 }
}
