import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector     : 'az-payment_transfer',
  templateUrl  : './payment_transfer.component.html',
  styleUrls    : ['./payment_transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Payment_transferComponent implements OnInit
{
  public user_bank_id = localStorage.getItem('bank_id');
  public user_type    = localStorage.getItem('type');
  public uid          = localStorage.getItem('uid');

  today               = new Date();
  todaysDate          = '';

  bankData            : any;
  bankData_length     : any;
  all_account         = [];
  user_account        = [];
  company_account     = [];
  cash_account        = [];
  gst_account         = [];
  employee_account    = [];

  balance             : any;
  addTrans            : FormGroup;
  loading             : boolean=false;
  constructor
  (
    public fb           : FormBuilder,
    public toastrService: ToastrService,
    private api         : ApiService
  )
  {
    this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530'); // hh:mm:ss a
    this.addTrans   = fb.group(
      {
        'created_by': [this.uid],
        tran_mode   : [0, Validators.compose([Validators.required, Validators.min(1)])],
        from_bank   : [null, Validators.compose([Validators.required, Validators.min(1)])],
        to_bank     : [null, Validators.compose([Validators.required, Validators.min(1)])],
        amount      : [0],
        tran_date   : [this.todaysDate],
        reference   : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
        description : [null, Validators.compose([Validators.required, Validators.minLength(3)])]
      }
    )
  }

  ngOnInit()
  {
    this.loadData();
  }
  async loadData()
  {
    await this.api.get('get_data.php?table=bank&authToken=' + environment.authToken).then((data: any) =>
    {
      this.feedData(data) ;
    }).catch(error => { });
  }

  feedData(data)
  {
    this.bankData        = data;
    this.bankData_length = data.length;

    let j = 0 ; let k = 0; let l = 0; let m = 0; let n=0; let p=0
    for (let i = 0; i<=this.bankData_length; i++)
      {
        if (this.bankData[i].type == 1 && this.bankData[i].mode == 1 && this.bankData[i].status == 1 )
        {
          this.company_account[j] = this.bankData[i];
          j++;
        }
        if (this.bankData[i].type == 1 && this.bankData[i].mode == 2 && this.bankData[i].status == 1 )
        {
          this.cash_account[k] = this.bankData[i];
          k++;
        }
        if (this.bankData[i].type == 1 && this.bankData[i].mode == 3 && this.bankData[i].status == 1 )
        {
          this.all_account[l] = this.bankData[i];
          l++;
        }
        if (this.bankData[i].bank_id == this.user_bank_id && this.bankData[i].status == 1 )
        {
          this.user_account[m] = this.bankData[i];
          m++;
        }
        if (this.bankData[i].type == 2 && this.bankData[i].mode == 1 && this.bankData[i].status == 1 )
        {
          this.gst_account[n] = this.bankData[i];
          n++;
        }

        if (this.bankData[i].type === 1 && this.bankData[i].mode === 3)
        {
          this.employee_account[p] = this.bankData[i];
          p++;
        }

      }
  }

  async AddNewTrans(data)
  {

    Object.keys(this.addTrans.controls).forEach(field =>
      {
        const control = this.addTrans.get(field);
        control.markAsTouched({ onlySelf: true });
      });

    if (this.addTrans.valid)
    {
      const confirmed = confirm("Do you want to proceed with the transaction?");
        console.log(confirmed)
        if (!confirmed) {
          return;
        }
      this.loading=true;
      await this.api.get('get_data.php?table=bank&find=bank_id&value='+data.from_bank+'&authToken=' + environment.authToken).then((get_data: any) =>
      {
        this.balance = get_data[0].balance;
      }).catch(error => { this.toastrService.error('API Faild : AddNewTrans'); });

      // if(data.amount <= this.balance)
      // {
        if(data.from_bank == data.to_bank)
        {
          this.toastrService.error("You Can't Transfer amount in same accounts");
          this.loading=false;
        }
        else
        {
          await this.api.post('mp_bank_trans.php?authToken=' + environment.authToken, data).then((data: any) =>
          {
            console.log(data)
            if(data.status == "success")
              {
                this.toastrService.success('Transaction Succesfully');
                this.loadData();

                this.addTrans.controls['tran_mode'].setValue(0);
                this.addTrans.controls['from_bank'].reset();
                this.addTrans.controls['to_bank'].reset();
                this.addTrans.controls['reference'].reset();
                this.addTrans.controls['description'].reset();
                this.addTrans.controls['amount'].setValue(0);
                this.loading=false; }
            else
              { this.toastrService.error(data.status);
                this.loading=false; }
              return true;
          }).catch(error => {this.toastrService.error('API Faild : AddNewTrans');
               this.loading=false;});


        }
      // }
      // else
      // {
      //   this.toastrService.error("You don't have sufficient balance in source account");
      // }
    }
    else
    {
      this.toastrService.error('Please make sure all fields are filled in correctly');
    }
  }


  selecct(value)
  {
  }
}
