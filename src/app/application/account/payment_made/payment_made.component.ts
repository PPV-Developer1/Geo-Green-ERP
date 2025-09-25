import { Component, ElementRef, OnInit ,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { environment } from "../../../../environments/environment";
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-payment_made',
  templateUrl: './payment_made.component.html',
  styleUrls: ['./payment_made.component.scss']
})


export class Payment_madeComponent implements OnInit {


  public uid        = localStorage.getItem('uid');
  public user_type  = localStorage.getItem('type');

  all_account               = [];
  user_account              = [];
  company_account           = [];
  cash_account              = [];
  gst_account               = [];
  user_bank_id              = [];

  payment_transaction : any;
  selected            = [];
  temp                : any;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("Add_advance", { static: true }) Add_advance   : ElementRef;
  today               = new Date();
  todaysDate          = '';
  vendor_advance      : FormGroup;
  vendor_list         : any;
  bankData            : any;
  bankData_length     : any;
  loading             : boolean;
  model_open          : any;
  prefix              : any;
  receipt_serial_no   : any;
  constructor(    private modalService : NgbModal,
    public  fb           : FormBuilder,
    public  toastrService: ToastrService,
    private api          : ApiService) {

      {
        this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530'); // hh:mm:ss a

        this.vendor_advance =fb.group({
            'created_by': [this.uid],
            receipt_no  : [null],
            tran_mode   : [null, Validators.compose([Validators.required])],
            from_bank   : [1, Validators.compose([Validators.required])],
            to_bank     : [null, Validators.compose([Validators.required])],
            amount      : [null,Validators.compose([Validators.required])],
            tran_date   : [this.todaysDate],
            reference   : ["Advance amount", Validators.compose([Validators.required, Validators.minLength(3)])],
            description : [null, Validators.compose([Validators.required, Validators.minLength(3)])]
          })
        }
    }

  ngOnInit() {
    this.load_paymentTransactiond();
  }
  load_paymentTransactiond()
  {
     this.api.get('mp_payment_made.php?&authToken=' + environment.authToken).then((data) =>
    {
      this.payment_transaction = data;
      this.temp=[...data]
    }).catch(error => { });

    this.api.get('get_data.php?table=vendor&authToken='+environment.authToken).then((data: any) =>
    {
      this.vendor_list = data;

    }).catch(error => { });


    this.api.get('get_data.php?table=bank&authToken='+environment.authToken).then((data: any) =>
    {
       this.feedData(data);
    }).catch(error => { });
  }

  Onclick(event)
  {
     if(event.type=='click')
     {
     localStorage.setItem('select_id', event.row.tran_id);
    }
  }
  setzero()
  {
    this.selected=[];
  }

  updateFilter(event) {

    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });
    this.payment_transaction = temp;
    this.table.offset = 0;
  }

 async advance()
  {
    await this.api.get('get_data.php?table=prefix&authToken=' + environment.authToken).then((data) =>
    {
      this.prefix = data[0].payment_receipt;
    }).catch(error => { this.toastrService.error('API Faild : AddNewTrans')});

    await this.api.get('get_data.php?table=payment_made&asign_field=tran_id&asign_value=DESC&authToken=' + environment.authToken).then((data) =>
    {
      if(data != null)
      {
         this.receipt_serial_no = data[0].serial_no+1;
      }
      else
      {
         this.receipt_serial_no = 1;
      }
    }).catch(error => { this.toastrService.error('API Faild : AddNewTrans')});

     await this.api.get('get_data.php?table=bank&authToken=' + environment.authToken).then((data) =>
    {
      this.feedData(data) ;

    }).catch(error => { });

    let serial_no = this.prefix+this.receipt_serial_no;
    this.vendor_advance.controls['receipt_no'].setValue(serial_no);
    this.model_open  = this.modalService.open(this.Add_advance, { size: 'md' });

  }


  feedData(data)
  {
    this.bankData        = data;
    this.bankData_length = data.length;

    let j = 0 ; let k = 0; let l = 0; let m = 0; let n=0;
    for (let i = 0; i<this.bankData_length; i++)
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
      }

  }


  advance_submit(data)
  {
       Object.keys(this.vendor_advance.controls).forEach(field =>
        {
          const control = this.vendor_advance.get(field);
          control.markAsTouched({ onlySelf: true });
        });

      if (this.vendor_advance.valid)
      {
        this.loading = true;
         this.api.post('mp_vendor_advance.php?authToken=' + environment.authToken, this.vendor_advance.value).then((data: any) =>
        {
          console.log(data)
          if(data.status == "success")
            {
              this.loading = false;
              this.toastrService.success('Advance Transaction Succesfully');

              this.vendor_advance.controls['tran_mode'].reset(0);
              this.vendor_advance.controls['from_bank'].reset();
              this.vendor_advance.controls['to_bank'].setValue(1);
              this.vendor_advance.controls['reference'].reset();
              this.vendor_advance.controls['description'].reset();
              this.vendor_advance.controls['amount'].setValue(0);
              this.model_open.close();

              this.load_paymentTransactiond();
            }
          else
          {
            this.toastrService.error(data.status);
            this.loading = false;
          }
          return true;
        }).catch(error =>
        {
            this.toastrService.error('API Faild : Item Added failed');
            this.loading = false;
        });
      }
      else{
        this.toastrService.error('Fill the Required Details');
      }
  }

}
