import { Component, OnInit, ViewChild,ViewEncapsulation,ElementRef, Renderer2} from '@angular/core';
import { DatatableComponent, SelectionType, isNullOrUndefined } from '@swimlane/ngx-datatable';
import { ApiService } from "../../../../service/api.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../../../environments/environment";
import { Router } from '@angular/router';
import { FormControl, FormGroup,FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ImgToBase64Service } from "src/app/service/img-to-base64.service";
import { IndianCurrency } from 'src/app/pipe/INR/indianCurrency.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { isNull } from 'util';
import {   HostListener } from '@angular/core';
import { NumtowordPipe } from 'src/app/pipe/WORD/numtoword.pipe';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  'Roboto': {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-Italic.ttf'
  }
};


@Component({
  selector: 'app-billview',
  templateUrl: './billview.component.html',
  styleUrls: ['./billview.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class BillviewComponent implements OnInit {

  imgUrl: string = '../../../../assets/img/logo/geogreen.png';

  public router             : Router;
  SelectionType             = SelectionType;
  selected                  = [];
  billPdf                   = [];
  billItems                 : [];
  all_account               = [];
  user_account              = [];
  company_account           = [];
  cash_account              = [];
  gst_account               = [];

  public VendorBillList     : any;
  public notes              : any;
  public terms_condition    : any;
  public bill_addr          : any;
  public billFrom           : any;
  public billAttention      : any;
  public billAddress_line_1 : any;
  public billAddress_line_2 : any;
  public billCity           : any;
  public billState          : any;
  public billZipcode        : any;
  public shipp_addr         : any;
  public shipFrom           : any;
  public shipAttention      : any;
  public shipAddress_line_1 : any;
  public shipAddress_line_2 : any;
  public shipCity           : any;
  public shipState          : any;
  public shipZipcode        : any;
  public taxes              : any;
  public i_valu             : any;

  if_delete     : boolean = false;

  advance_list              : any;
  uom                       : any;
  balance                   : any;
  fontFace                  : any;
  amount                    : any;
  descriptions              : any;
  invoiceDate               : any;
  followingDay              : any;
  day                       : any;
  month                     : any;
  year                      : any;
  fullDate                  : any;
  dueValues                 : any = 0;

  prefix                    : any;
  receipt_serial_no         : any;
  new_category_id           : any;
  billToPdf                 : any;
  customerPdf               : any;
  branchPdf                 : any;
  billPdfDetails            : any;
  img_path                  : any;
  company_pdf_logo          : any;
  company_mobile            : any;
  company_gst_no            : any;
  company_tan_no            : any;
  events                    : any;
  alldata                   : any;
  alldata1                  : any;

  openMd                    : any;
  price                     : any;
  quantity                  : any;
  inv_id                    : any;
  invoiceNumber             : any;
  stateCode                 : any;
  vendor_id                 : any;
  customer_bill_address     : any;
  customer_ship_address     : any;
  payment_terms             : any;
  bill_attention            : any;
  bill_address_line_1       : any;
  bill_address_line_2       : any;
  bill_city                 : any;
  bill_state                : any;
  bill_zip_code             : any;
  bill_phone                : any;
  ship_attention            : any;
  ship_city                 : any;
  ship_state                : any;
  ship_zip_code             : any;
  ship_phone                : any;
  company_name              : any;
  state_code                : any;
  bill_id                   : any;
  Edit_bill                 : any;
  customer_id               : any;
  ItemList                  : any;
  editGST_Data              : any;
  editGST_Length            : any;
  invoice_item              : any;
  invoiceitem_list          : any;
  selectdata                : any;
  bill_list                 : any;
  name                      : any;
  GST_Data                  : any;
  GST_Length                : any;
  add_payment               : any;
  payment_transaction       : any;
  bankData                  : any;
  bankData_length           : any;
  inv_no                    : any;
  details                   : any;
  serial_no                 : any;
  bill_number               : any;
  tds_percent               : any;
  tcs_percent               : any;
  subtotal                  : any;
  tds_data                  : any;
  tcs_data                  : any;
  taxempty                  : any;
  originalTableHeight       : any;
  item_DeleteId             : any;
  item_index                : any;

  clone_bill             : FormGroup;
  bill_payment           : FormGroup;
  e_way_bill             : FormGroup;
  advance                : FormGroup;
  private startX: number = 0;
  private startWidth: number = 0;
  private columnIndex: number | null = null;
  private resizing = false;
  tableWidth : any = 100;
  imageToShow               : string | ArrayBuffer;
  today                     = new Date();
  todaysDate                = '';

  show_new_bill        : boolean=true;
  loading              : boolean=false;
  show                 : boolean=true;
  show_edit_btn        : boolean=false;
  show_bill_edit       : boolean=false;
  payment_view         : boolean=false;
  public formShow      : boolean=true;
  clone_bill_show      : boolean=false;

  public view_bill     =  localStorage.getItem('view_bill');
  public uid           =  localStorage.getItem('uid');
  public user          =  localStorage.getItem('type');
  public user_bank_id  =  localStorage.getItem('bank_id');

  @ViewChild("delete",{static:true}) delete:ElementRef;
  @ViewChild("delete_bill",{static:true}) delete_bill:ElementRef;
  @ViewChild("delete_item",{static:true}) delete_item:ElementRef;
  @ViewChild("use_advancePayment", { static: true }) use_advancePayment: ElementRef;
  constructor(private api: ApiService,private modalService: NgbModal,
    public toastrService: ToastrService,
    private imgToBase64: ImgToBase64Service,
     router:Router,
     public fb: FormBuilder,
     private renderer: Renderer2) { this.router = router;

  this.Edit_bill = fb.group(
    {
      created_by: [this.uid],
      vendorId  : ['', Validators.compose([Validators.required])],
      billFrom  : [null],
      shipFrom  : [null],
      billNo    : [null, Validators.compose([Validators.required])],
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
      bill_id   :[null],
      tds_percentage:[0],
      tcs_percentage:[0],
      project_id : [null],
      tax_type   :[null],
      size : [null]
    })

    this.clone_bill = fb.group(
      {
        created_by: [this.uid],
        customerId: ['', Validators.compose([Validators.required])],
        billFrom  : [null],
        shipFrom  : [null],
        billNo : [null, Validators.compose([Validators.required])],
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
        invoice_id: [null],
        project_id : [null],
        inv_type      : [null],
        tds_percentage:[0],
        tcs_percentage:[0],
        tax_type      :[null],
      })

    {
      this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530'); // hh:mm:ss a

    this.bill_payment =fb.group({
          'created_by': [this.uid],
          receipt_no  : [null],
          tran_mode   : [0, Validators.compose([Validators.required, Validators.min(1)])],
          from_bank   : [null, Validators.compose([Validators.required, Validators.min(1)])],
          to_bank     : [1, Validators.compose([Validators.required, Validators.min(1)])],
          amount      : [0],
          tran_date   : [this.todaysDate],
          reference   : [null, Validators.compose([Validators.required])],
          description : [null, Validators.compose([Validators.required])],
          prefix      : [null]
        } )
      }

      this.e_way_bill = fb.group({
        bill_no      :[null, Validators.compose([Validators.required])],
        vehicle_no   :[null, Validators.compose([Validators.required])],
        shipment_mode:[null, Validators.compose([Validators.required])],
      })

      this.advance = fb.group({
        bill_amount  :[null,Validators.compose([Validators.required])],
        advance_id   :[null,Validators.compose([Validators.required])],
        bill_id      :[null],
        description  :[null,Validators.compose([Validators.required])],
      })
  }

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("addPayment", { static: true }) addPayment : ElementRef;
  @ViewChild("ewayBill", { static: true }) ewayBill     : ElementRef;
  @ViewChild('tableResponsive', { static: false }) tableResponsive: ElementRef;
  @ViewChild('dropdownPanel', { static: false }) dropdownPanel: ElementRef;

  async ngOnInit()
  {
    this.loadonce();
    this.LoadVendorBills();
    this.getImageFromService();
    await this.fontloader();
    await this.fontloader();
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


  adjustTableHeight() {
    setTimeout(() => {
        const dropdownPanels = document.querySelectorAll('.ng-dropdown-panel');

        dropdownPanels.forEach(dropdownPanel => {
          if (dropdownPanel) {
            const dropdownHeight = dropdownPanel.getBoundingClientRect().height;

            if (this.tableResponsive) {
              const newTableHeight = this.tableResponsive.nativeElement.offsetHeight + dropdownHeight + 50; // Add some extra space
              this.renderer.setStyle(this.tableResponsive.nativeElement, 'height', `${newTableHeight}px`);

              this.dropdownOpen = true;
            }
          }
        });
      }, 100);
}


private dropdownOpen = false;

@HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const dropdownPanels = document.querySelectorAll('.ng-dropdown-panel');
    const target = event.target as HTMLElement;

    // Check if the click is outside the dropdown
    if (!dropdownPanels.length || Array.from(dropdownPanels).some(panel => !panel.contains(target))) {
      if (this.dropdownOpen) {
        this.onDropdownClose();
        this.dropdownOpen = false;
      }
    }
  }

  onDropdownClose() {
    this.resetTableHeight();
  }

resetTableHeight()  {
  const dropdownPanels = document.querySelectorAll('.ng-dropdown-panel');
        if (this.tableResponsive) {

          this.renderer.setStyle(this.tableResponsive.nativeElement, 'height', `auto`);
        }
  }

   changeTableWidth() {
    document.documentElement.style.setProperty('--table-width', this.tableWidth+'%');
  }

  fontloader()
  {
    pdfMake.fonts = {
      'Roboto': {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-Italic.ttf'
      }
    };
  }

  getImageFromService() {
    this.imgToBase64.imgToString(this.imgUrl).subscribe(data => {
      this.createImageFromBlob(data);
    }, error => {
      console.log(error);
    });
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
serial_no_list:any
  loadonce()
  {
    this.api.get('mp_vendor_bill_pdf.php?value=' + this.view_bill + '&authToken=' + environment.authToken).then((data: any) => {
       console.log(data)
      this.bill_id = data[0].bill_id
      this.billPdf = data;
      this.Edit_status  = data[0].edit_status
        console.log("Edit_status ", this.Edit_status)
      this.serial_no_list = data[0].serial_no_list
      console.log("serial ", this.serial_no_list)
      this.billItems = this.billPdf[0].billItems;
      this.company_pdf_logo = this.billPdf[0].company_details[0].logo;
      this.company_pdf_logo = environment.baseURL + "download_file.php?path=upload/company/" +  this.company_pdf_logo + "&authToken=" + environment.authToken;
      this.load_paymentTransactiond(data[0].bill_id);
      this.vendor_address(data[0].vendor_id);
      this.bill_number = data[0].bill_number;
      this.taxempty = data[0].tax_mode;
      this.stateCode =data[0].state_code;

      this.bill_payment.controls['description'].setValue(data[0].bill_number)
     }).catch(error => {
       this.toastrService.error('Something went wrong 1');
      });
  }

  async LoadVendorBills()
  {
    await this.api.get('mp_vendor_bill.php?&authToken=' + environment.authToken).then((data: any) =>
    {

      this.VendorBillList = data;
      var selectedId  = this.view_bill;
      let selectedRow = this.VendorBillList.find(item => item.serial_no == selectedId);
      if (selectedRow)
      {
        this.selected = [selectedRow];
        this.bill_list=this.selected[0];
       // setTimeout(() => this.scrollToSelectedRow(selectedId), 500);
      }
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorBills'); });
  }

  scrollToSelectedRow(selectedId) {
    const uniqueId = `bill-row-${selectedId}`;
    const selectedRow = document.getElementById(uniqueId);
    if (selectedRow) {
      selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onActivate(event)
  {
    if (event.type === "click")
    {
      this.bill_id   = event.row.bill_id
      this.bill_list = event.row
      this.name      = event.row.vendor_name;
      this.serial_no = event.row.serial_no;

      this.view_bill = event.row.serial_no;

      this.bill_number = event.row.bill_number;

      this.load_paymentTransactiond(event.row.bill_id);
      this.load_paymentTransactiond(event.row.bill_id);
      this.selectEdit_data();

      this.e_way_bill.controls['bill_no'].setValue(this.bill_list.e_way_no);
      this.e_way_bill.controls['vehicle_no'].setValue(this.bill_list.vehicle_number);
      this.e_way_bill.controls['shipment_mode'].setValue(this.bill_list.transport_mode);

      this.bill_payment.controls['description'].setValue(event.row.bill_number)

      this.vendor_address(event.row.vendor_id);
    }
  }

  // tds_tcs_load()
  // {
  //   this.api.get('get_data.php?table=tds_ledger&find=bill_id&value='+this.bill_id+'&authToken=' + environment.authToken).then((data: any) =>
  //   {
  //     this.tds_percent = 0;
  //     if(data != null)
  //     {
  //       this.tds_data = data;
  //       this.tcs_data = data;
  //       this.tds_percent = data[0].tds_percentage;
  //       this.tcs_percent = this.tcs_data[0].tcs_percentage;
  //     }
  //   }).catch(error => { this.toastrService.error('Something went wrong in TDS'); });

  // }

  Edit_status : any
  selectEdit_data()
  {
      var serial_no =  this.bill_list['serial_no'];

    this.api.get('mp_vendor_bill_pdf.php?value=' + serial_no  + '&authToken=' + environment.authToken).then((data: any) => {

      this.billPdf     = data;
      this.billItems   = this.billPdf[0].billItems;
      this.Edit_status  = this.billPdf[0].edit_status
      console.log(this.Edit_status)
      this.serial_no_list = data[0].serial_no_list
      this.taxempty    = data[0].tax_mode;
      this.company_pdf_logo = this.billPdf[0].company_details[0].logo;
      this.company_pdf_logo = environment.baseURL + "download_file.php?path=upload/company/" + this.company_pdf_logo + "&authToken=" + environment.authToken
      this.stateCode   = data[0].state_code;

    }).catch(error => {
      this.toastrService.error('Something went wrong');
    });
  }


onSelect({ selected }) {

  this.selected.splice(0, this.selected.length);
  this.selected.push(...selected);
  this.show_edit_btn=true;
}

Delete()
    {
       let editproduct=this.Edit_bill.get('product') as FormArray;
        this.api.get('delete_data.php?authToken='+environment.authToken+'&table=bill_item&field=bill_item_id&id='+this.item_DeleteId).then((data: any) =>
        {
              editproduct.removeAt(this.item_index)
              this.toastrService.success('Item Deleted Successful');
              this.new_category_id.close()
              this.edit_SubTotalChange();

        }).catch(error =>
        {
            this.toastrService.error('Something went wrong');
        });
    }

editbill()
{
  this.show_bill_edit=true;
  this.show          =false;
  this.edit_dataload();
  this.LoadItemDetails();
  this.selectEdit_data()
}

async LoadItemDetails()
{
  await this.api.get('get_data.php?table=item&find=purchase&value=1&authToken=' + environment.authToken).then((data: any) =>
  {
    this.ItemList = data;
  }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
}

async edit_dataload()
{
  let bill_id =  this.bill_list['bill_id'];
  await this.api.get('mp_bill_edit_data.php?value=' +  bill_id  + '&authToken=' + environment.authToken).then((data: any) => {
     if(data != null)
       {
         this.invoice_item     = data[0];
         this.invoiceitem_list = data[0].bill_items;
         this.vendor_id        = data[0].vendor_id;
       }
     }).catch(error => { this.toastrService.error('Something went wrong '); });

     this.Edit_bill.controls['vendorId'].setValue(this.bill_list.vendor_id);
     this.Edit_bill.controls['bill_id'].setValue(this.bill_list.bill_id);
     if(this.clone_bill_show == false)
     {
      this.FetchAddress(this.invoice_item);
     }

     if(this.clone_bill_show == true)
     {
      this.clone_address(this.vendor_id);
     }
     this.stateCode =this.invoice_item.place_from_supply_code;
     if(this.stateCode == 33)
     {
      this.edit_LoadGST('GST');
      this.Edit_bill.controls['tax_type'].setValue("GST");
     }
    else
     {
      this.edit_LoadGST('IGST');
      this.Edit_bill.controls['tax_type'].setValue("IGST");
     }
     this.load_billnumber( this.invoice_item);
     this.load_billnumber( this.invoice_item);
}

clone_address(id)
{
   this.api.get('get_data.php?table=vendor_address&find=vendor_id&value='+id+'&find1=status&value1=1&authToken=' + environment.authToken).then((data: any) =>
  {
    this.FetchAddress(data)
  }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
}
async FetchAddress(data)
  {

    if(this.clone_bill_show == true && this.show_bill_edit == false)
    {
        for (let i = 0; i < data.length; i++)
        {
          if (data[i].set_as_default === 1 && data[i].type === 1 && data[i].status === 1) {
            this.bill_addr   = data[i];
            this.billFrom    = this.bill_addr.vendor_addr_id;

            this.billAttention      = this.bill_addr.attention;
            this.billAddress_line_1 = this.bill_addr.address_line_1;
            this.billAddress_line_2 = this.bill_addr.address_line_2;
            this.billCity           = this.bill_addr.city;
            this.billState          = this.bill_addr.state;
            this.billZipcode        = this.bill_addr.zip_code;
            this.Edit_bill.controls['billFrom'].setValue(this.billFrom);
          }

          if (data[i].set_as_default === 1 && data[i].type === 2 && data[i].status === 1) {
            this.shipp_addr = data[i];
            this.shipFrom   = this.shipp_addr.vendor_addr_id;

            this.shipAttention      = this.shipp_addr.attention;
            this.shipAddress_line_1 = this.shipp_addr.address_line_1;
            this.shipAddress_line_2 = this.shipp_addr.address_line_2;
            this.shipCity           = this.shipp_addr.city;
            this.shipState          = this.shipp_addr.state;
            this.shipZipcode        = this.shipp_addr.zip_code;
            this.Edit_bill.controls['shipFrom'].setValue(this.shipFrom);

          }
        }
      }

    if(this.show_bill_edit == true && this.clone_bill_show == false)
    {

        for (let i = 0; i < data.bill_address.length; i++)
        {
          if (data.bill_address[i] ) {
            this.bill_addr   = data.bill_address[i];
            this.billFrom    = this.bill_addr.vendor_addr_id;

            this.billAttention      = this.bill_addr.attention;
            this.billAddress_line_1 = this.bill_addr.address_line_1;
            this.billAddress_line_2 = this.bill_addr.address_line_2;
            this.billCity           = this.bill_addr.city;
            this.billState          = this.bill_addr.state;
            this.billZipcode        = this.bill_addr.zip_code;
            this.Edit_bill.controls['billFrom'].setValue(this.billFrom);
          }

          if (data.ship_address[i] ) {
            this.shipp_addr = data.ship_address[i];
            this.shipFrom   = this.shipp_addr.vendor_addr_id;

            this.shipAttention      = this.shipp_addr.attention;
            this.shipAddress_line_1 = this.shipp_addr.address_line_1;
            this.shipAddress_line_2 = this.shipp_addr.address_line_2;
            this.shipCity           = this.shipp_addr.city;
            this.shipState          = this.shipp_addr.state;
            this.shipZipcode        = this.shipp_addr.zip_code;
            this.Edit_bill.controls['shipFrom'].setValue(this.shipFrom);
          }
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
    this.Edit_bill.controls["paymentTerms"].setValue(this.payment_terms);
  }

  edit_initProduct()
  {
    let product = this.Edit_bill.get('product') as FormArray;
    product.push(this.fb.group({
      type        :"new",
      id          : new FormControl(''),
      items       : new FormControl('', Validators.required),
      descriptions: new FormControl(''),
      taxes       : new FormControl('', Validators.required),
      price       : new FormControl('', Validators.required),
      quantity    : new FormControl('', Validators.required),
      uom         : new FormControl('', Validators.required),
      amount      : new FormControl('', Validators.required),
      discount_1  : 0,
      discount_2  : 0,
    }))
    this.adjustTableHeight()
  }

  async edit_LoadGST(mode)
  {
      await this.api.get('get_data.php?table=tax&find=type&value=' + mode + '&authToken=' + environment.authToken).then((data: any) =>
      {
       this.editGST_Data     = data;
       this.editGST_Length   = data.length;
       this.editGST_Length   = data.length;
      }).catch(error => { this.toastrService.error('Something went wrong'); });

        for(let n = 0; n < this.editGST_Length; n++)
        {
          this.editGST_Data[n]['amount'] = 0;
        }
      this.load_editpage();
  }


 load_editpage()
 {
  this.LoadpaymentTerms();
  setTimeout(() => {
    if(this.clone_bill_show == false)
    {
    this.Edit_bill.controls['billNo'].setValue(this.bill_list.bill_number);
    this.Edit_bill.controls['billDate'].setValue(this.bill_list.bill_date);
    }
    this.Edit_bill.controls['reference_number'].setValue(this.bill_list.reference_number);
  //  this.Edit_bill.controls['tax_type'].setValue();
    this.Edit_bill.controls['paymentTerms'].setValue(this.bill_list.payment_term);
    this.Edit_bill.controls['dueDate'].setValue(this.bill_list.bill_due_date);
    this.Edit_bill.controls['shippingCharge'].setValue(this.bill_list.transport)
    this.Edit_bill.controls['subTotal'].setValue(0);
    this.Edit_bill.controls['tds_percentage'].setValue(this.bill_list.tds_percentage);
    this.Edit_bill.controls['tcs_percentage'].setValue(this.bill_list.tcs_percentage);
    this.Edit_bill.controls['TCS'].setValue(this.bill_list.TCS);
    this.Edit_bill.controls['TDS'].setValue(this.bill_list.TDS);
    this.Edit_bill.controls['roundOff'].setValue(this.bill_list.round_off);
    this.Edit_bill.controls['terms_condition'].setValue(this.bill_list.terms_condition);
    this.Edit_bill.controls['dueDate'].setValue(this.bill_list.bill_due_date);
    this.Edit_bill.controls['bill_id'].setValue(this.bill_list.bill_id);
    this.Edit_bill.controls['project_id'].setValue(this.bill_list.project_id);
    this.Edit_bill.controls['created_by'].setValue(this.uid);
    this.Edit_bill.controls['notes'].setValue(this.bill_list.note);

  const product1 = this.Edit_bill.get('product') as FormArray;
  product1.clear();
  this.invoiceitem_list.forEach((item,j) => {
    product1.push(this.fb.group({
      type        : "edit",
      id          : [item.bill_item_id],
      items       : [item.item_list_id],
      descriptions: [item.item_description],
      taxes       : [item.tax_percent],
      price       : [item.amount],
      uom         : [item.uom],
      quantity    : [item.qty],
      amount      : [item.total],
      discount_1  : [item.discount_1],
      discount_2  : [item.discount_2],
    }));

     let qty   = item.qty;
     let price = item.amount;
     let discount_1 = item.discount_1;
     let discount_2 = item.discount_2;
     this.edit_priceChange(qty, price,discount_1,discount_2, j);
   });
  for(let m = 0; m < this.invoiceitem_list.length; m++)
    {
      this.edit_GSTCalculation();
    }
  }, 100);
}

async edit_specItem(item,j)
  {
    await this.api.get('get_data.php?table=item&find=item_id&value=' + item + '&authToken=' + environment.authToken).then((data: any) => {

      if(this.taxempty == 1)
      {
       this.taxes     = data[0].tax_percent;
      }

      if(this.taxempty == 0)
      {
       this.taxes     = 0;
      }

      this.uom       = data[0].uom
      this.price     = data[0].price;
      this.quantity  = 1;
      this.amount    = data[0].price;
      this.descriptions = data[0].description;
    }).catch(error => { this.toastrService.error('Something went wrong '); });
    const formData = {
      taxes: item,
    }
    this.edit_patchValues(item,j);
    this.edit_SubTotalChange();
    this.edit_GSTCalculation();
    this.resetTableHeight();
  }

  edit_patchValues(id,j)
  {
    let y = (<FormArray>this.Edit_bill.controls['product']).at(j);
    y.patchValue({
    taxes        : this.taxes,
    price        : this.price,
    quantity     : this.quantity,
    amount       : this.amount,
    uom          : this.uom,
    descriptions : this.descriptions,
    discount_1   : 0,
    discount_2   : 0,
    });
  }

  edit_priceChange(qty, price,discount_1,discount_2, j)
  {
    let dis_1=  price - (discount_1/100)*price;
    let dis_2= dis_1 - (discount_2/100)*dis_1;
    this.amount = Number(qty *dis_2).toFixed(2);
    let y       = (<FormArray>this.Edit_bill.controls['product']).at(j);
    y.patchValue({
      amount : this.amount
    })
    this.edit_SubTotalChange();

  }
 edit_qty(qty, price,discount_1,discount_2, j)
  {
    let dis_1=  price - (discount_1/100)*price;
    let dis_2= dis_1 - (discount_2/100)*dis_1;
    this.amount = Number(qty *dis_2).toFixed(2);
    let y       = (<FormArray>this.Edit_bill.controls['product']).at(j);
    y.patchValue({
      amount : this.amount
    })
    this.edit_SubTotalChange();

  }

total_tax : number
edit_GSTCalculation() {

  this.editGST_Data.forEach(data => {
    data.amount = 0;
  });
    this.total_tax = 0
  let products = (<FormArray>this.Edit_bill.controls['product']).value;
  products.forEach(product => {
    let taxValue = (product.amount / 100) * product.taxes;
    let taxAmount = parseFloat(taxValue.toFixed(2));
    this.total_tax += taxAmount
    this.editGST_Data.forEach(data => {
      if (data.rate === product.taxes)
      {
        data.amount += taxAmount;
        data.amount = parseFloat(data.amount.toFixed(2));
      }
    });
  });
  this.edit_FinalTotalCalculation();
}

 edit_SubTotalChange()
  {
    let edit_arr     = this.Edit_bill.controls['product'].value;
    let sum1: number = edit_arr.map(a => parseFloat(a.amount)).reduce(function(a, b) {
      return a + b;
    });
    this.subtotal= sum1.toFixed(2);
    this.Edit_bill.controls['subTotal'].setValue((sum1).toFixed(2));
     this.edit_GSTCalculation();
     this.edit_FinalTotalCalculation();
     this.tdsCalculation();
     this.tcsCalculation();
  }

  tdsCalculation()
  {

     let subtotal = Number(this.subtotal)
     let tds =  ((subtotal + this.total_tax)*(this.tds_percent/100)).toFixed(2);
     this.Edit_bill.controls['TDS'].setValue(tds);
     this.edit_FinalTotalCalculation();
  }

  tcsCalculation()
  {
    let subtotal = Number(this.subtotal)
    let tcs =  ((subtotal + this.total_tax)*(this.tcs_percent/100)).toFixed(2);
    this.Edit_bill.controls['TCS'].setValue(tcs);
    this.edit_FinalTotalCalculation();
  }

  discount_Change(qty, price,discount_1,discount_2, j)
  {

    let dis_1=  price - (discount_1/100)*price;
    let dis_2= dis_1 - (discount_2/100)*dis_1;
    this.amount = (qty *dis_2).toFixed(2);
    let x = (<FormArray>this.Edit_bill.controls['product']).at(j);
    x.patchValue({
      amount : this.amount
    });
    this.edit_SubTotalChange();
  }

  edit_FinalTotalCalculation()
  {
    let editSub_Total       = this.Edit_bill.controls['subTotal'].value;
    let editTDS_Value       = this.Edit_bill.controls['TDS'].value;
    let editTCS_Vale        = this.Edit_bill.controls['TCS'].value;
    let editShipping_Value  = this.Edit_bill.controls['shippingCharge'].value;
    let editRoundof_Value   = this.Edit_bill.controls['roundOff'].value;

    let editTotalGST: number = this.editGST_Data.map(a => parseFloat (a.amount)).reduce(function(a, b)
    {
      return a + b;
    });
    let editTotal_Calculation =  (Number(editSub_Total) - Number(editTDS_Value) + Number(editTCS_Vale) + Number(editShipping_Value) + Number(editRoundof_Value)+ Number(editTotalGST)).toFixed(2);
    this.Edit_bill.controls['total'].setValue(editTotal_Calculation);
  }

  edit_onDeleteRow(rowIndex)
  {
    let editproduct = this.Edit_bill.get('product') as FormArray;
     const delete_data = editproduct.at(rowIndex).value;
     this.item_index=rowIndex;
     console.log(delete_data)
     if (delete_data.type=="new" && editproduct.length>0)
    {
      editproduct.removeAt(rowIndex)
    }
    else if(delete_data.type=="edit")
    {
      this.item_DeleteId = delete_data.id
      this.new_category_id= this.modalService.open(this.delete_item, { size: 'md' });
    }
    else
    {
      editproduct.reset()
    }
    this.edit_SubTotalChange()
  }


   onDeleteRow(rowIndex)
  {
    let editproduct=this.Edit_bill.get('product') as FormArray;
    if (editproduct.length>0)
    {
      editproduct.removeAt(rowIndex)
    }
    else
    {
      editproduct.reset()
    }
    this.edit_SubTotalChange()
  }

  async LoadpaymentTerms()
  {
    await this.api.get('get_data.php?table=payment_terms&authToken=' + environment.authToken).then((data: any) => {
      this.payment_terms = data;
    }).catch(error => { this.toastrService.error('Something went wrong '); });
  }

  async edit_onSubmit(value)
  {

    let bill_id =  this.bill_list['bill_id'];
    let serial_no=this.bill_list.serial_no;
       Object.keys(this.Edit_bill.controls).forEach(field => {
       const control = this.Edit_bill.get(field);
       control.markAsTouched({ onlySelf: true });
       });
       if (this.Edit_bill.valid)
         {

           value.bill_id =this.invoice_item.bill_id
          this.loading=true;
          await this.api.post('mp_bill_edit_submit.php?value='+bill_id+'&authToken=' + environment.authToken, value).then((data: any) =>
          {
            console.log(data)
            if (data.status == "success")
            {
              this.loading=false;
              this.toastrService.success('Bill Updated Succesfully');
              this.Return();
              this.view_bill = serial_no;
              this.loadonce();
            }
            else { this.toastrService.error('Something went wrong ');
            this.loading = false;}
            return true;
          }).catch(error =>
            {
            this.toastrService.error('Something went wrong ');
            this.loading = false;
          });
        }
 }

 Return()
 {
      this.show_bill_edit = false;
      this.show           = true;
      this.LoadVendorBills();
 }


async download()
 {

  let bill_id =this.billPdf[0].bill_id;
  await this.fontloader();

  this.api.get('mp_download_bill.php?value=' + bill_id + '&authToken=' + environment.authToken).then((data: any) => {
      var bill_data = data;
     this.pdfDownload( bill_data);

  }).catch(error => { this.toastrService.error('Something went wrong'); });

 }

 async pdfDownload(files) {

  let docDefinition = {
    info: {
      title:files[0].bill_number,
    },
    content: [

      this.getCompanyDetails(files),
      this.getMobileDetails(files),
      this.getGstObject(files),
      {
        table: {
          widths: ['*'],
          body: [
            [
              [
                [
                  { text: ' BILL', fontSize: 11, bold: true, alignment: 'center' },]
              ],
            ],
          ]
        },
        layout: {
          layout: 'lightHorizontalLines',
          hLineWidth: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 0 : 0;
          },
        },
      },

      this.getInvoiceObject(files),
      this.getBillObject(files),
      this.getItemsObject(files),
      this.getItemstotalObject(files),
      this.getTotalWords(files),
      this.getBankObject(files),
      this.getTermsObject(files),

    ],
    defaultStyle: {
      font: 'Roboto', // Use the registered font name here
    },

     footer: function(currentPage, pageCount) {
              return {
                columns: [
                  { text: 'For ' + files[0].company_name, alignment: 'right', margin: [0, 0, 40, 25],  fontSize: 8 },
                  { text: 'Page ' + currentPage + ' of ' + pageCount, alignment: 'left', margin: [40, 0, 0, 20], fontSize: 8 }
                ]
              };
            },
  };

  pdfMake.createPdf(docDefinition).open();
 // pdfMake.createPdf(docDefinition).download("invoice.pdf");
}

getCompanyDetails(files) {
  var test = files[0].company_details[0];

  return {
    table: {
      widths: ['*'],
      body: [
        [
          [
            { image: this.imageToShow, width: 250, alignment: 'center', rowSpan: 2 },
            '',
            { text: ""+test.address_1+","+test.address_2+","+test.city+"-"+test.pincode, fontSize: 9, color: 'black', alignment: 'center' },
            { text: test.website, border: [false, false, false, false], fontSize: 10, color: 'black', alignment: 'center' }
          ],
        ],
      ],
    },
  };
}

getMobileDetails(files) {
  var test = files[0].company_details[0]
  return {
    table: {
      widths: ['*'],
      body: [
        [
          [
            [{ text: test.mobile, border: [false, false, false, false], color: 'black', fontSize: '10', alignment: 'center' },]
          ],
        ],
      ]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 0;
      },
    },
  }
}

getGstObject(files) {

  var test = files[0]
  return {
    table: {
      widths: ['*', '*'],
      body: [
        [
          [
            { text: 'GSTIN :' + test.gst_number, fontSize: 10, bold: true, alignment: 'center' },
          ],
          [{  text: 'UDYAM : ' + test.company_udyam,  fontSize: 10, bold: true, alignment: 'center' }]
        ],
      ]
    },
  }

}

getInvoiceObject(files) {

  var test = files[0]
  return {

    table: {
      widths: ['*', '*'],
      body: [
        [
          {
            columns: [
              [
                { text: 'Bill No :', fontSize: 10 },
                { text: 'Bill Date :', fontSize: 10 },
                { text: 'State: ', fontSize: 10 },
                { text: 'Pin Code : ', fontSize: 10 },
              ],
              [
                { text: test.bill_number, fontSize: 10 },
                { text: test.bill_date, fontSize: 10 },
                { text: test.bill_state, fontSize: 10 },
                { text: test.bill_zip_code, fontSize: 10 },
              ]

            ]
          },

          {
            columns: [
              [

                { text: test.shipment_mode ? 'Shipment :' : '', fontSize: 10 },
                { text: test.vehicle_number ? 'Vehicle Number :' : '', fontSize: 10 },
                // test.shipment_mode ? { text: 'Shipment :', fontSize: 10 } : null,
                // test.vehicle_number ? { text: 'Vehicle Number :', fontSize: 10 } : null,
                { text: 'Place of Supply :', fontSize: 10 },
                { text: test.reference_number ? 'P.O ref No :':'', fontSize: 10 },
              ],
              [
                { text: test.shipment_mode, fontSize: 10 },
                { text: test.vehicle_number, fontSize: 10 },
                { text: test.place_from_supply, fontSize: 10 },
                { text: test.reference_number, fontSize: 10 },

              ]
            ]
          },
        ],
      ]
    },
    layout: {
      layout: 'lightHorizontalLines',
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 1 : 1;
      },
    },
  }
}

getBillObject(files) {

  var test = files[0]

  return {
    table: {
      widths: ['*', '*'],
      body: [
        [
          [
            { text: 'Bill to party:', bold: true, fontSize: 10 },
            { text: test.bill_attention, bold: true, fontSize: 10 },
            { text: test.bill_address_line_1, fontSize: 10 },
            { text: test.bill_address_line_2, fontSize: 10 },
            { text: 'GST No :' + test.vendor_gst, fontSize: 10, bold: true },
            { text: test.customer_udyam ? 'Udyam No :'+test.customer_udyam : '', fontSize: 10 ,bold:true},
            { text: 'State :' + test.bill_state, fontSize: 10,  },
            { text: 'Pin Code :' + test.bill_zip_code, alignment: 'left', bold: true, fontSize: 10 },
          ],
          {
            columns: [
              [{ text: 'Ship to party:', bold: true, fontSize: 10 },
              { text: test.ship_attention, bold: true, fontSize: 10 },
              { text: test.ship_address_line_1, fontSize: 10 },
              { text: test.ship_address_line_2, fontSize: 10 },
              { text: 'GST No :' + test.vendor_gst, fontSize: 10, bold: true },
              { text: 'State :' + test.ship_state, fontSize: 10, },
              { text: 'Pin Code :' + test.ship_zip_code, alignment: 'left', bold: true, fontSize: 10 },
              ],
            ]
          },
        ],
      ]
    },
    layout: {
      layout: 'lightHorizontalLines',
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 0;
      },
    },
  }
}

getItemsObject(files) {

  var test = files[0].billItems;
  var serialNumber = 1;
  if(files[0].place_from_supply_code == 33)
  {
  return {
  table: {
    widths: [10, 112, 40,18, 18, 35, 12, 33, 12, 33,18,18,38],
    body: [
      [
        { text: '#', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true , alignment: 'center'},
        { text: 'Product Description', alignment: 'center',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 9, bold: true },
        { text: 'HSN', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true , alignment: 'center'},
        { text: 'QTY', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true, alignment: 'center' },
        { text: 'UOM', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true, alignment: 'center' },
        { text: "Unit Rate", border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true, alignment: 'center' },
        { text: 'CGST', border: [true, true, true, false],fillColor: '#CCCCCC',fontSize: 8, bold: true, alignment: 'center', colSpan: 2 },
        {},
        { text: 'SGST', fontSize: 8, bold: true,fillColor: '#CCCCCC', alignment: 'center', colSpan: 2 },
        {},
        { text: 'DIST', border: [true, true, false, false],fillColor: '#CCCCCC',fontSize: 8, bold: true, alignment: 'center',  },
        { text: 'ATD', border: [true, true, false, false],fillColor: '#CCCCCC',fontSize: 8, bold: true, alignment: 'center', },
        { text: 'Amount', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true ,alignment: 'center'},
      ],
      [
        { text: '',fillColor: '#CCCCCC', border: [true, false, true, false] },
        { text: '',fillColor: '#CCCCCC', border: [true, false, true, false] },
        { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
        { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
        { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
        { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
        { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 9 ,alignment:'center'},
        { text: 'Amt',fillColor: '#CCCCCC', bold: true, fontSize: 8,alignment:'center' },
        { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 9,alignment:'center'},
        { text: 'Amt',fillColor: '#CCCCCC', bold: true, fontSize: 8,alignment:'center' },
        { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 9 ,alignment:'center'},
        { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 9 ,alignment:'center'},
        { text: '',fillColor: '#CCCCCC', border: [true, false, true, false], bold:true},
      ],
      ...test.map((ed, index) => {
          let cellBorder = [true, true, true, false];
          if (index > 0) {
            cellBorder = [true, true, true, true];
          }

        return [
          { text:  serialNumber++,border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: [{ text: ed.item_name,bold: true },{ text: '\n' }, { text: ed.item_description },], border: cellBorder, fontSize: 9, alignment: 'left' },
          { text: ed.hsn,border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.qty,border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.uom,border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.tax_percent/2 +'%',border:cellBorder, fontSize: 8 ,alignment: 'center'},
          { text: (ed.item_tax/2).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.tax_percent/2 +'%',border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: (ed.item_tax/2).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.discount_1,border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.discount_2,border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'), border: [true, true, true, false], fontSize: 8,  alignment: 'right'}]
        },
        )
      ],
    }
    }
  }

  if(files[0].place_from_supply_code != 33)
    {
    return {
    table: {
      widths: [11, 112, 45, 22, 22, 40, 20,38,30,30,45],
      body: [
        [
          { text: '#', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true , alignment: 'center'},
          { text: 'Product Description', alignment: 'center',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 10, bold: true },
          { text: 'HSN', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true , alignment: 'center'},
          { text: 'QTY', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true, alignment: 'center' },
          { text: 'UOM', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true, alignment: 'center' },
          { text: "Unit Rate", border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true, alignment: 'center' },
          { text: 'IGST', border: [true, true, false, false],fillColor: '#CCCCCC',fontSize: 10, bold: true, alignment: 'center', colSpan: 2 },
          { text: '',fillColor: '#CCCCCC',border: [false, false, false, false]},
          { text: 'DIST', border: [true, true, false, false],fillColor: '#CCCCCC',fontSize: 10, bold: true, alignment: 'center',},
          { text: 'ATD', border: [true, true, false, false],fillColor: '#CCCCCC',fontSize: 10, bold: true, alignment: 'center', },
          { text: 'Amount', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true ,alignment: 'center'},
        ],
        [
          { text: '',fillColor: '#CCCCCC', border: [true, false, true, false] },
          { text: '',fillColor: '#CCCCCC', border: [true, false, true, false] },
          { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
          { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
          { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
          { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
          { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 11 ,alignment:'center'},
          { text: 'Amt',fillColor: '#CCCCCC', bold: true, fontSize: 10,alignment:'center' },
          { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 11 ,alignment:'center'},
          { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 11 ,alignment:'center'},
          { text: '',fillColor: '#CCCCCC', border: [true, false, true, false], bold:true},
        ],
        ...test.map((ed, index) => {
            let cellBorder = [true, true, true, false];
            if (index > 0) {
              cellBorder = [true, true, true, true];
            }

          return [
            { text:  serialNumber++,border:cellBorder, fontSize: 9 , alignment: 'center'},
            { text: [{ text: ed.item_name,bold: true },{ text: '\n' }, { text: ed.item_description },], border: cellBorder, fontSize: 9, alignment: 'left' },
            { text: ed.hsn,border:cellBorder, fontSize: 9 , alignment: 'center'},
            { text: ed.qty,border:cellBorder, fontSize: 9 , alignment: 'center'},
            { text: ed.uom,border:cellBorder, fontSize: 9 , alignment: 'center'},
            { text: ed.amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 9 , alignment: 'center'},
            { text: ed.tax_percent +'%',border:cellBorder, fontSize: 9 ,alignment: 'center'},
            { text: (ed.item_tax).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 9 , alignment: 'center'},
            { text: ed.discount_1,border:cellBorder, fontSize: 9 , alignment: 'center'},
            { text: ed.discount_2,border:cellBorder, fontSize: 9 , alignment: 'center'},
            { text: ed.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'), border: [true, true, true, false], fontSize: 9,  alignment: 'right'}]
          },
          )
        ],
      }
    }
  }
}

getItemstotalObject(files) {

  var test = files[0];
  var tax  = files[0].tax_amount_percentage;
  const without_tax = '₹' + test.without_tax.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const tax_5     =  tax.tax_5.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const tax_12    =  tax.tax_12.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const tax_18    =  tax.tax_18.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const tax_28    =  tax.tax_28.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const round_off =  test.round_off.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const total     = '₹' + test.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const transport   =   test.transport.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const tds         =   test.tds.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const tcs         =   test.tcs.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const tcs_percent = test.tcs_percent;
  const tds_percent = test.tds_percent;

  var rows = [
    [
      { text: 'Total Amount Before Tax', fontSize: 10, colSpan: 11, alignment: 'right' },
      '', '', '', '', '', '', '', '', '', '',
      { text: without_tax, fontSize: 10 ,alignment: 'right'}
    ],

  ];

  if (tax.tax_5 > 0) {
    rows.push([
      { text: 'GST (5%)', fontSize: 10, colSpan: 11, alignment: 'right' },
      '', '', '', '', '', '', '', '', '', '',
      { text: tax_5, fontSize: 10 ,alignment: 'right'}
    ]);
  }

  if (tax.tax_12 > 0) {
    rows.push([
      { text: 'GST (12%)', fontSize: 10, colSpan: 11, alignment: 'right' },
      '', '', '', '', '', '', '', '', '', '',
      { text: tax_12, fontSize: 10, alignment: 'right'}
    ]);
  }

  if (tax.tax_18 > 0) {
    rows.push([
      { text: 'GST (18%)', fontSize: 10, colSpan: 11, alignment: 'right' },
      '', '', '', '', '', '', '', '', '', '',
      { text: tax_18, fontSize: 10, alignment: 'right' }
    ]);
  }

  if (tax.tax_28 > 0) {
    rows.push([
      { text: 'GST (28%)', fontSize: 10, colSpan: 11, alignment: 'right' },
      '', '', '', '', '', '', '', '', '', '',
      { text:tax_28, fontSize: 10, alignment: 'right' }
    ]);
  }


  if (test.transport > 0) {
    rows.push([
      { text: 'Shipping Charge', fontSize: 10, colSpan: 11, alignment: 'right' },
      '', '', '', '', '', '', '', '', '', '',
      { text:transport, fontSize: 10, alignment: 'right' }
    ]);
  }
  if (test.tds > 0) {
      rows.push([
        { text: 'TDS('+test.tds_percent+'%)', fontSize: 10, colSpan: 11, alignment: 'right' },
        '', '', '', '', '', '', '', '', '', '',
        { text:tds, fontSize: 10, alignment: 'right' }
      ]);
    }

  if (test.tcs > 0) {
    rows.push([
      { text: 'TCS('+test.tcs_percent+'%)', fontSize: 10, colSpan: 11, alignment: 'right' },
      '', '', '', '', '', '', '', '', '', '',
      { text:tcs, fontSize: 10, alignment: 'right' }
    ]);
  }

  rows.push([

      { text: 'Round off',  fontSize: 10, colSpan: 11, alignment: 'right' },
      '', '', '', '', '', '', '', '', '', '',
      { text: round_off, fontSize: 10, alignment: 'right' }
    ],
    [
      { text: 'Total', fontSize: 10, colSpan: 11, alignment: 'right',  },
      '', '', '', '', '', '', '', '', '', '',
      { text: total, fontSize: 10, alignment: 'right' }
    ]);

  return {
    table: {
      widths:[20, 103, 23, 23, 20, 35, 34, 15, 32, 15, 22, 64],
      body: rows
    }
  };
}

getTotalWords(files) {
 var test = files[0];
//  const totalInWords = test.total;
  const numToWordPipe = new NumtowordPipe();
    console.log("total ",test.total)
  const totalInWords = numToWordPipe.transform(test.total);
  console.log("totalInWords ",totalInWords)
 return {
   table: {
     widths: ['*'],
     body: [
        [
          {
            text: totalInWords,
            border: [true, false, true, true],
            fontSize: 9,
            alignment: 'right',
            italics:true
          }
        ]
      ]
   },

 };
}


getBankObject(files) {

  var test = files[0].company_details[0];
var value = files[0];
  return {

    table: {
      widths: ['*', '*'],
      body: [
        [
          [
            [
              { text: 'Bank Details :', bold: 'true', fontSize: '10', alignment: 'left' },
              { text: 'Bank Name           : ' + test.bank_name, fontSize: '10', alignment: 'left' },
              { text: 'Account Number : ' + test.account_no, fontSize: '10', alignment: 'left' },
              { text: 'IFSC CODE            : ' + test.ifsc_code, fontSize: '10', alignment: 'left' },
            ]
          ],

          [
            [
              { text: 'Terms of Payment :', bold: true, fontSize: '10', alignment: 'left' },
              { text: value.payment_term1, margin: [0, 5], fontSize: '10', alignment: 'left' },
              { text: value.payment_term2, margin: [0, 5], fontSize: '10', alignment: 'left' },
              { text: value.payment_term3, margin: [0, 5], fontSize: '10', alignment: 'left' }
            ]
          ],

        ],

      ]
    },
    layout: {

      layout: 'headerLineOnly',
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 0;
      },
    },
  }
}



getTermsObject(files) {
  var test = files[0]

  return {
    table: {
      widths: ['*', '*'],
      body: [
        [
          [
            [
              { text: test.inv_notes1, alignment: 'justify', margin: [0, 10, 0, 0], bold: false, fontSize: '10' },
              { text: test.inv_notes2, alignment: 'justify', margin: [0, 10, 0, 0], bold: false, fontSize: '10' },
              { text: 'For '+test.company_name, margin: [0, 10, 0, 0], bold: true, fontSize: '10', alignment: 'left' },
              { text: 'Authorised Signatory', margin: [0, 35, 0, 0], bold: true, italics: true, fontSize: '10', alignment: 'left' },]
          ],
          [
            [
              { text: 'Terms & Conditions of sale:', bold: true, italics: true, fontSize: '10', alignment: 'left' },
              { text: test.terms_conditions, margin: [0, 10], italics: true, fontSize: '10', alignment: 'left' },
            ]
          ],
        ],

      ]
    },
    layout: {

      layout: 'lightHorizontalLines',

      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 1 : 0;
      },
    },
  }
}

async payment()
{

  await this.api.get('get_data.php?table=prefix&authToken=' + environment.authToken).then((data) =>
  {
    this.prefix = data[0].payment_made;
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
    this.openpop()
  }).catch(error => { this.toastrService.error('API Faild : AddNewTrans')});

  let serial_no = this.prefix+this.receipt_serial_no;
  this.bill_payment.controls['receipt_no'].setValue(serial_no);
}

async load_paymentTransactiond(id)
{
  this.payment_view = false;
   await this.api.get('get_data.php?table=payment_made&find=bill_id&value='+id+'&asign_field=tran_id&asign_value=DESC&authToken=' + environment.authToken).then((data) =>
  {
    console.log("transaction ",data)
    this.payment_transaction = data;
    if(data!=null)
    {
        let paid = 0;
        this.payment_transaction.forEach(element => {
              paid += element.credit
        });
         this.balance = (this.billPdf[0].total - paid).toFixed(2);
       if(this.balance == 0 || this.balance < 0)
       {
        this.payment_view = true;
       }

    }
    else{
      this.balance =this.billPdf[0].total
    }


  }).catch(error => { });
}

async openpop()
  {
    this.add_payment = this.modalService.open(this.addPayment, { size: 'md' });
    this.name =this.bill_list.vendor_name;
      if(this.payment_transaction!=null)
      {

        let paid = 0;
        this.payment_transaction.forEach(element => {
              paid += element.credit
        });
         this.balance = (this.billPdf[0].total - paid).toFixed(2);
          var amount  = this.balance ;

      }
       else{
        var amount  =  this.billPdf[0].total;

       }
    this.bill_payment.controls['to_bank'].setValue(this.name);
    this.bill_payment.controls['amount'].setValue(amount);
    this.bill_payment.controls['description'].setValue(this.bill_number);
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

  cancel()
  {
    this.show_bill_edit = false;
    this.show=true;
    this.clone_bill_show = false;
  }


  async AddNewTrans(data)
  {
    let bill_id =this.bill_list.bill_id;
    let amount =this.bill_list.total;

    if(this.payment_transaction != null)
      {
        let paid =0;
         this.payment_transaction.forEach(element => {
              paid += element.credit
        });
         this.balance = (this.billPdf[0].total - paid).toFixed(2);
        let balance = this.balance;
        var last_total  =  balance;
      }
       else
       {var last_total  =  this.billPdf[0].total; }

       Object.keys(this.bill_payment.controls).forEach(field => {
        const control = this.bill_payment.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if (this.bill_payment.valid)
    {
         const billNoValue = this.prefix+this.receipt_serial_no;
        console.log(billNoValue)
          function normalizeString(str : any) {
              return str.replace(/\s+/g, '').toLowerCase();
            }
            let checking :any
            await this.api.get('get_data.php?table=payment_made&authToken=' + environment.authToken).then((data: any) =>

              {
                console.log(data)
                if(data != null)
                  {
                     checking = data.some((item: { receipt_no: any; }) =>  normalizeString(item.receipt_no) ===  normalizeString(billNoValue) );
                  }
              }).catch(error =>
              {
                  this.toastrService.error('API Faild : Invoice number checking failed');
                  this.loading = false;
              });

              if(checking)
               {
                  this.toastrService.error('receipt Number already exist');
                  return
               }
               console.log("data")
       if(last_total >= data.amount && last_total >0)
       {
          this.loading=true;
              await this.api.post('mp_bill_payment_made.php?value='+bill_id+'&amount='+amount+'&authToken=' + environment.authToken, data).then((data: any) =>
              {

                if(data.status == "success")
                  {
                    this.toastrService.success('Transaction Succesfully');
                    this.bill_payment.controls['tran_mode'].reset(0);
                    this.bill_payment.controls['from_bank'].setValue(1);
                    this.bill_payment.controls['to_bank'].setValue('');
                    this.bill_payment.controls['reference'].reset();
                    this.bill_payment.controls['description'].reset();
                    this.bill_payment.controls['amount'].setValue(0);
                    this.add_payment.close();
                    this.loading=false;
                   this. load_paymentTransactiond(bill_id) }
                else
                  { this.toastrService.error(data.status);
                    this.loading=false; }
                  return true;
              }).catch(error => {this.toastrService.error('API Faild : AddNewTrans');
                  this.loading=false;});
        }
        else
        {this.toastrService.error('Amount is greater than the Bill amount '); }
    }
     else
     {
       this.toastrService.error('Please make sure all fields are filled in correctly');
     }
  }

  clone()
  {
    this.clone_bill_show = true;
    this.show_bill_edit = false;
    this.show=false;
    this.edit_dataload();
    this.LoadItemDetails();
    this.selectEdit_data()

  }

  async load_billnumber(id)
 {
    this.details =id
  await  this.api.get('mp_bill.php?&value=' + this.details.vendor_id+ '&authToken=' + environment.authToken).then((data: any) =>
  {

     let bill_id         = data[0].serial_no + 1;
      var billprifix     = data[0].prefix ;
      this.inv_no        =  parseFloat(bill_id);
      this.view_bill     = bill_id ;

      if(this.clone_bill_show == true)
      {
        this.Edit_bill.controls['billNo'].setValue(this.inv_no);
        this.Edit_bill.controls['billDate'].setValue(this.todaysDate);
      }
  }).catch(error => { this.toastrService.error('Something went wrong') });
}


async onSubmit(bill_data)
  {
    Object.keys(this.Edit_bill.controls).forEach(field => {
      const control = this.Edit_bill.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    if (this.Edit_bill.valid)
    {
      const billNoValue = bill_data.billNo;
      let value = this.VendorBillList.find(item => item.bill_number === billNoValue);
         if(value != undefined)
         {
          this.toastrService.error('Bill number has already been entered')
         }
        if(value == undefined)
         {
                this.loading = true;
                await this.api.post('mp_bill_create.php?type=new_po&authToken=' + environment.authToken, bill_data).then((data: any) =>
                {
                  if (data.status == "success")
                  {
                    this.toastrService.success('Bill Added Succesfully');
                    this.loading = false;
                    this.Return();
                    this.show_bill_edit = false;
                    this.show = true;
                    this.loadonce()
                    this.clone_bill_show = false;
                  }
                  else { this.toastrService.error('Something went wrong ');
                  this.loading = false;}
                  return true;
                }).catch(error =>
                  {
                  this.toastrService.error('Something went wrong ');
                  this.loading = false;
                });
              }
            }
    else
    {
      this.toastrService.error('Please Fill All Details');
    }
  }

  e_bill()
  {
    this.new_category_id = this.modalService.open(this.ewayBill, { size: 'md' });
    this.api.get('get_data.php?table=bill&find=bill_id&value='+this.bill_id+'&authToken=' + environment.authToken).then((data: any) => {

      this.e_way_bill.controls['bill_no'].setValue(data[0].e_way_no);
      this.e_way_bill.controls['vehicle_no'].setValue(data[0].vehicle_number);
      this.e_way_bill.controls['shipment_mode'].setValue(data[0].transport_mode);

     }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  async billSubmit(value)
  {
    let bill_id =this.billPdf[0].bill_id;
    this.view_bill =this.bill_list.serial_no;
    await this.api.post('mp_bill_create.php?bill_id='+bill_id+'&type=e_way&authToken=' + environment.authToken, value).then((data: any) =>
    {
      if (data.status == "success")
      {
        this.toastrService.success('Added Succesfully');
        this.loading = false;
        this.Return();
        this.show_bill_edit = false;
        this.show = true;

        this.loadonce()
        this.clone_bill_show = false;
        this.new_category_id.close();
      }
      else
      { this.toastrService.error('Something went wrong');
        this.loading = false;}
      return true;
    }).catch(error =>
      {
      this.toastrService.error('Something went wrong');
      this.loading = false;
    });
  }


 async remove()
  {

    if(this.Edit_status >0)
    {
       this.toastrService.error('Bill was not able to Delete');
       return
    }
  await  this.api.get('get_data.php?table=payment_made&find=bill_id&value='+this.bill_id+'&authToken=' + environment.authToken).then((data: any) => {

   this.if_delete = false;
    if(data != null)
    {
      for(let i=0;i<data.length;i++)
      {
        if(data[i].po_id == null)
        {
           this.if_delete = true;
        }
      }

       if(this.if_delete == false)
       {
        this.openMd = this.modalService.open(this.delete_bill, { size: 'md' });
       }

      if(this.if_delete == true)
      {
        this.toastrService.error('Bill was not able to Delete');
      }
    }
    else
    {
      this.openMd = this.modalService.open(this.delete, { size: 'md' });
    }

     }).catch(error => { this.toastrService.error('Something went wrong'); });


  }

 async Req_delete_bill()
  {
    let bill_id =this.billPdf[0].bill_id;
    let serial_no = this.bill_list.serial_no;

    await this.api.post('mp_delete_po_linked_bill.php?table=bill&field=bill_id&delete_id='+bill_id+'&authToken=' + environment.authToken,bill_id).then((data: any) =>
    {

      if (data.status == "success")
      {
              this.view_bill=data.id;
               this.toastrService.success('Deleted Succesfully');
               this.loading = false;
               this.Return();
               this.show_bill_edit = false;
               this.show = true;
               this.loadonce()
               this.clone_bill_show = false;
               this.openMd.close();
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


  async ReqDelete()
  {
    let bill_id =this.billPdf[0].bill_id;
    let serial_no = this.bill_list.serial_no;
        await this.api.post('mp_delete_invoice.php?table=bill&field=bill_id&delete_id='+bill_id+'&authToken=' + environment.authToken,bill_id).then((data: any) =>
        {
          if (data.status == "success")
          {
                  this.view_bill=data.id;
                   this.toastrService.success('Deleted Succesfully');
                   this.loading = false;
                   this.Return();
                   this.show_bill_edit = false;
                   this.show = true;
                   this.loadonce()
                   this.clone_bill_show = false;
                   this.openMd.close();
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

  vendor_address(id)
  {
    this.api.get('get_data.php?table=vendor_address&find=vendor_id&value=' + id + '&find1=type&value1=1&authToken=' + environment.authToken).then((data: any) => {
      this.alldata = data;
    }).catch(error => { this.toastrService.error('Something went wrong 1'); });

    this.api.get('get_data.php?table=vendor_address&find=vendor_id&value=' + id + '&find1=type&value1=2&authToken=' + environment.authToken).then((data: any) => {
      this.alldata1 = data;
  }).catch(error => { this.toastrService.error('Something went wrong 2'); });

  }

  ReloadBillAddr(id)
  {

    this.api.get('get_data.php?table=vendor_address&find=vendor_addr_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) => {
      this.bill_addr = data[0];

      this.billFrom = this.bill_addr.vendor_addr_id;
      this.billAttention = this.bill_addr.attention;
      this.billAddress_line_1 = this.bill_addr.address_line_1;
      this.billAddress_line_2 = this.bill_addr.address_line_2;
      this.billCity = this.bill_addr.city;
      this.billState = this.bill_addr.state;
      this.billZipcode = this.bill_addr.zip_code;
      this.Edit_bill.controls['billFrom'].setValue(this.billFrom);
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  ReloadShippAddr(id) {

    this.api.get('get_data.php?table=vendor_address&find=vendor_addr_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) => {
      this.shipp_addr = data[0];

      this.shipFrom = this.shipp_addr.vendor_addr_id;
      this.shipAttention = this.shipp_addr.attention;
      this.shipAddress_line_1 = this.shipp_addr.address_line_1;
      this.shipAddress_line_2 = this.shipp_addr.address_line_2;
      this.shipCity = this.shipp_addr.city;
      this.shipState = this.shipp_addr.state;
      this.shipZipcode = this.shipp_addr.zip_code;
      this.Edit_bill.controls['shipFrom'].setValue(this.shipFrom);
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  onInputChange()
  {
    const billNoValue = this.inv_no;
    let value = this.VendorBillList.find(item => item.bill_number === billNoValue);
       if(value != undefined)
       {
        this.toastrService.error('Bill number has already been entered')
       }
       if(value == undefined)
       {
       }
  }

  use_advance()
  {
    this.load_paymentTransactiond(this.bill_id)
    let vendor_id = this.bill_list.vendor_id;

    this.advance.controls['bill_amount'].setValue(this.bill_list.total);
    this.advance.controls['bill_id'].setValue(this.bill_id);
    this.advance.controls['description'].setValue(this.bill_list.bill_number);

    this.api.get('get_data.php?table=vendor_balance&find=vendor_id&value='+vendor_id+'&authToken=' + environment.authToken).then((data: any) => {

      if (data != null)
      {
        function levelFilter(value) {
          if (!value) { return false; }
           return value.bill_id === null;
          }
            this.advance_list = data.filter(levelFilter);
      }

       }).catch(error => { this.toastrService.error('Something went wrong'); });

     this.add_payment = this.modalService.open(this.use_advancePayment, { size: 'md' });
  }

 async Add_advance(data)
  {
    console.log(data)
     console.log("this.advance_list",this.advance_list)
    let select = this.advance_list.find(u => u.id == data.advance_id)
    console.log("Add_advance ",select)
    Object.keys(this.advance.controls).forEach(field => {
      const control = this.advance.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  if(this.advance.valid)
  {
    console.log(this.balance)
    if(select.debit <= this.balance && this.balance>0)
      {
         await     this.api.post('mp_advance_amount_to_bill.php?tran_id='+select.tran_id+'&authToken=' + environment.authToken, this.advance.value).then(async (data: any) =>
              {
                if(data.status == "success")
                  {
                          this.loading = false;
                        await  this.advance.reset()
                          this.toastrService.success('Updated Succesfully');
                          this.load_paymentTransactiond(this.bill_list.bill_id);
                          this.add_payment.close();

                  }
                else
                { this.toastrService.error(data.status);
                  this.loading = false;}

                return true;
              }).catch(error =>
              {
                  this.toastrService.error('API Faild : Advance Update');
                  this.loading = false;
              });
            }
            else
            {
              this.toastrService.warning("advance amount is greater than the Bill amount")
            }
  }
  else{
    this.toastrService.error('No select the payament');
  }
  }
}
