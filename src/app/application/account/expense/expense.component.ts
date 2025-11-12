import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { environment } from "../../../../environments/environment";
import { ApiService } from "../../../service/api.service";
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import {formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector   : 'az-expense',
  templateUrl: './expense.component.html',
  styleUrls  : ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit
{
  @ViewChild("delete", { static: true }) delete   : ElementRef;

  public user_bank_id = localStorage.getItem('bank_id');
  public user_type    = localStorage.getItem('type');
  public uid          = localStorage.getItem('uid');

  today               = new Date();
  todaysDate          = '';

  invoice_list        : any;
  bill_list           : any;
  all_account         = [];
  user_account        = [];
  company_account     = [];
  cash_account        = [];
  gst_account         = [];
  addExpen            : FormGroup;
  balance             : any;
  bankData            : any;
  bankData_length     : any;
  exp_acc_info        : any;
  gst_percent         : any;
  cal_amount          : any;
  cal_tax             : any;
  cal_percent         : any;
  tax_per             : any;
  onloadBalance       : any;
  vendor_list         : any;
  customer_list       : any;
  project_list        : any;
  expense_list        : any;
  model_open          : any;
  select_id           : any;
  balance_disp        = 0;
  loading             : boolean= false;
  show                : boolean= false;

  Expense_Data           =[];
  Expense_Data_length    =[];
  fixed_asset            =[];
  other_current_asset    =[];
  other_current_liability=[];
  ther_liability         =[];
  other_liability        =[];
  Expense                =[];
  cost_cf_goods_sold     =[];
  other_expense          =[];
  expense                =[];
  employee_account       =[];

  constructor
  (
    public fb           : FormBuilder,
    public toastrService: ToastrService,
    private api         : ApiService,
    private modalService : NgbModal,
  )
  {
    this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
    this.addExpen = fb.group(
      {
        'created_by': [this.uid],
        exp_date    : [this.todaysDate, Validators.compose([Validators.required])],
        exp_type    : [1],
        exp_account : [1, Validators.compose([Validators.required, Validators.min(1)])],
        gst_code    : [null],
        paid_through: [null, Validators.compose([Validators.required, Validators.min(1)])],
        exp_mode    : [1, Validators.compose([Validators.required, Validators.min(1)])],
        amount      : [null, Validators.compose([Validators.required])],
        tax_rate    : [null, Validators.compose([Validators.required])],
        tax_percent : [0, Validators.compose([Validators.required])],
        inv_number  : [null],
        exp_name    : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
        vendor      : [null],
        customer    : [null],
        project     : [null],
        reference   : [null],
      }
    )
  }

  ngOnInit()
  {
    this.loadData();
    this.expense_list_load();
  }

  expense_list_load()
  {
    this.api.get('mp_expense_list.php?authToken=' + environment.authToken).then((data: any) =>
      {

        this.expense_list = data;
      }).catch(error => {this.toastrService.error('API Faild : loadData tax'); });
  }
  async balanceLoad()
  {
    let bank = this.addExpen.controls['paid_through'].value;
    this.balance_disp = 0;
    if(bank != null)
    {
      this.balance_disp = 1;
      await this.api.get('get_data.php?table=bank&find=bank_id&value='+bank+'&authToken=' + environment.authToken).then((get_data: any) =>
        {
          this.onloadBalance = get_data[0].balance;
        }).catch(error => { this.toastrService.error('API Faild : balanceLoad'); });
    }
  }

  async loadData()
  {
    await this.api.get('get_data.php?table=bank&find=status&value=1&authToken=' + environment.authToken).then((data: any) =>
    {
      let value = data ;
      this.feedData(value) ;
    }).catch(error =>
      {   this.toastrService.error('API Faild : loadData bank'); });

    await this.api.get('get_data.php?table=expense_account&find=status&value=1&authToken=' + environment.authToken).then((exp_acc: any) =>
    {
      this.exp_acc_info = exp_acc;
      this.feedData_exp(exp_acc);
    }).catch(error => {this.toastrService.error('API Faild : loadData expense '); });

    await this.api.get('get_data.php?table=tax&authToken=' + environment.authToken).then((gst_per: any) =>
    {
      this.gst_percent = gst_per;
    }).catch(error => {this.toastrService.error('API Faild : loadData tax'); });

    await this.api.get('get_data.php?table=invoice&find=status&value=1&asign_field=invoice_id&asign_value=DESC&authToken=' + environment.authToken).then((inv_list: any) =>
    {
      this.invoice_list = inv_list;
    }).catch(error => {this.toastrService.error('API Faild : loadData vendor'); });

    await this.api.get('get_data.php?table=bill&find=status&value=1&asign_field=bill_id&asign_value=DESC&authToken=' + environment.authToken).then((bill_list: any) =>
    {
      this.bill_list = bill_list;
    }).catch(error => {this.toastrService.error('API Faild : loadData customers'); });

    await this.api.get('get_data.php?table=projects&find=status&value=1&authToken=' + environment.authToken).then((pro_list: any) =>
    {
      this.project_list = pro_list;
    }).catch(error => {this.toastrService.error('API Faild : loadData projects'); });
  }

  load_transaction()
  {}

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
    let i = 0 ; let j = 0 ; let k = 0; let l = 0; let m = 0; let n=0; let p =0;
    for (i = 0; i<this.bankData_length; i++)
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

        if ( bankid == this.user_bank_id && this.bankData[i].status == 1 )
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

        if (type === 1 && mode === 3)
        {
          this.employee_account[p] = this.bankData[i];
          p++;
        }
        else{}
      }
  }

  feedData_exp(exp_acc:any) {

    this.Expense_Data = exp_acc;

    for (let i = 0; i < exp_acc.length; i++)
    {
        //  if (this.Expense_Data[i].account_type != null)
        //  {
             let mode = this.Expense_Data[i].account_type;
             switch (mode) {
                 case 1:
                     this.fixed_asset.push(this.Expense_Data[i]);
                    break;
                 case 2:
                     this.other_current_asset.push(this.Expense_Data[i]);
                     break;
                 case 3:
                     this.other_current_liability.push(this.Expense_Data[i]);
                     break;
                 case 4:
                     this.other_liability.push(this.Expense_Data[i]);
                     break;
                 case 5:
                     this.expense.push(this.Expense_Data[i]);
                     break;
                case 6:
                    this.cost_cf_goods_sold.push(this.Expense_Data[i]);
                    break;
                case 7:
                    this.other_expense.push(this.Expense_Data[i]);
                    break;
                 default:
                 //    console.log("Unknown mode:", mode);
         //    }
         }
    }
}


  async AddNewExpen(data)
  {
    Object.keys(this.addExpen.controls).forEach(field =>
      {
        const control = this.addExpen.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if (this.addExpen.valid)
    {
      this.loading=true;
      await this.api.get('get_data.php?table=bank&find=bank_id&value='+data.paid_through+'&authToken=' + environment.authToken).then((get_data: any) =>
      {
        this.balance = get_data[0].balance;
      }).catch(error => { this.toastrService.error('Unable to load bank balance contact super admin'); });

      let total_amount = data.amount + data.tax_rate;

      // if(total_amount <= this.balance)
      // {
        await this.api.post('mp_expense.php?authToken=' + environment.authToken, data).then((data: any) =>
        {

          if(data.status == "success")
            {
              this.loading=false;
              this.toastrService.success('Expense Added Succesfully');
              this.expense_list_load()
              this.show = false;
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
              this.loadData();
              this.balance_disp = 0;
            }
          else
            { this.toastrService.error(data.status);
              this.loading=false;}
            return true;
        }).catch(error => {this.toastrService.error('API Faild : Expense Add Process');});
      }
      // else
      // {
      //   this.toastrService.error("You don't have sufficient balance in source account");
      // }
    //}
    else
    {
      this.toastrService.error('Please make sure all fields are filled in correctly');
    }
  }

  onSelect_bill(event)
  {

    var value= this.bill_list.find(t=>t.bill_id == event);

    if(value != undefined)
      this.addExpen.controls['inv_number'].setValue(value.bill_number);
      this.addExpen.controls['vendor'].setValue(null);
      this.addExpen.controls['project'].setValue(null);
    if(value == undefined)
      this.addExpen.controls['inv_number'].setValue(null);
  }

  onSelect_inv(event)
  {

    var value= this.invoice_list.find(t=>t.invoice_id == event);
    if(value != undefined)
    {
        this.addExpen.controls['inv_number'].setValue(value.invoice_number);
        this.addExpen.controls['customer'].setValue(null);
        this.addExpen.controls['project'].setValue(null);
    }
    if(value == undefined)
    {
       this.addExpen.controls['inv_number'].setValue(null);
    }
  }

  onSelect_pro(event)
  {
    var value= this.project_list.find(t=>t.project_id == event);
    if(value != undefined)
    {
        this.addExpen.controls['inv_number'].setValue(value.name);
        this.addExpen.controls['customer'].setValue(null);
        this.addExpen.controls['vendor'].setValue(null);
    }
    if(value == undefined)
    {
       this.addExpen.controls['inv_number'].setValue(null);
    }
  }


  add_expense()
  {
    this.show = true
  }

  setzero()
  {
    this.show = false
  }

  Onclick(event)
  {
    if(event.type == "click")
      {
         this.select_id  = event.row.id
         this.model_open  = this.modalService.open(this.delete, { size: 'md' });
      }
  }

  ReqDelete()
  {
    
    this.loading= true;
    this.api.post('mp_transaction_delete.php?id='+this.select_id+'&uid='+this.uid+'&authToken=' + environment.authToken, null).then((data: any) =>
      {

        if(data.status == "success")
          {
            this.loading=false;
            this.toastrService.success('Expense Deleted Succesfully');
            this.expense_list_load()
            this.model_open.close();
          }
        else
          { this.toastrService.error(data.status);
            this.loading=false;}
          return true;
      }).catch(error => {this.toastrService.error('API Faild : Expense Deleted Process');});
  }
}
