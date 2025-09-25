import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {  Directive,  HostListener, Renderer2 } from '@angular/core';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



declare var $: any;
@Component({
  selector   : 'az-bills',
  templateUrl: './bills.component.html',
  styleUrls  : ['./bills.component.scss']
})
export class BillsComponent implements OnInit {

  public uid = localStorage.getItem('uid');

  public formShow          : boolean = true;
  show_new_bill            : boolean = false;
  loading                  : boolean = false;
  public isDropdownAppendedToBody: boolean = true;

  private startX: number = 0;
  private startWidth: number = 0;
  private columnIndex: number | null = null;
  private resizing = false;

  public notes             : any;
  public terms_condition   : any;
  public bill_addr         : any;
  public billFrom          : any;
  public billAttention     : any;
  public billAddress_line_1: any;
  public billAddress_line_2: any;
  public billCity          : any;
  public billState         : any;
  public billZipcode       : any;
  public shipp_addr        : any;
  public shipFrom          : any;
  public shipAttention     : any;
  public shipAddress_line_1: any;
  public shipAddress_line_2: any;
  public shipCity          : any;
  public shipState         : any;
  public shipZipcode       : any;
  public taxes             : any;
  public i_valu            : any;

  VendorBillList           : any;
  ItemList                 : any;
  BillingAddress           : any;
  ShippingAddress          : any;
  GST_Data                 : any;
  GST_Length               : any;

  ingredients              : any;
  response                 : any;
  modalRef                 : any;
  file                     : any;
  test                     : any;
  invoiceDetails           : any;
  paymentTerm              : any;
  branches                 : any;
  vendorDetails            : any;
  invoiceCustDetails       : any;

  uom                      : any;
  price                    : any;
  quantity                 : any;
  inv_id                   : any;
  invoiceNumber            : any;
  stateCode                : any;
  vendor_id                : any;
  customer_bill_address    : any;
  customer_ship_address    : any;
  payment_terms            : any;
  bill_attention           : any;
  bill_address_line_1      : any;
  bill_address_line_2      : any;
  bill_city                : any;
  bill_state               : any;
  bill_zip_code            : any;
  bill_phone               : any;
  ship_attention           : any;
  ship_city                : any;
  ship_state               : any;
  ship_zip_code            : any;
  ship_phone               : any;
  company_name             : any;
  state_code               : any;
  invoice_id               : any;

  amount                   : any;
  descriptions             : any;
  invoiceDate              : any;
  followingDay             : any;
  day                      : any;
  month                    : any;
  year                     : any;
  fullDate                 : any;
  dueValues                : any = 0;
  invoicePdf               : any;
  invoiceItems             : any;
  billToPdf                : any;
  customerPdf              : any;
  branchPdf                : any;
  invoicePdfDetails        : any;
  img_path                 : any;
  company_pdf_logo         : any;
  company_mobile           : any;
  company_gst_no           : any;
  company_tan_no           : any;
  events                   : any;
  bill_no                  : any;
  lastindex                : any = 0;
  tds_percent               = 0;
  tcs_percent               = 0;
  subtotal                 : any;
  taxempty                 : any;
  category                 : any;
  total_tax                : any;

  SelectCategory           : FormGroup;
  addForm                  : FormGroup;
  product                  : FormGroup;
  bill                     : FormGroup;
  item_list                : FormGroup;
  myControl                = new FormControl();

  imageToShow              : string | ArrayBuffer;
  billPerfix               : string;
  imgUrl                   : string = '../../../../assets/img/logo/geogreen.png';

  rows                     = [];
  temp                     = [];
  selected                 = [];
  options                  : string[] = ['One', 'Two', 'Three'];
  SelectionType            = SelectionType;
  type                     : any
  customer_list            : any
  project_list             : any
  originalTableHeight      : any

  tableWidth :any= 100 ;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("customer_name", { static: true }) customer_name: ElementRef;  // For MODEL Open
  @ViewChild("bill_category", { static: true }) bill_category : ElementRef;
  @ViewChild("bill_list", { static: true }) bill_list : ElementRef;
  @ViewChild('tableResponsive', { static: false }) tableResponsive: ElementRef;
  @ViewChild('dropdownPanel', { static: false }) dropdownPanel: ElementRef;

  constructor
  (
    public  fb            : FormBuilder,
    public  toastrService : ToastrService,
    private api           : ApiService,
    private modalService  : NgbModal,
    private renderer: Renderer2
  )
  {
    this.SelectCategory = fb.group({
      invoicetype : [null, Validators.compose([Validators.required])],
      vendor_id   : [null],
      project_id  : [null]
     })

    this.bill = fb.group(
      {
        created_by: [this.uid],
        vendorId: ['', Validators.compose([Validators.required])],
        billFrom: [null],
        shipFrom: [null],
        billNo  : [null, Validators.compose([Validators.required])],
        reference_number: [null],
        billDate: [(new Date()).toISOString().substring(0, 10)],
        paymentTerms: ['', Validators.compose([Validators.required])],
        dueDate : [(new Date()).toISOString().substring(0, 10)],
        subTotal: [0,Validators.compose([Validators.required])],
        shippingCharge: [0],
        TCS     : [0],
        TDS     : [0],
        roundOff: [0],
        notes: [null, Validators.compose([Validators.required])],
        terms_condition: [null, Validators.compose([Validators.required])],
        status  : [1],
        total   : [0],
        tds_percentage:[0],
        tcs_percentage:[0],
        tax_type: [null],
        project_id : [null],
        size : [null],
        product: this.fb.array([])
      })


  }

  ngOnInit()
  {
    this.LoadVendorDetails();
    this.LoadVendorBills();
    this.initProduct();
    this.LoadItemDetails();

  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('resizer')) {
      this.startX = event.clientX;
      this.startWidth = target.parentElement!.offsetWidth;
      this.columnIndex = Array.from(target.parentElement!.parentElement!.children).indexOf(target.parentElement!);
      this.resizing = true;
      event.preventDefault(); // Prevent text selection during resize
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.resizing && this.columnIndex !== null) {
      const columns = document.querySelectorAll(`.resizable-table th:nth-child(${this.columnIndex + 1})`);
      columns.forEach(column => {
        const newWidth = this.startWidth + (event.clientX - this.startX);
        (column as HTMLElement).style.width = `${newWidth}px`;
      });
    }
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.resizing = false;
  }

  changeTableWidth() {
    document.documentElement.style.setProperty('--table-width', this.tableWidth+'%');
  }

  get project_id(): AbstractControl {
    return this.SelectCategory.get('project_id');
  }

  private dropdownOpen = false;

  @HostListener('document:click', ['$event'])
      handleClickOutside(event: MouseEvent) {
          const dropdownPanels = document.querySelectorAll('.ng-dropdown-panel');
          const target = event.target as HTMLElement;

            if (!dropdownPanels.length || Array.from(dropdownPanels).some(panel => !panel.contains(target))) {
              if (this.dropdownOpen) {
                this.resetTableHeight();
                this.dropdownOpen = false;
              }
          }
    }

    adjustTableHeight() {

          setTimeout(() => {
            const dropdownPanels = document.querySelectorAll('.ng-dropdown-panel');

            dropdownPanels.forEach(dropdownPanel => {
              if (dropdownPanel) {
                const dropdownHeight = dropdownPanel.getBoundingClientRect().height;

                if (this.tableResponsive) {

                  const newTableHeight = this.tableResponsive.nativeElement.offsetHeight + dropdownHeight ; // Add some extra space
                  this.renderer.setStyle(this.tableResponsive.nativeElement, 'height', `${newTableHeight}px`);

                  this.dropdownOpen = true;
                }
              }
            });
          }, 100);
    }

  resetTableHeight() {
        if (this.tableResponsive) {

          this.renderer.setStyle(this.tableResponsive.nativeElement, 'height', `auto`);
        }
  }


  applyConditionalValidators() {
    if (this.type === 'project') {

      this.SelectCategory.get('project_id').addValidators(Validators.required);
    } else {
      this.SelectCategory.get('project_id').addValidators(null);
    }
  }




  async LoadVendorBills()
  {
    await this.api.get('mp_vendor_bill.php?&authToken=' + environment.authToken).then((data: any) =>
    {
      this.VendorBillList = data;
      this.temp   =[...data]
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorBills'); });

    this.api.get('get_data.php?table=customers&authToken=' + environment.authToken).then((data: any) => {

      this.customer_list =  data

   }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  async LoadVendorDetails()
  {
    await this.api.get('get_data.php?table=vendor&authToken=' + environment.authToken).then((data: any) =>
    {
      this.vendorDetails = data;
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorDetails'); });
  }

  async LoadItemDetails()
  {
    await this.api.get('get_data.php?table=item&find=purchase&value=1&authToken=' + environment.authToken).then((data: any) =>
    {
      this.ItemList = data;
    }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
  }

  ReturnToList()
  {
    this.isDropdownAppendedToBody = true;
    this.LoadVendorBills();
    this.show_new_bill = !this.show_new_bill;
    this.selected = [];
    this.bill.reset();
    this.bill.controls['created_by'].setValue(this.uid);
    this.bill.controls['subTotal'].setValue(0);
    this.bill.controls['shippingCharge'].setValue(0);
     this.bill.controls['TCS'].setValue(0);
     this.bill.controls['TDS'].setValue(0);
    this.bill.controls['roundOff'].setValue(0);
    this.bill.controls['total'].setValue(0);
    this.bill.controls['status'].setValue(1);
    this.loading = false;

    this.LoadVendorBills();
    const formArray         = this.bill.get('product') as FormArray;
    const formArrayLength   = formArray.length;
    const formArrayControls = formArray.controls;
    for (let i = formArrayControls.length-1; i >= 1; i--)
    {
    const control = formArrayControls[i];
    formArray.removeAt(i);
    }
    this.type = null
    this.project_list = null
  }

  async VendorSelection(id)
  {

    this.isDropdownAppendedToBody = false;
    this.formShow = false;
    this.vendor_id = id;
    const today = new Date();
    let date = today.toISOString().split('T')[0];

    this.bill.reset();

    this.bill.controls['project_id'].setValue(this.SelectCategory.value.project_id);
    this.bill.controls['vendorId'].setValue(id);
    this.bill.controls['created_by'].setValue(this.uid);
    this.bill.controls['billDate'].setValue(date);
    this.bill.controls['subTotal'].setValue(0);
    this.bill.controls['shippingCharge'].setValue(0);
    this.bill.controls['TCS'].setValue(0);
    this.bill.controls['TDS'].setValue(0);
    this.bill.controls['roundOff'].setValue(0);
    this.bill.controls['total'].setValue(0);
    this.bill.controls['status'].setValue(1);
    this.bill.controls['tds_percentage'].setValue(0);
    this.bill.controls['tcs_percentage'].setValue(0);
    this.tds_percent=0;
    this.tcs_percent=0;
    this.loading = false;

    this.LoadVendorBills();
    const formArray         = this.bill.get('product') as FormArray;
    const formArrayLength   = formArray.length;
    const formArrayControls = formArray.controls;
    for (let i = formArrayControls.length-1; i >= 1; i--)
    {
    const control = formArrayControls[i];
    formArray.removeAt(i);
    }

    await this.api.get('mp_bill.php?&value=' + this.vendor_id + '&authToken=' + environment.authToken).then((data: any) =>
    {
      this.FetchAddress(data[0]);

      this.company_name    = data[0].company_name;
      this.notes           = data[0].notes;
      this.terms_condition = data[0].terms_condition;
      this.stateCode       = data[0].place_from_supply_code;
      this.payment_terms   = data[0].payment_terms;
      let MyPaymentTerm    = data[0].my_payment_terms;
      let bill_id          = data[0].serial_no + 1;
      var prifix           = data[0].prefix ;
      this.bill_no         = bill_id;
      this.taxempty        = data[0].tax_mode;


      const today = new Date();
      let date = today.toISOString().split('T')[0];
      if(MyPaymentTerm)
        {
          this.bill.controls['paymentTerms'].setValue(MyPaymentTerm)
          this.dueDates(MyPaymentTerm, date);
        }
      if(this.stateCode == 33)
      {
        this.LoadGST('GST');
        this.bill.controls['tax_type'].setValue('GST');
      }
      else
      {
        this.LoadGST('IGST');
        this.bill.controls['tax_type'].setValue('IGST');
      }
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }
  async LoadGST(mode)
  {
    await this.api.get('get_data.php?table=tax&find=type&value=' + mode + '&authToken=' + environment.authToken).then((data: any) =>
    {
      this.GST_Data = data;
      this.GST_Length = data.length;
    }).catch(error => { this.toastrService.error('Something went wrong'); });

    for(let m = 0; m < this.GST_Length; m++)
      {
        this.GST_Data[m]['amount'] = 0;
      }
  }

  async FetchAddress(data)
  {
    for (let i = 0; i < data.bill_address.length; i++)
    {

        if (data.bill_address[i].set_as_default === 1 && data.bill_address[i].type === 1 && data.bill_address[i].status === 1 ) {

          this.bill_addr          = data.bill_address[i];
          this.billFrom           = this.bill_addr.vendor_addr_id;

          this.billAttention      = this.bill_addr.attention;
          this.billAddress_line_1 = this.bill_addr.address_line_1;
          this.billAddress_line_2 = this.bill_addr.address_line_2;
          this.billCity           = this.bill_addr.city;
          this.billState          = this.bill_addr.state;
          this.billZipcode        = this.bill_addr.zip_code;
          this.bill.controls['billFrom'].setValue(this.billFrom);
        }

      if (data.ship_address[i].set_as_default === 1 && data.ship_address[i].type === 2 && data.ship_address[i].status === 1 ) {

        this.shipp_addr         = data.ship_address[i];
        this.shipFrom           = this.shipp_addr.vendor_addr_id;

        this.shipAttention      = this.shipp_addr.attention;
        this.shipAddress_line_1 = this.shipp_addr.address_line_1;
        this.shipAddress_line_2 = this.shipp_addr.address_line_2;
        this.shipCity           = this.shipp_addr.city;
        this.shipState          = this.shipp_addr.state;
        this.shipZipcode        = this.shipp_addr.zip_code;
        this.bill.controls['shipFrom'].setValue(this.shipFrom);
      }
    }
  }
  Billdate(a)
  {
    this.dueDateChange();
    this.invoiceDate  = a;
    var current       = new Date(this.invoiceDate);
    this.followingDay = new Date(current.getTime() + (this.dueValues * 24 * 60 * 60 * 1000));
    this.fullDate     = this.followingDay.toISOString().substring(0, 10);
  }
  dueDates(s, BillDate)
  {
    this.dueValues    = s;
    var current       = new Date(this.invoiceDate || BillDate);
    this.followingDay = new Date(current.getTime() + (this.dueValues * 24 * 60 * 60 * 1000));
    this.fullDate     = this.followingDay.toISOString().substring(0, 10)
  }
  dueDateChange()
  {
    this.bill.controls["paymentTerms"].setValue(this.payment_terms);
  }
  async onSubmit(bill_data)
  {

    Object.keys(this.bill.controls).forEach(field => {
      const control = this.bill.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    if (this.bill.valid && this.bill.value.subTotal > 0)
    {
      console.log(this.bill.value)
        const billNoValue = this.bill_no;
        if(this.VendorBillList != null)
        {
        var value = this.VendorBillList.find(item => item.bill_number === billNoValue);
        }
        else{
            value = undefined;
        }
           if(value != undefined)
           {
            this.toastrService.error('Bill number has already been entered')
           }
          if(value == undefined)
           {

               this.loading = true;
                await this.api.post('mp_bill_create.php?type=new_po&authToken=' + environment.authToken, bill_data).then((data: any) =>
                {
                  console.log(data)
                  if (data.status == "success")
                  {
                    this.toastrService.success('Bill Added Succesfully');
                    this.loading = false;
                    this.ReturnToList();
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
      }

    else {
      this.toastrService.error('Please Fill All Details');
    }
  }

  initProduct()
  {
    let product = this.bill.get('product') as FormArray;
    product.push(this.fb.group({
      items       : new FormControl('', Validators.required),
      descriptions: new FormControl(''),
      taxes       : new FormControl('', Validators.required),
      price       : new FormControl('', Validators.required),
      quantity    : new FormControl('', Validators.required),
      uom         : new FormControl('', Validators.required),
      amount      : new FormControl('', Validators.required),
      discount_1  : new FormControl(0),
      discount_2  : new FormControl(0),
    }))
    this.adjustTableHeight()
  }

  patchValues(id,i)
  {
    let x = (<FormArray>this.bill.controls['product']).at(i);
    x.patchValue({
      taxes        : this.taxes,
      price        : this.price,
      quantity     : this.quantity,
      uom          : this.uom,
      amount       : this.amount,
      descriptions : this.descriptions,
      discount_1   : 0,
      discount_2   : 0,
    });
  }


  async specItem(item,i)
  {


    await this.api.get('get_data.php?table=item&find=item_id&value=' + item + '&authToken=' + environment.authToken).then((data: any) => {

      if(this.taxempty == 1)
      {
        this.taxes    = data[0].tax_percent;
      }

      if(this.taxempty == 0)
      {
        this.taxes    = 0;
      }

        this.price    = data[0].price;
        this.quantity = 1;
        this.uom      = data[0].uom;
        this.amount   = data[0].price;
        this.descriptions = data[0].description;

        this.api.get('get_data.php?table=item_category&find=cat_id&value=' + data[0].item_cat + '&authToken=' + environment.authToken).then((data: any) => {

           this.category =  data[0].have_serial_number

        }).catch(error => { this.toastrService.error('Something went wrong'); });
    }).catch(error => { this.toastrService.error('Something went wrong'); });

    const formData = {
      taxes: item,
    }
    this.patchValues(item,i);
    this.SubTotalChange();
    this.GSTCalculation();
    this.resetTableHeight();
  }

  SubTotalChange()
  {
    let arr = this.bill.controls['product'].value;
    let sum: number = arr.map(a => parseFloat(a.amount)).reduce(function(a, b)
    {
      return a + b;
    });
    this.subtotal=sum.toFixed(2);
    this.bill.controls['subTotal'].setValue(sum.toFixed(2));
    this.FinalTotalCalculation();
    this.GSTCalculation();
    this.tdsCalculation();
    this.tcsCalculation();
  }

  tdsCalculation()
  {
    let subtotal = Number(this.subtotal)
     let tds =  ((subtotal + this.total_tax)*(this.tds_percent/100)).toFixed(2);
     this.bill.controls['TDS'].setValue(tds);
     this.FinalTotalCalculation();
  }

  tcsCalculation()
  {
    let subtotal = Number(this.subtotal)
    let tcs =  ((subtotal + this.total_tax) *(this.tcs_percent/100)).toFixed(2);
    this.bill.controls['TCS'].setValue(tcs);
    this.FinalTotalCalculation();
  }

  FinalTotalCalculation()
  {
    let Sub_Total       = this.bill.controls['subTotal'].value;
    let TDS_Value       = this.bill.controls['TDS'].value;
    let TCS_Vale        = this.bill.controls['TCS'].value;
    let Shipping_Value  = this.bill.controls['shippingCharge'].value;
    let Roundof_Value   = this.bill.controls['roundOff'].value;

    let TotalGST: number = this.GST_Data.map(a => a.amount).reduce(function(a, b)
    {
      return a + b;
    });

    let Total_Calculation = ( Number(Sub_Total) - Number(TDS_Value) + Number(TCS_Vale) + Number(Shipping_Value) + Number(Roundof_Value)+ Number(TotalGST)).toFixed(2);
    this.bill.controls['total'].setValue(Total_Calculation);
  }

  GSTCalculation() {

    this.GST_Data.forEach(data => {
      data.amount = 0;
    });
        this.total_tax = 0
    let products = (<FormArray>this.bill.controls['product']).value;
    products.forEach(product => {
      let taxValue = (product.amount / 100) * product.taxes;
      let taxAmount = parseFloat(taxValue.toFixed(2));
       this.total_tax += taxValue;
      this.GST_Data.forEach(data => {
        if (data.rate === product.taxes)
        {
          data.amount += taxAmount;
          data.amount = parseFloat(data.amount.toFixed(2));
        }
      });
    });
    this.FinalTotalCalculation();
  }


  qty(qty, price,discount_1,discount_2, i)
  {
    let dis_1=  price - (discount_1/100)*price;
    let dis_2= dis_1 - (discount_2/100)*dis_1;
    this.amount = (qty *dis_2).toFixed(2);
    let x = (<FormArray>this.bill.controls['product']).at(i);
    x.patchValue({
      amount : this.amount
    });
    this.SubTotalChange();
    if(this.category)
    {

    }
  }

  discount_Change(qty, price,discount_1,discount_2, i)
  {

    let dis_1=  price - (discount_1/100)*price;
    let dis_2= dis_1 - (discount_2/100)*dis_1;
    this.amount = (qty *dis_2).toFixed(2);
    let x = (<FormArray>this.bill.controls['product']).at(i);
     x.patchValue({
      amount : this.amount
    });
    this.SubTotalChange();
  }

  priceChange(qty, price,discount_1,discount_2, i)
  {
    let dis_1=  price - (discount_1/100)*price;
    let dis_2= dis_1 - (discount_2/100)*dis_1;

    this.amount = (qty *dis_2).toFixed(2);
    this.amount = (qty *dis_2).toFixed(2);
    let x = (<FormArray>this.bill.controls['product']).at(i);
    x.patchValue({
      amount : this.amount
    });
    this.SubTotalChange();
  }

  onDeleteRow(rowIndex)
  {
    let product = this.bill.get('product') as FormArray;
    if (product.length > 1) {
      product.removeAt(rowIndex)
    } else {
      product.reset()
    }
    this.SubTotalChange()
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  set_zero() {
    this.selected = [];
  }

  removeEmployee(i: number) {
    let address = this.bill.get('products') as FormArray;
    address.removeAt(i);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event)
  {
    if (event.type === "click")
    {
      localStorage.setItem('view_bill', event.row.serial_no);

      this.api.get('mp_ven_bill_pdf.php?value=' + event.row.serial_no + '&authToken=' + environment.authToken).then((data: any) => {
        this.invoicePdf   = data;
        this.invoiceItems = this.invoicePdf[0].bill_items;
      }).catch(error => {
        this.toastrService.error('Something went wrong 2');
      });
    }
  }
  updateFilter(event) {


    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });
    this.VendorBillList = temp;
    this.table.offset = 0;
  }
  onFocus($event: Event) {
    this.events.push({ name: '(focus)', value: $event });
  }
  onBlur($event: Event) {
    this.events.push({ name: '(blur)', value: $event });
  }
  onOpen() {
    this.events.push({ name: '(open)', value: null });
  }
  onClose() {
    this.events.push({ name: '(close)', value: null });
  }
  onAdd($event: any) {
    this.events.push({ name: '(add)', value: $event });
  }
  onRemove($event: any) {
    this.events.push({ name: '(remove)', value: $event });
  }
  onClear() {
    this.events.push({ name: '(clear)', value: null });
  }
  onScrollToEnd($event: any) {
    this.events.push({ name: '(scrollToEnd)', value: $event });
  }
  onSearch($event: any) {
    this.events.push({ name: '(search)', value: $event });
  }
  addInvoice() {

    this.modalRef = this.modalService.open(this.bill_category, { size: 'md' });
    this.SelectCategory.reset();
  }

  setzero()
  {
    this.show_new_bill = false;
    this.selected      = [];
    this.LoadVendorBills();
  }

  onInputChange()
  {
    const billNoValue = this.bill_no;
      if(this.VendorBillList != null)
      {
      var value = this.VendorBillList.find(item => item.bill_number === billNoValue);
      }
      else{
          value = undefined;
      }
       if(value != undefined)
       {
        this.toastrService.error('Bill number has already been entered')
       }
       if(value == undefined)
       {
       }
  }

  onDropdownChange() {
  this.resetTableHeight()
  }

  AddSubmit(value)
  {

    if(this.type =="project")
      {
        if(this.SelectCategory.value.project_id != null)
          {
            this.type = value.invoicetype
            this.show_new_bill = true;
            this.formShow      = true
            this.modalRef.close();
          }
          else{
            this.toastrService.error('Select all data');
          }
      }
     else if(this.type =="company"){
        this.type = value.invoicetype
            this.show_new_bill = true;
            this.formShow      = true
            this.modalRef.close();
      }
      else{
        this.toastrService.error('Select Type');
      }
  }

  bill_type(data)
  {
    this.project_list = null
    this.type = data
    this.applyConditionalValidators();
  }

  project_load(id)
  {
    this.api.get('get_data.php?table=projects&find=customer_id&value=' +id + '&authToken=' + environment.authToken).then((data: any) =>
      {
        this.project_list = data
      }).catch(error => { this.toastrService.error('Something went wrong'); });
  }
}
