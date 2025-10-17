import { Component, OnInit, ViewChild,ElementRef, Renderer2 } from '@angular/core';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from "../../../../service/api.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../../../environments/environment";
import { Router } from '@angular/router';
import { FormControl, FormGroup,FormBuilder, FormArray, Validators } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ImgToBase64Service } from "src/app/service/img-to-base64.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { HostListener } from '@angular/core';
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
  selector: 'app-po_view',
  templateUrl: './po_view.component.html',
  styleUrls: ['./po_view.component.scss']
})
export class Po_viewComponent implements OnInit {
  public router: Router;

  SelectionType             = SelectionType;
  selected                  = [];
  poPdf                     = [];
  poItems                   : [] ;
  all_account               = [];
  user_account              = [];
  company_account           = [];
  cash_account              = [];
  gst_account               = [];
  Edit_po                   : FormGroup;
  e_way_bill                : FormGroup;
  bill                      : FormGroup;
  po_payment                : FormGroup;

  payment_view              : boolean=false;
  show_new_bill             : boolean=true;
  loading                   : boolean=false;
  show                      : boolean=true;
  show_edit_btn             : boolean=false;
  show_bill_edit            : boolean=false;
  public formShow           : boolean=true;
  show_po_edit              : boolean=false;
  clone_po_show             : boolean=false;
  create_bill_show          : boolean=false;

  total_bill                : any;
  fontFace                  : any;
  serial_no                 : any;
  VendorBillList            : any;
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

  bill_list                 : any;
  prefix                    : any;
  new_bill                  : any;
  amount                    : any;
  descriptions              : any;
  invoiceDate               : any;
  followingDay              : any;
  day                       : any;
  month                     : any;
  year                      : any;
  fullDate                  : any;
  dueValues                 : any = 0;

  billToPdf                 : any;
  customerPdf               : any;
  branchPdf                 : any;
  invoicePdfDetails         : any;
  img_path                  : any;
  company_pdf_logo          : any;
  company_mobile            : any;
  company_gst_no            : any;
  company_tan_no            : any;
  events                    : any;

  uom                       : any;
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
  customer_id               : any;
  alldata                   : any;
  alldata1                  : any;

  ItemList                  : any;
  editGST_Data              : any;
  editGST_Length            : any;
  po_item                   : any;
  invoiceitem_list          : any;
  selectdata                : any;
  po_list                   : any;
  name                      : any;
  GST_Data                  : any;
  GST_Length                : any;
  po_id                     : any;
  details                   : any;
  inv_no                    : any;
  poitem_list               : any;
  saveGST_data              : any;
  new_category_id           : any;
  openMd                    : any;
  status                    : any;
  subtotal                  : any;
  tds_percent               : any;
  tcs_percent               : any;
  taxempty                  : any;
  po_number                 : any;
  total_tax                 : any;

  today                     = new Date();
  todaysDate                = '';

  imageToShow               : string | ArrayBuffer;

  imgUrl: string = '../../../../assets/img/logo/geogreen.png';


  public view_bill     =  localStorage.getItem('view_bill');
  public uid           =  localStorage.getItem('uid');
  public user          =  localStorage.getItem('type');
  public user_bank_id  =  localStorage.getItem('bank_id');

  payment_transaction : any;
  balance             : any;
  add_payment         : any;
  receipt_serial_no   : any;
  bankData            : any;
  bankData_length     : any;
  edit_status         : any
  private startX      : number = 0;
  private startWidth: number = 0;
  private columnIndex: number | null = null;
  private resizing = false;
  tableWidth:any = 100

  @ViewChild('tableResponsive', { static: false }) tableResponsive: ElementRef;
  @ViewChild('dropdownPanel', { static: false }) dropdownPanel: ElementRef;

  constructor(private api: ApiService,private modalService: NgbModal,private imgToBase64: ImgToBase64Service,
     public toastrService: ToastrService, router:Router,
     public fb: FormBuilder,  private renderer: Renderer2) { this.router = router;

  this.Edit_po = fb.group(
    {
      created_by: [this.uid],
      vendorId  : ['', Validators.compose([Validators.required])],
      billFrom  : [null],
      shipFrom  : [null],
      poNo      : [null, Validators.compose([Validators.required])],
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
      tds_percentage:[0],
      tcs_percentage:[0],
      product   : this.fb.array([]),
      bill_id   :[null],
      tax_type  :[null],
      size      : [null],
      deliverytype:[null, Validators.compose([Validators.required])],
      freight     :[null, Validators.compose([Validators.required])],
      delivery_schedule :[null, Validators.compose([Validators.required])],
      prefix      :[null]
    })

    this.bill = fb.group(
      {
        created_by: [this.uid],
        vendorId  : ['', Validators.compose([Validators.required])],
        billFrom  : [null],
        shipFrom  : [null],
        billNo      : [null, Validators.compose([Validators.required])],
        reference_number: [null],
        billDate  : [(new Date()).toISOString().substring(0, 10)],
        paymentTerms: ['', Validators.compose([Validators.required])],
        dueDate   : [(new Date()).toISOString().substring(0, 10)],
        subTotal  : [0],
        shippingCharge: [0],
        tds_percentage :[0],
        tcs_percentage :[0],
        TCS       : [0],
        TDS       : [0],
        roundOff  : [0],
        notes     : [null, Validators.compose([Validators.required])],
        terms_condition: [null, Validators.compose([Validators.required])],
        status    : [1],
        total     : [0],
        product   : this.fb.array([]),
        bill_id   :[null],
        deliverytype:[null, Validators.compose([Validators.required])],
        freight     :[null, Validators.compose([Validators.required])],
        delivery_schedule :[null, Validators.compose([Validators.required])]
      })


      {
        this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530'); // hh:mm:ss a

      this.po_payment =fb.group({
            'created_by': [this.uid],
            receipt_no  : [null],
            tran_mode   : [0, Validators.compose([Validators.required, Validators.min(1)])],
            from_bank   : [null, Validators.compose([Validators.required, Validators.min(1)])],
            to_bank     : [1, Validators.compose([Validators.required, Validators.min(1)])],
            amount      : [0],
            tran_date   : [this.todaysDate],
            reference   : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
            description : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
            prefix      : [null]
          } )
        }

    this.e_way_bill = fb.group({
      vehicle_no:[null,Validators.compose([Validators.required])],
      shipment_mode:[null,Validators.compose([Validators.required])],
    })
  }
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("ewayBill", { static: true }) ewayBill   : ElementRef;
  @ViewChild("delete",{static:true}) delete:ElementRef;
  @ViewChild("delete_item",{static:true}) delete_item:ElementRef;
  @ViewChild("addPayment", { static: true }) addPayment : ElementRef;
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
  loadonce()
  {

    this.api.get('mp_ven_po_pdf.php?value=' + this.view_bill + '&authToken=' + environment.authToken).then((data: any) => {
      console.log(data)
      this.poPdf   = data;
      this.po_id   = data[0].po_id;
      this.poItems = this.poPdf[0].poItems;
      this.status  =  data[0].status;
      this.taxempty=  data[0].tax_mode;
      this.po_number = data[0].po_number;
      this.company_pdf_logo = this.poPdf[0].company_details[0].logo;
      this.stateCode = data[0].place_from_supply_code;
      this.edit_status  = data[0].edit_status
      this.load_paymentTransactiond(data[0].po_id);
      this.company_pdf_logo = environment.baseURL + "download_file.php?path=upload/company/" +  this.company_pdf_logo + "&authToken=" + environment.authToken;

      this.vendor_address(data[0].vendor_id);
    }).catch(error => {
       this.toastrService.error('Something went wrong');
      });
  }
  async LoadVendorBills()
  {
    await this.api.get('mp_po_bill.php?&authToken=' + environment.authToken).then((data: any) =>
    {

      this.VendorBillList = data;
      var selectedId  = this.view_bill;
      let selectedRow = this.VendorBillList.find(item => item.serial_no == selectedId);
      if (selectedRow)
      {
        this.selected = [selectedRow];
        this.po_list=this.selected[0];
       // setTimeout(() => this.scrollToSelectedRow(selectedId), 500);
      }
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorBills'); });
  }

  scrollToSelectedRow(selectedId) {
    const uniqueId = `po-row-${selectedId}`;
    const selectedRow = document.getElementById(uniqueId);
    if (selectedRow) {
      selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }


  onActivate(event)
  {
    if (event.type === "click")
    {console.log(event.row)

      this.po_id   = event.row.po_id
      this.po_list = event.row
      this.name    = event.row.vendor_name;
      this.selectEdit_data();
      this.view_bill = event.row.serial_no;
      this.status   = event.row.status;
      this.e_way_bill.controls['vehicle_no'].setValue(this.po_list.vehicle_number);
      this.e_way_bill.controls['shipment_mode'].setValue(this.po_list.transport_mode);
      this.load_paymentTransactiond(event.row.po_id);
      this.vendor_address(event.row.vendor_id);
    }
  }

  selectEdit_data()
  {
      var serial_no =  this.po_list['serial_no'];

      this.api.get('mp_ven_po_pdf.php?value=' + serial_no + '&authToken=' + environment.authToken).then((data: any) => {
        this.poPdf   = data;
        this.poItems = this.poPdf[0].poItems;
        this.taxempty=data[0].tax_mode;
        this.stateCode = data[0].place_from_supply_code;
        this.company_pdf_logo = this.poPdf[0].company_details[0].logo;
        this.edit_status  = data[0].edit_status
      this.company_pdf_logo = environment.baseURL + "download_file.php?path=upload/company/" +  this.company_pdf_logo + "&authToken=" + environment.authToken
      }).catch(error => {
        this.toastrService.error('Something went wrong 8');
      });

  }

onSelect({ selected }) {

  this.selected.splice(0, this.selected.length);
  this.selected.push(...selected);
  this.show_edit_btn=true;
}
editbill()
{
  this.show_po_edit = true;
  this.show         = false;
  this.edit_dataload();
  this.LoadItemDetails();
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
  let po_id =  this.po_list['po_id'];
  await this.api.get('mp_po_edit_data.php?value=' + po_id + '&authToken=' + environment.authToken).then((data: any) => {
     if(data != null)
       {
         this.po_item     = data[0];
         this.poitem_list = data[0].po_items;
       }
     }).catch(error => { this.toastrService.error('Something went wrong 7'); });

     this.Edit_po.controls['vendorId'].setValue(this.po_list.vendor_id);
     if(this.show_po_edit === true)
     {
      this.FetchAddress(this.po_item);
     }

     if(this.show_po_edit === false)
     {
      this.clone_address(this.po_list.vendor_id);
     }
     this.stateCode = this.po_item.place_from_supply_code;
     if(this.stateCode == 33)
     {
      this.edit_LoadGST('GST');
      this.Edit_po.controls['tax_type'].setValue("GST");
     }
    else
     {
      this.edit_LoadGST('IGST');
      this.Edit_po.controls['tax_type'].setValue("IGST");
     }
     this.load_invoicenumber( this.po_item);
     this.load_invoicenumber( this.po_item);
}

clone_address(id)
{
   this.api.get('get_data.php?table=vendor_address&find=vendor_id&value='+id+'&find1=status&value1=1&authToken=' + environment.authToken).then((data: any) =>
  {
    this.FetchAddress(data)
  }).catch(error => { this.toastrService.error('Something went wrong in Vendor Address'); });

}
async FetchAddress(data)
  {

    if(this.clone_po_show == true && this.show_po_edit == false || this.create_bill_show == true)
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
            this.Edit_po.controls['billFrom'].setValue(this.billFrom);
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
            this.Edit_po.controls['shipFrom'].setValue(this.shipFrom);


          }
        }
      }

    if(this.show_po_edit == true && this.clone_po_show == false)
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
            this.Edit_po.controls['billFrom'].setValue(this.billFrom);
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
            this.Edit_po.controls['shipFrom'].setValue(this.shipFrom);
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
    this.Edit_po.controls["paymentTerms"].setValue(this.payment_terms);
  }

  edit_initProduct()
  {
    let product = this.Edit_po.get('product') as FormArray;
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
    console.log(product.value)
    this.adjustTableHeight()
  }

  async edit_LoadGST(mode)
  {
      await this.api.get('get_data.php?table=tax&find=type&value=' + mode + '&authToken=' + environment.authToken).then((data: any) =>
      {
       this.editGST_Data     = data;
       this.saveGST_data     = data;
       this.editGST_Length   = data.length;
       this.editGST_Length   = data.length;
      }).catch(error => { this.toastrService.error('Something went wrong 6' ); });

        for(let n = 0; n < this.editGST_Length; n++)
        {
          this.editGST_Data[n]['amount'] = 0;
        }
      this.load_editpage();
  }

  async load_paymentTransactiond(id)
{
  this.payment_view = false;
   await this.api.get('get_data.php?table=payment_made&find=po_id&value='+id+'&asign_field=tran_id&asign_value=DESC&authToken=' + environment.authToken).then((data) =>
  {
    this.payment_transaction = data;
    if(data!=null)
    {
       this.balance = this.payment_transaction[0].balance;
       if(this.balance == 0)
       {
        this.payment_view = true;
       }

    }

  }).catch(error => { });
}

load_editpage()
 {

  this.LoadpaymentTerms();
  setTimeout(() => {
  this.name =this.po_list.vendor_name;

  if(this.clone_po_show == false && this.create_bill_show  == false)
  {
   this.Edit_po.controls['poNo'].setValue(this.po_list.po_number);
   this.Edit_po.controls['billDate'].setValue(this.po_list.po_date);
   this.Edit_po.controls['reference_number'].setValue(this.po_list.reference_number);
  }

  this.Edit_po.controls['paymentTerms'].setValue(this.po_list.payment_term);
  this.Edit_po.controls['dueDate'].setValue(this.po_list.bill_due_date);
  this.Edit_po.controls['subTotal'].setValue(0)
  this.Edit_po.controls['shippingCharge'].setValue(this.po_list.transport);
  this.Edit_po.controls['tds_percentage'].setValue(this.po_list.tds_percentage);
  this.Edit_po.controls['tcs_percentage'].setValue(this.po_list.tcs_percentage);
  this.Edit_po.controls['TDS'].setValue(this.po_list.TDS);
  this.Edit_po.controls['TCS'].setValue(this.po_list.TCS);
  this.Edit_po.controls['TDS'].setValue(this.po_list.TDS);
  this.Edit_po.controls['roundOff'].setValue(this.po_list.round_off);
  this.Edit_po.controls['terms_condition'].setValue(this.po_list.terms_condition);
  this.Edit_po.controls['dueDate'].setValue(this.po_list.bill_due_date);
  this.Edit_po.controls['bill_id'].setValue(this.po_list.po_id);
  this.Edit_po.controls['created_by'].setValue(this.uid);
  this.Edit_po.controls['notes'].setValue(this.po_list.note);
  this.Edit_po.controls['deliverytype'].setValue(this.po_list.delivery_type);
  this.Edit_po.controls['freight'].setValue(this.po_list.freight);
  this.Edit_po.controls['delivery_schedule'].setValue(this.po_list.delivery_schdule);
   console.log(this.po_list)
  const product1 = this.Edit_po.get('product') as FormArray;
  product1.clear();
  this.poitem_list.forEach((item,j) => {
    product1.push(this.fb.group({
      type        : "edit",
      id          : [item.po_item_id],
      items       : [item.item_list_id],
      descriptions: [item.item_description],
      taxes       : [item.tax_percent],
      price       : [item.amount],
      quantity    : [item.qty],
      uom         : [item.uom],
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

  for(let m = 0; m < this.poitem_list.length; m++)
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
      this.uom       = data[0].uom;
      this.price     = data[0].price;
      this.quantity  = 1;
      this.amount    = data[0].price;
      this.descriptions = data[0].description;

    }).catch(error => { this.toastrService.error('Something went wrong 5'); });
    const formData = {
      taxes: item,
    }
    this.edit_patchValues(item,j);
    this.edit_SubTotalChange();
    this.edit_GSTCalculation();
  }

  edit_patchValues(id,j)
  {
    let y = (<FormArray>this.Edit_po.controls['product']).at(j);
    y.patchValue({
      taxes        : this.taxes,
      price        : this.price,
      quantity     : this.quantity,
      amount       : this.amount,
      uom          : this.uom,
      descriptions : this.descriptions,
      discount_1   :0,
      discount_2   :0,
    });
  }

  edit_priceChange(qty, price,discount_1,discount_2, j)
  {
    let dis_1=  price - (discount_1/100)*price;
    let dis_2= dis_1 - (discount_2/100)*dis_1;
    this.amount = Number(qty *dis_2).toFixed(2);
    let y       = (<FormArray>this.Edit_po.controls['product']).at(j);
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
    let y       = (<FormArray>this.Edit_po.controls['product']).at(j);
    y.patchValue({
      amount : this.amount
    })
    this.edit_SubTotalChange();
  }

  discount_Change(qty, price,discount_1,discount_2, j)
  {
    let dis_1=  price - (discount_1/100)*price;
    let dis_2= dis_1 - (discount_2/100)*dis_1;
    this.amount = (qty *dis_2).toFixed(2);
    let x = (<FormArray>this.Edit_po.controls['product']).at(j);
    x.patchValue({
      amount : this.amount
    });
    this.edit_SubTotalChange();
  }

edit_GSTCalculation() {

  this.editGST_Data.forEach(data => {
    data.amount = 0;
  });
   this.total_tax = 0
  let products = (<FormArray>this.Edit_po.controls['product']).value;
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
    let edit_arr = this.Edit_po.controls['product'].value;
   let sum1: number = edit_arr .map(a => parseFloat(a.amount)) .reduce((a, b) => a + b, 0);

    this.subtotal = (sum1).toFixed(2);
    this.Edit_po.controls['subTotal'].setValue((sum1).toFixed(2));
     this.edit_GSTCalculation();
     this.edit_FinalTotalCalculation();
     this.tdsCalculation();
     this.tcsCalculation();

  }


  tdsCalculation()
  {
     let subtotal = Number(this.subtotal)
     let tds =  ((subtotal+this.total_tax)*(this.tds_percent/100)).toFixed(2);
     this.Edit_po.controls['TDS'].setValue(tds);
     this.edit_FinalTotalCalculation();
  }

  tcsCalculation()
  {
    let subtotal = Number(this.subtotal)
    let tcs =  ((subtotal+this.total_tax)*(this.tcs_percent/100)).toFixed(2);
    this.Edit_po.controls['TCS'].setValue(tcs);
    this.edit_FinalTotalCalculation();
  }

  edit_FinalTotalCalculation()
  {
    let editSub_Total       = this.Edit_po.controls['subTotal'].value;
    let editTDS_Value       = this.Edit_po.controls['TDS'].value;
    let editTCS_Vale        = this.Edit_po.controls['TCS'].value;
    let editShipping_Value  = this.Edit_po.controls['shippingCharge'].value;
    let editRoundof_Value   = this.Edit_po.controls['roundOff'].value;

    let editTotalGST: number = this.editGST_Data.map(a => parseFloat (a.amount)).reduce(function(a, b)
    {
      return a + b;
    });
    let editTotal_Calculation =  (Number(editSub_Total) - Number(editTDS_Value) + Number(editTCS_Vale) + Number(editShipping_Value) + Number(editRoundof_Value)+ Number(editTotalGST)).toFixed(2);
    this.Edit_po.controls['total'].setValue(editTotal_Calculation);
  }

  item_DeleteId:any
  item_index:any

  edit_onDeleteRow(rowIndex)
  {
    let editproduct=this.Edit_po.get('product') as FormArray;
    const delete_data = editproduct.at(rowIndex).value;
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
    let editproduct=this.Edit_po.get('product') as FormArray;
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

   Delete()
    {
       let editproduct=this.Edit_po.get('product') as FormArray;
        this.api.get('delete_data.php?authToken='+environment.authToken+'&table=po_item&field=po_item_id&id='+this.item_DeleteId).then((data: any) =>
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


  async LoadpaymentTerms()
  {
    await this.api.get('get_data.php?table=payment_terms&authToken=' + environment.authToken).then((data: any) => {
      this.payment_terms=data;
    }).catch(error => { this.toastrService.error('Something went wrong 4'); });
  }

async edit_onSubmit(value)
  {

    let po_id = this.po_list.po_id;
    this.serial_no=this.po_list.serial_no;
       Object.keys(this.Edit_po.controls).forEach(field => {
       const control = this.Edit_po.get(field);
       control.markAsTouched({ onlySelf: true });
       });
       console.log("enter")
       if (this.Edit_po.valid)
         {
          this.loading = true;

          await this.api.post('mp_po_edit_data_submit.php?value='+po_id+'&authToken=' + environment.authToken, value).then((data: any) =>
          {
 console.log("data",data)
            if (data.status == "success")
            {
              this.loading=false;
              this.toastrService.success('PO Updated Succesfully');
              this.Return();
              this.view_bill = this.serial_no;
              this.loadonce();
              this.show_po_edit = false;
            }
            else { this.toastrService.error('Something went wrong 1');
            this.loading=false; }
            return true;
          }).catch(error =>
            {
            this.toastrService.error('Something went wrong 2');
            this.loading=false;
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

    let po_id =this.poPdf[0].po_id;
    await this.fontloader();
    this.api.get('mp_download_po.php?value=' + po_id + '&authToken=' + environment.authToken).then((data: any) => {
        var invoice_data = data;
        this.pdfDownload( invoice_data);
    }).catch(error => { this.toastrService.error('Something went wrong 3'); });

  }

// async pdfDownload(files) {


//  let docDefinition = {
//   info:{
//     title:files[0].po_number,
//   },
//    content: [

//      this.getCompanyDetails(files),
//      this.getMobileDetails(files),
//     //  this.getGstObject(files),
//      {
//        table: {
//          widths: ['*'],
//          body: [
//            [


//                  { text: ' PURCHASE ORDER', fontSize: 11, bold: true, alignment: 'center' ,fillColor: '#c4d69b' ,  },


//            ],
//          ]
//        },
//        layout: {
//          layout: 'lightHorizontalLines',
//          hLineWidth: function (i, node) {
//            return (i === 1 || i === node.table.body.length) ? 1 : 0;
//          },
//        },
//      },
//      this.getPoNo(files),
//     this. getBillToObject(files),
//     this.getBillShipObject(files),
//     //  this.getInvoiceObject(files),
//     //  this.getBillObject(files),
//      this.getItemsObject(files),
//      this.getItemstotalObject(files),
//     this.getTotalWords(files),
//     //  this.getBankObject(files),
//      this.getTermsObject(files),
//    ],

//    defaultStyle: {
//     font: 'Roboto', // Use the registered font name here,

//   },
// };
//  pdfMake.createPdf(docDefinition).open();
// // pdfMake.createPdf(docDefinition).download("invoice.pdf");

// }


async pdfDownload(files) {
  let test = files[0];

  let docDefinition = {
    info: {
      title: test.po_number,
    },
    content: [
      {
              stack: [
                    this.getCompanyDetails(files),
                    this.getMobileDetails(files),
                    {
                      table: {
                        widths: ['*'],
                        body: [
                          [
                            { text: ' PURCHASE ORDER', fontSize: 11, bold: true, alignment: 'center', fillColor: '#c4d69b' },

                          ],

                        ]

                      },
                       layout: {
                          // Horizontal lines: only top and bottom of the table
                          hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 1 : 0;
                          },
                          // Vertical lines: remove completely
                          vLineWidth: function (i, node) {
                            return 0;
                          }
                      }
                    },
                    this.getPoNo(files),
                    this.getBillToObject(files),
                    this.getBillShipObject(files),
                    this.getItemsObject(files),
                    this.getItemstotalObject(files),
                    this.getTotalWords(files),
                    this.getTermsObject(files), // ✅ now only terms
              ],
        }
      ],
        footer: function(currentPage, pageCount) {
              return {
                columns: [
                  { text: 'For ' + test.company_name, alignment: 'right', margin: [0, 0, 40, 25],  fontSize: 8 },
                  { text: 'Page ' + currentPage + ' of ' + pageCount, alignment: 'left', margin: [40, 0, 0, 20], fontSize: 8 }
                ]
              };
            },
            defaultStyle: {
            font: 'Roboto',
            },
       background: function () {

                  return {
                    canvas: [
                      {
                        type: 'rect',
                        x: 39,
                        y: 40,
                        w: 517,
                        h: 761,
                        r: 0,
                        lineColor: 'lightblack',
                        lineWidth: 0
                      }
                    ]
                  };
                }
  };

  pdfMake.createPdf(docDefinition).open();
}


getCompanyDetails(files) {
 var test = files[0].company_details[0];

 return {
   table: {
     widths: ['*'],
     body: [
       [
         [
           { image: this.imageToShow, width: 250, alignment: 'center', rowSpan: 2, },
           '',
           { text: ""+test.address_1+","+test.address_2+","+test.city+"-"+test.pincode, fontSize: 9,  alignment: 'center',color: '#668cff' },
           { text: test.website, border: [false, false, false, false], fontSize: 10,  alignment: 'center',color: '#668cff' }
         ],
       ],
     ],
   },
      layout: {
     hLineWidth: function (i, node) {
       return (i === 0 || i === node.table.body.length) ? 1 : 0;
     },
      vLineWidth: function (i, node) {
        return 0; // remove vertical lines
    },
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
           [{ text: test.mobile, border: [false, false, false, false], color: '#668cff', fontSize: '10', alignment: 'center' },]
         ],
       ],
     ]
   },
   layout: {
     hLineWidth: function (i, node) {
       return (i === 1 || i === node.table.body.length) ? 0 : 0;
     },
       vLineWidth: function (i, node) {
        return 0; // remove vertical lines
    },
   },
 }
}

getGstObject(files) {

 var test = files[0];

 return {
   table: {
     widths: ['*', '*'],
     body: [
       [
         [
           { text: 'GSTIN :' + test.gst_number, fontSize: 10, bold: true, alignment: 'center' },
         ],
         [{ text: 'UDYAM : ' + test.company_udyam, fontSize: 10, bold: true, alignment: 'center' }]
       ],
     ]
   },
 }

}

getPoNo(files) {
  var test = files[0];
  const today = new Date(test.po_date);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedDate = today.toLocaleDateString('en-US', options);

  return {
    table: {
      widths: ['*', '*'],
      body: [
        [
          {
            text: 'P.O No :' + test.po_number,
            fontSize: 10,
            bold: true,
            alignment: 'left',
            fillColor: '#c4d69b', // ✅ works now
          },
          {
            text: formattedDate,
            fontSize: 10,
            bold: true,
            alignment: 'right',
            fillColor: '#c4d69b', // ✅ works now
          },
        ],
      ],
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 1 || i === node.table.body.length) ? 1 : 0;
      },
     vLineWidth: function (i, node) {
        return 0; // remove vertical lines
    },
    },
  };
}


getInvoiceObject(files) {

 var test = files[0];
 return {

   table: {
     widths: ['*', '*'],
     body: [
       [
         {
           columns: [
             [
               { text: 'PO No :', fontSize: 10 },
               { text: 'PO Date :', fontSize: 10 },
               { text: 'State: ', fontSize: 10 },
               { text: 'Pin Code : ', fontSize: 10 },
             ],
             [
               { text: test.po_number, fontSize: 10 },
               { text: test.po_date, fontSize: 10 },
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
               { text: 'Place of Supply :', fontSize: 10 },
               { text: 'P.O ref No :', fontSize: 10 },

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

getBillToObject(files) {

 var test = files[0]
var testcompany_details = files[0].company_details[0]
 return {
   table: {
     widths: ['*', '*'],
     body: [
       [
          {
            stack: [
              { text: 'To ,', bold: true, fontSize: 10 },
              { text: test.bill_attention, bold: true, fontSize: 8 },
              { text: test.bill_address_line_1 + ' , ' + test.bill_address_line_2, fontSize: 8 },
              { text: test.bill_city + '-' + test.bill_zip_code, fontSize: 8 },
              { text: 'GST NO : ' + test.vendor_gst, fontSize: 9, bold: true },
            ],
            border: [false, false, true, true] // vertical line on the right
          },

          // Right column
          {
            columns: [
              [
                { text: 'Our GSTIN', fontSize: 8, border: [false, false, false, false] },
                { text: 'Our PAN No', fontSize: 8, border: [false, false, false, false] },
                { text: 'Range & Division', fontSize: 8, border: [false, false, false, false] },
              ],
              [
                { text: ': ' + testcompany_details.gst_number, fontSize:8, border: [false, false, false, false] },
                { text: ': ' + testcompany_details.pan_number, fontSize: 8, border: [false, false, false, false] },
                { text: ': ' + test.range_division, fontSize: 8, border: [false, false, false, false] },
              ]
            ],
            border: [false, false, false, true] // no vertical line on left
          }
       ],
     ]
   },
       layout: {
      hLineWidth: function(i, node) {
        return (i === 0 || i === node.table.body.length) ? 1 : 0; // top/bottom only
      },
      // vLineWidth: function(i, node) {
      //   return 0; // remove all other vertical lines
      // },
      // paddingLeft: function(i, node) { return 2; },
      // paddingRight: function(i, node) { return 2; },
      // paddingTop: function(i, node) { return 2; },
      // paddingBottom: function(i, node) { return 2; }
    }
 }
}

getBillShipObject(files) {

 var test = files[0]
var testcompany_details = files[0].company_details[0]
 return {
   table: {
     widths: ['*', '*'],
     body: [
       [
        {
            stack:
         [
           { text: 'Delivery Address : ,', bold: true, fontSize: 10 },
           { text: test.ship_attention, bold: true, fontSize: 8 },
           { text: test.ship_address_line_1+' , '+test.ship_address_line_2, fontSize: 8 },
          //  { text: test.bill_address_line_2, fontSize: 10 },
          //  { text: test.vendor_udyam ? 'Udyam No :'+test.vendor_udyam : '', fontSize: 10 ,bold:true},
          //  { text: 'State :' + test.bill_state, fontSize: 10, bold: true },
           { text:test.ship_city+ '-' + test.ship_zip_code, alignment: 'left', fontSize: 8 },
         ],
         border: [false, false, true, false] // vertical line on the right
          },
         {
           columns: [
             [
                { text: 'Mode Of Transport   ' , fontSize: 8, border: [false, false, false, false] },
                { text: 'Delivery Type ' , fontSize: 8, border: [false, false, false, false] },
                { text: 'Ref ' , alignment: 'left', fontSize: 8,border: [false, false, false, false] },
             ],
              [
               { text: ': '+test.shipment_mode, fontSize: 8,border: [false, false, false, false] },
               { text: ': '+test.delivery_type, fontSize: 8 ,border: [false, false, false, false]},
               { text: ': '+test.reference_number, fontSize: 8 ,border: [false, false, false, false]},
             ]
           ],
            border: [false, false, false, false]
         },
       ],
     ]
   },
   layout: {
     layout: 'lightHorizontalLines',
     hLineWidth: function (i, node) {
       return (i === 0 || i === node.table.body.length) ? 1 : 0;
     },
    //   vLineWidth: function (i, node) {
    //     return 0; // remove vertical lines
    // },
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
           { text: 'GST NO :' + test.vendor_gst, fontSize: 10, bold: true },
           { text: test.vendor_udyam ? 'Udyam No :'+test.vendor_udyam : '', fontSize: 10 ,bold:true},
           { text: 'State :' + test.bill_state, fontSize: 10, bold: true },
           { text: 'Pin Code :' + test.bill_zip_code, alignment: 'left', bold: true, fontSize: 10 },
         ],
         {
           columns: [
             [{ text: 'Ship to party:', bold: true, fontSize: 10 },
             { text: test.ship_attention, bold: true, fontSize: 10 },
             { text: test.ship_address_line_1, fontSize: 10 },
             { text: test.ship_address_line_2, fontSize: 10 },
             { text: 'GST NO :' + test.vendor_gst, fontSize: 10, bold: true },
             { text: 'State :' + test.ship_state, fontSize: 10, bold: true },
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
     vLineWidth: function (i, node) {
        return 0; // remove vertical lines
    },
   },
 }
}

getItemsObject(files) {

  var test = files[0].poItems;
  var serialNumber = 1;
  if(files[0].place_of_supply_code == 33)
  {
  return {
  table: {
    widths: [20, 170, 63,41, 41,50,66],
    body: [
      [
         { text: '#', border: [false, true, true, false],fillColor: '#99ffff', fontSize: 8, bold: true , alignment: 'center'},
          { text: 'Product Description', alignment: 'center',fillColor: '#99ffff', border: [true, true, true, false], fontSize: 8, bold: true },
          { text: 'HSN', border: [true, true, true, false],fillColor: '#99ffff', fontSize: 8, bold: true , alignment: 'center'},
          { text: 'QTY', border: [true, true, true, false],fillColor: '#99ffff', fontSize: 8, bold: true, alignment: 'center' },
          { text: 'UOM', border: [true, true, true, false],fillColor: '#99ffff', fontSize: 8, bold: true, alignment: 'center' },
          { text: "Unit Rate", border: [true, true, true, false],fillColor: '#99ffff', fontSize: 8, bold: true, alignment: 'center' },
         { text: 'Amount', border: [true, true, false, false],fillColor: '#99ffff', fontSize: 8, bold: true ,alignment: 'center'},
      ],
      [
        { text: '',fillColor: '#99ffff', border: [false, false, true, false] },
        { text: '',fillColor: '#99ffff', border: [true, false, true, false] },
        { text: '', fillColor: '#99ffff',border: [true, false, true, false] },
        { text: '', fillColor: '#99ffff',border: [true, false, true, false] },
        { text: '', fillColor: '#99ffff',border: [true, false, true, false] },
        { text: '', fillColor: '#99ffff',border: [true, false, true, false] },
        { text: '',fillColor: '#99ffff', border: [true, false, false, false], bold:true},
      ],
      ...test.map((ed, index) => {
          let cellBorder = [false, true, true, false];
            if (index > 0) {
              cellBorder = [false, true, true, false];
            }

        return [
          { text:  serialNumber++,border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: [{ text: ed.item_name,bold: true },{ text: '\n' }, { text: ed.item_description },], border: cellBorder, fontSize: 9, alignment: 'left' },
          { text: ed.hsn,border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.qty,border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.uom,border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 8 , alignment: 'center'},
          { text: ed.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'), border: [true, true, false, false], fontSize: 8,  alignment: 'right'}]


        },

        )
      ],
    },
  //    layout: {
  //    layout: 'lightHorizontalLines',
  //    hLineWidth: function (i, node) {
  //      return (i === 0 || i === node.table.body.length) ? 0 : 0;
  //    },
  //    vLineWidth: function (i, node) {
  //       return 0; // remove vertical lines
  //   },
  //  },
    }
  }

  if(files[0].place_of_supply_code != 33)
    {
    return {
    table: {
      widths: [20, 170, 63,41, 41,50,66],
      body: [
        [
          { text: '#', border: [false, true, true, false],fillColor: '#99ffff', fontSize: 8, bold: true , alignment: 'center'},
          { text: 'Product Description', alignment: 'center',fillColor: '#99ffff', border: [true, true, true, false], fontSize: 8, bold: true },
          { text: 'HSN', border: [true, true, true, false],fillColor: '#99ffff', fontSize: 8, bold: true , alignment: 'center'},
          { text: 'QTY', border: [true, true, true, false],fillColor: '#99ffff', fontSize: 8, bold: true, alignment: 'center' },
          { text: 'UOM', border: [true, true, true, false],fillColor: '#99ffff', fontSize: 8, bold: true, alignment: 'center' },
          { text: "Unit Rate", border: [true, true, true, false],fillColor: '#99ffff', fontSize: 8, bold: true, alignment: 'center' },
          { text: 'Amount', border: [true, true, false, false],fillColor: '#99ffff', fontSize: 8, bold: true ,alignment: 'center'},
        ],
        [
          { text: '',fillColor: '#99ffff', border: [false, false, true, false] },
          { text: '',fillColor: '#99ffff', border: [true, false, true, false] },
          { text: '', fillColor: '#99ffff',border: [true, false, true, false] },
          { text: '', fillColor: '#99ffff',border: [true, false, true, false] },
          { text: '', fillColor: '#99ffff',border: [true, false, true, false] },
          { text: '', fillColor: '#99ffff',border: [true, false, true, false] },
          { text: '',fillColor: '#99ffff', border: [true, false, false, false], bold:true},
        ],
        ...test.map((ed, index) => {
            let cellBorder = [false, true, true, false];
            if (index > 0) {
              cellBorder = [false, true, true, false];
            }

          return [
            { text:  serialNumber++,border:cellBorder, fontSize: 8 , alignment: 'center', italics:true},
            { text: [{ text: ed.item_name,bold: true },{ text: '\n' }, { text: ed.item_description },], border: cellBorder, fontSize: 8, alignment: 'left', italics:true },
            { text: ed.hsn,border:cellBorder, fontSize: 8 , alignment: 'center', italics:true},
            { text: ed.qty,border:cellBorder, fontSize: 8 , alignment: 'center', italics:true},
            { text: ed.uom,border:cellBorder, fontSize: 8 , alignment: 'center', italics:true},
            { text: ed.amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 8 , alignment: 'center', italics:true},
            { text: ed.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'), border: [true, true, false, false], fontSize: 8,  alignment: 'right', italics:true}]
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
        { text: 'Total Amount Before Tax', fontSize: 8, italics:true, colSpan: 11, alignment: 'right' ,border:[false, true, true, false]},
        '', '', '', '', '', '', '', '', '', '',
        { text: without_tax, fontSize: 8 ,alignment: 'right',border: [true, true, false, false], italics:true}
      ],

    ];

      if(files[0].place_of_supply_code != 33)
      {
          if (tax.tax_5 > 0) {
            rows.push([
              { text: 'GST (5%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text: tax_5, fontSize: 8 ,alignment: 'right',border: [true, true, false, false], italics:true}
            ]);
          }

          if (tax.tax_12 > 0) {
            rows.push([
              { text: 'GST (12%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text: tax_12, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true}
            ]);
          }

          if (tax.tax_18 > 0) {
            rows.push([
              { text: 'GST (18%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text: tax_18, fontSize: 8, alignment: 'right' ,border: [true, true, false, false], italics:true}
            ]);

          }

          if (tax.tax_28 > 0) {
            rows.push([
              { text: 'GST (28%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text:tax_28, fontSize: 8, alignment: 'right',border: [true, true, false, false] , italics:true}
            ]);
          }
          if (test.transport > 0) {
            rows.push([
              { text: 'Shipping Charge', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text:transport, fontSize: 8, alignment: 'right' ,border: [true, true, false, false], italics:true}
            ]);
          }
          if (test.tds > 0) {
              rows.push([
                { text: 'TDS('+test.tds_percent+'%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
                '', '', '', '', '', '', '', '', '', '',
                { text:tds, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true }
              ]);
            }

          if (test.tcs > 0) {
            rows.push([
              { text: 'TCS('+test.tcs_percent+'%)', fontSize: 8, colSpan: 11, alignment: 'right',border:[false, true, true, false], italics:true },
              '', '', '', '', '', '', '', '', '', '',
              { text:tcs, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true }
            ]);
          }
          rows.push([

              { text: 'Round off',  fontSize: 8, colSpan: 11, alignment: 'right',border:[false, true, true, false], italics:true },
              '', '', '', '', '', '', '', '', '', '',
              { text: round_off, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true }
            ],
            [
              { text: 'Total', fontSize: 8, colSpan: 11, italics:true, alignment: 'right',border:[false, true, false, false]  },
              '', '', '', '', '', '', '', '', '', '',
              { text: total, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true }
            ]);
          }

      if(files[0].place_of_supply_code == 33)
      {

         const tax_5      =  (tax.tax_5/2).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
          const tax_12    =  (tax.tax_12/2).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
          const tax_18    =  (tax.tax_18/2).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
          const tax_28    =  (tax.tax_28/2).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
          if (tax.tax_5 > 0) {
            rows.push([
              { text: 'CGST (2.5%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text: tax_5, fontSize: 8 ,alignment: 'right',border: [true, true, false, false], italics:true}
            ]);

            rows.push([
              { text: 'SGST (2.5%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text: tax_5, fontSize: 8 ,alignment: 'right',border: [true, true, false, false], italics:true}
            ]);
          }

          if (tax.tax_12 > 0) {
            rows.push([
              { text: 'CGST (6%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text: tax_12, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true}
            ]);
            rows.push([
              { text: 'SGST (6%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text: tax_12, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true}
            ]);
          }

          if (tax.tax_18 > 0) {
            rows.push([
              { text: 'CGST (9%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text: tax_18, fontSize: 8, alignment: 'right' ,border: [true, true, false, false], italics:true}
            ]);
           rows.push([
              { text: 'SGST (9%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text: tax_18, fontSize: 8, alignment: 'right' ,border: [true, true, false, false], italics:true}
            ]);

          }

          if (tax.tax_28 > 0) {
            rows.push([
              { text: 'CGST (14%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text:tax_28, fontSize: 8, alignment: 'right',border: [true, true, false, false] , italics:true}
            ]);
             rows.push([
              { text: 'SGST (14%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text:tax_28, fontSize: 8, alignment: 'right',border: [true, true, false, false] , italics:true}
            ]);
          }
          if (test.transport > 0) {
            rows.push([
              { text: 'Shipping Charge', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
              '', '', '', '', '', '', '', '', '', '',
              { text:transport, fontSize: 8, alignment: 'right' ,border: [true, true, false, false], italics:true}
            ]);
          }
          if (test.tds != 0) {
              rows.push([
                { text: 'TDS('+test.tds_percent+'%)', fontSize: 8, colSpan: 11, alignment: 'right' ,border:[false, true, true, false], italics:true},
                '', '', '', '', '', '', '', '', '', '',
                { text:tds, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true }
              ]);
            }

          if (test.tcs !=0 ) {
            rows.push([
              { text: 'TCS('+test.tcs_percent+'%)', fontSize: 8, colSpan: 11, alignment: 'right',border:[false, true, true, false], italics:true },
              '', '', '', '', '', '', '', '', '', '',
              { text:tcs, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true }
            ]);
          }
          rows.push([

              { text: 'Round off',  fontSize: 8, colSpan: 11, alignment: 'right',border:[false, true, true, false], italics:true },
              '', '', '', '', '', '', '', '', '', '',
              { text: round_off, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true }
            ],
            [
              { text: 'Total', fontSize: 8, colSpan: 11, italics:true, alignment: 'right',border:[false, true, false, false]  },
              '', '', '', '', '', '', '', '', '', '',
              { text: total, fontSize: 8, alignment: 'right',border: [true, true, false, false], italics:true }
            ]);
          }
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
            border: [false, true, false, true],
            fontSize: 9,
            alignment: 'right',
            italics:true
          }
        ]
      ]
   },

 };
}



getTermsObject(files) {
 var test = files[0]
var value =files[0]
 return {
   table: {
     widths: ['*', '*'],
     body: [
        [
          // Left column
          {
            stack: [
               { text: 'Deliverd Schedule :'+test.delivery_schdule , margin: [0, 10, 0, 0], bold: true,italics:true, fontSize: 8, alignment: 'left', border: [false, false, false, false] },
              { text: 'Freight :'+test.freight, margin: [0, 35, 0, 0], bold: true, italics: true, fontSize: 8, alignment: 'left', border: [false, false, false, false] },
              { text: 'For ' + test.company_name, margin: [0, 10, 0, 0], bold: true, fontSize: 8, alignment: 'left', border: [false, false, false, false] },
              { text: 'Authorised Signatory', margin: [0, 35, 0, 0], bold: true, italics: true, fontSize: 8, alignment: 'left', border: [false, false, false, false] }
            ],
            border: [false, false, false, false]
          },

          // Right column
          {
            stack: [
              { text: 'Terms of Payment :',margin: [0, 10, 0, 0], bold: true, fontSize: 8, alignment: 'left', border: [false, false, false, false] },
              { text: value.terms_conditions, margin: [0, 5], fontSize: 8, alignment: 'left', border: [false, false, false, false] },

            ],
            border: [false, false, false, false]
          }
        ]
      ]
   },
 }
}



 cancel()
 {
   this.show_po_edit = false;
   this.show=true;
   this.clone_po_show=false;
 }

 cancel_1()
 {
  this.show_po_edit = false;
  this.show=true;
  this.clone_po_show=false;
  this.create_bill_show=false;
 }


 clone()
 {
   this.clone_po_show = true;
   this.show_po_edit=false;
   this.show = false;
   this.edit_dataload();
   this.LoadItemDetails();
   this.selectEdit_data()

 }

 po_prefix:any
 async load_invoicenumber(id)
{
   this.details =id
 await  this.api.get('mp_po.php?&value=' + this.details.vendor_id+ '&authToken=' + environment.authToken).then((data: any) =>
 {
    this.serial_no         = data;
    let po_id              = data[0].serial_no + 1;
    this.po_prefix         = data[0].prefix ;
     this.inv_no           =  po_id;
     this.view_bill        = po_id;

     this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530'); // hh:mm:ss a
     if(this.clone_po_show == true)
     {
       this.Edit_po.controls['poNo'].setValue(this.inv_no);
       this.Edit_po.controls['billDate'].setValue(this.todaysDate);
     }
 }).catch(error => { this.toastrService.error('Something went wrong 12') });
}

async onSubmit(bill_data)
 {
   Object.keys(this.Edit_po.controls).forEach(field => {
     const control = this.Edit_po.get(field);
     control.markAsTouched({ onlySelf: true });
   });
   if (this.Edit_po.valid)
   {
    const billNoValue = this.po_prefix+this.inv_no;
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
          this.loading = true;
          await this.api.post('mp_po_create.php?type=new_po&authToken=' + environment.authToken, bill_data).then((data: any) =>
          {

            if (data.status == "success")
            {
              this.toastrService.success('PO Added Succesfully');
              this.loading = false;
              this.Return();
              this.show_po_edit = false;
              this.show = true;
              this.loadonce()
              this.clone_po_show = false;
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
        else {
          this.toastrService.error('PO number was already exist');
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
    this.api.get('get_data.php?table=po&find=po_id&value='+this.po_id+'&authToken=' + environment.authToken).then((data: any) => {

      this.e_way_bill.controls['vehicle_no'].setValue(data[0].vehicle_number);
      this.e_way_bill.controls['shipment_mode'].setValue(data[0].transport_mode);
     }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  async billSubmit(value)
  {

    let po_id =this.poPdf[0].po_id;
    this.view_bill =this.po_list.serial_no;

    await this.api.post('mp_po_create.php?po_id='+po_id+'&type=e_way&authToken=' + environment.authToken, value).then((data: any) =>
    {
      if (data.status == "success")
      {
        this.toastrService.success('Added Succesfully');
        this.loading = false;
        this.Return();
        this.show_po_edit = false;
        this.show = true;
        this.loadonce()
        this.clone_po_show = false;
        this.new_category_id.close();

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

  async remove()
  {
    this.openMd = this.modalService.open(this.delete, { size: 'md' });
  }
  async ReqDelete()
  {
    let po_id =this.poPdf[0].po_id;
    await this.api.post('mp_delete_invoice.php?table=po&field=po_id&delete_id='+po_id+'&authToken=' + environment.authToken,po_id).then((data: any) =>
    {
      if (data.status == "success")
      {
               this.view_bill=data.id;
               this.toastrService.success('Deleted Succesfully');
               this.loading = false;
               this.Return();
               this.show_po_edit = false;
               this.show = true;
               this.loadonce()
               this.clone_po_show = false;
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

  addbill()
  {
    this.create_bill_show  = true;
      this.clone_po_show   = false;
      this.show_po_edit    = false;
      this.show            = false;
      this.edit_dataload();
      this.LoadItemDetails();
      this.selectEdit_data();
      this.load_billnumber()
 }


 async load_billnumber()
 {
    await this.api.get('get_data.php?table=bill&asign_field=bill_id&asign_value=DESC&authToken=' + environment.authToken).then((data: any) =>
    {
      if(data != null)
      {
      this.bill_list  = data[0].serial_no;
      this.total_bill = data;
      }
      else{
        this.bill_list = 0
      }

    }).catch(error => { this.toastrService.error('Something went wrong'); });

    await this.api.get('get_data.php?table=prefix&authToken=' + environment.authToken).then((data: any) =>
    {
        this.prefix=data[0];
    }).catch(error => { this.toastrService.error('Something went wrong'); });

      let bill_no              = this.bill_list+ 1;
      console.log("bill_list",this.bill_list)
      var invoiceprifix        = this.prefix.bill_year ;

       this.new_bill            =  bill_no;
       this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530'); // hh:mm:ss a

       if(this.create_bill_show == true)
       {

         this.Edit_po.controls['poNo'].setValue(this.new_bill);
         this.Edit_po.controls['billDate'].setValue(this.todaysDate);
         this.Edit_po.controls['reference_number'].setValue(this.po_list.po_number);
       }

  }

  async billcreate(bill)
  {
    this.view_bill =this.poPdf[0].serial_no;
    Object.keys(this.Edit_po.controls).forEach(field => {
      const control = this.Edit_po.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    if (this.Edit_po.valid)
    {
      const billNoValue = this.new_bill;
      if(this.total_bill != null)
        {
         var value = this.total_bill.find(item => item.bill_number === billNoValue);
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
           bill.po_number = this.po_list.po_number
             this.loading = true;
              await this.api.post('mp_po_to_bill.php?po_id='+this.po_id+'&authToken=' + environment.authToken, bill).then((data: any) =>
              {
                console.log(data)
                if (data.status == "success")
                {
                  this.toastrService.success('Bill Added Succesfully');
                  this.loading = false;
                  this.show_po_edit = false;
                  this.show = true;
                  this.create_bill_show = false;
                  this.clone_po_show =false;
                  this.loadonce()
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
    else
    {
      this.toastrService.error('Please Fill All Details');
     }
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
      this.Edit_po.controls['billFrom'].setValue(this.billFrom);
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
      this.Edit_po.controls['shipFrom'].setValue(this.shipFrom);

    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  onInputChange()
  {
    const billNoValue = this.inv_no;
    let value = this.VendorBillList.find(item => item.po_number === billNoValue);
       if(value != undefined)
       {
        this.toastrService.error('PO number has already been entered')
       }
       if(value == undefined)
       {
       }
  }


  onInputbillChange() {
    const billNoValue = this.new_bill;

    if (Array.isArray(this.total_bill)) {
      let value = this.total_bill.find(item => item.bill_number === billNoValue);

      if (value !== undefined) {
        this.toastrService.error('Bill number has already been entered');
      }

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
  this.po_payment.controls['receipt_no'].setValue(serial_no);
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

  async openpop()
  {
    this.add_payment = this.modalService.open(this.addPayment, { size: 'md' });
    this.name =this.po_list.vendor_name;
      if(this.payment_transaction!=null)
      {
        this.balance = this.payment_transaction[0].balance;
        var amount  =  this.balance;
      }
       else{
        var amount  =  this.poPdf[0].total;

       }
    this.po_payment.controls['to_bank'].setValue(this.name);
    this.po_payment.controls['amount'].setValue(amount);
    this.po_payment.controls['description'].setValue(this.po_number);
  }

  async AddNewTrans(data)
  {
    let po_id =this.po_list.po_id;
    let amount =this.po_list.total;

    if(this.payment_transaction != null)
      {
        let balance = this.payment_transaction[0].balance;
        var last_total  =  balance;
      }
       else
       {var last_total  =  this.poPdf[0].total; }

       Object.keys(this.po_payment.controls).forEach(field => {
        const control = this.po_payment.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    if (this.po_payment.valid)
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

       if(last_total >= data.amount)
       {
          this.loading=true;
              await this.api.post('mp_po_payment_made.php?value='+po_id+'&amount='+amount+'&authToken=' + environment.authToken, data).then((data: any) =>
              {
                if(data.status == "success")
                  {
                    this.toastrService.success('Transaction Succesfully');
                    this.po_payment.controls['tran_mode'].reset(0);
                    this.po_payment.controls['from_bank'].setValue(1);
                    this.po_payment.controls['to_bank'].setValue('');
                    this.po_payment.controls['reference'].reset();
                    this.po_payment.controls['description'].reset();
                    this.po_payment.controls['amount'].setValue(0);
                    this.add_payment.close();
                    this.loading=false;
                   this. load_paymentTransactiond(po_id) }
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

}
