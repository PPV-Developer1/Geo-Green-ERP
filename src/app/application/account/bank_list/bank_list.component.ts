import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as XLSX from "xlsx";

@Component({
  selector   : 'az-bank_list',
  templateUrl: './bank_list.component.html',
  styleUrls  : ['./bank_list.component.scss']
})
export class Bank_listComponent implements OnInit
{
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("add_account",{static:true})  add_account:ElementRef;
  @ViewChild("add_expense",{static:true})  add_expense:ElementRef;
  @ViewChild("edit_expense",{static:true}) edit_expense:ElementRef;
  @ViewChild("edit_account",{static:true}) edit_account:ElementRef;
  @ViewChild("content", { static: true })  content: ElementRef;

  public uid                = localStorage.getItem('uid');
  public user_type          = localStorage.getItem('type');
  public user_bank_id       = localStorage.getItem('bank_id');

  public account_name       : AbstractControl;
  public mode               : AbstractControl;
  public opening_balance    : AbstractControl;
  public level              : AbstractControl;
  public status             : AbstractControl;
  public bank_id            : AbstractControl;

  editing                   = {};
  rows                      = [];
  temp                      = [];
  selected                  = [];
  detail_view               = [];
  price                     = '1000000';
  statement                 = [];

  newAccountValue           : any;
  bankData                  : any;
  transaction               : any;
  modalRef                  : any;
  selected_bank_id          : any;
  transeaction_det          : any;
  addExpense                : any;
  expenseData               : any;
  expense_detail_view       : any;
  selected_id               : any;
  expense_transeaction_det  : any;

  show                      : boolean=false;
  loading                   : boolean=false;
  addAccount                : FormGroup;
  date                      : FormGroup;


  constructor
  (
    private modalService: NgbModal,
    public fb           : FormBuilder,
    public toastrService: ToastrService,
    private api         : ApiService,

  )
  {
    this.addAccount = fb.group(
      {
        'created_by'    : [this.uid],
         account_name   : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
         mode           : [0, Validators.compose([Validators.required, Validators.min(1)])],
         opening_balance: [0],
        'type'          : ['1'],
        'status'        : ['1']
      }
    )
    this.addExpense = fb.group(
      {
        'created_by'    : [this.uid],
         account_name   : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
         mode           : [0, Validators.compose([Validators.required, Validators.min(1)])],
         'status'       : ['1']
      }
    )

    this.date = fb.group(
      {
         fromdate       : [null],
         todate         : [null],
      }
    )
  }

  ngOnInit()
  {
    this.loadData();
  }

  AccountAddButton()
  {
    this.modalRef =  this.modalService.open(this.add_account, { size: 'xl'});
  }

  ExpenseAddButton()
  {
    this.modalRef =  this.modalService.open(this.add_expense, { size: 'xl'});
  }
  AccountEditButton()
  {
    this.modalRef =  this.modalService.open(this.edit_account, { size: 'xl'});
  }
  ExpenseEditButton()
  {
    this.modalRef =  this.modalService.open(this.edit_expense, { size: 'xl'});
  }

  loadData()
  {
    if (this.user_type == "super_admin")
    {
      this.api.get('get_data.php?table=bank&find=type&value=1&authToken=' + environment.authToken).then((data: any) =>
      {
        this.bankData = data;
      }).catch(error => {
        this.toastrService.error('API Faild : loadData  bank list');
      });
    }
    if (this.user_type != "super_admin")
    {
      this.api.get('get_data.php?table=bank&find=bank_id&value='+this.user_bank_id+'&authToken=' + environment.authToken).then((data: any) =>
      {
        this.bankData = data;
      }).catch(error => {
        this.toastrService.error('API Faild : loadData bank list');
      });
    }

    this.api.get('get_data.php?table=expense_account&authToken=' + environment.authToken).then((data: any) =>
    {
      this.expenseData = data;
    }).catch(error => {
      this.toastrService.error('API Faild : loadData expence');
    });

    this.api.get('get_data.php?table=bank_transactions&authToken=' + environment.authToken).then((data: any) =>
    {
      this.transaction = data;
    }).catch(error => { this.toastrService.error('API Faild : loadData bank transaction details'); });
  }

  async newAccount(addAccount)
  {
    Object.keys(this.addAccount.controls).forEach(field =>
      {
        const control = this.addAccount.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if (this.addAccount.valid)
    {
      this.loading = true;
      await this.api.post('post_insert_data.php?table=bank&authToken=' + environment.authToken, addAccount).then((data: any) =>
      {
        if(data.status == "success")
          { this.toastrService.success('Account Added Succesfully');
            this.loading = false; }
        else
        { this.toastrService.error(data.status); }
        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : newAccount');
      });
      this.modalRef.dismiss();
      this.loadData();
      this.addAccount.controls['account_name'].reset();
      this.addAccount.controls['mode'].setValue(0);
      this.addAccount.controls['opening_balance'].setValue(0);
    }
    else
    {
      this.toastrService.error('Please make sure all fields are filled in correctly');
    }
  }

  async editAccount(editAccount)
  {
    if (this.addAccount.valid)
    {
      this.loading=true;
      await this.api.post('post_update_data.php?table=bank&field=bank_id&value='+this.detail_view['bank_id']+'&authToken=' + environment.authToken, editAccount).then((data: any) =>
      {
        if(data.status == "success")
          { this.toastrService.success('Account Updated Succesfully');
            this.loading=false; }
        else
          {this.toastrService.error(data.status);
            this.loading=false; }
        return true;
      }).catch(error => {this.toastrService.error('API Faild : edit bank Account ');
      this.loading=false;  });
      this.modalRef.dismiss();

      await this.api.get('get_data.php?table=bank&find=bank_id&value='+this.detail_view['bank_id']+'&authToken=' + environment.authToken).then((data: any) =>
      {
        this.detail_view = data[0];
      }).catch(error => {
        this.toastrService.error('API Faild : load edit Account ');
        this.selected = [];
      });
      this.addAccount.controls['account_name'].reset();
      this.addAccount.controls['mode'].setValue(0);
      this.addAccount.controls['opening_balance'].setValue(0);
    }
    else{ this.toastrService.error('Please make sure all fields are filled in correctly');}
  }

  async submitAccount_expense(editExpense)
  {
    if (this.addExpense.valid)
    {
      await this.api.post('post_update_data.php?table=expense_account&field=id&value='+this.expense_detail_view['id']+'&authToken=' + environment.authToken, editExpense).then((data: any) =>
      {
        if(data.status == "success")
          {
            this.toastrService.success('Account Updated Succesfully');
            this.loadData()
            this.api.get('get_data.php?table=expense_account&find=id&value='+this.expense_detail_view['id']+'&authToken=' + environment.authToken).then((data: any) =>
              {
                this.expense_detail_view = data[0];
              }).catch(error => {
                this.toastrService.error('API Faild : load edit expence Account ');
                this.selected = [];
              });
            this.addExpense.controls['account_name'].reset();
            this.addExpense.controls['mode'].reset();
        }
        else
          {this.toastrService.error(data.status);}
        return true;
      }).catch(error =>
      {  this.toastrService.error('API Faild :  edit expence Account ');});
      this.modalRef.dismiss();


    }
    else
    {  this.toastrService.error('Please make sure all fields are filled in correctly'); }
  }
  set_zero()
  {
    this.selected = [];
    this.show = false;
  }

  EditAccount()
  {
    this.addAccount.controls['account_name'].setValue(this.detail_view['account_name']);
    this.addAccount.controls['mode'].setValue(this.detail_view['mode']);
    this.addAccount.controls['opening_balance'].setValue(this.detail_view['opening_balance']);
    this.AccountEditButton();
  }

  EditAccount_expense()
  {
    this.addExpense.controls['account_name'].setValue(this.expense_detail_view['account_name']);
    this.addExpense.controls['mode'].setValue(this.expense_detail_view['account_type']);
    this.ExpenseEditButton();
  }
  async DisableAccount()
  {
    await this.api.get('single_field_update.php?table=bank&field=bank_id&value='+this.detail_view['bank_id']+'&update=0&up_field=status&authToken=' + environment.authToken).then((data: any) =>
      {
        if(data.status == "success")
          {
            this.toastrService.warning('Account Disabled Succesfully');
            let id = this.detail_view['bank_id'];
            this.loadData();
            this.api.get('get_data.php?table=bank&find=bank_id&value='+id+'&authToken=' + environment.authToken).then((data: any) =>
            {
              this.detail_view = data[0];
            }).catch(error => {
              this.toastrService.error('Unable to reload');
            });
          }
        else
        { this.toastrService.error(data.status); }
        return true;
      }).catch(error =>
      {  this.toastrService.error('API Faild : DisableAccount');});
  }

  async EnableAccount()
  {
    await this.api.get('single_field_update.php?table=bank&field=bank_id&value='+this.detail_view['bank_id']+'&update=1&up_field=status&authToken=' + environment.authToken).then((data: any) =>
      {
        if(data.status == "success")
          {
            this.toastrService.success('Account Enabled Succesfully');
            let id = this.detail_view['bank_id'];
            this.loadData();
            this.api.get('get_data.php?table=bank&find=bank_id&value='+id+'&authToken=' + environment.authToken).then((data: any) =>
            {
              this.detail_view = data[0];
            }).catch(error => {this.toastrService.error('Unable to reload');});
          }
        else
        { this.toastrService.error(data.status); }
        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : EnableAccount');
      });
  }

  async DisableAccount_expense()
  {
    await this.api.get('single_field_update.php?table=expense_account&field=id&value='+this.expense_detail_view['id']+'&update=0&up_field=status&authToken=' + environment.authToken).then((data: any) =>
      {
        if(data.status == "success")
          {
            this.toastrService.warning('Account Disabled Succesfully');
            let id = this.expense_detail_view['id'];
            this.loadData();
            this.api.get('get_data.php?table=expense_account&find=id&value='+id+'&authToken=' + environment.authToken).then((data: any) =>
            {
              this.expense_detail_view = data[0];
            }).catch(error => {
              this.toastrService.error('Unable to reload');
            });
          }
        else
        { this.toastrService.error(data.status); }

        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : DisableAccount');
      });
  }

  async EnableAccount_expense()
  {
    await this.api.get('single_field_update.php?table=expense_account&field=id&value='+this.expense_detail_view['id']+'&update=1&up_field=status&authToken=' + environment.authToken).then((data: any) =>
      {
        if(data.status == "success")
          {
            this.toastrService.success('Account Enabled Succesfully');
            let id = this.expense_detail_view['id'];
            this.loadData();
            this.api.get('get_data.php?table=expense_account&find=id&value='+id+'&authToken=' + environment.authToken).then((data: any) =>
            {
              this.expense_detail_view = data[0];
            }).catch(error => {this.toastrService.error('Unable to reload');});
          }
        else
        { this.toastrService.error(data.status); }
        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : EnableAccount');
      });
  }

  onActivate(event)
  {
    if (event.type === "click")
    {
      this.detail_view        = event.row;
      this.selected_bank_id   = event.row.bank_id;
      this.loadTranseaction(this.selected_bank_id)
      this.date.reset();
    }
  }

  onActivate_expense(event)
  {
    if (event.type === "click")
    {
      this.expense_detail_view     = event.row;
      this.selected_id             = event.row.id;
      this.ExpenceloadTranseaction(this.selected_id)
      this.show = true;
      this.selected = [];
      this.date.reset();
    }
  }

  loadTranseaction(data)
  {
    this.api.get('bank_transaction_list.php?value='+data+'&authToken=' + environment.authToken).then((data: any) =>
    {
      this.transeaction_det = data;
    }).catch(error => {this.toastrService.error('API Faild : loadTranseaction');});
  }

  ExpenceloadTranseaction(data)
  {
    this.api.get('get_data.php?table=expense&find=exp_account&value='+data+'&asign_field=exp_id&asign_value=DESC&authToken=' + environment.authToken).then((data: any) =>
    {
      this.expense_transeaction_det = data;

    }).catch(error => {this.toastrService.error('API Faild : loadTranseaction');});
  }

  async newExpense(addExpense)
  {

    Object.keys(this.addExpense.controls).forEach(field =>
      {
        const control = this.addExpense.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if (this.addExpense.valid)
    {
      this.loading = true;
      await this.api.post('post_insert_data.php?table=expense_account&authToken=' + environment.authToken, addExpense).then((data: any) =>
      {

        if(data.status == "success")
          { this.toastrService.success('Account Added Succesfully');
            this.loading = false;
            this.modalRef.dismiss();
            this.loadData();
            this.addExpense.controls['account_name'].reset();
            this.addExpense.controls['mode'].reset();}
        else
        { this.toastrService.error(data.status);
          this.loading = false; }
        return true;
      }).catch(error =>
      {
          this.toastrService.error('API Faild : newAccount');
          this.loading=false;
      });

    }
    else
    {
      this.toastrService.error('Please make sure all fields are filled in correctly');
    }
  }


  download(value,data)
  {
    let today = new Date();
    let year  = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day   = String(today.getDate()).padStart(2, '0');

    let formattedDate = `${year}-${month}-${day}`;

    let from_date = value.fromdate;
    let to_date   = value.todate;
    if(data =="bank")
    {
     var id   = this.detail_view['bank_id'];
     var name=this.detail_view['account_name'];
    }
    if(data =="expense")
    {
     var id   = this.expense_detail_view['id'];
     var name=this.expense_detail_view['account_name'];
    }
  if(  from_date <= to_date &&  to_date <= formattedDate)
   {
    this.api.post('mp_downloadReport_json.php?mode='+data+'&id='+id+'&from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, value).then((data: any[]) => {
      if (data != null)
        {
          // const csvData = this.convertToCSV(data);
          // this.downloadCSVFile(csvData, 'data_export.csv');
          // this.date.reset();

          this.exportToExcel(data, ''+name+'_transactions_'+formattedDate+'.xlsx');
          this.date.reset();
        }
        else
        {
          this.toastrService.warning('No data');
          this.date.reset();
        }
      })
      .catch(error => {
        this.toastrService.error('API Failed: loadTransaction');
      });
    }
    else{
      this.toastrService.warning('Choose the Correct Date ');
    }
  }

  exportToExcel(data: any[], filename: string)
  {
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

// csv data type start

  convertToCSV(data: any[]): string
  {
    const csvArray = [];
    const headers = Object.keys(data[0]);
    csvArray.push(headers.join(','));

    data.forEach(item => {
      const row = headers.map(key => item[key]);
      csvArray.push(row.join(','));
    });

    return csvArray.join('\n');
  }

  downloadCSVFile(csvData: string, filename: string)
  {
    const csvBlob = new Blob([csvData], { type: 'application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(csvBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();

    URL.revokeObjectURL(url);
  }
 // csv data type end

 close()
 {
  this.modalRef.dismiss();

 }
}


