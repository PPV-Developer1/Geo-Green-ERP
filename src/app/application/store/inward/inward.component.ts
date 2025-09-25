import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import {formatDate } from '@angular/common';


@Component({
  selector: 'az-inward',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './inward.component.html',
  styleUrls: ['./inward.component.scss']
})
export class InwardComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("accept_inward",{static:true}) accept_inward:ElementRef;

  public uid = localStorage.getItem('uid');

  today      = new Date();
  todaysDate = '';
  todaysTime = '';

  item_list   = [];
  filter_data = [];
  selected    = [];
  detail_view = [];
  LastId     : any;
  next_id    : any;
  batchCode  : any;
  has_serial : any;
  qty        : any;
  prefix     : any;
  todays_Date = '';
  batchError : boolean = false;
  loading    : boolean = false;
  seriel_no  : FormGroup;
  InwardEntry = new FormGroup
  ({
      'inward_by'     : new FormControl(this.uid),
      batch           : new FormControl(null, [Validators.required]),
      inward_at       : new FormControl(null, [Validators.required]),
      inward_qty      : new FormControl(null, [Validators.required]),
      notes           : new FormControl(null),
      seriel_no       : this.fb.array([])
    })

    DebitNoteForm = new FormGroup
  ({
      created_by      : new FormControl(this.uid),
      bill_to         : new FormControl(null, [Validators.required]),
      vendor_id       : new FormControl(null, [Validators.required]),
      payment_term    : new FormControl(null, [Validators.required]),
      bill_number     : new FormControl(null, [Validators.required]),
      note            : new FormControl(null, [Validators.required]),
      terms_condition : new FormControl(null, [Validators.required]),
      item_id         : new FormControl(null, [Validators.required]),
      item_description: new FormControl(null, [Validators.required]),
      qty             : new FormControl(null, [Validators.required]),
      amount          : new FormControl(null, [Validators.required]),
      hsn             : new FormControl(null, [Validators.required]),
      uom             : new FormControl(null, [Validators.required]),
      tax_percent     : new FormControl(null, [Validators.required]),
      inward_id       : new FormControl(null, [Validators.required]),
      total           : new FormControl(null, [Validators.required]),
      type            : new FormControl('vendor'),
    })

  constructor
  (
    public fb           : FormBuilder,
    public toastrService: ToastrService,
    private api         : ApiService
  )
  {
    this.todaysDate = formatDate(this.today, 'ddMMyy', 'en-US', '+0530');
    this.todaysTime = formatDate(this.today, 'hh:mm', 'en-US', '+0530');
    this.todays_Date = formatDate(this.today, 'yyyy-MM-dd HH:mm:ss', 'en-US', '+0530');
  }

  ngOnInit()
  {
    this.getProductList();
  }

  async getProductList()
  {
    await this.api.get('mp_bill_item_list.php?format=inward&authToken='+environment.authToken).then((data: any) =>
    {
      if(data != null)
      {
        this.item_list    = data;
        this.filter_data  = [...data];
        console.log(data)
      }
      else
      {
        this.item_list   = null;
        this.filter_data = null;
      }
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  async onActivate(event)
  {
    if(event.type === "click")
    {
      console.log(event.row)
      this.detail_view = event.row;
      this.has_serial  = event.row.have_seriel_number;
      this.qty         = event.row.qty;
      const billDate = this.detail_view['bill_date'];
      const formattedDate = billDate.substring(8, 10) + billDate.substring(5, 7) + billDate.substring(2, 4);
      this.batchCode   = formattedDate+'/'+this.detail_view['item_list_id'];

      await this.api.get('get_data.php?table=stock_list&find=batch&value='+this.batchCode+'&authToken='+environment.authToken).then((data: any) =>
        {
          if(data != null)
          {
             const count = data.length +1
            this.batchCode   = formattedDate+'/'+this.detail_view['item_list_id']+'-'+count;
          }
        }).catch(error => {this.toastrService.error('Something went wrong');});
        setTimeout(() => {
          this.InwardEntry.controls['batch'].setValue(this.batchCode);
          this.InwardEntry.controls['inward_at'].setValue(this.todays_Date);
          this.InwardEntry.controls['inward_qty'].setValue(this.detail_view['qty']);
          this.seriel_box();
        }, 500);
    }
  }

  set_zero()
  {
    this.selected = [];
    this.has_serial = 0;
  }

  clearError()
  {
    this.batchError = false;
  }

  async InwardSubmit(value)
  {
    Object.keys(this.InwardEntry.controls).forEach(field =>
      {
        const control = this.InwardEntry.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      if(this.InwardEntry.valid)
      {
        this.loading = true;
        let batch    = this.InwardEntry.value['batch'];

        await this.api.get('get_data.php?table=stock_list&find=batch&value='+batch+'&authToken='+environment.authToken).then((data: any) =>
        {
          if(data === null)
          {
            let id = this.detail_view['bill_item_id'];
            this.api.post('mp_stock_inward.php?bill_item_id='+id+'&authToken='+environment.authToken, value).then(async (data: any) =>
              {
                if(data.status == "success")
                {
                  this.DebitNoteForm.controls['inward_id'].setValue(data.last_id)
                  console.log(Number(this.detail_view['qty']));
                  console.log(Number(this.InwardEntry.value['inward_qty']));
                  var qty = Number(this.detail_view['qty']) - Number(this.InwardEntry.value['inward_qty']);
                  console.log(qty);
                   if (qty > 0) {
                      await this.DebitNote(qty);
                    }
                    else if (qty < 0) {
                        qty = qty * -1;
                        console.log("credit note",qty);
                     await   this.CreaditNote(qty)
                    }
                  this.loading = false;
                  this.toastrService.success('Inward Added Succesfully');
                  this.InwardEntry.controls['batch'].reset();
                  this.InwardEntry.controls['inward_at'].reset();
                  this.InwardEntry.controls['inward_qty'].reset();
                  this.InwardEntry.controls['notes'].reset();

                  const formArray         = this.InwardEntry.get('seriel_no') as FormArray;
                  const formArrayLength   = formArray.length;
                  const formArrayControls = formArray.controls;
                  for (let i = formArrayControls.length-1; i >0; i--)
                  {
                    const control = formArrayControls[i];
                    formArray.removeAt(i);
                  }
                  this.has_serial = 0;
                  this.selected = [];
                  this.ngOnInit();
                  setTimeout(() => {}, 500);
                }
                else { this.toastrService.error('Something went wrong');
                this.loading = false;}

                return true;
              }).catch(error =>
              {
                  this.toastrService.error('Something went wrong');
                  this.loading = false;
              });
          }
          else if (data != null)
          {
            this.batchError = true;
            this.toastrService.error('Batch Number Already Exist');
            this.loading = false;
          }
        }).catch(error => {this.toastrService.error('Something went wrong');});
      }
      else
      {
        this.toastrService.error('Please Fill all data!');
        this.loading = false;
      }
  }

  updateFilter(event)
  {
    const val = event.target.value.toLowerCase();
    const temp = this.filter_data.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });
    this.item_list = temp;
    this.table.offset = 0;
  }

  seriel_box()
  {
    let product = this.InwardEntry.get('seriel_no') as FormArray;
    product.clear();
    for(let i=1;i<=this.qty;i++)
    {
        let product = this.InwardEntry.get('seriel_no') as FormArray;
        product.push(this.fb.group({
          seriel_number  : new FormControl(null,),
        }))
    }
  }

 async DebitNote(qty)
  {
      // var serial_no:any
      //  await this.api.get('get_data.php?table=prefix&authToken='+environment.authToken).then((data: any) =>
      //   {
      //       this.prefix = data[0]['debit_note']
      //       console.log(this.prefix)
      //   }).catch(error => {this.toastrService.error('Something went wrong');});

      //  await this.api.get('get_data.php?table=debit_note&asign_field=id&asign_value=DESC&authToken='+environment.authToken).then((data: any) =>
      //   {
      //       if(data.length>0)
      //       {
      //         serial_no=`${this.prefix}${data[0].serial_no+1}`
      //       }
      //       else{serial_no=`${this.prefix}${1}`}
      //   }).catch(error => {this.toastrService.error('Something went wrong');});

       const amount = (this.detail_view['total']/this.detail_view['qty']).toFixed(2)
        const total  = (Number(amount)*qty).toFixed(2)

        this.DebitNoteForm.controls["bill_number"].setValue(this.detail_view['bill_number'])
        this.DebitNoteForm.controls["bill_to"].setValue(this.detail_view['bill_from'])
        this.DebitNoteForm.controls["vendor_id"].setValue(this.detail_view['vendor_id'])
        this.DebitNoteForm.controls["payment_term"].setValue(this.detail_view['payment_term'])
        this.DebitNoteForm.controls["note"].setValue(this.detail_view['note'])
        this.DebitNoteForm.controls['terms_condition'].setValue(this.detail_view['terms_condition'])
        // this.DebitNoteForm.controls['debitnote_no'].setValue(serial_no)
        this.DebitNoteForm.controls['item_id'].setValue(this.detail_view['item_list_id'])
        this.DebitNoteForm.controls['item_description'].setValue(this.detail_view['item_description'])
        this.DebitNoteForm.controls['qty'].setValue(qty)
        this.DebitNoteForm.controls['amount'].setValue(amount)
        this.DebitNoteForm.controls['hsn'].setValue(this.detail_view['hsn'])
        this.DebitNoteForm.controls['uom'].setValue(this.detail_view['uom'])
        this.DebitNoteForm.controls['tax_percent'].setValue(this.detail_view['tax_percent'])
        this.DebitNoteForm.controls['total'].setValue(total)
        console.log("form : ",this.DebitNoteForm.value)
        if(this.DebitNoteForm.valid)
        {
          await this.api.post('debit_note_create.php?&authToken='+environment.authToken, this.DebitNoteForm.value).then((data: any) =>
              {
                console.log(data)
                if(data.status =="success")
                {
                  console.log(data.status =="success")
                }
              }).catch(error => {this.toastrService.error('Something went wrong');});
        }
  }

  async CreaditNote(qty)
  {
      // var serial_no:any
      //  await this.api.get('get_data.php?table=prefix&authToken='+environment.authToken).then((data: any) =>
      //   {
      //       this.prefix = data[0]['debit_note']
      //       console.log(this.prefix)
      //   }).catch(error => {this.toastrService.error('Something went wrong');});

      //  await this.api.get('get_data.php?table=credit_note&asign_field=id&asign_value=DESC&authToken='+environment.authToken).then((data: any) =>
      //   {
      //       if(data.length>0)
      //       {
      //         serial_no=`${this.prefix}${data[0].serial_no+1}`
      //       }
      //       else{serial_no=`${this.prefix}${1}`}
      //   }).catch(error => {this.toastrService.error('Something went wrong');});

        const amount = (this.detail_view['total']/this.detail_view['qty']).toFixed(2)
        const total  = (Number(amount)*qty).toFixed(2)
        this.DebitNoteForm.controls["bill_number"].setValue(this.detail_view['bill_number'])
        this.DebitNoteForm.controls["bill_to"].setValue(this.detail_view['bill_from'])
        this.DebitNoteForm.controls["vendor_id"].setValue(this.detail_view['vendor_id'])
        this.DebitNoteForm.controls["payment_term"].setValue(this.detail_view['payment_term'])
        this.DebitNoteForm.controls["note"].setValue(this.detail_view['note'])
        this.DebitNoteForm.controls['terms_condition'].setValue(this.detail_view['terms_condition'])
        // this.DebitNoteForm.controls['debitnote_no'].setValue(serial_no)
        this.DebitNoteForm.controls['item_id'].setValue(this.detail_view['item_list_id'])
        this.DebitNoteForm.controls['item_description'].setValue(this.detail_view['item_description'])
        this.DebitNoteForm.controls['qty'].setValue(qty)
        this.DebitNoteForm.controls['amount'].setValue(amount)
        this.DebitNoteForm.controls['hsn'].setValue(this.detail_view['hsn'])
        this.DebitNoteForm.controls['uom'].setValue(this.detail_view['uom'])
        this.DebitNoteForm.controls['tax_percent'].setValue(this.detail_view['tax_percent'])
        this.DebitNoteForm.controls['total'].setValue(total)
        console.log("form : ",this.DebitNoteForm.value)

        if(this.DebitNoteForm.valid)
        {
          await this.api.post('credit_note_create.php?&authToken='+environment.authToken, this.DebitNoteForm.value).then((data: any) =>
              {
                console.log(data)
                if(data.status =="success")
                {
                  console.log(data.status =="success")
                }
              }).catch(error => {this.toastrService.error('Something went wrong');});
        }
  }
}

