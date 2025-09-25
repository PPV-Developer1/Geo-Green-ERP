import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ContactPerson } from "./class/contactPerson";
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import { async } from 'rxjs';


@Component({
  selector   : 'az-vendor',
  templateUrl: './vendor.component.html',
  styleUrls  : ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("content", { static: true }) content: ElementRef
  @ViewChild("edit_address", { static: true }) edit_address: ElementRef
  @ViewChild("edit_contact", { static: true }) edit_contact: ElementRef
  @ViewChild("upload_cust_img", { static: true }) upload_cust_img: ElementRef;
  @ViewChild("add_address", { static: true }) add_address: ElementRef
  @ViewChild("add_contact", { static: true }) add_contact: ElementRef
  public uid            = localStorage.getItem('uid');
  public user_type      = localStorage.getItem('type');
  temp                  = [];
  rows                  = [];
  gstDetails            = [];
  selected              = [];

  vendor                : FormGroup;
  address               : FormGroup;
  updateAddress         : FormGroup;
  editCustDetail        : FormGroup;

  contactPerson         = new ContactPerson();
  public image          : any;

  vendor_name           : any;
  ven_name              : any;
  gstin_number          : any;
  vendorName            : any;
  editAddress           : any;
  Upl_cust_img          : any;
  file                  : any;
  stateName             : any;
  vendorDetails         : any;
  paymentTerm           : any;
  vendors               : any;
  vendor_details        : any;
  cust_image            : any;
  img_path              : any;
  updateVendor          : any;
  cust_id               : any;
  addressChange         : any;
  name                  : any;
  address_line_1        : any;
  address_line_2        : any;
  city                  : any;
  state                 : any;
  zipcode               : any;
  mobile                : any;
  status                : any;
  editAddressId         : any;
  shipAttention         : any;
  shipAddress1          : any;
  shipAddress2          : any;
  shipCity              : any;
  shipState             : any;
  shipZip               : any;
  shipPhone             : any;
  shipFax               : any;
  detail_view           : any;
  vendor_address        : any;
  vendor_contact        : any;
  vendor_bill_address   : any;
  vendor_id             : any;
  vendorType            : any;
  tax_empty             : any;
  tax_mode              : any;
  pan_number            : any;
  web_site              : any;
  place_of_supply       : any;
  opening_balance       : any;
  terms_condition       : any;
  payment_term          : any;
  remarks               : any;
  notes                 : any;
  logo                  : any;
  pan                   : any ='AAAAA0000A';
  placeOfSupply         : any ='33';
  editContactId         : any;
  editcontact           : any;
  contactChange         : any;
  prefix                : any;
  fname                 : any;
  lname                 : any;
  email                 : any;
  workphone             : any;
  tax_exemption         : any;
  steps                 : any;
  addAddress            : any;
  type                  : any;
  addcontact_popup      : any;
  payment_term_name     : any;
  contact_no            : any;
  mobile_no             : any;
  gst_number            : any;
  udyam_registeration   : any;
  udyam_no              : any;

  name_submit           : boolean = false;
  loading               : boolean = false;
  submitted             : boolean = false;
  change                : boolean = true;
  stateShow             : boolean = true;
  taxRate               : boolean = false;
  taxRate1              : boolean = false;
  taxfills              : boolean = false;
  taxfills1             : boolean = false;
  gstview               : boolean = true;
  gstuin                : boolean = true;
  show                  : boolean = true;
  emptyTax              : boolean = false;
  imgStatus             : boolean = true;
  vendorType1           : boolean = true;
  panhide               : boolean = true;
  statehide             : boolean = true;
  isLoading             : Boolean = true;
  udyamhide             : boolean = false;

  public showConfirm     :boolean;
  public vendor_data     :FormGroup;
  public gst_details     :FormGroup;
  public address_details :FormGroup;
  public contact_details :FormGroup;
  public updateContact   :FormGroup;
  public newaddress      :FormGroup;
  public addcontact      :FormGroup;

  public details :any ={ contacts: []};


  constructor(public fb: FormBuilder, private modalService: NgbModal, public toastrService: ToastrService, private api: ApiService) {
    this.vendor = fb.group(
      {
        contacts: this.fb.array([])
      })

      this.steps = [
        {name: 'Vendor Information', icon: 'fa-lock', active: true, valid: false, hasError:false },
        {name: 'Tax Information', icon: 'fa-user', active: false, valid: false, hasError:false },
        {name: 'Address Information', icon: 'fa-credit-card', active: false, valid: false, hasError:false },
        {name: 'Contact Details', icon: 'fa-check-square-o', active: false, valid: false, hasError:false }
      ]

      this.vendor_data = this.fb.group({
        'created_by'   : [this.uid],
        'type'         : ['1'],
        'vendorType'   : ['distributor'],
        'salutation'   : ['Mr'],
        'firstName'    : ['Name', Validators.required],
        'companyName'  : ['',],
        'email'        : ['Default@gmail.com',Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
        'phone'        : ['0000000000000000',Validators.compose([Validators.required])],
        'mobile'       : ['0000000000',Validators.compose([Validators.required])],
        'website'      : ['www.website.com',Validators.compose([ Validators.pattern("^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\S*)?$")])],
      } );


    this.gst_details = this.fb.group({
       'gstTreatment'    : ['1',Validators.compose([Validators.required])],
       'gstin'           : ['AAAAA0000A1Z5' ],
       'pan'             : ['', Validators.compose([Validators.required ,Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")])],
       'placeOfSupply'   : [null],
       'udyam_register' : ['', Validators.compose([Validators.required])],
        'udyam_no'      : [null],
       'taxType'         : ['1'],
       'taxEmpty'        : [null],
       'paymentTerms'    : [1],
       'opening_balance' : [0],
       'terms_condition' : [null],
       'remarks'         : [null],
       'notes'           : [null],
       'vendorStatus'    : [1],
    });

    this.address_details = this.fb.group({
      'billAttention'   : ['Name', Validators.required],
      'billAddress1'    : ['Address Line 1', Validators.required],
      'billAddress2'    : ['Address Line 2', Validators.required],
      'billCity'        : ['City', Validators.required],
      'billState'       : ['Tamil Nadu'],
      'billZip'         : ['000000', Validators.required],
      'billPhone'       : ['0000000000', Validators.required],
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

    this.contact_details = this.fb.group({
     contacts : this.fb.array([])
  });

    this.updateAddress = fb.group(
      {
        name:   ['Name', Validators.compose([Validators.required])],
        addressline1: ['Address Line 1', Validators.compose([Validators.required])],
        addressline2: ['Address Line 2', Validators.compose([Validators.required])],
        city:   ['City', Validators.compose([Validators.required])],
        state:  ['TAMIL NADU', Validators.compose([Validators.required])],
        zipcode: ['123456',Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")])],
        mobile: ['000000000',Validators.compose([Validators.required])],
        type  : [null, Validators.compose([Validators.required])],
        status: [null],
      })

    this.editCustDetail = fb.group(
      {
        'created_by' : [this.uid],
        vendor_name  : ['Name'],
        vendor_id    : [],
        vendorType   : [],
        tax_empty    : [],
        tax_mode     : [],
        email        : ['Default@gmail.com',Validators.compose([ Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
        tax_exemption: [],
        gst_number    :[],
        udyam_register : [],
        udyam_no       : [null],
        pan_number   : ['AAAAA1234A', Validators.compose([Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")])],
        web_site     : ['www.website.com',Validators.compose([Validators.pattern("^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\S*)?$")])],
        place_of_supply: [],
        con_no       :[],
        mobile_no    :[],
        opening_balance: [''],
        terms_condition: [''],
        payment_term      : [],
        payment_term_name : [],
        remarks      : [],
        notes        : []
      }
    )

    this.updateContact =fb.group(
      {
       prefix  : [null, Validators.compose([Validators.required])],
       fname   : [null, Validators.compose([Validators.required])],
       lname   : [null, Validators.compose([Validators.required])],
       email   : ['Default@gmail.com',Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
       mobile  : ['1234567890',Validators.compose([Validators.required])],
       workphone:['1234567890',Validators.compose([Validators.required])],
       status  : [null],
      }
    )

    this.newaddress=fb.group(
      {
         'created_by' : [this.uid],
          vendor_id   : [null],
          name        : [null, Validators.compose([Validators.required])],
          addressline1: [null, Validators.compose([Validators.required])],
          addressline2: [null, Validators.compose([Validators.required])],
          city        : [null, Validators.compose([Validators.required])],
          state       : [null, Validators.compose([Validators.required])],
          zipcode     : [this.zipcode,Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")])],
          mobile      : ['000000000',Validators.compose([Validators.required])],
          type        : [null, Validators.compose([Validators.required])],
          status      : [0],
      }
    )

    this.addcontact =fb.group(
      {
      'created_by' : [this.uid],
       vendor_id   : [null],
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

  myForm = new FormGroup(
    {
      type: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', [Validators.required])
    }
  );
  get f(): { [key: string]: AbstractControl } {
    return this.vendor.controls;
  }
  get c(): { [key: string]: AbstractControl } {
    return this.updateAddress.controls;
  }
  get e() {
    return this.myForm.controls;
  }

  createPerson() {
    return new FormGroup({
      'salutation': new FormControl(),
      'fname'     : new FormControl(),
      'lname'     : new FormControl(),
      'email'     : new FormControl(),
      'phone'     : new FormControl(),
      'mobile'    : new FormControl()
    })

  }
  ngOnInit()
  {
    this.vendorInfo();
  }

  vendorInfo()
  {
        this.api.get('mp_vendor_info.php?&authToken=' + environment.authToken).then((data: any) => {
          this.vendors     = data.vendor_info;
          this.temp        = [...data.vendor_info];
          this.paymentTerm = data.payment_terms;
          this.stateName   = data.state_code;
        }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  fileChange(input)
   {
          const reader = new FileReader();
          if (input.files.length) {
            this.file = input.files[0].name;
          }
  }
  onFileChange(event: any)
  {
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.myForm.patchValue({
              fileSource: file
            });
          }
  }
  submitImg(data)
  {
          const formData = new FormData();
          formData.append('file', this.myForm.get('fileSource')?.value);
          this.api.post('upload_vendor_file.php?mode=update&user_id=' + this.vendor_id + '&location=upload/vendor_images/&table=vendor&authToken=' + environment.authToken, formData).then((data: any) => {
          this.toastrService.success(' vendor Image Updated Succesfully');
          this.employeeLoad(this.vendor_id);
          this.Upl_cust_img.close();
          this.myForm.reset();

          return true;
    }).catch(error => {
           this.toastrService.error(' vendor Image Updated Failed');
    });
  }
  removeFile(): void
  {
           this.file = '';
  }
  async employeeLoad(vendor_id)
  {
          await this.api.get('get_data.php?table=vendor&find=vendor_id&value=' + vendor_id + '&authToken=' + environment.authToken).then((data: any) => {
            this.vendor_details = data[0];
            this.cust_image     = this.vendor_details.image;
            this.img_path       = environment.baseURL + "download_file.php?path=upload/vendor_images/" + this.cust_image + "&authToken=" + environment.authToken;
          }).catch(error => { this.toastrService.error('data not load'); });
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

  async updateEmp(editCustDetail)
  {
                if (this.editCustDetail.valid)
                {
                  let id = editCustDetail.vendor_id;
                  const billNoValue = this.vendor_name;
                  let value = this.vendors.find(item => item.company_name === billNoValue);

                    if( value != undefined)
                    {
                        if(value.vendor_id!= id)
                            {
                              this.toastrService.error(' Vendor Name has already been entered')
                              this.name_submit = false
                            }

                          if(value.vendor_id  == id )
                            {this.name_submit = true}
                    }
                    else
                    {
                      this.name_submit = true
                    }
                if(this.name_submit === true)
                {
                  this.change    = true;
                  this.stateShow = true;
                  this.imgStatus = true;

                  var data = this.stateName.find(t=>t.state_name == this.place_of_supply);
                  editCustDetail.place_of_supply_code= data.state_code;

                  this.api.post('post_update_data.php?table=vendor&field=vendor_id&value=' + id + '&authToken=' + environment.authToken, editCustDetail).then((data_rt: any) => {

                    if (data_rt.status == "success")
                    {
                      this.toastrService.success('Vendor Details Updated Succesfully');

                      this.vendor_name     = null
                      this.vendor_id       = null
                      this.vendorType      = null
                      this.tax_exemption   = null
                      this.tax_mode        = null
                      this.email           = null
                      this.pan_number      = null
                      this.gst_number      = null
                      this.udyam_no        = null
                      this.udyam_registeration = null
                      this.web_site        = null
                      this.place_of_supply = null
                      this.opening_balance = null
                      this.terms_condition = null
                      this.remarks         = null
                      this.notes           = null
                      this.contact_no      = null
                      this.mobile_no       = null
                      this.logo            = null
                      this.payment_term    = null
                      this.img_path        = null
                      this.vendorInfo();
                      this.loaddata(id);
                      this.payment_term_name = null;
                    }
                    else { this.toastrService.error(data_rt.status); }
                  }).catch(error => { this.toastrService.error(' Vendor Details Update Failed'); });
                }
              }
                else
                {
                  this.toastrService.error('Please Fill All Details');
                }
  }
  updateCust(updateCust) {
                this.updateVendor = updateCust;
                this.cust_id = updateCust.vendor_id
                this.api.post('post_update_data.php?authToken=' + environment.authToken + '&table=vendor&field=vendor_id&value=' + this.cust_id, this.updateVendor).then((data: any) => {
                  if (data.status == "success") {
                    this.toastrService.success('Updated Vendor Image Successfully!!');
                    this.status = true;
                    this.ngOnInit();
                  }
                  else {this.toastrService.error(data.status); }
                  return true;
                }).catch(error => {
                  this.toastrService.error('Vendor Update Failed');
                });
  }
  editVendorAddress(addressId)
  {
                this.status        = false;
                this.editAddressId = addressId
                this.api.get('get_data.php?table=vendor_address&find=cust_addr_id&value=' + addressId + '&authToken=' + environment.authToken).then((data: any) => {
                  this.addressChange  = data[0];

                  this.name           = this.addressChange.attention
                  this.address_line_1 = this.addressChange.address_line_1
                  this.address_line_2 = this.addressChange.address_line_2
                  this.city           = this.addressChange.city
                  this.state          = this.addressChange.state
                  this.zipcode        = this.addressChange.zip_code
                  this.mobile         = this.addressChange.phone
                  this.type           = this.addressChange.type
                  this.status         = this.addressChange.status
                }).catch(error => { this.toastrService.error('Document view Failed'); });
                this.editAddress = this.modalService.open(this.edit_address, { size: 'md' });
  }
  taxview()
  {
                this.taxRate   = true;
                this.taxRate1  = false;
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
                this.gstview     = true;
                this.vendorType1 = true;
                this.panhide     = true;
              }
              else if (gst == 0)
              {
                this.gstview     = false;
                this.vendorType1 = false;
                this.panhide     = false;
                this.statehide   = false;
              }
  }
  copyAddress(vendorAddress)
  {
              this.shipAttention = vendorAddress.billAttention
              this.shipAddress1  = vendorAddress.billAddress1
              this.shipAddress2  = vendorAddress.billAddress2
              this.shipCity      = vendorAddress.billCity
              this.shipState     = vendorAddress.billState
              this.shipZip       = vendorAddress.billZip
              this.shipPhone     = vendorAddress.billPhone
              this.shipFax       = vendorAddress.billFax
  }
  addPerson(prefix = "Mr.", fname = "", lname = "", contactEmail = "", workPhone = "", mobile = "")
  {
              let contacts = this.vendor.get('contacts') as FormArray;
              contacts.push(this.fb.group({
                prefix      : [prefix],
                fname       : [fname],
                lname       : [lname],
                contactEmail: [contactEmail],
                workPhone   : [workPhone],
                mobile      : [mobile]
              }));
  }

  addPerson_wizard(prefix = "Mr.", fname = "", lname = "", contactEmail = "", workPhone = "", mobile = "")
  {
              let contacts = this.contact_details.get('contacts') as FormArray;
              contacts.push(this.fb.group({
                prefix      : [prefix],
                fname       : [fname],
                lname       : [lname],
                contactEmail: [contactEmail,Validators.compose([ Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
                workPhone: [workPhone,Validators.compose([ Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
                mobile   : [mobile,Validators.compose([ Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])]
              }));

  }

  removePerson_wizard(i)
  {
              let con = this.contact_details.get('contacts') as FormArray;
              con.removeAt(i);
  }

  removePerson(i)
   {
              let con = this.vendor.get('contacts') as FormArray;
              con.removeAt(i);
  }

  async submit(updateAddress) {
              if (this.updateAddress.valid)
              {
                let id = this.editAddressId
                this.api.post('post_update_data.php?table=vendor_address&field=vendor_addr_id&value=' + id + '&authToken=' + environment.authToken, updateAddress).then((data_rt: any) => {
                  if (data_rt.status == "success")
                  {
                    this.toastrService.success('Vendor Address Updated Succesfully');
                    this.vendAddr(this.detail_view.vendor_id);
                    this.vendContact(this.detail_view.vendor_id);
                  }
                  else { this.toastrService.error(data_rt.status); }
                  this.editAddress.close();
                }).catch(error => { this.toastrService.error('Vendor Address Update Failed!!'); });
              }
              else
              {
                this.toastrService.error('Please Fill All Details');
              }
  }
 async onSubmit(vendor)
  {
              Object.keys(this.vendor.controls).forEach(field =>
                {
                const control = this.vendor.get(field);
                control.markAsTouched({ onlySelf: true });
              });

              if (this.vendor.valid)
              {
                this.loading = true;
              await this.api.post('mp_vendor_create.php?authToken=' + environment.authToken, vendor).then((data: any) => {
                  if (data.status == "success")
                  {
                    this.toastrService.success('Vendor Added Succesfully');
                    this.loading = false;
                    this.vendorInfo();
                    this.vendorType1 = true;
                    this.show = true;
                  }
                  else
                  {
                    this.toastrService.error('Something went wrong');
                  }
                }).catch(error => {
                  this.toastrService.error('Something went wrong');
                });
              }
              else {this.toastrService.error('Please Fill All Details'); }
  }

  onActivate(event) {
              if (event.type === "click") {
                this.detail_view = event.row.vendor_id;
                this.vendAddr(this.detail_view);
                this.vendContact(this.detail_view);
                this.loaddata(this.detail_view)
                this.editCustDetail.controls['payment_term'].setValue( event.row.payment_term);

              }
  }


 async loaddata(id)
  {
                await this.api.get('get_data.php?table=vendor&find=vendor_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) => {
                    this.detail_view      = data[0];
                    setTimeout(() => {

                    this.vendor_name      = this.detail_view.company_name;
                    this.vendor_id        = this.detail_view.vendor_id;
                    this.vendorType       = this.detail_view.vendor_type;
                    this.email            = this.detail_view.email;
                    this.tax_exemption    = this.detail_view.tax_exemption;
                    this.contact_no       = this.detail_view.contact_number;
                    this.mobile_no        = this.detail_view.mobile_number;
                    this.tax_empty        = this.detail_view.tax_empty;
                    this.tax_mode         = this.detail_view.tax_mode;
                    this.pan_number       = this.detail_view.pan_number;
                    this.gst_number       = this.detail_view.gst_number;
                    this.udyam_no         = this.detail_view.udyam_number;
                    this.udyam_registeration = this.detail_view.udyam_registeration ;
                    this.web_site         = this.detail_view.web_site;
                    this.place_of_supply  = this.detail_view.place_from_supply;
                    this.opening_balance  = this.detail_view.opening_balance;
                    this.terms_condition  = this.detail_view.terms_condition;
                    this.remarks          = this.detail_view.remarks;
                    this.notes            = this.detail_view.notes;
                    this.logo             = this.detail_view.image;
                    this.payment_term     = this.detail_view.payment_term;
                    this.payment_term_name = null;

                    this.img_path = environment.baseURL + "download_file.php?path=upload/vendor_images/" + this.logo + "&authToken=" + environment.authToken;

                    if(this.detail_view.payment_term != null || this.detail_view.payment_term > 0)
                    {
                      this.nameload(this.detail_view.payment_term);
                    }
                  }, 200);
                  }).catch(error => { this.toastrService.error('Something went wrong'); });

  }

  async nameload(value:any)
    {
                  var name =this.paymentTerm.find(x => x.id === parseInt(value));

                  if(name != undefined)
                  {
                    this.payment_term_name = name.terms;
                  }
                  else
                  {
                    this.payment_term_name = null
                  }
    }

  editVendorContact(id)
  {
                    this.status=null;
                    this.editContactId = id
                    this.api.get('get_data.php?table=vendor_contact&find=vendor_cont_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) => {
                              this.contactChange  = data[0];
                              this.prefix         = this.contactChange.prefix
                              this.fname          = this.contactChange.first_name
                              this.lname          = this.contactChange.last_name
                              this.email          = this.contactChange.email
                              this.workphone      = this.contactChange.phone
                              this.mobile         = this.contactChange.mobile
                              this.status         = this.contactChange.status
                    }).catch(error => { this.toastrService.error('Something went wrong'); });
                    this.editcontact = this.modalService.open(this.edit_contact, { size: 'md' });
  }

contact_submit(data)
{
                    let id = this.editContactId
                    this.loading = true;
                    this.api.post('post_update_data.php?table=vendor_contact&field=vendor_cont_id&value=' + id + '&authToken=' + environment.authToken, data).then((data: any) => {
                      if (data.status == "success")
                      {
                        this.loading = false;
                        this.toastrService.success('Vendor Contact Updated Succesfully');
                        this.editcontact.close();
                        this.vendAddr(this.detail_view.vendor_id);
                        this.vendContact(this.detail_view.vendor_id);
                      }
                      else { this.toastrService.error(data.status); }
                    }).catch(error => { this.toastrService.error('Vendor Contact Update Failed!!'); });
}


  vendAddr(detail_view)
  {
                  this.api.get('get_data.php?table=vendor_address&find=vendor_id&value=' + detail_view + '&authToken=' + environment.authToken).then((data: any) => {

                    setTimeout(() => {

                      this.vendor_address = data;

                      this.isLoading = false;
                    }, 1500);
                  }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  vendContact(detail_view)
    {
                this.api.get('get_data.php?table=vendor_contact&find=vendor_id&value=' + detail_view + '&authToken=' + environment.authToken).then((data: any) => {

                  setTimeout(() => {
                  this.vendor_contact = data;
                }, 1500);
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
                this.vendors = temp;
                this.table.offset = 0;
   }

  set_zero()
  {
              this.selected  = [];
              this.change    = true;
              this.stateShow = true;
              this.imgStatus = true;
  }

  addVendor()
   {
              this.show = false;
  }

  custView()
  {
               this.show = true;
  }

  views() {
               this.show      = false;
  }

  taxEmpty() {
             this.emptyTax  = true;
  }
  taxEmpty1() {
              this.emptyTax  = false;
  }
  editCust() {
              this.imgStatus = false;
              this.stateShow = false;
              this.change    = false;
              this.imgStatus = false;
  }
  uploadImg() {
             this.Upl_cust_img = this.modalService.open(this.upload_cust_img, { size: 'md' });
  }
  getGstNo(gstNo)
  {
            this.placeOfSupply = gstNo.slice(0, 2);
            this.placeOfSupply = this.placeOfSupply;
            this.pan           = gstNo.slice(2, 12);
            this.pan           = this.pan;
            this.panhide       = false;
            this.onInput(gstNo)
  }
  type1()
  {
            this.vendorType1 = true;
            this.panhide     = true;
            this.statehide   = true;
            this.gst_details.controls['pan'].reset();
            this.gst_details.controls['placeOfSupply'].reset();
  }
  type2()
  {
            this.vendorType1  = false;
            this.panhide      = false;
            this.statehide    = false;
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

editCustomerAddress(addressId)
{
            this.status = false;
            this.editAddressId = addressId
            this.api.get('get_data.php?table=vendor_address&find=vendor_addr_id&value=' + addressId + '&authToken=' + environment.authToken).then((data: any) => {
              this.addressChange    = data[0];
              this.name             = this.addressChange.attention
              this.address_line_1   = this.addressChange.address_line_1
              this.address_line_2   = this.addressChange.address_line_2
              this.city             = this.addressChange.city
              this.state            = this.addressChange.state
              this.zipcode          = this.addressChange.zip_code
              this.mobile           = this.addressChange.phone
              this.type             = this.addressChange.type
              this.status           = this.addressChange.status
            }).catch(error => { this.toastrService.error('Something went wrong'); });
            this.editAddress = this.modalService.open(this.edit_address, { size: 'md' });
}

public next()
{
              let vendor_data     = this.vendor_data;
              let gst_details     = this.gst_details;
              let address_details = this.address_details;
              let contact_details = this.contact_details;

              if(this.steps[this.steps.length-1].active)
                  return false;

              this.steps.some(function (step, index, steps) {
                  if(index < steps.length-1){
                      if(step.active){
                          if(step.name=='Vendor Information'){

                            Object.keys(vendor_data.controls).forEach(field =>
                              {
                              const control = vendor_data.get(field);
                              control.markAsTouched({ onlySelf: true });
                              });

                              if (vendor_data.valid) {
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
                                  steps[index+1].active = true;
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
                                  steps[index+1].active = true;

                                  return true;
                              }
                              else{
                                  step.hasError = true;
                              }
                              this.addPerson_wizard()
                          }
                          if(step.name=='Contact Details'){

                            Object.keys(contact_details.controls).forEach(field =>
                              {
                              const control = contact_details.get(field);
                              control.markAsTouched({ onlySelf: true });
                              });

                            if (contact_details.valid) {

                                step.active  = false;
                                step.valid   = true;
                                steps[index+1].active = true;
                                return true;
                            }
                            else{
                                step.hasError = true;
                            }
                        }
                      }
                  }
              });
              this.details.vendor_name     = this.vendor_data.value.company_name;
              this.details.created_by      = this.vendor_data.value.created_by;
              this.details.type            = this.vendor_data.value.type;
              this.details.vendorType      = this.vendor_data.value.vendorType;
              this.details.salutation      = this.vendor_data.value.salutation;
              this.details.firstName       = this.vendor_data.value.firstName;
              this.details.companyName     = this.vendor_data.value.companyName;
              this.details.email           = this.vendor_data.value.email;
              this.details.phone           = this.vendor_data.value.phone;
              this.details.mobile          = this.vendor_data.value.mobile;
              this.details.website         = this.vendor_data.value.website;
              this.details.gstTreatment    = this.gst_details.value.gstTreatment;
            if(this.gst_details.value.gstin != undefined)
              {
                this.details.gstin           = this.gst_details.value.gstin;
              }
              else{this.details.gstin = null;}
              this.details.pan             = this.gst_details.value.pan;
              this.details.placeOfSupply   = this.gst_details.value.placeOfSupply;
              this.details.opening_balance = this.gst_details.value.opening_balance;
              this.details.udyam_register  = this.gst_details.value.udyam_register;
              this.details.udyam_no        = this.gst_details.value.udyam_no;
              this.details.terms_condition = this.gst_details.value.terms_condition;
              this.details.remarks         = this.gst_details.value.remarks;
              this.details.notes           = this.gst_details.value.notes;
              this.details.taxType         = this.gst_details.value.taxType;
              this.details.taxEmpty        = this.gst_details.value.taxEmpty;
              this.details.paymentTerms    = this.gst_details.value.paymentTerms;
              this.details.placeOfSupply   = this.gst_details.value.placeOfSupply;
              this.details.vendorStatus    = this.gst_details.value.vendorStatus;
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

public prev()
{
            if(this.steps[0].active)
                return false;
            this.steps.some(function (step, index, steps) {
                if(index != 0){
                    if(step.active)
                    {
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


            const billNoValue = this.ven_name;
            const gstvalue = this.gstin_number;

            function normalizeString(str : any) {
              return str.replace(/\s+/g, '').toLowerCase();
            }

            let checking :any
            let checking_gst :any

            await this.api.get('get_data.php?table=vendor&authToken=' + environment.authToken).then((data: any) =>

              {
                checking = data.some((item: { company_name: any; }) =>  normalizeString(item.company_name) ===  normalizeString(billNoValue) );
                if(gstvalue != null)
                {
                  checking_gst = data.some((item: { gst_number: any; }) =>  normalizeString(item.gst_number) ===  normalizeString(gstvalue) );
                }
              }).catch(error =>
                {
                    this.toastrService.error('API Faild : vendor details checking failed');
                    this.loading = false;
                });

              if(!checking)
               {
                if(!checking_gst)
                  {  this.dataload();
                    this.loading=true;
                    await  this.api.post('mp_vendor_create.php?authToken=' + environment.authToken, this.details).then((data: any) => {
                      if (data.status == "success")
                        {
                          this.toastrService.success('Vendor Added Succesfully');
                          this.loading=false;
                          this.vendor_data.controls['created_by'].setValue(this.uid);
                          this.vendor_data.controls['type'].setValue('1');
                          this.vendor_data.controls['vendorType'].setValue('distributor')
                          this.vendor_data.controls['salutation'].setValue('Mr');
                          this.vendor_data.controls['firstName'].setValue('Name');
                          this.vendor_data.controls['companyName'].setValue('');
                          this.vendor_data.controls['email'].setValue('Default@gmail.com');
                          this.vendor_data.controls['phone'].setValue('00000000000000');
                          this.vendor_data.controls['mobile'].setValue('0000000000');
                          this.vendor_data.controls['website'].setValue('WWW.Website.com');
                          this.gst_details.controls['gstTreatment'].setValue(1);
                          this.gst_details.controls['gstin'].setValue('AAAAA0000A1Z5');
                          this.gst_details.controls['udyam_register'].setValue('');
                          this.gst_details.controls['udyam_no'].setValue('');
                          this.gst_details.controls['pan'].setValue('');
                          this.gst_details.controls['placeOfSupply'].setValue('33');
                          this.gst_details.controls['taxType'].setValue('1');
                          this.gst_details.controls['taxEmpty'].setValue('');
                          this.gst_details.controls['paymentTerms'].setValue('1');
                          this.gst_details.controls['opening_balance'].setValue(0);
                          this.gst_details.controls['terms_condition'].setValue('');
                          this.gst_details.controls['remarks'].setValue('');
                          this.gst_details.controls['notes'].setValue('');
                          this.gst_details.controls['vendorStatus'].setValue(1);
                          this.address_details.controls['billAttention'].setValue('Name');
                          this.address_details.controls['billAddress1'].setValue('Address Line 1');
                          this.address_details.controls['billAddress2'].setValue('Address Line 2');
                          this.address_details.controls['billCity'].setValue('City');
                          this.address_details.controls['billState'].setValue('TAMIL NADU');
                          this.address_details.controls['billZip'].setValue('000000');
                          this.address_details.controls['billPhone'].setValue('0000000000');
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
                          this.vendorInfo();
                          this.contact_details.reset();
                          this.vendorType1 = true;
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
                        else
                        {
                          this.toastrService.error('Something went wrong ');
                          this.loading=false;
                        }
                      }).catch(error => {this.toastrService.error('Something went wrong ');
                          this.loading=false;});
                    }
                    else{ this.toastrService.error('GST number was already exist ');}
                  }else{ this.toastrService.error('Vendor Name was already exist ');}
 }

 onActivate1(){}

 add_newaddress()
 {
                this.newaddress.controls['created_by'].setValue(this.uid);
                this.newaddress.controls['vendor_id'].setValue(this.detail_view.vendor_id);

                this.addAddress = this.modalService.open(this.add_address, { size: 'md' });
 }

 new_submit(value)
 {
                Object.keys(this.newaddress.controls).forEach(field =>
                  {
                  const control = this.newaddress.get(field);
                  control.markAsTouched({ onlySelf: true });
                  });
                if (this.newaddress.valid)
                {
                  this.loading=true;
                  this.api.post('post_insert_data.php?table=vendor_address&authToken=' + environment.authToken, value).then((data_rt: any) => {
                    if (data_rt.status == "success")
                    {
                      this.loading=false;
                      this.toastrService.success('Vendor Address Added Succesfully');
                      this.newaddress.reset();
                      this.addAddress.close();
                      this.vendAddr(this.detail_view.vendor_id);
                    }
                    else { this.toastrService.error(data_rt.status);
                        this.loading=false;}

                  }).catch(error => { this.toastrService.error('Vendor Address Added Failed!!');
                      this.loading=false; });
                }
                else
                {
                  this.toastrService.error('Please Fill All Details');
                }
 }

 add_newcontact()
 {
                this.addcontact.controls['created_by'].setValue(this.uid);
                this.addcontact.controls['vendor_id'].setValue(this.detail_view.vendor_id);
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
                  this.api.post('post_insert_data.php?table=vendor_contact&authToken=' + environment.authToken, data).then((data_rt: any) => {
                    if (data_rt.status == "success")
                    {
                      this.loading=false;
                      this.toastrService.success('Vendor Contact Added Succesfully');
                      this.addcontact.reset();
                      this.addcontact_popup.close();
                      this.vendContact(this.detail_view.vendor_id);
                    }
                    else { this.toastrService.error(data_rt.status);
                          this.loading=false; }

                  }).catch(error => { this.toastrService.error('Vendor Contact Added Failed!!');
                                    this.loading=false;});
                }
                else
                {
                  this.toastrService.error('Please Fill All Details');
                }
 }



 onInputChange()
 {
              const billNoValue = this.ven_name;
              let value   = this.vendors.find(item => item.company_name === billNoValue);
                if(value != undefined)
                {

                  this.toastrService.error(' Vendor Name has already been entered')
                }
 }


 onInput(gstNo)
 {
              const gstvalue = gstNo;
              let value_1 = this.vendors.find(item => item.gst_number   === gstvalue);
                if(value_1 != undefined)
                {
                  this.toastrService.error(' GST Number has already been entered')
                }
 }

 onInput_pan()
 {
              const panvalue = this.pan;
              let value = this.vendors.find(item => item.pan_number   === panvalue);
                if(value != undefined)
                {
                  this.toastrService.error(' PAN Number has already been entered')
                }
 }
}
