import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {  SelectionType } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HostListener } from '@angular/core';


@Component({
  selector   : 'az-purchase_order',
  templateUrl: './purchase_order.component.html',
  styleUrls  : ['./purchase_order.component.scss']
})
export class Purchase_orderComponent implements OnInit {
  public uid = localStorage.getItem('uid');
  public isDropdownAppendedToBody: boolean = true;

  public formShow        : boolean = true;
  show_new_po            : boolean = false;
  loading                : boolean = false;

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

  total_tax                : any;
  VendorPOList             : any;
  ItemList                 : any;
  BillingAddress           : any;
  ShippingAddress          : any;
  GST_Data                 : any;
  GST_Length               : any;
  show:boolean=false;

  addForm                  : FormGroup;
  product                  : FormGroup;
  po                       : FormGroup;
  myControl                = new FormControl();

  imageToShow              : string | ArrayBuffer;
  billPerfix               : string;

  imgUrl                   : string = '../../../../assets/img/logo/geogreen.png';

  rows                     = [];
  temp                     = [];
  selected                 = [];
  options                  : string[] = ['One', 'Two', 'Three'];
  SelectionType            = SelectionType;

  ingredients              : any;
  response                 : any;
  modalRef                 : any;
  file                     : any;
  test                     : any;
  poDetails                : any;
  paymentTerm              : any;
  branches                 : any;
  vendorDetails            : any;
  poCustDetails            : any;

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
  po_id                    : any;

  uom                      : any;
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
  taxempty                 : any;
  po_no                    : any;
  lastindex                : any=0;
  tds_percent              : any=0;
  tcs_percent              : any=0;
  subtotal                 : any;
  private startX: number = 0;
  private startWidth: number = 0;
  private columnIndex: number | null = null;
  private resizing = false;
  tableWidth:any = 100

  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild("customer_name", { static: true }) customer_name: ElementRef;
  @ViewChild('tableResponsive', { static: false }) tableResponsive: ElementRef;
  @ViewChild('dropdownPanel', { static: false }) dropdownPanel: ElementRef;
  constructor
  (
    public  fb           : FormBuilder,
    public  toastrService: ToastrService,
    private api          : ApiService,
    private route: ActivatedRoute,
    private router: Router, private renderer: Renderer2
  )
  {
    this.po = fb.group(
      {
        created_by : [this.uid],
        vendorId   : ['', Validators.compose([Validators.required])],
        billFrom   : [null],
        shipFrom   : [null],
        poNo       : ['', Validators.compose([Validators.required])],
        reference_number: [null],
        billDate   : [(new Date()).toISOString().substring(0, 10)],
        paymentTerms: ['', Validators.compose([Validators.required])],
        dueDate    : [(new Date()).toISOString().substring(0, 10)],
        subTotal   : [0],
        shippingCharge: [0],
        TCS        : [0],
        TDS        : [0],
        roundOff   : [0],
        notes      : [null, Validators.compose([Validators.required])],
        terms_condition: [null, Validators.compose([Validators.required])],
        status     : [1],
        total      : [0],
        tds_percentage:[0],
        tcs_percentage:[0],
        tax_type    :[null],
        product     : this.fb.array([]),
        size        :[null],
        deliverytype:[null, Validators.compose([Validators.required])],
        freight     :[null, Validators.compose([Validators.required])],
        delivery_schedule :[null, Validators.compose([Validators.required])],
        prefix      : [null]
      })
  }

  ngOnInit(): void
  {
    this.LoadVendorDetails();
    this.LoadVendorBills();
    this.initProduct();
    this.LoadItemDetails();

    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.reload === 'true') {
        this.LoadVendorBills();
        this.show = false;

      }
    });
  }
  hideContainerAndReload() {
    this.show = false;
    location.reload();
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




  async LoadVendorBills()
  {
    await this.api.get('mp_po_bill.php?&authToken=' + environment.authToken).then((data: any) =>
    {
      this.VendorPOList = data;
      if(data != null)
      this.temp   =[...data]
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorBills'); });
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
    this.show_new_po = !this.show_new_po;
    this.selected = [];
    this.po.reset();
    this.po.controls['created_by'].setValue(this.uid);
    this.po.controls['subTotal'].setValue(0);
    this.po.controls['shippingCharge'].setValue(0);
    this.po.controls['TCS'].setValue(0);
    this.po.controls['TDS'].setValue(0);
    this.po.controls['roundOff'].setValue(0);
    this.po.controls['total'].setValue(0);
    this.po.controls['status'].setValue(1);
    this.tds_percent = 0;
    this.tcs_percent = 0;
    const formArray         = this.po.get('product') as FormArray;
    const formArrayLength   = formArray.length;
    const formArrayControls = formArray.controls;
    for (let i = formArrayControls.length-1; i >= 1; i--)
    {
      const control = formArrayControls[i];
      formArray.removeAt(i);
    }
  }

po_prifix : any
  async VendorSelection(id)
  {
    this.formShow  = false;
    this.vendor_id = id;
    this.isDropdownAppendedToBody = false;
    const today = new Date();
    let date = today.toISOString().split('T')[0];
    this.po.reset();
    this.po.controls['vendorId'].setValue(id);
    this.po.controls['created_by'].setValue(this.uid);
    this.po.controls['subTotal'].setValue(0);
    this.po.controls['billDate'].setValue(date);
    this.po.controls['shippingCharge'].setValue(0);
    this.po.controls['TCS'].setValue(0);
    this.po.controls['TDS'].setValue(0);
    this.po.controls['roundOff'].setValue(0);
    this.po.controls['total'].setValue(0);
    this.po.controls['status'].setValue(1);
    this.po.controls['tds_percentage'].setValue(0);
    this.po.controls['tcs_percentage'].setValue(0);
    this.tds_percent = 0;
    this.tcs_percent = 0;
    const formArray         = this.po.get('product') as FormArray;
    const formArrayLength   = formArray.length;
    const formArrayControls = formArray.controls;
    for (let i = formArrayControls.length-1; i >= 1; i--)
    {
      const control = formArrayControls[i];
      formArray.removeAt(i);
    }

    await this.api.get('mp_po.php?&value=' + this.vendor_id + '&authToken=' + environment.authToken).then((data: any) =>
    {
      this.FetchAddress(data[0]);

      this.company_name    = data[0].company_name;
      this.notes           = data[0].notes;
      this.terms_condition = data[0].terms_condition;

      this.stateCode       = data[0].place_from_supply_code;
      this.payment_terms   = data[0].payment_terms;

      let MyPaymentTerm    = data[0].my_payment_terms;
      let po_id            = data[0].serial_no + 1;
      this.po_prifix        = data[0].prefix ;
      this.po_no           = po_id;
      this.taxempty        = data[0].tax_mode;

      this.po.controls['paymentTerms'].setValue(MyPaymentTerm)
      const today = new Date();
      let date = today.toISOString().split('T')[0];

      this.dueDates(MyPaymentTerm, date);

      if(this.stateCode == 33)
      {
        this.LoadGST('GST');
        this.po.controls['tax_type'].setValue("GST");
      }
      else
      {
        this.LoadGST('IGST');
        this.po.controls['tax_type'].setValue("IGST");
      }
    }).catch(error => { this.toastrService.error('Something went wrong'); });

    //this.specItem(1,0);
  }

  async LoadGST(mode)
  {
    await this.api.get('get_data.php?table=tax&find=type&value=' + mode + '&authToken=' + environment.authToken).then((data: any) =>
    {
      this.GST_Data   = data;
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
          this.po.controls['billFrom'].setValue(this.billFrom);

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
        this.po.controls['shipFrom'].setValue(this.shipFrom);

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
    this.dueValues = s;
    var current       = new Date(this.invoiceDate || BillDate);
    this.followingDay = new Date(current.getTime() + (this.dueValues * 24 * 60 * 60 * 1000));
    this.fullDate     = this.followingDay.toISOString().substring(0, 10)
  }
  dueDateChange()
  {
    this.po.controls["paymentTerms"].setValue(this.payment_terms);
  }

  async onSubmit(bill_data)
  {
    Object.keys(this.po.controls).forEach(field => {
      const control = this.po.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    if (this.po.valid)
    {
      const billNoValue = this.po_prifix+this.po_no;
      function normalizeString(str : any) {
        return str.replace(/\s+/g, '').toLowerCase();
      }
      let checking :any
      await this.api.get('get_data.php?table=po&authToken=' + environment.authToken).then((data: any) =>

        {
          if(data != null)
            {
              checking = data.some((item: { po_number: any; }) =>  normalizeString(item.po_number) ===  normalizeString(billNoValue) );
            }
        }).catch(error =>
          {
              this.toastrService.error('API Faild : PO number checking failed');
              this.loading = false;
          });
        if(!checking)
         {
          console.log("bill_data : ",bill_data)
              this.loading = true;
              await this.api.post('mp_po_create.php?type=new_po&authToken=' + environment.authToken, bill_data).then((data: any) =>
              {
                    console.log(data)
                if (data.status == "success")
                {
                  this.toastrService.success('PO Added Succesfully');
                  this.loading = false;
                  this.ReturnToList();
                }
                else { this.toastrService.error('Something went wrong');
                this.loading = false; }
                return true;
              }).catch(error =>
                {
                this.toastrService.error('Something went wrong');
                this.loading = false;
              });
            }
            else {
              this.toastrService.error('PO number was already exist');
            }
    }
    else {
      this.toastrService.error('Please Fill All Details');
    }
  }
  initProduct()
  {
    let product = this.po.get('product') as FormArray;
    product.push(this.fb.group({
      items   : new FormControl('', Validators.required),
      descriptions: new FormControl(''),
      taxes   : new FormControl('', Validators.required),
      price   : new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      amount  : new FormControl('', Validators.required),
      uom     : new FormControl('', Validators.required),
      discount_1 : new FormControl(0),
      discount_2 : new FormControl(0),
    }))
    this.adjustTableHeight()
  }
  patchValues(id,i)
  {
    let x = (<FormArray>this.po.controls['product']).at(i);
    x.patchValue({
      taxes    : this.taxes,
      price    : this.price,
      quantity : this.quantity,
      amount   : this.amount,
      descriptions : this.descriptions,
      uom      : this.uom,
      discount_1: 0,
      discount_2: 0,
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
        this.taxes   = 0;
      }
        this.price    = data[0].price;
        this.quantity = 1;
        this.amount   = data[0].price;
        this.descriptions = data[0].description;
        this.uom      = data[0].uom;
    }).catch(error => { this.toastrService.error('Something went wrong'); });

    const formData = {
      taxes: item,
    }
    this.patchValues(item,i);
    this.SubTotalChange();
    this.GSTCalculation();
  }

  SubTotalChange()
  {
    let arr = this.po.controls['product'].value;
    let sum: number = arr.map(a => parseFloat(a.amount)).reduce(function(a, b)
    {
      return a + b;
    });
    this.subtotal = (sum).toFixed(2);
    this.po.controls['subTotal'].setValue((sum).toFixed(2));
    this.FinalTotalCalculation();
    this.GSTCalculation();
    this.tdsCalculation();
    this.tcsCalculation();
  }

  tdsCalculation()
  {
    let subtotal = Number(this.subtotal)
     let tds =  ((subtotal+this.total_tax)*(this.tds_percent/100)).toFixed(2);
     this.po.controls['TDS'].setValue(tds);
     this.FinalTotalCalculation();
  }

  tcsCalculation()
  {
    let subtotal = Number(this.subtotal)
    let tcs =  ((subtotal+ this.total_tax)*(this.tcs_percent/100)).toFixed(2);
    this.po.controls['TCS'].setValue(tcs);
    this.FinalTotalCalculation();
  }

  FinalTotalCalculation()
  {
    let Sub_Total       = this.po.controls['subTotal'].value;
    let TDS_Value       = this.po.controls['TDS'].value;
    let TCS_Vale        = this.po.controls['TCS'].value;
    let Shipping_Value  = this.po.controls['shippingCharge'].value;
    let Roundof_Value   = this.po.controls['roundOff'].value;

    let TotalGST: number = this.GST_Data.map(a => parseFloat (a.amount)).reduce(function(a, b)
    {
      return a + b;
    });

    let Total_Calculation =  (Number(Sub_Total) - Number(TDS_Value) + Number(TCS_Vale) + Number(Shipping_Value) + Number(Roundof_Value)+ Number(TotalGST)).toFixed(2);
    this.po.controls['total'].setValue(Total_Calculation);
  }

  GSTCalculation() {

    this.GST_Data.forEach(data => {
      data.amount = 0;
    });

    this.total_tax = 0
    let products = (<FormArray>this.po.controls['product']).value;
    products.forEach(product => {
      let taxValue = (product.amount / 100) * product.taxes;
      let taxAmount = parseFloat(taxValue.toFixed(2));
      this.total_tax += taxAmount
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
    let x = (<FormArray>this.po.controls['product']).at(i);
    x.patchValue({
      amount : this.amount
    });
    this.SubTotalChange();

  }

  discount_Change(qty, price,discount_1,discount_2, i)
  {

    let dis_1=  price - (discount_1/100)*price;
    let dis_2= dis_1 - (discount_2/100)*dis_1;
    this.amount = (qty *dis_2).toFixed(2);
    let x = (<FormArray>this.po.controls['product']).at(i);
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
    let x = (<FormArray>this.po.controls['product']).at(i);
    x.patchValue({
      amount : this.amount
    });
    this.SubTotalChange();
  }

 async onDeleteRow(rowIndex)
  {
    let product = this.po.get('product') as FormArray;
    if (product.length > 1) {
      product.removeAt(rowIndex)
    } else {
      product.reset()
    }
     await this.SubTotalChange()
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
    let address = this.po.get('products') as FormArray;
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
      this.show=true;
    }
  }
  updateFilter(event) {

        const val = event.target.value.toLowerCase();
        const temp = this.temp.filter((d) => {
          return Object.values(d).some(field =>
            field != null && field.toString().toLowerCase().indexOf(val) !== -1
          );
        });
        this.VendorPOList = temp;
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
    this.show_new_po = true;
    this.formShow = true
  }
  setzero()
  {
    this.show_new_po = false;
    this.selected=[];
    this.LoadVendorBills();
  }

  onInputChange()
  {
    const billNoValue = this.po_no;

    if(this.VendorPOList != null)
    {
      let value = this.VendorPOList.find(item => item.po_number === billNoValue);
        if(value != undefined)
        {
          this.toastrService.error('PO number has already been entered')
        }
        if(value == undefined)
        {
        }
    }
  }
}
