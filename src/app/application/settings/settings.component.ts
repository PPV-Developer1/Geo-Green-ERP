import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'az-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit
{

  selected        = [];
  report_list     :any;
  report_group    :any;
  editAddress     :any;
  detail_view     :any;
  id              :any;
  file            :any;
  prefix_view     :any;
  prefix_list     :any;
  product_list    :any;
  unit_list       :any;
  tax_list        :any;
  payment_list    :any;
  list_tax        :any;
  menu_list       :any;
  user_type_list  :any;
  status_change_id:any;
  user_id         :any;
  select_menu     :any;
  parent_status   :any;
  parent_id       :any;
  update_id       :any;
  find_name       :any;
  pay_roll_list   :any;
  pay_roll_id     :any;
  list_report     :any;
  list_user_id    :any;

  report_view     :Boolean = false;
  payrole_view    :Boolean = false;
  menubar_view    :boolean = false;
  list_view       :boolean = false;
  unit_view       :boolean = false;
  show            :boolean = true ;
  loading         :boolean = false;
  organisation    :Boolean = false;
  product_view    :boolean = false;
  tax_view        :boolean = false;
  payment_view    :boolean = false;

  profile_update    :FormGroup;
  prefix_update     :FormGroup;
  product           :FormGroup;
  tax               :FormGroup;
  edit_tax          :FormGroup;
  unit              :FormGroup;
  payment_term      :FormGroup;
  edit_payment      :FormGroup;
  new_user          :FormGroup;
  user_edit         :FormGroup;
  pay_roll_update   :FormGroup;
  editUnit          :FormGroup;
  product_prefix    :FormGroup;
  edit_product_prefix: FormGroup;
  public uid         = localStorage.getItem('uid');

  constructor(private modalService: NgbModal, public router: Router, public api: ApiService, public toastrService: ToastrService, private fb: FormBuilder)

  {
    this.profile_update = fb.group({
           name         :[null],
           gst_no       :['',Validators.compose([Validators.required ,Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$")])],
           addressline1 :[null],
           addressline2 :[null],
           city         :[null],
           state        :[null],
           country      :[null],
           zipcode      :[null],
           mobile       :[null],
           pan_no       :['', Validators.compose([Validators.required ,Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")])],
           bank         :[null],
           acc_no       :[null],
           ifsc_code    :[null,Validators.compose([Validators.required ,Validators.pattern("^[A-Z]{4}0\d{6}$")])],
           tan_no       :[null,Validators.compose([Validators.required ,Validators.pattern("^[A-Z]{4}[0-9]{5}[A-Z]$")])],
           website      :['',Validators.compose([ Validators.pattern("^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\S*)?$")])],
           email        :['',Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
           inv_note1    :[null],
           inv_note2    :[null],
           payment_term1:[null],
           payment_term2:[null],
           payment_term3:[null],
           udyam_no     :[null],
    });

    this.prefix_update =
    fb.group({
      dc             :[null],
      invoice        :[null],
      po             :[null],
      bill           :[null],
      credit         :[null],
      debit          :[null],
      payment_receipt:[null],
      payment_made   :[null],
      product_prefix :[null]
    });

    this.product = fb.group({
      created_by    :[this.uid],
      name          :[null,Validators.compose([Validators.required])],
      tax           :[null,Validators.compose([Validators.required])],
      hsn           :[null,Validators.compose([Validators.required])],
      status        :[1],
    })

    this.tax = fb.group({
      created_by   :[this.uid],
      name         :[null,Validators.compose([Validators.required])],
      type         :[null,Validators.compose([Validators.required])],
      rate         :[null,Validators.compose([Validators.required])],
    })

    this.edit_tax = fb.group({
      name         :[null],
      type         :[null],
      rate         :[null],
    })

    this.unit = fb.group({
      created_by   :[this.uid],
      name         :[null,Validators.compose([Validators.required])],
    })

    this.editUnit = fb.group({
      name         :[null,Validators.compose([Validators.required])],
    })

    this.payment_term = fb.group({
      created_by   :[this.uid],
      terms        :[null,Validators.compose([Validators.required])],
      terms_value  :[null,Validators.compose([Validators.required])],
      title        :[null],
      description  :[null,Validators.compose([Validators.required])],
      value        :[null],
      status       :[1]
    })

    this.edit_payment = fb.group({
      terms        :[null,Validators.compose([Validators.required])],
      terms_value  :[null,Validators.compose([Validators.required])],
      title        :[null],
      description  :[null],
      value        :[null],
      status       :[null]
    })

    this.new_user = fb.group({
      ['created_by']:[this.uid],
       name         :[null,Validators.compose([Validators.required])],
    })

    this.user_edit = fb.group({
       name         :[null,Validators.compose([Validators.required])],
    })

    this.pay_roll_update =fb.group({
       pl                :[null],
       epf               :[null],
       basic_da          :[null],
       epf_max_amount    :[null],
       hra               :[null],
       allowance         :[null],
       epf_percentage    :[null],
       company_paid_esi  :[null],
    })

    this.product_prefix = fb.group({
       ['created_by']:[this.uid],
       name         :[null,Validators.compose([Validators.required])],
       status       :[1]
    })
      this.edit_product_prefix = fb.group({
            ['created_by']:[this.uid],
            name         :[null,Validators.compose([Validators.required])],
            status       :[1]
          })

  }

  @ViewChild("edit_address", { static: true }) edit_address: ElementRef
  @ViewChild("edit_prefix", { static: true }) edit_prefix: ElementRef
  @ViewChild("edit_product", { static: true }) edit_product: ElementRef
  @ViewChild("add_product", { static: true }) add_product: ElementRef
  @ViewChild("tax_update", { static: true }) tax_update: ElementRef
  @ViewChild("edit_unit", { static: true }) edit_unit: ElementRef
  @ViewChild("add_unit", { static: true }) add_unit: ElementRef
  @ViewChild("add_payment_term", { static: true }) add_payment_term: ElementRef
  @ViewChild("edit_payment_term", { static: true }) edit_payment_term: ElementRef
  @ViewChild("add_tax", { static: true }) add_tax: ElementRef
  @ViewChild("add_user", { static: true }) add_user: ElementRef
  @ViewChild("edit_user_type", { static: true }) edit_user_type: ElementRef
  @ViewChild("pay_roll", { static: true }) pay_roll: ElementRef
  @ViewChild("Product_prefix_add", { static: true }) Product_prefix_add: ElementRef
   @ViewChild("Product_prefix_edit", { static: true }) Product_prefix_edit: ElementRef

  ngOnInit()
  {

  }

  organization_profile()
  {
    this.organisation=true;
    this.show=false;
    this.api.get('get_data.php?table=company_profile&authToken='+environment.authToken).then((data: any) =>
    {
      this.report_list = data[0];
      this.detail_view = data[0];
      this.id =data[0].id;
      this.dataload(data[0])
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

 edit()
  {
    this.editAddress = this.modalService.open(this.edit_address, { size: 'xl' });
  }

  dataload(value)
   {
      this.profile_update.controls['name'].setValue(this.report_list.company_name);
      this.profile_update.controls['gst_no'].setValue(this.report_list.gst_number);
      this.profile_update.controls['addressline1'].setValue(this.report_list.address_1);
      this.profile_update.controls['addressline2'].setValue(this.report_list.address_2);
      this.profile_update.controls['city'].setValue(this.report_list.city);
      this.profile_update.controls['state'].setValue(this.report_list.state);
      this.profile_update.controls['country'].setValue(this.report_list.country);
      this.profile_update.controls['zipcode'].setValue(this.report_list.pincode);
      this.profile_update.controls['mobile'].setValue(this.report_list.mobile);
      this.profile_update.controls['pan_no'].setValue(this.report_list.pan_number);
      this.profile_update.controls['bank'].setValue(this.report_list.bank_name);
      this.profile_update.controls['acc_no'].setValue(this.report_list.account_no);
      this.profile_update.controls['ifsc_code'].setValue(this.report_list.ifsc_code);
      this.profile_update.controls['tan_no'].setValue(this.report_list.tan_number);
      this.profile_update.controls['website'].setValue(this.report_list.website);
      this.profile_update.controls['email'].setValue(this.report_list.email);
      this.profile_update.controls['inv_note1'].setValue(this.report_list.inv_note1);
      this.profile_update.controls['inv_note2'].setValue(this.report_list.inv_note2);
      this.profile_update.controls['payment_term1'].setValue(this.report_list.payment_term1);
      this.profile_update.controls['payment_term2'].setValue(this.report_list.payment_term2);
      this.profile_update.controls['payment_term3'].setValue(this.report_list.payment_term3);
      this.profile_update.controls['udyam_no'].setValue(this.report_list.udyam_no);
  }

  submit(value)
    {
          this.loading=true;
          this.api.post('post_update_data.php?table=company_profile&field=id&value=' + this.id + '&authToken=' + environment.authToken, this.profile_update.value).then((data: any) => {

            if (data.status == "success")
            {
              this.loading=false;
              this.toastrService.success('Company Profile Updated Succesfully');
              this.editAddress.close();
              this.organization_profile();
              this.profile_update.reset();

            }
            else { this.toastrService.error(data.status);
                  this.loading=false; }

          }).catch(error => { this.toastrService.error('Company Profile Updated Failed!!');
                            this.loading=false;});
    }

  set_zero()
    {
      this.organisation = false;
      this.show         = true;
      this.prefix_view  = false;
      this.product_view = false;
      this.tax_view     = false;
      this.unit_view    = false;
      this.payment_view = false;
      this.menubar_view = false;
      this.list_view    = false;
      this.payrole_view = false;
      this.report_view  = false;
    }

    production_prefix_list : any
 async prefix()
    {
      this.prefix_view=true;
      this.show=false;
      await this.api.get('get_data.php?table=prefix&authToken='+environment.authToken).then((data: any) =>
        {

          this.prefix_list = data[0];
          this.detail_view = data[0];
          this.id =data[0].prefix_id;
          this.prefix_dataload()
        }).catch(error => {this.toastrService.error('Something went wrong ');});

        await this.api.get('get_data.php?table=production_prefix&asign_field=id&asign_value=DESC&authToken='+environment.authToken).then((data: any) =>
        {

          this.production_prefix_list = data
        }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

    product_prefix_data :any
    onActivate_product_prefix(event)
    {
      if(event.type == "click")
      {
        console.log(event.row)
        this.product_prefix_data = event.row
        this.edit_product_prefix.controls['status'].setValue(event.row.status)
        this.edit_product_prefix.controls['name'].setValue(event.row.prefix)
        this.editAddress  = this.modalService.open(this.Product_prefix_edit,{size:"sm"})
      }
    }

 prefix_dataload()
    {
      this.prefix_update.controls['dc'].setValue(this.prefix_list.dc_year);
      this.prefix_update.controls['invoice'].setValue(this.prefix_list.inv_year);
      this.prefix_update.controls['po'].setValue(this.prefix_list.po_year);
      this.prefix_update.controls['bill'].setValue(this.prefix_list.bill_year);
      this.prefix_update.controls['payment_made'].setValue(this.prefix_list.payment_made);
      this.prefix_update.controls['payment_receipt'].setValue(this.prefix_list.payment_receipt);
      this.prefix_update.controls['credit'].setValue(this.prefix_list.credit_notes);
      this.prefix_update.controls['debit'].setValue(this.prefix_list.debit_note);
      this.prefix_update.controls['product_prefix'].setValue(this.prefix_list.product_prefix);
    }

  async  update_Product_prefix()
    {
        Object.keys(this.edit_product_prefix.controls).forEach(field =>
        {
          const control = this.edit_product_prefix.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      if (this.edit_product_prefix.valid)
      {
        console.log(this.edit_product_prefix.value)

          this.loading=true;
        await this.api.post('post_update_data.php?table=production_prefix&field=id&value='+this.product_prefix_data.id+'&authToken=' + environment.authToken, this.edit_product_prefix.value).then((data: any) => {
            console.log(data)
            if (data.status == "success")
            {
              this.loading=false;
              this.toastrService.success(' Updated Succesfully');
              this.editAddress.close();
              this.prefix();
              this.edit_product_prefix.reset();

            }
            else { this.toastrService.error(data.status);
                  this.loading=false; }

          }).catch(error => { this.toastrService.error(' Somthing went wrong ');
                            this.loading=false;});
      }
    }

  edit_prefix_data()
    {
      this.editAddress = this.modalService.open(this.edit_prefix, { size: 'md' });
    }

    add_Production_prefix()
    {
        this.product_prefix.controls['created_by'].setValue(this.uid)
        this.product_prefix.controls['status'].setValue(1)
        this.editAddress = this.modalService.open(this.Product_prefix_add,{size:"sm"})
    }

    onInput(event: any): void {
  const input = event.target;
  input.value = input.value.toUpperCase();
  this.product_prefix.get('name')?.setValue(input.value, { emitEvent: false });
   this.edit_product_prefix.get('name')?.setValue(input.value, { emitEvent: false });
}


async  submit_Product_prefix()
  {
    Object.keys(this.product_prefix.controls).forEach(field =>
        {
          const control = this.product_prefix.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      if (this.product_prefix.valid)
      {
        console.log(this.product_prefix.value)

          this.loading=true;
        await this.api.post('post_insert_data.php?table=production_prefix&authToken=' + environment.authToken, this.product_prefix.value).then((data: any) => {
            console.log(data)
            if (data.status == "success")
            {
              this.loading=false;
              this.toastrService.success(' Added Succesfully');
              this.editAddress.close();
              this.prefix();
              this.product_prefix.reset();

            }
            else { this.toastrService.error(data.status);
                  this.loading=false; }

          }).catch(error => { this.toastrService.error(' Somthing went wrong ');
                            this.loading=false;});
      }
  }

  submit_prefix(value)
    {
      if (this.prefix_update.valid)
        {
          this.loading=true;
          this.api.post('post_update_data.php?table=prefix&field=prefix_id&value=' + this.id + '&authToken=' + environment.authToken, this.prefix_update.value).then((data: any) => {

            if (data.status == "success")
            {
              this.loading=false;
              this.toastrService.success(' Prefix Updated Succesfully');
              this.editAddress.close();
              this.prefix();
              this.prefix_update.reset();

            }
            else { this.toastrService.error(data.status);
                  this.loading=false; }

          }).catch(error => { this.toastrService.error('Prefix  Updated Failed!!');
                            this.loading=false;});
        }
        else
        {
          this.toastrService.error('Please Fill All Details');
        }
    }

  poduct()
    {
      this.product_view=true;
      this.show = false;
      this.api.get('get_data.php?table=product_type&authToken='+environment.authToken).then((data: any) =>
      {
        this.product_list = data;
        this.detail_view  = data[0];
        this.id = data[0].id;

      }).catch(error => {this.toastrService.error('Something went wrong ');});

      this.api.get('get_data.php?table=tax&authToken='+environment.authToken).then((data: any) =>
      {
        this.list_tax = data;
      }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

    onActivate(event)
    {
      if(event.type =='click')
      {
        this.editAddress = this.modalService.open(this.edit_product, { size: 'md' });

        this.product.controls['name'].setValue(event.row.name);
        this.product.controls['tax'].setValue(event.row.tax);
        this.product.controls['hsn'].setValue(event.row.hsn_code);
        this.product.controls['status'].setValue(event.row.status);
        this.id = event.row.id;
      }
    }

    submit_product(value)
    {
      if (this.product.valid)
        {
          this.loading=true;
          this.api.post('post_update_data.php?table=product_type&field=id&value=' + this.id + '&authToken=' + environment.authToken, this.product.value).then((data: any) => {

            if (data.status == "success")
            {
              this.loading=false;
              this.toastrService.success(' Product Updated Succesfully');
              this.editAddress.close();
              this.poduct();
              this.product.controls['name'].setValue('');
              this.product.controls['tax'].setValue('');
              this.product.controls['hsn'].setValue('');
              this.product.controls['status'].setValue('');

            }
            else { this.toastrService.error(data.status);
                  this.loading=false; }

          }).catch(error => { this.toastrService.error('Product Updated Failed!!');
                            this.loading=false;});
        }
        else
        {
          this.toastrService.error('Please Fill All Details');
        }
    }

   OpenCatAdd()
    {
      this.product.controls['status'].setValue(1);
      this.editAddress = this.modalService.open(this.add_product, { size: 'md' });
    }

    new_product(value)
    {
      Object.keys(this.product.controls).forEach(field =>
        {
          const control = this.product.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      if (this.product.valid)
      {
        this.loading=true;
        this.api.post('post_insert_data.php?table=product_type&authToken=' + environment.authToken, this.product.value).then((data: any) => {

          if (data.status == "success")
          {
            this.loading=false;
            this.toastrService.success('Product Added Succesfully');
            this.editAddress.close();
            this.poduct();
            this.product.controls['name'].setValue('');
            this.product.controls['tax'].setValue('');
            this.product.controls['hsn'].setValue('');


          }
          else { this.toastrService.error(data.status);
                this.loading=false; }

        }).catch(error => { this.toastrService.error('Product Added Failed!!');
                          this.loading=false;});
      }
      else
      {
        this.toastrService.error('Please Fill All Details');
      }
    }

    tax_edit()
    {
       this.tax_view = true;
       this.show     = false;
      this.api.get('get_data.php?table=tax&authToken='+environment.authToken).then((data: any) =>
      {
        this.tax_list = data;
        this.detail_view  = data[0];
        this.id = data[0].id;
      }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

    onActivate_tax(event)
    {
      if(event.type =='click')
      {
        this.editAddress = this.modalService.open(this.tax_update, { size: 'md' });

        this.edit_tax.controls['name'].setValue(event.row.name);
        this.edit_tax.controls['type'].setValue(event.row.type);
        this.edit_tax.controls['rate'].setValue(event.row.rate);
        this.id =event.row.id;
      }
    }

    submit_tax()
    {
      if (this.edit_tax.valid)
      {
        this.loading=true;
        this.api.post('post_update_data.php?table=tax&field=id&value=' + this.id + '&authToken=' + environment.authToken, this.edit_tax.value).then((data: any) => {
          if (data.status == "success")
          {
            this.loading=false;
            this.toastrService.success('Tax Updated Succesfully');
            this.tax_edit();
            this.editAddress.close();
            this.tax.reset();
          }
          else { this.toastrService.error(data.status);
                this.loading=false; }
        }).catch(error => { this.toastrService.error('Tax Updated Failed!!');
                          this.loading=false;});
      }
      else
      {
        this.toastrService.error('Please Fill All Details');
      }
    }

  Unit_edit()
    {
      this.unit_view = true;
      this.show     = false;
      this.api.get('get_data.php?table=unit&authToken='+environment.authToken).then((data: any) =>
      {

        this.unit_list = data;
        this.detail_view  = data[0];
        this.id = data[0].id;

      }).catch(error => {this.toastrService.error('Something went wrong ');});

    }

  onActivate_unit(event)
    {
      if(event.type =='click')
      {
        this.editAddress = this.modalService.open(this.edit_unit, { size: 'md' });
        this.editUnit.controls['name'].setValue(event.row.name);
        this.id =event.row.id;
      }
    }

  submit_unit()
    {
      if (this.editUnit.valid)
      {
        this.loading=true;
        this.api.post('post_update_data.php?table=unit&field=id&value=' + this.id + '&authToken=' + environment.authToken, this.editUnit.value).then((data: any) => {
          if (data.status == "success")
          {
            this.loading=false;
            this.toastrService.success('Unit Updated Succesfully');
            this.Unit_edit();

            this.editAddress.close();
            this.unit.reset();
          }
          else { this.toastrService.error(data.status);
                this.loading=false; }

        }).catch(error => { this.toastrService.error('Unit Updated Failed!!');
                          this.loading=false;});
      }
      else
      {
        this.toastrService.error('Please Fill All Details');
      }
    }

  Addunit()
    {
      this.unit.reset();
      this.unit.controls['created_by'].setValue(this.uid);
      this.editAddress = this.modalService.open(this.add_unit, { size: 'md' });
    }

  submit_newunit()
    {
      Object.keys(this.unit.controls).forEach(field =>
        {
          const control = this.unit.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      if (this.unit.valid)
      {
        this.loading=true;
        this.api.post('post_insert_data.php?table=unit&field=id&value=' + this.id + '&authToken=' + environment.authToken, this.unit.value).then((data: any) => {
          if (data.status == "success")
          {
            this.loading=false;
            this.toastrService.success('Unit Added Succesfully');
            this.editAddress.close();
            this.Unit_edit();
            this.unit.reset();
          }
          else { this.toastrService.error(data.status);
                this.loading=false; }

        }).catch(error => { this.toastrService.error('Unit Added Failed!!');
                          this.loading=false;});
      }
      else
      {
        this.toastrService.error('Please Fill All Details');
      }
    }

    payment_term_view()
    {
      this.payment_view = true;
      this.show         = false;

      this.api.get('get_data.php?table=payment_terms&authToken='+environment.authToken).then((data: any) =>
      {
        this.payment_list = data;
        this.detail_view  = data[0];
        this.id = data[0].id;
      }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

    AddPayment()
    {
      this.editAddress = this.modalService.open(this.add_payment_term, { size: 'md' });
    }

    new_payment(data)
    {

      Object.keys(this.payment_term.controls).forEach(field =>
        {
          const control = this.payment_term.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      if (this.payment_term.valid)
      {
        this.loading=true;
        this.api.post('post_insert_data.php?table=payment_terms&authToken=' + environment.authToken, data).then((data: any) => {
          if (data.status == "success")
          {
            this.loading=false;
            this.toastrService.success('Payment Term Added Succesfully');
            this.payment_term_view();
            this.editAddress.close();
            this.payment_term.reset();
          }
          else { this.toastrService.error(data.status);
                this.loading=false; }

        }).catch(error => { this.toastrService.error('Payment Term Added Failed!!');
                          this.loading=false;});
      }
      else
      {
        this.toastrService.error('Please Fill All Details');
      }
    }

    onActivate_payment(event)
    {
      if(event.type =='click')
      {
      this.id = event.row.id;
      this.editAddress = this.modalService.open(this.edit_payment_term, { size: 'md' });

      this.edit_payment.controls['title'].setValue(event.row.title);
      this.edit_payment.controls['terms'].setValue(event.row.terms);
      this.edit_payment.controls['terms_value'].setValue(event.row.terms_value);
      this.edit_payment.controls['description'].setValue(event.row.description);
      this.edit_payment.controls['value'].setValue(event.row.value);
      this.edit_payment.controls['status'].setValue(event.row.status);
      }
    }

    editSubmit_payment(data)
    {
      if (this.edit_payment.valid)
      {
        this.loading=true;
        this.api.post('post_update_data.php?table=payment_terms&field=id&value=' + this.id + '&authToken=' + environment.authToken, data).then((data: any) => {
          if (data.status == "success")
          {
            this.loading=false;
            this.toastrService.success('Payment Term Updated Succesfully');
            this.payment_term_view();
            this.editAddress.close();
            this.edit_payment.reset();
          }
          else { this.toastrService.error(data.status);
                this.loading=false; }

        }).catch(error => { this.toastrService.error('Payment Term Updated Failed!!');
                          this.loading=false;});
      }
      else
      {
        this.toastrService.error('Please Fill All Details');
      }
    }

    Addtax()
    {
      this.editAddress = this.modalService.open(this.add_tax, { size: 'md' });
    }

    submit_newtax(value)
    {
      Object.keys(this.tax.controls).forEach(field =>
        {
          const control = this.tax.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      if (this.tax.valid)
      {
        this.loading=true;
        this.api.post('post_insert_data.php?table=tax&authToken=' + environment.authToken, value).then((data: any) => {
          if (data.status == "success")
          {
            this.loading=false;
            this.toastrService.success('Tax Added Succesfully');
            this.tax_edit();
            this.editAddress.close();
            this.tax.reset();
          }
          else { this.toastrService.error(data.status);
                this.loading=false; }

        }).catch(error => { this.toastrService.error(' Tax Added Failed!!');
                          this.loading=false;});
      }
      else
      {
        this.toastrService.error('Please Fill All Details');
      }
    }


    menubar()
    {
      this.menubar_view = true;
      this.show         = false;

      this.api.get('get_data.php?table=user_type&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
        this.user_type_list = data;
      }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

    onSelect({ selected }) {
      this.selected.splice(0, this.selected.length);
      this.selected.push(...selected);
    }

    Addmenu()
    {
      let value = this.selected;
    }

    onActivate_user(row)
    {
        this.status_change_id = row.id;
        this.select_menu = row;

        this.load_menu();
    }

    load_menu()
    {
        this.api.get('get_data.php?table=main_menu&find=type&value='+ this.status_change_id+'&asign_field=sequence&asign_value=ASC&authToken='+environment.authToken).then((data: any) =>
        {
          this.menu_list = data;
          if(data != null)
          {
            this.list_view = true;
            this.menubar_view = false;
          }
          if(data!=null)
        {
          for(let i=0;i<data.length;i++)
          {
            if(this.menu_list[i]['parentId'] !=0)
            {
            var name = this.menu_list.find(t=>t.reference_number == this.menu_list[i]['parentId']);
            this.menu_list[i]['parent_name'] = name.title
            }
            else{
              let parent_name ="Tittle";
              this.menu_list[i]['parent_name'] = parent_name;
            }
          }
      }}).catch(error => {this.toastrService.error('Something went wrong ');});
    }


    onCheckboxChange(row)
    {
      console.log(row)
      let status = row.status;
      this.parent_id = row.parentId;
      if(status ==1)
      {
        status = 0;
      }
      else{
        status = 1;
      }

      this.api.get('single_field_update.php?table=main_menu&field=id&value='+row.id+'&up_field=status&update='+status+'&authToken='+environment.authToken).then((data: any) =>
      {
        console.log(data)
        this.load_menu();
        if(data.status =='success')
        {
          if(row.parentId != 0)
          {
            this.check_data();
          }
        }
      }).catch(error => {this.toastrService.error('Something went wrong ');});

    }

    check_data()
    {
      this.api.get('get_data.php?table=main_menu&find=type&value=' + this.status_change_id +'&find1=parentId&value1=' + this.parent_id + '&authToken=' + environment.authToken)
      .then((data: any) => {

         let i=0;
        if (data && Array.isArray(data)) {
          data.forEach((rowData: any) => {
            if (rowData && rowData.status === 1) {
               i++;
            }
          });

          if(i>0)
          {
            this.parent_status=1;
            this.parent_update(this.parent_status)
          }
          else
          {
            this.parent_status=0;
            this.parent_update(this.parent_status)
          }
        }
      })
      .catch(error => {
        this.toastrService.error('Something went wrong');
      });
    }

   async parent_update(id)
    {
     await  this.api.get('get_data.php?table=main_menu&find=type&value=' + this.status_change_id +'&find1=reference_number&value1=' + this.parent_id + '&authToken=' + environment.authToken)
      .then((data: any) => {
        this.update_id=data[0].id;
      }).catch(error => {this.toastrService.error('Something went wrong ');});

     await  this.api.get('single_field_update.php?table=main_menu&field=id&value='+this.update_id+'&up_field=status&update='+id+'&authToken='+environment.authToken).then((data: any) =>
      {
        this.load_menu();
      }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

    adduser()
    {
      this.editAddress = this.modalService.open(this.add_user, { size: 'md' });
    }

    submit_user(value)
    {
      Object.keys(this.new_user.controls).forEach(field =>
        {
          const control = this.new_user.get(field);
          control.markAsTouched({ onlySelf: true });
        });

    if(this.new_user.valid)
    {
      this.api.get('get_data.php?table=user_type&authToken='+environment.authToken).then((data: any) =>
      {
        let Data = data;
        this.find_name = Data.find(t=>t.name == value.name);
        if(this.find_name == undefined)
        {
          this.loading=true;
            this.api.post('mp_user_creation.php?&authToken=' + environment.authToken, value).then((data: any) => {

              if (data.status == "success")
              {
                this.loading = false;
                this.toastrService.success('User Type Added Succesfully');
                this.menubar();
                this.editAddress.close();
                this.new_user.controls['name'].setValue('');
              }
              }).catch(error => {this.toastrService.error('Something went wrong ');
              this.loading = false;});
        }
        else{
          this.toastrService.error('User Type is already Exists');
        }
      }).catch(error => {this.toastrService.error('Something went wrong ');});
    }
    else{
      this.toastrService.error('Fill the Details');
    }
    }

    edit_user(row)
    {
      this.user_id = row.id;
      this.user_edit.controls['name'].setValue(row.name);
      this.editAddress = this.modalService.open(this.edit_user_type, { size: 'md' });
    }

    submit_useredit(value)
    {
      this.loading=true;
      this.api.post('post_update_data.php?table=user_type&field=id&value=' + this.user_id + '&authToken=' + environment.authToken, value).then((data: any) => {
        if (data.status == "success")
        {
          this.loading=false;
          this.toastrService.success('User Type Updated Succesfully');
          this.editAddress.close();
          this.user_edit.reset()
          this.menubar();
        }
        else { this.toastrService.error(data.status);
              this.loading=false; }

      }).catch(error => { this.toastrService.error('User Type Updated Failed!!');
                        this.loading=false;});
    }

    set_zero1()
    {
      this.list_view    = false;
      this.menubar_view = true;
      this.show         = false;
      this.report_view  = false;
    }

    payrole()
    {

      this.api.get('get_data.php?table=pay_roll_items&authToken=' + environment.authToken).then((data: any) => {
        this.pay_roll_list = data[0];
     }).catch(error => {this.toastrService.error('Something went wrong ');});

      setTimeout(() => {
        this.payrole_view = true;
        this.show         = false;
      }, 100);
    }


    update_payrole()
    {

        this.pay_roll_id = this.pay_roll_list.id;
        this.pay_roll_update.controls['pl'].setValue(this.pay_roll_list.pl);
        this.pay_roll_update.controls['epf'].setValue(this.pay_roll_list.epf);
        this.pay_roll_update.controls['basic_da'].setValue(this.pay_roll_list.basic_da);
        this.pay_roll_update.controls['epf_max_amount'].setValue(this.pay_roll_list.epf_max_amount);
        this.pay_roll_update.controls['hra'].setValue(this.pay_roll_list.hra);
        this.pay_roll_update.controls['allowance'].setValue(this.pay_roll_list.allowance);
        this.pay_roll_update.controls['epf_percentage'].setValue(this.pay_roll_list.epf_percentage);
        this.pay_roll_update.controls['company_paid_esi'].setValue(this.pay_roll_list.company_paid_esi);

        this.editAddress = this.modalService.open(this.pay_roll, { size: 'md' });
    }

    submit_payroll_edit(value)
    {

      this.loading=true;
      this.api.post('post_update_data.php?table=pay_roll_items&field=id&value=' + this.pay_roll_id + '&authToken=' + environment.authToken, value).then((data: any) => {

        if (data.status == "success")
        {
          this.loading=false;
          this.toastrService.success('Pay Roll Updated Succesfully');
          this.editAddress.close();
          this.pay_roll_update.reset()
          this.payrole();
        }
        else { this.toastrService.error(data.status);
              this.loading=false; }

      }).catch(error => { this.toastrService.error('Pay Roll Updated Failed!!');
                        this.loading=false;});
    }


    report()
    {

        this.api.get('get_data.php?table=user_type&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
        {
          this.user_type_list = data;
        }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

    onActivate_user_report(row)
    {
      this.report_view  = true;
      this.menubar_view = false;
      this.list_user_id = row.id;

      this.api.get('get_data.php?table=main_report_list&find=user_type&value='+ row.id+'&asign_field=id&asign_value=ASC&authToken='+environment.authToken).then((data: any) =>
        {

          this.list_report = data;
        }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

    onChange_report(row)
    {

      let status = row.status;

      if(status ==1)
      {
        status = 0;
      }
      else{
        status = 1;
      }

      this.api.get('single_field_update.php?table=main_report_list&field=id&value='+row.id+'&up_field=status&update='+status+'&authToken='+environment.authToken).then((data: any) =>
      {
        // console.log(data)
        if(data.status =='success')
        {
          this.load_report()
          // console.log(data)
        }
      }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

    load_report()
    {
      this.api.get('get_data.php?table=main_report_list&find=user_type&value='+ this.list_user_id +'&asign_field=id&asign_value=ASC&authToken='+environment.authToken).then((data: any) =>
      {
        this.list_report = data;
      }).catch(error => {this.toastrService.error('Something went wrong ');});
    }

}
