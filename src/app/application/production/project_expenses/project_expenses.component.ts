import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../service/api.service";
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-project_expenses',
  templateUrl: './project_expenses.component.html',
  styleUrls: ['./project_expenses.component.scss']
})
export class Project_expensesComponent implements OnInit {

  public user_bank_id = localStorage.getItem('bank_id');
  public user_type = localStorage.getItem('type');
  public uid = localStorage.getItem('uid');

  today           = new Date();
  todaysDate      = '';

  bankData        : any;
  bankData_length : any;
  all_account     = [];
  user_account    = [];
  company_account = [];
  cash_account    = [];
  gst_account     = [];
  balance         : any;
  addExpen        : FormGroup;
  exp_acc_info    : any;
  gst_percent     : any;

  cal_amount      : any;
  cal_tax         : any;
  cal_percent     : any;
  tax_per         : any;
  onloadBalance   : any;
  vendor_list     : any;
  customer_list   : any;
  project_list    : any;

  balance_disp    = 0;

  constructor
  (
    public fb: FormBuilder,
    public toastrService: ToastrService,
    private api: ApiService
  )
  {
    this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530'); // hh:mm:ss a
    this.addExpen = fb.group(
      {
        'created_by': [this.uid],
        exp_date    : [this.todaysDate, Validators.compose([Validators.required])],
        exp_type    : [1],
        exp_account : [1, Validators.compose([Validators.required, Validators.min(1)])],
        gst_code    : [null],
        paid_through: [1, Validators.compose([Validators.required, Validators.min(1)])],
        exp_mode    : [1, Validators.compose([Validators.required, Validators.min(1)])],
        amount      : [null, Validators.compose([Validators.required])],
        tax_rate    : [null, Validators.compose([Validators.required])],
        tax_percent : [0, Validators.compose([Validators.required])],
        inv_number  : [null],
        exp_name    : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
        vendor      : [0],
        customer    : [0],
        project     : [0],
        reference   : [null],
      }
    )
  }
  ngOnInit()
  {
    this.loadData();
  }

  async balanceLoad()
  {
    let bank = this.addExpen.controls['paid_through'].value;
    this.balance_disp = 1;
    await this.api.get('get_data.php?table=bank&find=bank_id&value='+bank+'&authToken=' + environment.authToken).then((get_data: any) =>
      {
        this.onloadBalance = get_data[0].balance;
      }).catch(error => { this.toastrService.error('API Faild : balanceLoad'); });
  }
  async loadData()
  {
    await this.api.get('get_data.php?table=bank&find=status&value=1&authToken=' + environment.authToken).then((data: any) =>
    {
      this.feedData(data) ;
    }).catch(error =>
      {
        this.toastrService.error('API Faild : loadData ');
      });

    await this.api.get('get_data.php?table=expense_account&find=status&value=1&authToken=' + environment.authToken).then((exp_acc: any) =>
    {
      this.exp_acc_info = exp_acc;
    }).catch(error => {this.toastrService.error('API Faild : loadData '); });

    await this.api.get('get_data.php?table=tax&authToken=' + environment.authToken).then((gst_per: any) =>
    {
      this.gst_percent = gst_per;
    }).catch(error => {this.toastrService.error('API Faild : loadData '); });

    await this.api.get('get_data.php?table=vendor&find=status&value=1&authToken=' + environment.authToken).then((ven_list: any) =>
    {
      this.vendor_list = ven_list;
    }).catch(error => {this.toastrService.error('API Faild : loadData '); });

    await this.api.get('get_data.php?table=customers&find=status&value=1&authToken=' + environment.authToken).then((cust_list: any) =>
    {
      this.customer_list = cust_list;
    }).catch(error => {this.toastrService.error('API Faild : loadData '); });

    await this.api.get('get_data.php?table=projects&find=status&value=1&authToken=' + environment.authToken).then((pro_list: any) =>
    {
      this.project_list = pro_list;
    }).catch(error => {this.toastrService.error('API Faild : loadData '); });
  }

  tax_calculate()
  {
    this.tax_per      = this.addExpen.controls['tax_percent'].value;
    this.cal_amount   = this.addExpen.controls['amount'].value;
    this.cal_percent  = 100;
    this.cal_tax      = (this.cal_amount / this.cal_percent) * this.tax_per;

    this.addExpen.controls['tax_rate'].setValue(this.cal_tax);
  }
  feedData(data)
  {
    this.bankData = data;
    this.bankData_length = data.length;
    let i = 0 ; let j = 0 ; let k = 0; let l = 0; let m = 0; let n=0;
    for (i = 0; i<=this.bankData_length; i++)
      {
        let type = this.bankData[i].type;
        let mode = this.bankData[i].mode;
        let bankid = this.bankData[i].bank_id;

        if (type === 1 && mode === 1 )
        {
          this.company_account[j] = this.bankData[i];
          j++;
        }
        else{null}
        if (type === 1 && mode === 2)
        {
          this.cash_account[k] = this.bankData[i];
          k++;
        }
        else{}
        if (type === 1 && mode === 3)
        {
          this.all_account[l] = this.bankData[i];
          l++;
        }
        else{}
        if (bankid === this.user_bank_id)
        {
          this.user_account[m] = this.bankData[i];
          m++;
        }
        else{}
        if (type === 2 && mode === 1)
        {
          this.gst_account[n] = this.bankData[i];
          n++;
        }
        else{}
      }
  }
  async AddNewExpen(data)
  {
    if (this.addExpen.valid)
    {
      await this.api.get('get_data.php?table=bank&find=bank_id&value='+data.paid_through+'&authToken=' + environment.authToken).then((get_data: any) =>
      {
        this.balance = get_data[0].balance;
      }).catch(error => { this.toastrService.error('Unable to load bank balance contact super admin'); });

      let total_amount = data.amount + data.tax_rate;

      if(total_amount <= this.balance)
      {
        await this.api.post('mp_project_expence.php?authToken=' + environment.authToken, data).then((data: any) =>
        {
          if(data.status == "success")
            { this.toastrService.success('Expense Added Succesfully'); }
          else
            { this.toastrService.error(data.status);}
            return true;
        }).catch(error => {this.toastrService.error('API Faild : AddNewExpen');});

        this.loadData();

        this.addExpen.controls['gst_code'].reset();
        this.addExpen.controls['amount'].reset();
        this.addExpen.controls['tax_rate'].reset();
        this.addExpen.controls['tax_percent'].reset();
        this.addExpen.controls['inv_number'].reset();
        this.addExpen.controls['exp_name'].reset();
        this.addExpen.controls['tax_percent'].setValue(0);
        this.addExpen.controls['vendor'].setValue(0);
        this.addExpen.controls['customer'].setValue(0);
        this.addExpen.controls['project'].setValue(0);
        this.addExpen.controls['reference'].reset();
        this.balanceLoad();
      }
      else
      {
        this.toastrService.error("You don't have sufficient balance in source account");
      }
    }
    else
    {
      this.toastrService.error('Please make sure all fields are filled in correctly');
    }
  }
}
