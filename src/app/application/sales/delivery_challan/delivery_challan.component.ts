import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionType } from '@swimlane/ngx-datatable';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ApiService } from "../../../service/api.service";
import { environment } from "../../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector   : 'az-delivery_challan',
  templateUrl: './delivery_challan.component.html',
  styleUrls  : ['./delivery_challan.component.scss']
})
export class Delivery_challanComponent implements OnInit {
  public uid = localStorage.getItem('uid');
  public formShow          : boolean = true;
  show_new_bill            : boolean = false;
  loading                  : boolean = false;
  public isDropdownAppendedToBody: boolean = true;

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
  CustomerBillList         : any;
  ItemList                 : any;
  BillingAddress           : any;
  ShippingAddress          : any;
  type_id                  : any;
  GST_Data                 : any;
  GST_Length               : any;
  addForm                  : FormGroup;
  product                  : FormGroup;
  dc                       : FormGroup;
  return_dc                : FormGroup;
  SelectCategory           : FormGroup;
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
  invoiceDetails           : any;
  paymentTerm              : any;
  branches                 : any;
  customerDetails          : any;
  invoiceCustDetails       : any;

  price                    : any;
  quantity                 : any;
  inv_id                   : any;
  invoiceNumber            : any;
  stateCode                : any;
  customer_id              : any;
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
  inv_no                   : any;
  new_category_id          : any;
  type                     : any;
  tax_list                 : any;
  lastindex                : any = 0;
  tds_percent              : any = 0;
  tcs_percent              : any = 0;
  subtotal                 : any;
  returnable_dc_show : boolean = false
  private startX: number = 0;
  private startWidth: number = 0;
  private columnIndex: number | null = null;
  private resizing = false;
  tableWidth :any= 100 ;
  originalTableHeight      : any
  private dropdownOpen = false;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild("customer_name", { static: true }) customer_name: ElementRef;
  @ViewChild('tableResponsive', { static: false }) tableResponsive: ElementRef;
  @ViewChild("new_category", { static: true }) new_category   : ElementRef;
  constructor
  (
    private modalService : NgbModal,
    public  fb           : FormBuilder,
    public  toastrService: ToastrService,
    private api          : ApiService,
    private renderer: Renderer2
  )
  {
    this.dc = fb.group(
      {
        created_by: [this.uid],
        customerId: ['', Validators.compose([Validators.required])],
        billFrom  : [null],
        shipFrom  : [null],
        dcNo      : [null, Validators.compose([Validators.required])],
        reference_number: [null],
        billDate  : [(new Date()).toISOString().substring(0, 10)],
        paymentTerms: ['', Validators.compose([Validators.required])],
        dueDate   : [(new Date()).toISOString().substring(0, 10)],
        subTotal  : [0],
        shippingCharge: [0],
        TCS       : [0],
        TDS       : [0],
        roundOff  : [0],
        notes     : [null, Validators.compose([Validators.required])],
        terms_condition: [null, Validators.compose([Validators.required])],
        status    : [1],
        total     : [0],
        product   : this.fb.array([]),
        inv_type  :[null],
        tax_type  :[null],
        tds_percentage:[0],
        tcs_percentage:[0],
        size:[null]
      })


      this.SelectCategory=fb.group({
        invoicetype:[null, Validators.compose([Validators.required])],
       })
  }
  ngOnInit()
  {
    this.LoadCustomerDetails();
    this.LoadCustomerBills();
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

  async LoadCustomerBills()
  {
    await this.api.get('mp_customer_dc.php?&authToken=' + environment.authToken).then((data: any) =>
    {

      this.CustomerBillList = data;
      if(data != null)
      {
       this.temp   =[...data]
      }
    }).catch(error => { this.toastrService.error('Something went wrong '); });
  }
  async LoadCustomerDetails()
  {
    await this.api.get('get_data.php?table=customers&authToken=' + environment.authToken).then((data: any) =>
    {
      this.customerDetails = data;
    }).catch(error => { this.toastrService.error('Something went wrong in LoadCustomerDetails'); });
  }
  async LoadItemDetails()
  {
    await this.api.get('get_data.php?table=item&find=sales&value=1&authToken=' + environment.authToken).then((data: any) =>
    {
      this.ItemList = data;
    }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
  }

  ReturnToList()
  {
    this.isDropdownAppendedToBody = true;
    this.LoadCustomerBills();
    this.show_new_bill = !this.show_new_bill;
    this.selected = [];
    this.dc.reset();
    this.dc.controls['created_by'].setValue(this.uid);
    this.dc.controls['subTotal'].setValue(0);
    this.dc.controls['shippingCharge'].setValue(0);
    this.dc.controls['TCS'].setValue(0);
    this.dc.controls['TDS'].setValue(0);
    this.dc.controls['roundOff'].setValue(0);
    this.dc.controls['status'].setValue(1);
    this.dc.controls['tds_percentage'].setValue(0);
    this.dc.controls['tcs_percentage'].setValue(0);
    this.tds_percent = 0;
    this.tcs_percent = 0;
    this.loading=false;
    this.LoadCustomerBills();
    const formArray         = this.dc.get('product') as FormArray;
    const formArrayLength   = formArray.length;
    const formArrayControls = formArray.controls;
    for (let i = formArrayControls.length-1; i >= 1; i--)
    {
      const control = formArrayControls[i];
      formArray.removeAt(i);
    }
  }
  async VendorSelection(id)
  {
    this.isDropdownAppendedToBody = false;
    this.formShow = false;
    this.customer_id = id;
    this.tableWidth=100;
    const today = new Date();
    let date = today.toISOString().split('T')[0];

    this.dc.reset();
    this.dc.controls['inv_type'].setValue(this.type);
    this.dc.controls['customerId'].setValue(id);
    this.dc.controls['created_by'].setValue(this.uid);
    this.dc.controls['billDate'].setValue(date);
    this.dc.controls['subTotal'].setValue(0);
    this.dc.controls['shippingCharge'].setValue(0);
    this.dc.controls['TCS'].setValue(0);
    this.dc.controls['TDS'].setValue(0);
    this.dc.controls['roundOff'].setValue(0);
    this.dc.controls['status'].setValue(1);
    this.dc.controls['tds_percentage'].setValue(0);
    this.dc.controls['tcs_percentage'].setValue(0);
    this.tds_percent = 0;
    this.tcs_percent = 0;

    this.loading=false;
    this.LoadCustomerBills();
    const formArray         = this.dc.get('product') as FormArray;
    const formArrayLength   = formArray.length;
    const formArrayControls = formArray.controls;
    for (let i = formArrayControls.length-1; i >= 1; i--)
    {
      const control = formArrayControls[i];
      formArray.removeAt(i);
    }

    await this.api.get('mp_dc.php?&value=' + this.customer_id + '&authToken=' + environment.authToken).then((data: any) =>
    {
      this.FetchAddress(data[0]);

      this.company_name    = data[0].company_name;
      this.notes           = data[0].notes;
      this.terms_condition = data[0].terms_condition;

      this.stateCode       = data[0].place_from_supply_code;

      this.payment_terms   = data[0].payment_terms;
      let MyPaymentTerm    = data[0].my_payment_terms;
      this.taxempty        = data[0].tax_mode;
      let dc_id   = data[0].serial_no + 1;
      var dcprifix= data[0].prefix ;
      this.inv_no = dcprifix  + dc_id;
      this.dc.controls['paymentTerms'].setValue(MyPaymentTerm)
      const today = new Date();
      let date = today.toISOString().split('T')[0];
      if(MyPaymentTerm != null)
        {
          this.dueDates(MyPaymentTerm, date);
        }

      if(this.stateCode == 33)
      {
        this.LoadGST('GST');
        this.dc.controls['tax_type'].setValue("GST")
      }
      else
      {
        this.LoadGST('IGST');
        this.dc.controls['tax_type'].setValue("IGST")
      }
    }).catch(error => { this.toastrService.error('Something went wrong '); });

    if(this.type == "project")
    {
     this.api.get('mp_projectList_load.php?value=' + this.customer_id + '&authToken=' + environment.authToken).then((data: any) =>
       {
        this.ItemList = null;
       if(data.status != "no_data")
       {
         this.ItemList = data;
       }
       else
       {
        this.toastrService.warning('No data ');
       }
       }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
    }

    if(this.type == "product")
    {
     this.api.get('get_data.php?table=product_type&authToken=' + environment.authToken).then((data: any) =>
       {
         this.ItemList = data;
       }).catch(error => { this.toastrService.error('Something went wrong in product type'); });
    }

    if(this.returnable_dc_show === true)
    {
      this.patchValues(null,0);
    }

  }


  async LoadGST(mode)
  {
    await this.api.get('get_data.php?table=tax&find=type&value=' + mode + '&authToken=' + environment.authToken).then((data: any) =>
    {
      this.GST_Data   = data;
      this.tax_list   = data;
      this.GST_Length = data.length;
    }).catch(error => { this.toastrService.error('Something went wrong '); });

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
        this.billFrom           = this.bill_addr.cust_addr_id;

        this.billAttention      = this.bill_addr.attention;
        this.billAddress_line_1 = this.bill_addr.address_line_1;
        this.billAddress_line_2 = this.bill_addr.address_line_2;
        this.billCity           = this.bill_addr.city;
        this.billState          = this.bill_addr.state;
        this.billZipcode        = this.bill_addr.zip_code;
        this.dc.controls['billFrom'].setValue(this.billFrom);


      }

    if (data.ship_address[i].set_as_default === 1 && data.ship_address[i].type === 2 && data.ship_address[i].status === 1 ) {

      this.shipp_addr         = data.ship_address[i];
      this.shipFrom           = this.shipp_addr.cust_addr_id;

      this.shipAttention      = this.shipp_addr.attention;
      this.shipAddress_line_1 = this.shipp_addr.address_line_1;
      this.shipAddress_line_2 = this.shipp_addr.address_line_2;
      this.shipCity           = this.shipp_addr.city;
      this.shipState          = this.shipp_addr.state;
      this.shipZipcode        = this.shipp_addr.zip_code;
      this.dc.controls['shipFrom'].setValue(this.shipFrom);

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
    this.dc.controls["paymentTerms"].setValue(this.payment_terms);
  }
  async onSubmit(bill_data)
  {
    Object.keys(this.dc.controls).forEach(field => {
      const control = this.dc.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    if (this.dc.valid)
    {
      const billNoValue = this.inv_no;
      if (this.dc.valid)
        {
          const billNoValue = this.inv_no;
          function normalizeString(str : any) {
            return str.replace(/\s+/g, '').toLowerCase();
          }
          let checking :any
          await this.api.get('get_data.php?table=dc&authToken=' + environment.authToken).then((data: any) =>

            {
              if(data != null)
              {
                checking = data.some((item: { dc_number: any; }) =>  normalizeString(item.dc_number) ===  normalizeString(billNoValue) );
              }
            }).catch(error =>
              {
                  this.toastrService.error('API Faild : DC number checking failed');
                  this.loading = false;
              });
            if(!checking)
             {
                  this.loading = true;
                  await this.api.post('mp_dc_create.php?type=new_dc&authToken=' + environment.authToken, bill_data).then((data: any) =>
                  {

                    if (data.status == "success")
                    {
                      this.toastrService.success('DC Added Succesfully');
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
            else{
              this.toastrService.error('Dc Number was already Exist');
              }
        }

          else {
            this.toastrService.error('Please Fill All Detail');
          }
       }
  }
  OpenCatAdd()
  {
    this.new_category_id = this.modalService.open(this.new_category, { size: 'md' });
  }

  initProduct()
  {

        let product = this.dc.get('product') as FormArray;
        product.push(this.fb.group({
          items       : new FormControl('',),
          descriptions: new FormControl(''),
          taxes       : new FormControl('', Validators.required),
          price       : new FormControl('', Validators.required),
          quantity    : new FormControl('', Validators.required),
          amount      : new FormControl('', Validators.required),
          uom         : new FormControl(''),
          hsn         : new FormControl('')
        }))

  }

  patchValues(id,i)
  {
    if(!this.returnable_dc_show )
      {
        let x = (<FormArray>this.dc.controls['product']).at(i);
        x.patchValue({
          taxes    : this.taxes,
          price    : this.price,
          quantity : this.quantity,
          amount   : this.amount,
          descriptions : this.descriptions,
          uom      : this.uom,
          hsn      : this.hsn_code
        });
      }

      if(this.returnable_dc_show == true )
        {
          let x = (<FormArray>this.dc.controls['product']).at(i);
          x.patchValue({
            items    : '',
            taxes    : 0,
            price    : 0,
            quantity : 1,
            amount   : 0,
            descriptions : '',
            uom      : 'Nos',
            hsn      : ''
          });
        }
  }

  hsn_code:any
  async specProject(item,i)
  {

   await this.api.get('get_data.php?table=projects&find=project_id&value=' + item + '&authToken=' + environment.authToken).then((data: any) => {
        this.type_id      = data[0].type;
        this.price        = data[0].project_value;
        this.quantity     = 1;
        this.amount       = data[0].project_value;
        this.descriptions = data[0].description;
        this.uom          ="Nos"

   }).catch(error => { this.toastrService.error('Something went wrong'); });

   await this.api.get('get_data.php?table=product_type&find=id&value=' + this.type_id + '&authToken=' + environment.authToken).then((data: any) => {

      if(this.taxempty == 1)
      {
      this.taxes        = data[0].tax;
      }
      if(this.taxempty == 0)
      {
      this.taxes        = 0;
      }
      this.hsn_code     = data[0].hsn_code
    }).catch(error => { this.toastrService.error('Something went wrong'); });

    const formData = {
      taxes: item,
    }

    this.patchValues(item,i);
    this.SubTotalChange();
    this.GSTCalculation()
  }


  async specItem(item,i)
  {
    await this.api.get('get_data.php?table=item&find=item_id&value=' + item + '&authToken=' + environment.authToken).then((data: any) => {

        if(this.taxempty == 1)
        {
        this.taxes        = data[0].tax_percent;
        }
        if(this.taxempty == 0)
        {
          this.taxes        = 0;
        }

        this.price        = data[0].price;
        this.quantity     = 1;
        this.amount       = data[0].price;
        this.descriptions = data[0].description;
        this.uom          = data[0].uom;
        this.hsn_code     = data[0].hsnsac;
    }).catch(error => { this.toastrService.error('Something went wrong 1 '); });

    const formData = {
      taxes: item,
    }
    this.patchValues(item,i);
    this.SubTotalChange();
    this.GSTCalculation();
  }

  SubTotalChange()
  {
    let arr = this.dc.controls['product'].value;

    let sum: number = arr.map(a => a.amount).reduce(function(a, b)
    {
      return a + b;
    });
    this.subtotal= (sum).toFixed(2);
    this.dc.controls['subTotal'].setValue((sum).toFixed(2));
    this.FinalTotalCalculation();
    this.GSTCalculation();
    this.tdsCalculation();
    this.tcsCalculation();
  }

  tdsCalculation()
  {
      let subtotal = Number(this.subtotal) + this.total_tax
      let tds =  ((subtotal )*(this.tds_percent/100)).toFixed(2);
      this.dc.controls['TDS'].setValue(tds);
      this.FinalTotalCalculation();
  }

  tcsCalculation()
  {
    let subtotal = Number(this.subtotal) + this.total_tax
    let tcs =  ((subtotal )*(this.tcs_percent/100)).toFixed(2);
    this.dc.controls['TCS'].setValue(tcs);
    this.FinalTotalCalculation();
  }

  FinalTotalCalculation()
  {
    let Sub_Total       = this.dc.controls['subTotal'].value;
    let TDS_Value       = this.dc.controls['TDS'].value;
    let TCS_Vale        = this.dc.controls['TCS'].value;
    let Shipping_Value  = this.dc.controls['shippingCharge'].value;
    let Roundof_Value   = this.dc.controls['roundOff'].value;

    let TotalGST: number = this.GST_Data.map(a => a.amount).reduce(function(a, b)
    {
      return a + b;
    });

    let Total_Calculation =  Number(Sub_Total) - Number(TDS_Value) + Number(TCS_Vale) + Number(Shipping_Value) + Number(Roundof_Value)+ Number(TotalGST);
    this.dc.controls['total'].setValue((Total_Calculation).toFixed(2));
  }


  GSTCalculation() {

    this.GST_Data.forEach(data => {
      data.amount = 0;
    });
       this.total_tax =0
    let products = (<FormArray>this.dc.controls['product']).value;
    products.forEach(product => {
      let taxValue = (product.amount / 100) * product.taxes;
      let taxAmount = parseFloat(taxValue.toFixed(2));
      this.total_tax += taxAmount;
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

  GSTCalculation_tax(value,j)
  {
    this.taxes        = parseInt(value);

    let y = (<FormArray>this.dc.controls['product']).at(j);
    y.patchValue({
      taxes        : this.taxes,
     })
    this.SubTotalChange();
    this.GSTCalculation();

    this.FinalTotalCalculation();
  }

  qty(qty, price, i)
  {
    this.amount = qty * price;
    let x = (<FormArray>this.dc.controls['product']).at(i);
    x.patchValue({
      amount : this.amount
    });
    this.SubTotalChange();
  }

  priceChange(qty, price, i)
  {
    this.amount = qty * price;
    let x       = (<FormArray>this.dc.controls['product']).at(i);
    x.patchValue({
      amount : this.amount
    });
    this.SubTotalChange();
  }
  onDeleteRow(rowIndex)
  {
    let product = this.dc.get('product') as FormArray;
    if (product.length > 1) {
      product.removeAt(rowIndex)
    } else {
      product.reset()
    }
    this.SubTotalChange();
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
    let address = this.dc.get('products') as FormArray;
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

      this.api.get('mp_customer_dc_pdf.php?value=' + event.row.serial_no + '&authToken=' + environment.authToken).then((data: any) => {
        this.invoicePdf = data;
        this.img_path = environment.baseURL + "download_file.php?path=upload/company/" + this.invoicePdf[0].pdf_logo + "&authToken=" + environment.authToken
        this.invoiceItems   = this.invoicePdf[0].invoice_items;
        this.company_mobile = this.invoicePdf[0].company_details[0].mobile

        this.company_gst_no = this.invoicePdf[0].company_details[0].gst_number
        this.company_tan_no = this.invoicePdf[0].company_details[0].tan_number

        this.company_pdf_logo = this.invoicePdf[0].company_details[0].pdf_logo;
        this.company_pdf_logo = environment.baseURL + "download_file.php?path=upload/company/" + this.company_pdf_logo + "&authToken=" + environment.authToken
      }).catch(error => {

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
                this.CustomerBillList = temp;
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
    this.show_new_bill = true;
    this.formShow      = true;
  }
  setzero()
  {
    this.show_new_bill = false;
    this.selected = [];
    this.LoadCustomerBills();
  }

 async AddSubmit(data)
  {

    this.type  = data;
    console.log(this.type)
    this.dc.controls['inv_type'].setValue(this.type);
    this.loading = true;
    this.returnable_dc_show = false
    if(this.type != null)
    {
      this.addInvoice();
     if(this.type == "product")
     {

    await  this.api.get('get_data.php?table=product_type&authToken=' + environment.authToken).then((data: any) =>
        {
          this.loading=false;
          this.ItemList = data;
        }).catch(error => { this.toastrService.error('Something went wrong in product');
        this.loading=false; });
     }
     if(this.type == "items")
     {
    await  this.api.get('mp_item_list_load.php?authToken=' + environment.authToken).then((data: any) =>
        {
          this.loading=false;
          this.ItemList = data;
        }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails');
        this.loading=false;});
     }
     if(this.type == "return dc")
      {
        this.show_new_bill = true
        this.returnable_dc_show = true
      }
    }

    else{
      this.toastrService.error('Select any Type');
    }
     this.loading=false;
    //  this.new_category_id.close();
  }

}
