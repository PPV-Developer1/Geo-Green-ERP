import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl, FormControl} from '@angular/forms';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import { WizardValidationService } from 'src/app/pages/form-elements/wizard/wizard-validation.service';

@Component(
  {
    selector   : 'az-customer',
    templateUrl: './customer.component.html',
    styleUrls  : ['./customer.component.scss'],
    providers  : [ WizardValidationService ]
  })
export class CustomerComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("content", { static: true }) content: ElementRef
  @ViewChild("edit_address", { static: true }) edit_address: ElementRef
  @ViewChild("edit_contact", { static: true }) edit_contact: ElementRef
  @ViewChild("upload_cust_img", { static: true }) upload_cust_img: ElementRef;
  @ViewChild("add_address", { static: true }) add_address: ElementRef
  @ViewChild("add_contact", { static: true }) add_contact: ElementRef

  public uid = localStorage.getItem('uid');
  public customer        : FormGroup;
  public address         : FormGroup;
  public updateAddress   : FormGroup;
  public customer_data   : FormGroup;
  public gst_details     : FormGroup;
  public address_details : FormGroup;
  public contact_details : FormGroup;
  public editCustDetail  : FormGroup;
  public updateContact   : FormGroup;
  public newaddress      : FormGroup;
  public addcontact      : FormGroup;

  addAddress       : any;
  addcontact_popup : any;
  editAddress      : any;
  customerName     : any;
  Upl_cust_img     : any;
  file             : any;
  stateName        : any;
  customerDetails  : any;
  paymentTerm      : any;
  customers        : any;
  customer_details : any;
  cust_image       : any;
  img_path         : any;
  updateCustomer   : any;
  cust_id          : any;
  addressChange    : any;
  name             : any;
  address_line_1   : any;
  address_line_2   : any;
  city             : any;
  state            : any;
  zipcode          : any;
  mobile           : any;
  status           : any;
  editAddressId    : any;

  shipAttention    : any;
  shipAddress1     : any;
  shipAddress2     : any;
  shipCity         : any;
  shipState        : any;
  shipZip          : any;
  shipPhone        : any;
  shipFax          : any;
  detail_view      : any;
  customer_address : any;
  customer_bill_address: any;
  customer_id      : any;
  customerType     : any;
  tax_exemption    : any;
  tax_mode         : any;
  pan_number       : any;
  web_site         : any;
  place_of_supply  : any;
  opening_balance  : any;
  terms_condition  : any;
  remarks          : any;
  notes            : any;
  logo             : any;
  pan              : any;
  placeOfSupply    : any;
  public image     : any;
  steps            : any;
  customer_contact : any;
  type             : any;
  udyam_registeration   : any;
  udyam_no              : any;

  editContactId    : any;
  editcontact      : any;
  contactChange    : any;
  prefix           : any;
  fname            : any;
  lname            : any;
  email            : any;
  workphone        : any;
  edit_name        : any;
  paymentterm      : any;
  payment_term_name: any;
  contact_no       : any;
  mobile_no        : any;
  gst_number       : any;
  cus_name         : any;
  edit_id          : any;
  gstin_number     : any;

  gst_submit       : Boolean = false;
  name_submit      : Boolean = false;
  pan_submit       : Boolean = false;
  edit_show        : Boolean = false;
  submitted        : boolean = false;
  customerType1    : boolean = true;
  panhide          : boolean = true;
  statehide        : boolean = true;
  imgStatus        : boolean = true;
  loading          : boolean = false;
  gstview          : boolean = true;
  gstuin           : boolean = true;
  change           : boolean = true;
  stateShow        : boolean = true;
  udyamhide        : boolean = false;

  public showConfirm:boolean;
  taxRate          = false;
  taxRate1         = false;
  taxfills         = false;
  taxfills1        = false;
  emptyTax         = false;
  show             = true;
  gstDetails       : [];
  temp             = [];
  rows             = [];
  selected         = [];
  public details   : any = {contacts: []};

  constructor(public fb: FormBuilder, private modalService: NgbModal, public toastrService: ToastrService, private api: ApiService, private formBuilder: FormBuilder) {
    this.customer = fb.group(
      {
        contacts: this.fb.array([])
      })

      this.steps = [
        {name: 'Customer Information', icon: 'fa-lock', active: true, valid: false, hasError:false },
        {name: 'Tax Information', icon: 'fa-user', active: false, valid: false, hasError:false },
        {name: 'Address Information', icon: 'fa-credit-card', active: false, valid: false, hasError:false },
        {name: 'Contact Details', icon: 'fa-check-square-o', active: false, valid: false, hasError:false }
      ]

      this.customer_data = this.formBuilder.group({
         'created_by'   : [this.uid],
         'type'        : ['1'],
         'customerType': ['distributor'],
         'salutation'  : ['Mr'],
         'firstName'   : ['', Validators.required],
        'companyName'  : [null],
        'email'        : ['',Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
        'phone'        : ['',Validators.compose([Validators.required])],
        'mobile'       : ['',Validators.compose([Validators.required])],
        'website'      : ['',Validators.compose([ Validators.pattern("^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\S*)?$")])],
      } );

    this.gst_details = this.formBuilder.group({
       'gstTreatment'    : ['1'],
       'gstin'           : [null ],
       'pan'             : ['', Validators.compose([Validators.required ,Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")])],
       'placeOfSupply'   : [null],
       'udyam_register'  : ['', Validators.compose([Validators.required])],
       'udyam_no'        : [null],
       'taxType'         : ['1'],
       'taxEmpty'        : [null],
       'paymentTerms'    : [1],
       'opening_balance' : [0],
       'terms_condition' : [null],
       'remarks'         : [null],
       'notes'           : [null],
       'customerStatus'  : [1],
    });

    this.address_details = this.formBuilder.group({
      'billAttention'   : ['', Validators.required],
      'billAddress1'    : ['', Validators.required],
      'billAddress2'    : ['', Validators.required],
      'billCity'        : ['', Validators.required],
      'billState'       : ['TAMIL NADU'],
      'billZip'         : ['', Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")])],
      'billPhone'       : [null, Validators.compose([Validators.required])],
      'billDefault'     : [1],
      'billType'        : [1],
      'billStatus'      : [1],
      'shipAttention'   : [this.shipAttention,Validators.required],
      'shipAddress1'    : [this.shipAddress1,Validators.required],
      'shipAddress2'    : [this.shipAddress2,Validators.required],
      'shipCity'        : [this.shipCity,Validators.required],
      'shipState'       : [this.state,Validators.required],
      'shipZip'         : [this.zipcode,Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")])],
      'shipPhone'       : [this.mobile,Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      'shipType'        : [2],
      'shipDefault'     : [1],
      'shipStatus'      : [1],
      'contactStatus'   : [1],

    });

     this.contact_details = this.formBuilder.group({
      contacts    : this.formBuilder.array([])
   });

    this.updateAddress = this.formBuilder.group(
      {
        name        : ['', Validators.compose([Validators.required])],
        addressline1: ['', Validators.compose([Validators.required])],
        addressline2: ['', Validators.compose([Validators.required])],
        city        : ['', Validators.compose([Validators.required])],
        state       : ['', Validators.compose([Validators.required])],
        type        : ['', Validators.compose([Validators.required])],
        zipcode     : [this.zipcode,Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")])],
        mobile      : ['',Validators.compose([Validators.required])],
        status      : ['', Validators.compose([Validators.required])],
      })

      this.updateContact =this.formBuilder.group(
        {
         prefix  : [null, Validators.compose([Validators.required])],
         fname   : [null, Validators.compose([Validators.required])],
         lname   : [null, Validators.compose([Validators.required])],
         email   : ['',Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
         mobile  : ['',Validators.compose([Validators.required])],
         workphone:['',Validators.compose([Validators.required])],
         status  : [null, Validators.compose([Validators.required])],
        }
      )

    this.editCustDetail = fb.group(
      {
        name         : [],
        'created_by' : [this.uid],
        customer_id  : [],
        customerType : [],
        tax_exemption: [],
        tax_mode     : [],
        gst_number   : [],
        email        : ['',Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
        pan_number   : ['', Validators.compose([Validators.required ,Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")])],
        web_site     : [],
        place_of_supply: [],
        place_of_supply_code:[],
        contact_no   : [],
        mobile_no    : [],
        udyam_register : [],
        udyam_no       : [null],
        payment_term : [],
        payment_term_name: [],
        opening_balance: [null],
        terms_condition: ['', Validators.compose([Validators.required])],
        remarks      : ['', Validators.compose([Validators.required])],
        notes        : ['', Validators.compose([Validators.required])]
      }
    )

    this.newaddress=fb.group(
      {
         'created_by' : [this.uid],
          customer_id   : [null],
          name        : [null, Validators.compose([Validators.required])],
          addressline1: [null, Validators.compose([Validators.required])],
          addressline2: [null, Validators.compose([Validators.required])],
          city        : [null, Validators.compose([Validators.required])],
          state       : [null, Validators.compose([Validators.required])],
          zipcode     : [this.zipcode,Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")])],
          mobile      : ['',Validators.compose([Validators.required])],
          type        : [null, Validators.compose([Validators.required])],
          status      : [0],
      }
    )

    this.addcontact =fb.group(
      {
      'created_by' : [this.uid],
      customer_id   : [null],
       prefix      : [null, Validators.compose([Validators.required])],
       fname       : [null, Validators.compose([Validators.required])],
       lname       : [null, Validators.compose([Validators.required])],
       email       : ['',Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
       mobile      : ['',Validators.compose([Validators.required])],
       workphone   : ['',Validators.compose([Validators.required])],
       status      : [0],
      }
    )

  }

  ngOnInit() {
    this.customerInfo();
  }
  customerInfo()
  {
    this.api.get('mp_customer_info.php?&authToken=' + environment.authToken).then((data: any) => {
      this.customers   = data.customer_info;
      this.paymentTerm = data.payment_terms;
      this.stateName   = data.state_code;
      this.temp        = [... data.customer_info];
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  myForm = new FormGroup(
    {
      type: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', [Validators.required])
    }
  );

  fileChange(input) {
    const reader = new FileReader();
    if (input.files.length) {
      this.file = input.files[0].name;
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

  customerContact(detail_view)
  {
    this.api.get('get_data.php?table=customer_contact&find=customer_id&value=' + detail_view + '&authToken=' + environment.authToken).then((data: any) => {
      this.customer_contact = data;
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }
  submitImg(data) {
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource')?.value);
    this.loading = true;
    this.api.post('upload_customer_file.php?mode=update&user_id=' + this.customer_id + '&location=upload/customer_images/&table=customers&authToken=' + environment.authToken, formData).then((data: any) => {
      if(data.status == "success")
      {
      this.toastrService.success('Image Updated Succesfully');
      this.loading=false;
      this.Upl_cust_img.close();
      this.myForm.reset();
      this.employeeLoad(this.customer_id);
      }
      else { this.toastrService.error(data.status);
             this.loading=false; }
      return true;
    }).catch(error => {
      this.toastrService.error('Image Updated Failed');
      this.loading=false;
    });
  }

  removeFile(): void {
    this.file = '';
  }

  async employeeLoad(customer_id) {
    await this.api.get('get_data.php?table=customers&find=customer_id&value=' + customer_id + '&authToken=' + environment.authToken).then((data: any) => {
      this.customer_details = data[0];

      this.cust_image = this.customer_details.logo;
      this.img_path   = environment.baseURL + "download_file.php?path=upload/customer_images/" + this.cust_image + "&authToken=" + environment.authToken;
    }).catch(error => { this.toastrService.error('data not load'); });
  }


  async updateEmp(editCustDetail)
  {

      let id         = editCustDetail.customer_id;

      var data = this.stateName.find(t=>t.state_name == this.place_of_supply);
      editCustDetail.place_of_supply_code= data.state_code;

      const billNoValue = this.edit_name;
      let value = this.customers.find(item => item.company_name === billNoValue);

        if( value != undefined)
        {
            if(value.customer_id!= id)
                {
                  this.toastrService.error(' Customer Name has already been entered')
                  this.name_submit = false
                }

              if(value.customer_id  == id )
                {this.name_submit = true}
        }
        else{
          this.name_submit = true
        }

      const gstvalue = this.gst_number;
      let value_1 = this.customers.find(item => item.gst_number   === gstvalue);

      if(value_1 != undefined)
        {
            if(value_1.customer_id != id)
            {
            this.toastrService.error(' GST Number has already been entered');
            this.gst_submit = false
            }

            if(value_1.customer_id == id)
            {this.gst_submit = true}
         }
         else{
            this.gst_submit = true;
          }

          const panvalue = this.pan_number;
          let value_2 = this.customers.find(item => item.pan_number   === panvalue);

      if(value_2 != undefined)
        {
            if(value_2.customer_id != id)
            {
            this.toastrService.error(' PAN Number has already been entered');
            this.pan_submit = false
            }

            if(value_2.customer_id == id )
            {this.pan_submit = true}
         }
         else{
            this.pan_submit = true;
          }

      if(this.gst_submit === true &&  this.name_submit === true && this.pan_submit === true)
      {
        const confirmed = confirm(" Are you sure you want to update these changes?");
          console.log(confirmed)
          if (!confirmed) {
            return;
          }
        this.loading   = true;
        this.change    = true
        this.stateShow = true;
         this.imgStatus = true;
          this.api.post('post_update_data.php?table=customers&field=customer_id&value=' + id + '&authToken=' + environment.authToken, editCustDetail).then((data_rt: any) => {

            if (data_rt.status == "success")
            {
              this.loading = false;
              this.toastrService.success('Customer Details Updated Succesfully');
              this.edit_name       = null
              this.customer_id     = null
              this.customerType    = null
              this.tax_exemption   = null
              this.tax_mode        = null
              this.email           = null
              this.pan_number      = null
              this.gst_number      = null
              this.web_site        = null
              this.place_of_supply = null
              this.opening_balance = null
              this.terms_condition = null
              this.remarks         = null
              this.notes           = null
              this.contact_no      = null
              this.mobile_no       = null
              this.logo            = null
              this.paymentterm     = null
              this.img_path        = null

              setTimeout(() => {
                this.customerInfo();
                this.loaddata(id);
              }, 200);

              this.payment_term_name=null;
            }
            else
            {
              this.toastrService.error('Updated Problem');
              this.loading=false;
            }
          }).catch(error => { this.toastrService.error('Update Failed');
              this.loading=false; });
        }
        // else{
        //   this.toastrService.error(' Failed');
        // }
  }

 updateCust(updateCust) {
    this.updateCustomer = updateCust;
    this.cust_id        = updateCust.customer_id
    this.api.post('post_update_data.php?authToken=' + environment.authToken + '&table=customers&field=customer_id&value=' + this.cust_id, this.updateCustomer).then((data: any) => {
   if (data.status == "success") {
        this.toastrService.success('Update Customer Image!!');
        this.status = true;
        this.ngOnInit();
      }
      else
      {
        this.toastrService.error(data.status);
      }
      return true;
    }).catch(error => { this.toastrService.error('Customer Update Failed');});
  }

  editCustomerAddress(addressId)
  {
    this.status        = false;
    this.editAddressId = addressId
    this.api.get('get_data.php?table=customer_address&find=cust_addr_id&value=' + addressId + '&authToken=' + environment.authToken).then((data: any) => {
      this.addressChange  = data[0];

      this.name           = this.addressChange.attention
      this.address_line_1 = this.addressChange.address_line_1
      this.address_line_2 = this.addressChange.address_line_2
      this.city           = this.addressChange.city
      this.state          = this.addressChange.state
      this.zipcode        = this.addressChange.zip_code
      this.mobile         = this.addressChange.phone
      this.status         = this.addressChange.status
      this.type           = this.addressChange.type

    }).catch(error => { this.toastrService.error('Document view Failed'); });
    this.editAddress = this.modalService.open(this.edit_address, { size: 'md' });
  }

 editCustomerContact(contactId)
  {
    this.editContactId = contactId
    this.api.get('get_data.php?table=customer_contact&find=cust_cont_id&value=' + contactId + '&authToken=' + environment.authToken).then((data: any) => {
      this.contactChange  = data[0];

      this.prefix         = this.contactChange.prefix
      this.fname          = this.contactChange.first_name
      this.lname          = this.contactChange.last_name
      this.email          = this.contactChange.email
      this.workphone      = this.contactChange.phone
      this.mobile         = this.contactChange.mobile
      this.status         = this.contactChange.status
    }).catch(error => { this.toastrService.error('Document view Failed'); });

    this.editcontact = this.modalService.open(this.edit_contact, { size: 'md' });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.customer.controls;
  }

  get c(): { [key: string]: AbstractControl } {
    return this.updateAddress.controls;
  }

  get e() {
    return this.myForm.controls;
  }

  get contacts() {
    return this.contact_details.get('contacts') as FormArray;
  }
  taxview() {
    this.taxRate  = true
    this.taxRate1 = false
  }

  taxview1()
  {
    this.taxRate   = false;
    this.taxRate1  = true;
    this.taxfills  = false;
    this.taxfills1 = false;
  }

  taxfill()
  {
    this.taxfills  = true;
    this.taxfills1 = false;
    this.api.get('get_data.php?table=tax&authToken=' + environment.authToken).then((data: any) => {
      this.gstDetails = data;
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  taxfill1()
   {
    this.taxfills1 = true;
    this.taxfills  = false;
    this.api.get('get_data.php?table=tax&authToken=' + environment.authToken).then((data: any) => {
      this.gstDetails = data;
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  gstTreat(gst)
  {
    if (gst == 1)
    {
      this.gstview    = true;
    }
    else if (gst == 0) {
      this.gstview    = false;
      this.panhide    = false;
      this.statehide  = false;
    }
  }

  copyAddress(customerAddress)
  {
    this.shipAttention = customerAddress.billAttention;
    this.shipAddress1  = customerAddress.billAddress1;
    this.shipAddress2  = customerAddress.billAddress2;
    this.shipCity      = customerAddress.billCity;
    this.shipState     = customerAddress.billState;
    this.shipZip       = customerAddress.billZip;
    this.shipPhone     = customerAddress.billPhone;
    this.shipFax       = customerAddress.billFax;
  }


  addPerson(prefix = "Mr.", fname = "", lname = "", contactEmail = "", workPhone = "", mobile = "")
  {
    let contacts = this.customer.get('contacts') as FormArray;
    contacts.push(this.fb.group({
      prefix   : [prefix],
      fname    : [fname],
      lname    : [lname],
      contactEmail: [contactEmail],
      workPhone: [workPhone],
      mobile   : [mobile]
    }));

  }

  addPerson_wizard(prefix = "Mr.", fname = "", lname = "", contactEmail = "", workPhone = "", mobile = "")
  {
    let contacts = this.contact_details.get('contacts') as FormArray;
    contacts.push(this.formBuilder.group(
      {
      prefix      : [prefix],
      fname       : [fname],
      lname       : [lname],
      contactEmail: [contactEmail,Validators.compose([ Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
      workPhone   : [workPhone,Validators.compose([ Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      mobile      : [mobile,Validators.compose([ Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])]
    })
    );
  }

  addPerson_wizard_1() {

    this.addPerson_wizard();
  }

  removePerson(i)
  {
    let con = this.customer.get('contacts') as FormArray;
    con.removeAt(i);
  }

  removePerson_wizard(i)
  {
    let con = this.contact_details.get('contacts') as FormArray;
    con.removeAt(i);
  }

  async submit(updateAddress)
  {
      const confirmed = confirm(" Are you sure you want to update these changes?");
          console.log(confirmed)
          if (!confirmed) {
            return;
          }
      let id = this.editAddressId;
      this.loading = true;
      this.api.post('post_update_data.php?table=customer_address&field=cust_addr_id&value=' + id + '&authToken=' + environment.authToken, updateAddress).then((data_rt: any) => {
        if (data_rt.status == "success")
         {
          this.loading = false;
          this.toastrService.success('Updated Succesfully');
          this.editAddress.close();
          this.custAddr(this.detail_view.customer_id);
        }
        else { this.toastrService.error(data_rt.status); }
      }).catch(error => { this.toastrService.error('Customer Address Update Failed!!');
      this.loading = false; });
    }



  onActivate(event) {
    if (event.type === "click") {
      this.edit_show= false;
      this.detail_view = event.row.customer_id;
      this.edit_id     = event.row.customer_id;
      this.custAddr(this.detail_view);
      this.customerContact(this.detail_view);
      setTimeout(() => {
        this.loaddata(event.row.customer_id)
        this.edit_show = true;
      },150);

    }
  }


  loaddata(id)
  {
    this.api.get('get_data.php?table=customers&find=customer_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) => {
      this.detail_view     = data[0]
      setTimeout(() => {
      this.edit_name       = this.detail_view.company_name
      this.customer_id     = this.detail_view.customer_id
      this.customerType    = this.detail_view.customer_type
      this.tax_exemption   = this.detail_view.tax_exemption
      this.tax_mode        = this.detail_view.tax_mode
      this.email           = this.detail_view.email
      this.pan_number      = this.detail_view.pan_number
      this.gst_number      = this.detail_view.gst_number
      this.udyam_no         = this.detail_view.udyam_number;
      this.udyam_registeration = this.detail_view.udyam_registeration ;
      this.web_site        = this.detail_view.web_site
      this.place_of_supply = this.detail_view.place_of_supply
      this.opening_balance = this.detail_view.opening_balance
      this.terms_condition = this.detail_view.terms_condition
      this.remarks         = this.detail_view.remarks
      this.notes           = this.detail_view.notes
      this.contact_no      = this.detail_view.contact_number
      this.mobile_no       = this.detail_view.mobile_number
      this.logo            = this.detail_view.logo
      this.paymentterm     = this.detail_view.payment_term;
      this.img_path        = environment.baseURL + "download_file.php?path=upload/customer_images/" + this.logo + "&authToken=" + environment.authToken;
      this.payment_term_name = null;
      if(this.detail_view.payment_term != null && this.detail_view.payment_term > 0)
      {
        this.nameload(this.detail_view.payment_term);
      }
    },200);

    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }


  nameload(value)
  {
        var name =this.paymentTerm.find(x => x.id === value);
        this.payment_term_name = name.terms;
  }

  custAddr(detail_view)
  {
    this.api.get('get_data.php?table=customer_address&find=customer_id&value=' + detail_view + '&authToken=' + environment.authToken).then((data: any) => {
      this.customer_address = data;
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  updateFilter(event)
  {
              const val = event.target.value.toLowerCase();
                const temp = this.temp.filter((d) => {
                  return Object.values(d).some(field =>
                    field != null && field.toString().toLowerCase().indexOf(val) !== -1
                  );
                });
                this.customers = temp;
                this.table.offset = 0;
  }

  set_zero()
  {
    this.selected  = [];
    this.change    = true;
    this.stateShow = true;
    this.imgStatus = true;
    this.edit_show = false;
  }

  addCustomer()
  {
    this.show = false;
  }

  custView()
  {
    this.show = true;
  }

  view()
  {
    this.show = true;
  }

  views()
  {
    this.show = false;
  }

  taxEmpty()
  {
    this.emptyTax  = true;
  }

  taxEmpty1()
  {
    this.emptyTax  = false;
  }

  editCust()
  {
    setTimeout(() => {
      this.imgStatus = false;
      this.stateShow = false;
      this.change    = false;
      this.imgStatus = false;
    }, 250);

  }

  uploadImg()
  {
    this.Upl_cust_img = this.modalService.open(this.upload_cust_img, { size: 'md' });
  }

  getGstNo(gstNo)
  {
    this.placeOfSupply = gstNo.slice(0, 2);
    this.placeOfSupply = this.placeOfSupply;
    this.pan           = gstNo.slice(2, 12);
    this.pan           = this.pan;
    this.panhide       = false;
  }

  type1()
  {
    this.customerType1 = true;
    this.panhide       = true;
    this.statehide     = true;
    this.gst_details.controls['pan'].reset();
    this.gst_details.controls['placeOfSupply'].reset();
  }

  type2()
  {
    this.customerType1 = false;
    this.panhide       = false;
    this.statehide     = false;
    this.gst_details.controls['pan'].reset();
    this.gst_details.controls['placeOfSupply'].reset();
  }

cancel()
 {
    this.imgStatus = true;
    this.stateShow = true;
    this.change    = true;
    this.imgStatus = true;
 }

contact_submit(data)
{

  const confirmed = confirm(" Are you sure you want to update these changes?");
          console.log(confirmed)
          if (!confirmed) {
            return;
          }
    let id = this.editContactId;
    this.loading=true;
    this.api.post('post_update_data.php?table=customer_contact&field=cust_cont_id&value=' + id + '&authToken=' + environment.authToken, data).then((data: any) => {
      if (data.status == "success")
       {
        this.loading = false;
        this.toastrService.success('Updated Succesfully');
        this.editcontact.close();
        this.custAddr(this.detail_view.customer_id);
        this.customerContact(this.detail_view.customer_id);
       }
      else { this.toastrService.error(data.status);
        this.loading = false; }
    }).catch(error => { this.toastrService.error('Customer Address Update Failed!!');
    this.loading = false; });
}


public next(){
  let customer_data   = this.customer_data;
  let gst_details     = this.gst_details;
  let address_details = this.address_details;
  let contact_details = this.contact_details;

  const con =this.contact_details.controls.contacts.value;
  if(this.steps[this.steps.length-1].active)
      return false;
    this.steps.some(function (step, index, steps) {

      if(index < steps.length-1){

          if(step.active){
              if(step.name=='Customer Information'){

                Object.keys(customer_data.controls).forEach(field =>
                  {
                  const control = customer_data.get(field);
                  control.markAsTouched({ onlySelf: true });
                  });

                  if (customer_data.valid) {
                      step.active = false;
                      step.valid  = true;
                      steps[index+1].active=true;
                      return true;
                  }
                  else{
                      step.hasError = true;
                  }
              }
              if(step.name=='Tax Information'){

                Object.keys(gst_details.controls).forEach(field =>
                  {
                  const control = gst_details.get(field);
                  control.markAsTouched({ onlySelf: true });
                  });
                  if (gst_details.valid) {
                      step.active = false;
                      step.valid  = true;
                      steps[index+1].active=true;
                      return true;
                  }
                  else{
                      step.hasError = true;
                  }
              }
              if(step.name=='Address Information'){

                Object.keys(address_details.controls).forEach(field =>
                  {
                  const control = address_details.get(field);
                  control.markAsTouched({ onlySelf: true });
                  });

                  if (address_details.valid) {
                      step.active = false;
                      step.valid  = true;
                      steps[index+1].active=true;

                      return true;
                  }
                  else{
                      step.hasError = true;
                  }
              }
              if(step.name=='Contact Details'){
                if (contact_details.valid) {

                    step.active = false;
                    step.valid  = true;
                    steps[index+1].active=true;
                    return true;
                }
                else{
                    step.hasError = true;
                }
            }
          }
      }
  });

  this.details.created_by      = this.customer_data.value.created_by;
  this.details.type            = this.customer_data.value.type;
  this.details.customerType    = this.customer_data.value.customerType;
  this.details.salutation      = this.customer_data.value.salutation;
  this.details.firstName       = this.customer_data.value.firstName;
  this.details.lastName        = this.customer_data.value.lastName;
  this.details.companyName     = this.customer_data.value.companyName;
  this.details.email           = this.customer_data.value.email;
  this.details.phone           = this.customer_data.value.phone;
  this.details.mobile          = this.customer_data.value.mobile;
  this.details.website         = this.customer_data.value.website;
  this.details.gstTreatment    = this.gst_details.value.gstTreatment;
  if(this.gst_details.value.gstin != undefined)
  {
    this.details.gstin           = this.gst_details.value.gstin;
  }
  else{this.details.gstin = null;}
  this.details.pan             = this.gst_details.value.pan;
  this.details.placeOfSupply   = this.gst_details.value.placeOfSupply;
  this.details.opening_balance = this.gst_details.value.opening_balance;
  this.details.terms_condition = this.gst_details.value.terms_condition;
  this.details.remarks         = this.gst_details.value.remarks;
  this.details.udyam_register  = this.gst_details.value.udyam_register;
  this.details.udyam_no        = this.gst_details.value.udyam_no;
  this.details.notes           = this.gst_details.value.notes;
  this.details.taxType         = this.gst_details.value.taxType;
  this.details.taxEmpty         = this.gst_details.value.taxEmpty;
  this.details.paymentTerms    = this.gst_details.value.paymentTerms;
  this.details.placeOfSupply   = this.gst_details.value.placeOfSupply;
  this.details.customerStatus  = this.gst_details.value.customerStatus;
  this.details.billAttention   = this.address_details.value.billAttention;
  this.details.billAddress1    = this.address_details.value.billAddress1;
  this.details.billAddress2    = this.address_details.value.billAddress2;
  this.details.billCity        = this.address_details.value.billCity;
  this.details.billState       = this.address_details.value.billState;
  this.details.billZip         = this.address_details.value.billZip;
  this.details.billPhone       = this.address_details.value.billPhone;
  this.details.billDefault     = this.address_details.value.billDefault;
  this.details.billType        = this.address_details.value.billType;
  this.details.billStatus      = this.address_details.value.billStatus;
  this.details.shipAttention   = this.address_details.value.shipAttention;
  this.details.shipAddress1    = this.address_details.value.shipAddress1;
  this.details.shipAddress2    = this.address_details.value.shipAddress2;
  this.details.shipCity        = this.address_details.value.shipCity;
  this.details.shipState       = this.address_details.value.shipState;
  this.details.shipZip         = this.address_details.value.shipZip;
  this.details.shipPhone       = this.address_details.value.shipPhone;
  this.details.shipDefault     = this.address_details.value.shipDefault;
  this.details.shipType        = this.address_details.value.shipType;
  this.details.shipDefault     = this.address_details.value.shipDefault;
  this.details.shipStatus      = this.address_details.value.shipStatus;
  this.details.contactStatus   = this.address_details.value.contactStatus;

}

 dataload()
  {
    let contacts = this.contact_details.get('contacts') as FormArray;
  for (let j = 0; j < contacts.length; j++)
    {
    this.details.contacts[j] = contacts.at(j).value;
    }
  }

 public prev(){
  if(this.steps[0].active)
      return false;
  this.steps.some(function (step, index, steps) {
      if(index != 0){
          if(step.active){
              step.active = false;
              steps[index-1].active=true;
              return true;
          }
      }
  });
 }

async confirm()
{
  this.steps.forEach(step => step.valid = true);
  this.dataload();
  const billNoValue = this.cus_name;


  const gstvalue = this.gstin_number;


  const panvalue = this.pan;


    function normalizeString(str : any) {
      return str.replace(/\s+/g, '').toLowerCase();
    }

    let checking :any
    let checking_gst :any
    let checking_pan :any
    await this.api.get('get_data.php?table=customers&authToken=' + environment.authToken).then((data: any) =>

      {
        checking = data.some((item: { company_name: any; }) =>  normalizeString(item.company_name) ===  normalizeString(billNoValue) );
        if(gstvalue != null)
        {
          checking_gst = data.some((item: { gst_number: any; }) =>  normalizeString(item.gst_number) ===  normalizeString(gstvalue) );
        }
        if(gstvalue != null)
          {
            checking_pan = data.some((item: { pan_number: any; }) =>  normalizeString(item.pan_number) ===  normalizeString(panvalue) );
          }
      }).catch(error =>
          {
                this.toastrService.error('API Faild : vendor details checking failed');
                this.loading = false;
      });

    if(!checking)
     {
      if(!checking_gst)
        {
          if(!checking_pan)
            {
                this.loading=true;
              await  this.api.post('mp_customer_create.php?authToken=' + environment.authToken, this.details ).then((data: any) => {

                  if (data.status == "success") {
                    this.toastrService.success('Customer Added Succesfully');
                    this.loading=false;
                    this.customer_data.controls['created_by'].setValue(this.uid);
                    this.customer_data.controls['type'].setValue('1');
                    this.customer_data.controls['customerType'].setValue('distributor')
                    this.customer_data.controls['salutation'].setValue('Mr');
                    this.customer_data.controls['firstName'].setValue('');
                    this.customer_data.controls['companyName'].setValue('');
                    this.customer_data.controls['email'].setValue('');
                    this.customer_data.controls['phone'].setValue('');
                    this.customer_data.controls['mobile'].setValue('');
                    this.customer_data.controls['website'].setValue('');
                    this.gst_details.controls['gstTreatment'].setValue(1);
                    this.gst_details.controls['gstin'].setValue('');
                    this.gst_details.controls['pan'].setValue('');
                    this.gst_details.controls['placeOfSupply'].setValue('33');
                    this.gst_details.controls['taxType'].setValue('1');
                    this.gst_details.controls['taxEmpty'].setValue('');
                    this.gst_details.controls['paymentTerms'].setValue('1');
                    this.gst_details.controls['opening_balance'].setValue(0);
                    this.gst_details.controls['terms_condition'].setValue('');
                    this.gst_details.controls['remarks'].setValue('');
                    this.gst_details.controls['notes'].setValue('');
                    this.gst_details.controls['customerStatus'].setValue(1);
                    this.address_details.controls['billAttention'].setValue('');
                    this.address_details.controls['billAddress1'].setValue('');
                    this.address_details.controls['billAddress2'].setValue('');
                    this.address_details.controls['billCity'].setValue('');
                    this.address_details.controls['billState'].setValue('TAMIL NADU');
                    this.address_details.controls['billZip'].setValue('');
                    this.address_details.controls['billPhone'].setValue('');
                    this.address_details.controls['billDefault'].setValue(1);
                    this.address_details.controls['billType'].setValue(1);
                    this.address_details.controls['billStatus'].setValue(1);
                    this.address_details.controls['shipAttention'].setValue('');
                    this.address_details.controls['shipAddress1'].setValue('');
                    this.address_details.controls['shipAddress2'].setValue('');
                    this.address_details.controls['shipCity'].setValue('');
                    this.address_details.controls['shipState'].setValue('');
                    this.address_details.controls['shipZip'].setValue('');
                    this.address_details.controls['shipPhone'].setValue('');
                    this.address_details.controls['shipType'].setValue(2);
                    this.address_details.controls['shipDefault'].setValue(1);
                    this.address_details.controls['shipStatus'].setValue(1);
                    this.address_details.controls['contactStatus'].setValue(1);
                    this.customerInfo();
                    this.contact_details.reset();
                    this.customerType1 = true;
                    this.emptyTax  = false;
                    this.show = true;
                    this.steps.some(function (step, index, steps) {
                      if(index != 0){
                          if(step.active)
                          {
                            steps[0].active = true;
                            steps[1].active = false;
                            steps[2].active = false;
                            steps[3].active = false;
                            return true;
                          }
                      }
                  });
                  }
                  else {
                    this.toastrService.error('Something went wrong');
                    this.loading = false;
                  }
                  return true;
                }).catch(error => { this.toastrService.error('Something went wrong');
                    this.loading = false;});
            }
            else{ this.toastrService.error('PAN number was already exist ');}
          }
         else{ this.toastrService.error('GST number was already exist ');}
      }else{ this.toastrService.error('Vendor Name was already exist ');}

 }

 add_newaddress()
 {
  this.newaddress.controls['created_by'].setValue(this.uid);
  this.newaddress.controls['customer_id'].setValue(this.detail_view.customer_id);

  this.addAddress = this.modalService.open(this.add_address, { size: 'md' });
 }

 new_submit(value)
 {

  Object.keys(this.newaddress.controls).forEach(field =>
    {
      const control = this.newaddress.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    if(this.newaddress.valid)
    {
      this.loading=true;
      this.api.post('post_insert_data.php?table=customer_address&authToken=' + environment.authToken, value).then((data_rt: any) => {

        if (data_rt.status == "success")
        {
          this.loading=false;
          this.toastrService.success('Customer Address Added Succesfully');
          this.newaddress.reset();
          this.addAddress.close();
          this.custAddr(this.detail_view.customer_id);
        }
        else { this.toastrService.error(data_rt.status);
            this.loading=false;}

      }).catch(error => { this.toastrService.error('Customer Address Added Failed!!');
          this.loading=false; });
    }
    else{
      this.toastrService.error('Please Fill the Details!');
    }
  }


 add_newcontact()
 {
  this.addcontact.controls['created_by'].setValue(this.uid);
  this.addcontact.controls['customer_id'].setValue(this.detail_view.customer_id);
  this.addcontact_popup = this.modalService.open(this.add_contact, { size: 'md' });
 }

 newcontact_submit(data)
 {

  Object.keys(this.addcontact.controls).forEach(field =>
    {
      const control = this.addcontact.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  if (this.addcontact.valid)
  {

            this.loading=true;
            this.api.post('post_insert_data.php?table=customer_contact&authToken=' + environment.authToken, data).then((data_rt: any) => {
              if (data_rt.status == "success")
              {
                this.loading=false;
                this.toastrService.success('Customer Contact Added Succesfully');
                this.addcontact.reset();
                this.addcontact_popup.close();
                this.customerContact(this.detail_view.customer_id);
              }
              else { this.toastrService.error(data_rt.status);
                    this.loading=false; }

            }).catch(error => { this.toastrService.error('Customer Contact Added Failed!!');
                                this.loading=false;});

  }
  else
  {
    this.toastrService.error('Please Fill All Details');
  }

 }

 onInputChange()
 {
   const billNoValue = this.cus_name;
   let value   = this.customers.find(item => item.company_name === billNoValue);

      if(value != undefined)
      {
       this.toastrService.error(' Customer Name has already been entered')
      }
      if(value == undefined)
      {
      }
 }


 onInput()
 {
  const gstvalue = this.gstin_number;
  let value_1 = this.customers.find(item => item.gst_number   === gstvalue);
  if(value_1 != undefined)
  {
    this.toastrService.error(' GST NUmber has already been entered')
  }
 }

 onInput_pan()
 {
  const panvalue = this.pan;
  let value = this.customers.find(item => item.pan_number   === panvalue);
  if(value != undefined)
  {
    this.toastrService.error(' PAN Number has already been entered')
  }
 }
 edit_gst()
 {
  const gstvalue = this.gst_number;
  let value_1 = this.customers.find(item => item.gst_number   === gstvalue);

  // if(value_1 != undefined)
  //   {
  //     if(value_1.customer_id !== this.edit_id)
  //     {
  //      this.toastrService.error(' GST Number has already been entered1')
  //     }
  //   }

 }

 edit_pan()
 {

   const panvalue = this.pan_number;
  let value_2 = this.customers.find(item => item.pan_number   === panvalue);

  // if(value_2 != undefined)
  //   {
  //     if(value_2.customer_id !== this.edit_id)
  //     {
  //       this.toastrService.error(' PAN Number has already been entered1');
  //     }
  //    }

 }

 edit_cus_name()
 {

  const billNoValue = this.edit_name;
  let value = this.customers.find(item => item.company_name === billNoValue);

  // console.log(this.edit_id)
  // console.log(value)

  //     if( value != undefined)
  //     { if(value.customer_id !== this.edit_id)
  //       {
  //         this.toastrService.error(' Customer Name has already been entered1')
  //       }
  //     }

 }

 udyam_register(value)
 {

   if(value == 1)
     {
       this.udyamhide = true
     }
   if(value == 0)
       {
         this.udyamhide = false
       }
 }
}
