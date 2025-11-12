import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormGroup, AbstractControl, FormBuilder,Validators} from '@angular/forms';
import { formatDate } from '@angular/common';



@Component({
  selector    : 'az-salary',
  templateUrl : './salary.component.html',
  styleUrls   : ['./salary.component.scss']
})
export class SalaryComponent implements OnInit
{
  selected            = [];
  detail_view         = [];
  employee            = [];
  salary_details      = [];

  ip_sal_show         : boolean = true;
  loading             : boolean = false;
  show                : boolean = false;
  show_table          : boolean = false;
  salary_credit       : boolean = false;
  status              : boolean=false;

  public form_salary    : FormGroup;
  public salary_load    : FormGroup;
  public salary_gen     : FormGroup;
  public payroll_days   : FormGroup;
  public payroll_amount : FormGroup;
  public employ_advance : FormGroup;
  public advance_salary : FormGroup;

  public ip_salary    : AbstractControl;
  public ip_bank_id   : AbstractControl;
  public ip_utr       : AbstractControl;
  public ip_reff      : AbstractControl;
  public ip_tran_mode : AbstractControl;
  public ip_tran_date : AbstractControl;
  public from_date    : AbstractControl;
  public to_date      : AbstractControl;
  public category     : AbstractControl;
  public total_hr     : AbstractControl;

  public uid          = localStorage.getItem('uid');
  public user_type    = localStorage.getItem('type');

  today               = new Date();
  todaysDate          = '';
  show_page           = 0;
  show_Load           = 0;

  emp_acc_id          : any;
  emp_id              : any;
  LoadSalaryData      : any;
  SalaryList          : any;
  BankList            : any;
  SalaryAck           : any;
  employee_type       : any;
  plUseValue          : any;
  advance_date        : any;
  salary_dtails       : any;
  amount              : any;
  salary_amount       : any;
  salary_id           : any;
  salary_group        : any;
  temp                : any;
  open_popup          : any;
  pay_roll_data       : any;
  clUseValue          : any;
  total_days          : any;
  total_workeddays    : any;
  cl_days             : any;
  pl_days             : any;
  sl_days             : any;
  ot_days             : any;
  salary_data         : any;
  salary_Amount       : any;
  salary_advance      : any;
  salary_paid_amount  : any;
  ot_hours            : any;
  ot_per_hours        : any;
  ot_paid_amount      : any;
  total_amount        : any;
  fixed_salary        : any;
  fixed_payable_salary: any;
  basic_da            : any;
  hra                 : any;
  allowance           : any;
  epf_deduction       : any;
  esi_deduction       : any;
  petrol_food_expenses: any;
  incentive_others    : any;
  total_deduction     : any;
  net_salary          : any;
  salary_paid         : any;
  gross_salary        : any;
  final_data          : any;
  salary_detail       : any;
  payment             : any;
  pl_available        : any;
  cl_available        : any;
  account_balance     : any;
  advance_emp         : any;
  pl_balance          : any;
  cl_balance          : any;
  advance             : Boolean = false;
  company_total_expence     : any;
  epf_employer_contribution : any;
  esi_employer_contribution : any;

months = [];


selectedMonth:any; // default to current month
startDate: Date | null = null;
endDate: Date | null = null;
month: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild("content",{static:true}) content:ElementRef;

  @ViewChild("employee_salary",{static:true}) employee_salary:ElementRef;

  @ViewChild("employee_advance",{static:true}) employee_advance:ElementRef;

  @ViewChild("employee_salary_days",{static:true}) employee_salary_days:ElementRef;

   @ViewChild("Confirmation",{static:true}) Confirmation:ElementRef;

  constructor(private modalService: NgbModal, public api: ApiService, public toastrService: ToastrService, fb:FormBuilder)
  {
    const today = new Date();
    let date = today.toISOString().split('T')[0];

    this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
    this.form_salary = fb.group
    (
      {
        ip_salary   : [null],
        ip_bank_id  : [null, Validators.compose([Validators.required])],
        ip_utr      : ['',Validators.compose([Validators.required])],
        ip_reff     : [null],
        ip_tran_mode: ['',Validators.compose([Validators.required])],
        ip_tran_date: [date,Validators.compose([Validators.required])],
      }
    );
    this.ip_salary    = this.form_salary.controls['ip_salary'];
    this.ip_bank_id   = this.form_salary.controls['ip_bank_id'];
    this.ip_utr       = this.form_salary.controls['ip_utr'];
    this.ip_reff      = this.form_salary.controls['ip_reff'];
    this.ip_tran_mode = this.form_salary.controls['ip_tran_mode'];
    this.ip_tran_date = this.form_salary.controls['ip_tran_date'];
    this.salary_load  = fb.group
    (
      {
        'month' : ['', Validators.compose([Validators.required])],
        'category'  : ['', Validators.compose([Validators.required])],
      }
    );
    // this.from_date  = this.salary_load.controls['from_date'];
    // this.to_date    = this.salary_load.controls['to_date'];
    this.month  = this.salary_load.controls['month'];
    this.category   = this.salary_load.controls['category'];

    this.salary_gen = fb.group
    (
      {
        total_hr    : [null]
      }
    );
    this.total_hr   = this.salary_gen.controls['total_hr'];

    this.payroll_amount = fb.group
    ({
      created_by            :[this.uid],
      emp_id                :[null],
      attendance_id         :[null],
      salary_amount         :[null],
      salary_advance        :[null],
      paid_amount           :[null],
      ot_hours              :[null],
      ot_per_hour           :[null],
      ot_paid_amount        :[null],
      total_amount          :[null],
      fixed_salary          :[null],
      fixed_payable_amount  :[null],
      basic_da              :[null],
      hra                   :[null],
      allowance             :[null],
      epf_employee          :[null],
      esi_employee          :[null],
      total_deduction       :[null],
      pertrol_food          :[null],
      incentive_others      :[null],
      net_salary            :[null],
      salary_paid           :[null],
      gross_salary          :[null],
      epf_employer          :[null],
      esi_employer          :[null],
      company_total_expence :[null]
    })

    this.employ_advance=fb.group({
      created_by   : [this.uid],
      paid_through : [null],
      adv_mode     : [null],
      adv_date     : [null],
      emp_account  : [null],
      amount       : [null],
    });

    this.payroll_days = fb.group
    (
      {

        from_date         : [null],
        to_date           : [null],
        no_of_days        : [0, Validators.compose([Validators.required])],
        no_of_workingdays : [null],
        no_of_cl          : [null],
        no_of_pl          : [null],
        no_of_sl          : [null],
        no_of_ot          : [null],
        pl_available      : [null],
        pl_use            : [null],
        pl_balance        : [null],
        c_off_available   : [null],
        c_off_use         : [null],
        c_off_balance     : [null],
        lop               : [null],
        salary_paid_day   : [null],
        att_row           : [null]
      }
    );

    this.advance_salary = fb.group
    (
      {
        created_by  : [this.uid],
        ip_salary   : ['', Validators.compose([Validators.required])],
        ip_bank_id  : ['', Validators.compose([Validators.required])],
        ip_utr      : ['',Validators.compose([Validators.required])],
        ip_reff     : [null],
        ip_tran_mode: ['',Validators.compose([Validators.required])],
        ip_tran_date: ['',Validators.compose([Validators.required])],
      }
    );

    this.getLastFiveSalaryMonths();
  }


   getLastFiveSalaryMonths() {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const referenceDate = new Date();
      const result = [];

      for (let i = 0; i < 3; i++) {
        const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
        const month = date.getMonth(); // 0-11
        const year = date.getFullYear();

        // Determine financial year
        const fyStart = (month >= 3) ? year : year - 1;
        const fyEnd = fyStart + 1;
        const fy = `${fyStart}-${String(fyEnd).slice(-2)}`;

        this.months.push({
          monthName: monthNames[month],
          monthValue: month,
          year: year,
          financialYear: fy,
          display: `${monthNames[month]} ${year}`
        });
      }
      console.log(this.months);
      // return result;
 }

  ngOnInit()
  {
    this.loadData();
  }

  PageAction(action)
  {
    if(action == "show")
    {
      this.show_page = 1;
    }
    if(action == "hide")
    {
      this.show_page = 0;
    }
  }

  OpenSalaryAck()
  {
    this.SalaryAck = this.modalService.open(this.employee_salary, { size: 'lg'});

  }


  async loadData()
  {
    await this.api.get('get_data.php?table=bank&find=status&value=1&find1=type&value1=1&authToken=' + environment.authToken).then((data: any) =>
    {

      if(data != null)
        {
          function levelFilter(value) {
            if (!value) { return false; }
            return value.mode != 3; }
          let get_data = data.filter(levelFilter);
          this.BankList  = get_data;
        }
    }).catch(error => { });

    await this.api.get('get_data.php?table=employee&authToken=' + environment.authToken).then((data: any) =>
    {
      this.employee = data;
    }).catch(error => { this.toastrService.error('API Faild : loadData employee details'); });

    await this.api.get('get_data.php?table=employee_type&authToken=' + environment.authToken).then((data: any) =>
    {
      this.salary_group = data;
    }).catch(error => { this.toastrService.error('API Faild : loadData salary group'); });

    await this.api.get('get_data.php?table=salary&find=status&value=1&asign_field=id&asign_value=DESC&authToken=' + environment.authToken).then((data: any) =>
    {
      this.SalaryList = data;
      if(data != null)
      {
          for(let i=0;i<data.length;i++)
          {
            var name = this.employee.find(t=>t.emp_id == this.SalaryList[i]['emp_id']);
            data[i]['employee_name'] = name.name
            this.temp =[...data];
          }
      }
    }).catch(error => { this.toastrService.error('API Faild : loadData salary list'); });

  }

  set_zero()
  {
    this.selected = [];
    this.show_page = 0;
    this.show = false;
    this.show_table = false;
    this.salary_credit = false;
    this.advance = false;
  }

  async onActivate(event)
  {
    if(event.type === "click" || event.type === "dblclick")
    {

      if(this.user_type === "super_admin")
      {
        this.payroll_amount.controls['emp_id'].setValue(event.row.emp_id);
        this.payroll_amount.controls['attendance_id'].setValue(event.row.id);

        this.payment_data(event.row.id);
        this.load_salary(event.row.emp_id);

      }
      else
      {
        this.selected = [];
      }
    }
  }

  async load_salary(id)
  {
    await  this.api.get('mp_payroll_salary_amount.php?value='+id+'&authToken='+ environment.authToken).then((data: any) =>
    {
      console.log("data : ",data)
      this.account_balance           = data.emp_account
      this.advance_date              = data.from_date+' to '+data.to_date;
      this.final_data                = data;
      this.salary_Amount             = data.salary_amount.toFixed(2);
      this.salary_advance            = data.salary_advance.toFixed(2);
      this.salary_paid_amount        = data.salary_paid_amount.toFixed(2);
      this.ot_hours                  = data.ot_hours;
      this.ot_per_hours              = data.ot_per_hours;
      this.ot_paid_amount            = data.ot_paid_amount.toFixed(2);
      this.total_amount              = data.total_amount.toFixed(2);
      this.fixed_salary              = data.fixed_salary.toFixed(2);
      this.fixed_payable_salary      = data.fixed_payable_salary.toFixed(2);
      this.basic_da                  = data.basic_da.toFixed(2);
      this.hra                       = data.hra.toFixed(2);
      this.allowance                 = data.allowance.toFixed(2);
      this.epf_deduction             = data.epf_deduction.toFixed(2);
      this.esi_deduction             = data.esi_deduction.toFixed(2);
      this.petrol_food_expenses      = data.petrol_food_expenses.toFixed(2);
      this.incentive_others          = data.incentive_others.toFixed(2);
      this.total_deduction           = data.total_deduction.toFixed(2);
      this.net_salary                = data.net_salary.toFixed(2);
      this.salary_paid               = data.salary_paid.toFixed(2);
      this.gross_salary              = data.gross_salary.toFixed(2);
      this.epf_employer_contribution = data.epf_employer_contribution.toFixed(2);
      this.esi_employer_contribution = data.esi_employer_contribution.toFixed(2);
      this.company_total_expence     = data.company_total_expence.toFixed(2);
      setTimeout(async () => {
        this.show_table = true;
      }, 500);
    }).catch(error => { this.toastrService.error('API Faild : loadData employee details'); });
  }

  payment_data(id)
  {
    this.api.get('get_data.php?table=pay_roll&find=attendance_id&value='+id+'&find1=status&value1=1&authToken=' + environment.authToken).then((data: any) =>
    {
      if(data != null)
      {
        this.payment = data[0];
        this.status = true;
      }
      else
      {
        this.payment = null;
        this.status = true;
      }
    }).catch(error =>
      {
          this.toastrService.error('API Faild : SalaryLoad');
          this.loading=false;
      });
  }

salaryCalculate()
{
  let salary =this.payment.salary_paid
  let length = this.salary_detail.length;
   var total = 0;
    if(length > 0)
      {
          for(let i=0; i<length ;i++)
          {
            total=total+this.salary_detail[i].amount;
          }
      }
  this.amount = (salary-total).toFixed(2) ;
  this.form_salary.controls['ip_salary'].setValue(this.amount);
}


 async onAction(event)
  {
    if(event.type === "click")
    {
      this.salary_details = event.row;
      console.log("salary_details",this.salary_details)
   await  this.api.get('get_data.php?table=employee&find=emp_id&value='+event.row.emp_id+'&find1=status&value1=1&authToken=' + environment.authToken).then((data: any) =>
      {
        this.salary_details['pl_available']      = data[0].pl_leave;
        this.salary_details['com_off_available'] = data[0].com_off;
        this.pl_available   = data[0].pl_leave;
        this.cl_available   = data[0].com_off;

        this.pay_roll_data = this.salary_details;

          this.plUseValue =0;

        this.clUseValue       = 0;
        this.total_days       = 0;
        this.total_workeddays = parseFloat((this.salary_details['hr']).toFixed(2));
        this.cl_days          = (this.salary_details['cl']).toFixed(2);
        this.pl_days          = (this.salary_details['pl']).toFixed(2);
        this.sl_days          = (this.salary_details['sl']).toFixed(2);
        this.ot_days          = (this.salary_details['ot']).toFixed(2);

        this.payroll_days.controls['from_date'].setValue(this.salary_details['from_date']);
        this.payroll_days.controls['to_date'].setValue(this.salary_details['to_date']);
        this.payroll_days.controls['no_of_workingdays'].setValue(this.total_workeddays);
        this.payroll_days.controls['no_of_cl'].setValue(parseFloat(this.cl_days));
        this.payroll_days.controls['no_of_pl'].setValue(parseFloat(this.pl_days));
        this.payroll_days.controls['no_of_sl'].setValue(parseFloat(this.sl_days));
        this.payroll_days.controls['no_of_ot'].setValue(parseFloat(this.ot_days));

        this.payroll_days.controls['pl_available'].setValue(this.salary_details['pl_available'] );
        this.pl_status  = localStorage.getItem(`pl_${event.row.emp_id}_status`);
        console.log("pl_status",this.pl_status)
        if(this.pl_status == "Added")
        {
                    this.pl_available = localStorage.getItem(`pl_${event.row.emp_id}`);
                 console.log("pl_available",this.pl_available)
               this.payroll_days.controls['pl_available'].setValue(this.pl_available);
        }
        this.pl_balance = this.pl_available
        this.payroll_days.controls['pl_use'].setValue(this.plUseValue);
        this.payroll_days.controls['c_off_available'].setValue(data[0].com_off);
        this.payroll_days.controls['c_off_use'].setValue(this.clUseValue);
        this.payroll_days.controls['att_row'].setValue(this.salary_details['att_row']);
        this.onInputChange_cl()
        this.onInputChange()
      }).catch(error =>
        {
          this.toastrService.error('API Faild : GenerateSalary');
          this.loading=false;
        });
    if(this.total_workeddays > 0)
    {
      this.OpenSalaryAck();
    }
    }
  }

  async GenerateSalary(data : any)
  {
    this.salary_details['total_hr']   = data['total_hr'];
    this.salary_details['created_by'] = this.uid;

    if(this.salary_details['total_hr'] < this.salary_details['hr'])
    {
      this.toastrService.error('Total Hours is less than working hours');
    }
    else if(this.salary_details['hr'] != 0)
    {
      this.loading =true;
      await this.api.post('mp_salary_insert.php?authToken='+environment.authToken, this.salary_details).then((data_rt: any) =>
      {
        if(data_rt.status == "success")
        {
          this.toastrService.success('Salary Details Updates Successfully');
          this.loading=false;
        }
        else { this.toastrService.error(data_rt.status);
          this.loading=false; }
        this.loadData();
        this.SalaryLoad(this.salary_load.value)
        this.selected = [];
      }).catch(error =>
      {
        this.toastrService.error('API Faild : GenerateSalary');
        this.loading=false;
      });
      this.SalaryAck.close();
    }
    else
    {
      this.toastrService.error('Invalid Attendance');
    }
 }

//    calculateDateRange() {
//   const year = new Date().getFullYear();

//   // If month is January (0), previous month is December of previous year
//   const prevMonth = this.selectedMonth === 0 ? 11 : this.selectedMonth - 1;
//   const prevYear = this.selectedMonth === 0 ? year - 1 : year;

//   this.startDate = new Date(prevYear, prevMonth, 26); // 26th of previous month
//   this.endDate = new Date(year, this.selectedMonth, 25); // 25th of selected month
//   console.log("Selected Month:", this.selectedMonth);
//   console.log("startDate",this.startDate);
//   console.log("endDate",this.endDate);
// }

  formatDate(date: Date): string {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months start from 0
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }

  async SalaryLoad(details: any)
  {
    Object.keys(this.salary_load.controls).forEach(field =>
      {
        const control = this.salary_load.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if(this.salary_load.valid)
    {
      console.log(details);
      //  const year = new Date().getFullYear();
        const selectedMonth = parseInt(details.month, 10);  // or from details.value
        const selected = this.months.find(m => m.monthValue == details.month, 10);    // important!
        const selectedYear = selected ? selected.year : new Date().getFullYear();
        console.log("selectedMonth:", selectedMonth);
        console.log("selectedYear:", selectedYear);
        // Handle year and previous month correctly
        const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
        // If month is January (0), previous month is December of previous year
        // const prevMonth = this.selectedMonth === 0 ? 11 : details.month - 1;
        // const prevYear = this.selectedMonth === 0 ? year - 1 : year;

        console.log("prevMonth:", prevMonth);
        console.log("prevYear:", prevYear);
       const startDate = new Date(prevYear, prevMonth, 26);
       const endDate = new Date(selectedYear, details.month, 25);
        console.log("Selected Month:", details.month);


              const formattedStartDate = this.formatDate(startDate);
            const formattedEndDate = this.formatDate(endDate);
            const salaryMonth = new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

            const result = {
              salaryMonth,
              startDate: formattedStartDate,
              endDate: formattedEndDate
            };

          console.log("Selected Month:", details.month);
          console.log("startDate", startDate);
          console.log("endDate", endDate);


      this.show_Load = 1;
      this.loading=true;
      await this.api.get('mp_salary_load.php?category='+details.category+'&from_date='+formattedStartDate+'&to_date='+formattedEndDate+'&authToken='+environment.authToken).then((data_rt: any) =>
      {
        this.loading=false;
        if(data_rt.status== "no data")
        {
          this.LoadSalaryData = null;
          this.toastrService.warning('No Data');
        }
        else{
          this.LoadSalaryData = data_rt;
        }
        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : SalaryLoad');
          this.loading=false;
      });
   }
   else{
      this.toastrService.error('Select the Details');
   }
  }

  load_transaction(id)
  {
    this.api.get('get_data.php?table=salary_payment&find=payroll_id&value='+id+'&authToken=' + environment.authToken).then((data: any) =>
      {
        if(data != null)
        {
          this.salary_detail = data
          this.salaryCalculate();
        }
        else
        {
          this.form_salary.controls['ip_salary'].setValue(this.salary_dtails.salary_paid)
          this.amount = this.salary_dtails.salary_paid;
        }
      }).catch(error => { this.toastrService.error('API Faild : Salary Generated Failed'); });
  }

  async salaryUpdate(data)
  {
    Object.keys(this.form_salary.controls).forEach(field =>
      {
        const control = this.form_salary.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      if(this.form_salary.valid)
      {
    if(this.amount >= data.ip_salary)
    {

    data.created_by = this.uid;
    data.emp_id     = this.detail_view['emp_id'];
    data.row_id     = this.detail_view['row_id'];
    data.value      = data.att_edit_val;
    data.salary_id  = this.detail_view['salary_id'];
      if(this.amount>data.ip_salary)
      {
        data.status = 1;
      }
      if(this.amount == data.ip_salary)
      {
        data.status = 2;
      }
    const confirmed = confirm("Do you want to proceed with the update?");
        console.log(confirmed)
        if (!confirmed) {
          return;
        }
         this.loading=true;
    await this.api.post('mp_salary_update.php?authToken='+environment.authToken,data).then((data_rt: any) =>
    {
            if(data_rt.status == "success")
            {
              this.toastrService.success('Salary Details Updates Successfully');
              this.loading=false;
              this.load_transaction(this.detail_view['row_id']);
              this.form_salary.reset();
              this.salary_credit = false;
              this.show_page     = 0;
              this.selected      = [];
            }

            else { this.toastrService.error(data_rt.status);
              this.loading=false;}
              this.loadData();
              this.selected = [];
              return true;
    }).catch(error =>
    {
        this.toastrService.error('API Faild : salaryUpdate');
        this.loading=false;
    });
   }
   else
   {
    this.toastrService.warning('Salary Value is greater');
   }
  }
  else {
    this.toastrService.warning('Fill All Details');
   }
  }

  updateFilter(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });
    this.SalaryList = temp;
    this.table.offset = 0;
  }

  onAction1()
  {}

  onInputChange() {
  // Parse all inputs safely (fallback to 0)
  const totalDays = parseFloat(this.total_days) || 0;
  const totalHours = totalDays * 8;

  const workedHours = parseFloat(this.total_workeddays) || 0;
  const cl= parseFloat(this.cl_days) || 0;
  const pl = parseFloat(this.pl_days) || 0;
  const sl = parseFloat(this.sl_days) || 0;

  const clUse = parseFloat(this.clUseValue) || 0;
  let plUse = parseFloat(this.plUseValue) || 0;

  const otHours = parseFloat(this.payroll_days.get('no_of_ot')?.value) || 0;

  const compOffAvailable = parseFloat(this.pay_roll_data?.com_off_available || 0);
  console.log("Pl USE ",plUse)
   console.log("PL ",pl)
   console.log("pl_available : ",this.pl_available)


  //  Step 1: Validate plUse
  if (plUse > this.pl_available) {
    this.toastrService.error('PL Use is greater than PL Available');
    plUse = this.pl_available;
    this.payroll_days.controls['pl_use'].setValue(plUse);
  }

  if (plUse > pl) {
    this.toastrService.error('PL Use is greater than PL Earned');
    plUse = pl;
    this.payroll_days.controls['pl_use'].setValue(plUse);
  }

  //  Step 2: Calculate PL balance
  let plBalance = this.pl_available - plUse;
  if (plBalance < 0) plBalance = 0;
  this.payroll_days.controls['pl_balance'].setValue(plBalance);
  this.pl_balance = plBalance;

  //  Step 3: Handle zero availability
  if (this.pl_available <= 0) {
    plUse = 0;
    this.plUseValue = 0;
    this.payroll_days.controls['pl_use'].setValue(0);
    this.payroll_days.controls['pl_balance'].setValue(0);
  }

        // Total Leave Earned (CL + PL + SL)
        const totalLeaveEarned = cl + pl + sl;

        // Total Leave Applied (CL Use + PL Use)
        const totalLeaveApplied = clUse + plUse;
        const leave =totalHours  - workedHours;
        let lop = leave-totalLeaveApplied;
        console.log("totalHours", totalHours);
        console.log("totalLeaveEarned", totalLeaveEarned);
        console.log("totalLeaveApplied", totalLeaveApplied);
        console.log("lop", lop);
        if (lop < 0) lop = 0;
        this.payroll_days.controls['lop'].setValue(lop);

        // 🔹 Salary Paid Hours = Worked + CL Use + PL Use + OT (if OT is considered)
        let salaryPaidHours = workedHours + clUse + plUse ;
        this.payroll_days.controls['salary_paid_day'].setValue(salaryPaidHours);

}


      onInputChange_cl() {
      // Parse all inputs safely (fallback to 0)
      const totalDays = parseFloat(this.total_days) || 0;
      const totalHours = totalDays * 8;

      const workedHours = parseFloat(this.total_workeddays) || 0;
      const cl= parseFloat(this.cl_days) || 0;
      const pl = parseFloat(this.pl_days) || 0;
      const sl = parseFloat(this.sl_days) || 0;

      let clUse = parseFloat(this.clUseValue) || 0;
      let plUse = parseFloat(this.plUseValue) || 0;

      const otHours = parseFloat(this.payroll_days.get('no_of_ot')?.value) || 0;

      const compOffAvailable = parseFloat(this.pay_roll_data?.com_off_available || 0);


       //  Step 1: Validate plUse
        if (clUse > this.cl_available) {
          this.toastrService.error('Com-off Use is greater than Com-off Available');
          clUse = this.cl_available;
          this.payroll_days.controls['c_off_use'].setValue(clUse);
        }

        if (clUse > cl) {
          this.toastrService.error('Com-off Use is greater than Com-off Earned');
          clUse = cl;
          this.payroll_days.controls['c_off_use'].setValue(clUse);
        }

          //  Step 2: Calculate PL balance
        let clBalance = this.cl_available - clUse;
        if (clBalance < 0) clBalance = 0;
        this.payroll_days.controls['c_off_balance'].setValue(clBalance);
        this.cl_balance = clBalance;

        //  Step 3: Handle zero availability
        if (this.cl_available <= 0) {
          clUse = 0;
          this.clUseValue = 0;
          this.payroll_days.controls['c_off_use'].setValue(0);
          this.payroll_days.controls['c_off_balance'].setValue(0);
        }

      const totalLeaveEarned = cl + pl + sl;
      // Total Leave Applied (CL Use + PL Use)
      const totalLeaveApplied = clUse + plUse;
      const leave =totalHours  - workedHours;
      let lop = leave-totalLeaveApplied;
      console.log("totalHours", totalHours);
      console.log("totalLeaveEarned", totalLeaveEarned);
      console.log("totalLeaveApplied", totalLeaveApplied);
      console.log("lop", lop);
      if (lop < 0) lop = 0;
      this.payroll_days.controls['lop'].setValue(lop);

      // 🔹 Salary Paid Hours = Worked + CL Use + PL Use + OT (if OT is considered)
      let salaryPaidHours = workedHours + clUse + plUse ;
      this.payroll_days.controls['salary_paid_day'].setValue(salaryPaidHours);
    }

 async submit_payroll_days(value)
  {

    Object.keys(this.payroll_days.controls).forEach(field =>
      {
        const control = this.payroll_days.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if(this.payroll_days.valid && value.salary_paid_day > 0 && this.payroll_days.value.no_of_days>0)
      {
       const confirmed = confirm("  Are you sure you want to submit?");
       console.log(confirmed)
      if (!confirmed) {
        return;
      }
         const emp_id  = this.salary_details['emp_id'];
        this.loading = true;
    await this.api.post('mp_salary_days_create.php?emp_id='+emp_id+'&value='+this.pay_roll_data.id+'&authToken='+environment.authToken,value).then(async (data_rt: any) =>
        {
          if(data_rt.status == "success")
          {
            await this.SalaryAck.close();
           await  this.toastrService.success('Salary Details Updates Successfully');

              this.loading=false;
              localStorage.removeItem(`pl_${emp_id}`);
              localStorage.removeItem(`pl_${emp_id}_status`);
           await this.SalaryLoad(this.salary_load.value )
            this.selected=[];
            // this.loadData();

          }
          else { this.toastrService.error(data_rt.status);
            this.loading=false;}
            this.loadData();

            this.show = true;
        }).catch(error =>
        {
            this.toastrService.error('API Faild : salaryUpdate');
            this.loading=false;
        });
      }
      else{
        this.toastrService.warning('Details are not correct ');
      }
  }


  onsalary(event)
  {
    if(event.type == "click")
    {
        this.api.get('mp_payroll_salary_amount.php?value='+event.row.emp_id+'&authToken='+ environment.authToken).then((data: any) =>
          {
            this.salary_Amount       = data.salary_amount;
            this.salary_advance      = data.salary_advance;
            this.salary_paid_amount  = data.salary_paid_amount;
            this.ot_hours            = data.ot_hours;
            this.ot_per_hours        = data.ot_per_hours;
            this.ot_paid_amount      = data.ot_paid_amount;
            this.total_amount        = data.total_amount;
            this.fixed_salary        = data.fixed_salary;
            this.fixed_payable_salary= data.fixed_payable_salary;
            this.basic_da            = data.basic_da;
            this.hra                 = data.hra;
            this.allowance           = data.allowance;
            this.epf_deduction       = data.epf_deduction;
            this.esi_deduction       = data.esi_deduction;
            this.petrol_food_expenses= data.petrol_food_expenses;
            this.incentive_others    = data.incentive_others;
            this.total_deduction     = data.total_deduction;
            this.net_salary          = data.net_salary;
            this.salary_paid         = data.salary_paid;
            this.gross_salary        = data.gross_salary;
            this.epf_employer_contribution = data.epf_employer_contribution;
            this.esi_employer_contribution = data.esi_employer_contribution;
            this.company_total_expence     = data.company_total_expence;

            this.show_table = false;
            this.show       = true;
          }).catch(error => { this.toastrService.error('API Faild : loadData employee details'); });
    }

  }

salary_amount_calculation()
{
  if(this.salary_advance != '' || this.salary_advance != null)
  {
    let salary_paid_amount = ((parseInt(this.salary_Amount)/parseInt(this.final_data.no_of_days)) * this.final_data.salary_paid_days) - parseInt(this.salary_advance);

    let total_amount       = salary_paid_amount + parseInt(this.ot_paid_amount)

    let net_salary         = parseInt(this.fixed_payable_salary) + parseInt(this.petrol_food_expenses) + parseInt(this.incentive_others)- parseInt(this.total_deduction)  ;

    let salary_paid        = net_salary - parseInt(this.salary_advance)+ parseInt(this.ot_paid_amount);

    let gross_salary       = net_salary + parseInt(this.total_deduction) ;

    this.salary_paid_amount = salary_paid_amount;
    this.salary_paid        = salary_paid;
    this.gross_salary       = gross_salary;
    this.total_amount       = total_amount;
    this.net_salary         = net_salary;
  }
}

onSubmit(value)
 {

  let today = new Date();
  let year  = today.getFullYear();
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let day   = String(today.getDate()).padStart(2, '0');

  let formattedDate   = `${year}-${month}-${day}`;
   value.tran_date    = formattedDate;
   value.advance_date = this.advance_date;
   value.created_by   = this.uid;
  const confirmed = confirm("Are you sure you want to submit?");
       console.log(confirmed)
      if (!confirmed) {
          //  this.modaleditatt.close();
        return;
      }
   console.log("value",value)
      this.loading = true;
      this.api.post('mp_salary_esi_epf_create.php?table=pay_roll&authToken=' + environment.authToken, value).then((data: any) => {
        console.log(data)
        if (data.status == "success")
        {
          this.loading = false;
          this.toastrService.success('Salary Generated Succesfully');
          this.payment_data(value.attendance_id)
        }
        else{
          this.loading = false;
        }
        }).catch(error => { this.toastrService.error('API Faild : Salary Generated Failed');  this.loading = false;});
 }

 make_transaction(value)
  {
    this.salary_dtails = value

    this.api.get('mp_salary_transaction_data.php?emp_id='+value.emp_id+'&salary_id='+value.attendance_id+'&authToken='+ environment.authToken).then((data: any) =>
          {
            this.detail_view= data[0];

            this.api.get('get_data.php?table=salary_payment&find=payroll_id&value='+data[0].row_id+'&authToken=' + environment.authToken).then((data: any) =>
                {
                  if(data != null)
                  {
                    this.salary_detail = data;
                    this.salaryCalculate();
                  }
                  else{
                    this.salary_detail = null
                    this.form_salary.controls['ip_salary'].setValue(value.salary_paid)
                    this.amount = value.salary_paid;
                  }

                }).catch(error => { this.toastrService.error('API Faild : Salary Generated Failed'); });
          }).catch(error => { this.toastrService.error('API Faild : Salary Generated Failed'); });

          setTimeout(async () => {
            this.salary_credit = true;
            this.show_table    = false;
          }, 500);

  }


  ot_amount_calculation()
  {
    //this.ot_paid_amount = (this.ot_hours * this.ot_per_hours).toFixed(2);
  }

  open_pop()
  {
    this.SalaryAck = this.modalService.open(this.employee_advance, { size: 'sm'});
  }

  employee_advan(value)
  {
    const today = new Date();
    let date = today.toISOString().split('T')[0];
    this.advance_salary.controls['ip_tran_date'].setValue(date);
    this.emp_id = value;
    this.api.get('get_data.php?table=employee&find=emp_id&value='+value+'&authToken=' + environment.authToken).then((data: any) =>
        {
          if(data != null)
          {
            this.advance_emp = data[0]
            this.emp_acc_id  = data[0].bank_id
            this.SalaryAck.close();
            this.advance   = true;
            this.show_page = 1;
          }
          else{ }

        }).catch(error => { this.toastrService.error('API Faild : Advance Generated Failed'); });
  }


  salaryadvance(data)
  {
    data.emp_acc_id = this.emp_acc_id;
    data.emp_id     = this.emp_id;

    Object.keys(this.advance_salary.controls).forEach(field =>
      {
        const control = this.advance_salary.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      if(this.advance_salary.valid)
      {
        this.loading = true;
        this.api.post('mp_salary_advance.php?authToken=' + environment.authToken, data).then((data: any) => {
          if (data.status == "success")
          {
            this.loading = false;
            this.toastrService.success('Transaction Succesfull');
            this.advance_salary.controls['ip_salary'].reset();
            this.advance_salary.controls['ip_bank_id'].reset();
            this.advance_salary.controls['ip_tran_mode'].reset();
            this.advance_salary.controls['ip_utr'].reset();
            this.advance_salary.controls['ip_reff'].reset();

            const today = new Date();
            let date = today.toISOString().split('T')[0];
            this.advance_salary.controls['ip_tran_date'].setValue(date);

            this.api.get('get_data.php?table=employee&find=emp_id&value='+this.emp_id+'&authToken=' + environment.authToken).then((data: any) =>
            {
              if(data != null)
              {
                this.advance_emp = data[0]
                this.emp_acc_id  = data[0].bank_id
              }
              else{ }
            }).catch(error => { this.toastrService.error('API Faild : Advance Generated Failed'); });
          }
          else{
            this.loading = false;
          }
          }).catch(error => { this.toastrService.error('API Faild : Advance Generated Failed');  this.loading = false;});
        }
        else{
          this.toastrService.warning('Fill the Details');
        }
  }
addpl:any
  onAddLeave()
  {
      this.addpl = this.modalService.open(this.Confirmation , { size: 'sm'});

  }

  close()
  {
    const emp_id  = this.salary_details['emp_id'];

      localStorage.setItem(`pl_${emp_id}`,this.salary_details['pl_available'] );
      localStorage.setItem(`pl_${emp_id}_status`,'Added' );
      localStorage.removeItem(`pl_${emp_id}`);
      localStorage.removeItem(`pl_${emp_id}_status`);
      this.SalaryAck.close();
  }

  pl_status:any;

  async confirm()
  {
    const emp_id  = this.salary_details['emp_id'];

    const pl_leave = this.salary_details['pl_available']
    this.pl_status  = localStorage.getItem(`pl_${emp_id}_status`);
     console.log("pl_status",this.pl_status)
    if(this.pl_status == null)
    {
      console.log("pl_leave",pl_leave)
      this.salary_details['pl_available'] = pl_leave + 8;
      this.payroll_days.controls['pl_available'].setValue(pl_leave + 8);
      localStorage.setItem(`pl_${emp_id}`,this.salary_details['pl_available'] );
      localStorage.setItem(`pl_${emp_id}_status`,'Added' );
      this.pl_available = localStorage.getItem(`pl_${emp_id}`);
      this.pl_status  = localStorage.getItem(`pl_${emp_id}_status`);

      console.log("pl_available",this.pl_available)
      this.toastrService.success('PL Added Succesfully');
      this.onInputChange();
      this.addpl.close();
    }
    else{
      this.toastrService.warning('You have already added PL for this employee');
      this.addpl.close();
    }

  }
}
