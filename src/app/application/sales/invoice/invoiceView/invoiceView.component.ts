import { Component, OnInit, ViewChild , Renderer2, ElementRef, HostListener} from '@angular/core';
import { DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from "../../../../service/api.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../../../environments/environment";
import { Router } from '@angular/router';
import { FormControl, FormGroup,FormBuilder, FormArray, Validators } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ScriptService } from 'src/app/service/script.service';
import { ImgToBase64Service } from "src/app/service/img-to-base64.service";
import { InvoiceItem} from "../../class/invoiceItem";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { stringify } from 'querystring';
import { json } from 'd3';
import { AppState } from 'src/app/app.state';
declare let $: any;


pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  'Roboto': {
    //normal: 'https://fonts.googleapis.com/css?family=Roboto',
    normal:'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-Italic.ttf'
  }
};

@Component({
  selector   : 'app-invoiceView',
  templateUrl: './invoiceView.component.html',
  styleUrls  : ['./invoiceView.component.scss']
})
export class InvoiceViewComponent implements OnInit {
  public router: Router;

  SelectionType     = SelectionType;
  selected          = [];
  invoicePdf        = [];
  all_account       = [];
  user_account      = [];
  company_account   = [];
  cash_account      = [];
  gst_account       = [];
  invoiceItems      : [];

  show_new_bill             : boolean = false;
  loading                   : boolean = false;
  show                      : boolean = true;
  show_edit_btn             : boolean = false;
  show_invoice_edit         : boolean = false;
  public formShow           : boolean = true;
  clone_invoice_show        : boolean = false;
  payment_view              : boolean = true;

  dc_numbers                : any;
  advance_list              : any;
  subtotal                  : any;
  openMd                    : any;
  fontFace                  : any;
  CustomerBillList          : any;
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

  balance                   : any;
  prefix                    : any;
  receipt_serial_no         : any;
  amount                    : any;
  descriptions              : any;
  invoiceDate               : any;
  followingDay              : any;
  day                       : any;
  month                     : any;
  year                      : any;
  fullDate                  : any;
  dueValues                 : any = 0;
  prefix_data               : any
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
  alldata1                  : any;

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
  invoice_id                : any;

  customer_id               : any;
  ItemList                  : any;
  ProjectList               : any;
  editGST_Data              : any;
  editGST_Length            : any;
  invoice_item              : any;
  invoiceitem_list          : any;
  selectdata                : any;
  invoice_list              : any;
  name                      : any;
  GST_Data                  : any;
  GST_Length                : any;
  edit_ItemList             : any;
  invoice_type              : any;
  invoiceCustDetails        : any;
  add_payment               : any;
  payment_transaction       : any;
  bankData                  : any;
  bankData_length           : any;
  inv_no                    : any;
  details                   : any;
  new_category_id           : any;
  alldata                   : any;
  invoice_number            : any;
  type_id                   : any;
  payment_term              : any;
  tds_percent               : any;
  tcs_percent               : any;
  tds_data                  : any;
  tcs_data                  : any;
  taxempty                  : any;
  uom                       : any;
  total_tax                 : any;
  Dispatch_items            : any;
  Dispatch_total            : any;
  Dispatch_percentage       : any;
  Difference_amount         : any;

  clone_invoice             : FormGroup;
  Edit_invoice              : FormGroup;
  invoice_payment           : FormGroup;
  e_way_bill                : FormGroup;
  advance                   : FormGroup;
  imageToShow               : string | ArrayBuffer;
  today                     = new Date();
  todaysDate                = '';
  item_index                : any;
  status                    : any;
  private startX      : number = 0;
  private startWidth  : number = 0;
  private columnIndex : number | null = null;
  private resizing    = false;
  tableWidth          : any= 100 ;
  originalTableHeight : any
  private dropdownOpen = false;
  imgUrl: string = '../../../../assets/img/logo/geogreen.png';
 // imgUrl: string =  'https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=http://ppvgroups.org/test.php?id=100001';

  invoiceItem = new InvoiceItem();
  public view_invoice  = localStorage.getItem('view_bill');
  public uid           = localStorage.getItem('uid');
  public user          = localStorage.getItem('type');
  public user_bank_id  = localStorage.getItem('bank_id');
 selectedDCs: any[] = [];  // instead of null
  temp: any[] = [];

  dropdownSettings = {
    singleSelection: false,
    idField: 'dc_id',
    textField: 'dc_number',
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    enableCheckAll: false
  };

  @ViewChild("delete",{static:true}) delete:ElementRef;
  @ViewChild('tableResponsive', { static: false }) tableResponsive: ElementRef;
  @ViewChild("delete_item",{static:true}) delete_item:ElementRef;
  @ViewChild("delete_item_dc",{static:true}) delete_item_dc:ElementRef;
  constructor(private api: ApiService, private modalService: NgbModal, private imgToBase64: ImgToBase64Service, public toastrService: ToastrService,
    router:Router, public fb: FormBuilder,private scriptService: ScriptService, private renderer: Renderer2,private _state : AppState)
    {

  this.Edit_invoice = fb.group(
    {
      created_by: [this.uid],
      customerId: ['', Validators.compose([Validators.required])],
      billFrom  : [''],
      shipFrom  : [null],
      invoiceNo : [null, Validators.compose([Validators.required])],
      reference_number: [null],
      billDate  : [(new Date()).toISOString().substring(0, 10)],
      paymentTerms: ['', Validators.compose([Validators.required])],
      dueDate   : [(new Date()).toISOString().substring(0, 10)],
      subTotal  : [0],
      shippingCharge: [0],
      TCS       : [0],
      TDS       : [0],
      tds_percentage:[0],
      tcs_percentage:[0],
      tax_type  :[null],
      roundOff  : [0],
      notes     : [null, Validators.compose([Validators.required])],
      terms_condition: [null, Validators.compose([Validators.required])],
      status    : [1],
      total     : [0],
      product   : this.fb.array([]),
      invoice_id: [null],
      inv_type  : [null],
      size      : [null],
      dc_data   : [null],
      prefix    : [null],

    })

    this.clone_invoice = fb.group(
      {
        created_by: [this.uid],
        customerId: ['', Validators.compose([Validators.required])],
        billFrom  : [],
        shipFrom  : [null],
        invoiceNo : [null, Validators.compose([Validators.required])],
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
        inv_type  : [null],
        tds_percentage:[0],
        tcs_percentage:[0],
        tax_type  :[null],

      })

    {
      this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530'); // hh:mm:ss a
    this.invoice_payment =fb.group({
          'created_by': [this.uid],
          receipt_no  : [null],
          tran_mode   : [0, Validators.compose([Validators.required, Validators.min(1)])],
          from_bank   : [null, Validators.compose([Validators.required, Validators.min(1)])],
          to_bank     : [1, Validators.compose([Validators.required, Validators.min(1)])],
          amount      : [0],
          tran_date   : [this.todaysDate],
          reference   : [null, Validators.compose([Validators.required])],
          description : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
          prefix      : [null]
        } )
      }

      this.e_way_bill = fb.group({
        bill_no :[null,Validators.compose([Validators.required])],
        vehicle_no:[null,Validators.compose([Validators.required])],
        shipment_mode:[null,Validators.compose([Validators.required])],
      })

      this.advance = fb.group({
        invoice_amount   :[null,Validators.compose([Validators.required])],
        advance_id   :[null,Validators.compose([Validators.required])],
        invoice_id   :[null],
        description  :[null,Validators.compose([Validators.required])],
      })
  }


  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("addPayment", { static: true }) addPayment: ElementRef;
  @ViewChild("ewayBill", { static: true }) ewayBill   : ElementRef;
  @ViewChild("use_advancePayment", { static: true }) use_advancePayment: ElementRef;

  async ngOnInit()
  {
    this._state.notifyDataChanged('menu.isCollapsed', true);
    this.loadonce();
    this.LoadCustomerBills();
    this.getImageFromService();
   await this.fontload();
   await this.fontload();
   await this.fontload();
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

  changeTableWidth() {
    document.documentElement.style.setProperty('--table-width', this.tableWidth+'%');
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


fontload()
{
    pdfMake.fonts = {
      'Roboto': {
        normal:'Roboto-Regular.ttf',
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


  async loadonce()
  {
    await this.api.get('mp_customer_invoice_pdf.php?value=' + this.view_invoice + '&authToken=' + environment.authToken).then((data: any) => {

      this.invoice_id = data[0].invoice_id;
      this.invoicePdf   = data;
      this.status   = data[0].status
        console.log("invoicePdf ",this.invoicePdf)
      if(this.invoicePdf[0].dc_data != null)
      this.invoicePdf[0]['dc_no'] =this.invoicePdf[0].dc_data.map(item => item.dc_number).join(", ");
        console.log(this.invoicePdf[0]);
      this.company_pdf_logo = this.invoicePdf[0].company_details[0].logo;
      this.company_pdf_logo = environment.baseURL + "download_file.php?path=upload/company/" +  this.company_pdf_logo + "&authToken=" + environment.authToken

      this.invoiceItems   = this.invoicePdf[0].invoiceItems;
      this.company_gst_no = this.invoicePdf[0].gst_number;
      this.company_tan_no = this.invoicePdf[0].tan_number;

      this.invoiceNumber =  this.invoicePdf[0].invoice_number;
      this.taxempty      = this.invoicePdf[0].tax_mode;
      this.stateCode     = data[0].state_code;
      this.load_paymentTransactiond(this.invoicePdf[0].invoice_id);
      this.customer_address(data[0].customer_id);
      this.Load_dispath_data()
    }).catch(error => {
       this.toastrService.error('Something went wrong 1');
      });

  }



 async Load_dispath_data()
  {
      await this.api.get('mp_invoice_dc_item_dispatch_data.php?id=' + this.invoice_id + '&type=Invoice&authToken=' + environment.authToken).then((data: any) => {
          console.log("dispatch data ",data)
          this.Dispatch_items = data.item
          this.Dispatch_total = data?.item_total
          if(data.item.length > 0)
          {
              const invoiceTotal = parseFloat(this.invoicePdf[0]?.without_tax || 0);
              const itemTotal = parseFloat(data?.item_total || 1); // use 1 to avoid division by 0
              const difference = invoiceTotal - itemTotal;
              this.Difference_amount = difference.toFixed(2)
              const percentageDifference = ((difference / invoiceTotal) * 100).toFixed(2); // 2 decimal places
              this.Dispatch_percentage = percentageDifference
              console.log("Invoice Total:", invoiceTotal);
              console.log("Item Total:", itemTotal);
              console.log("Difference:", difference);
              console.log("Difference (%):", percentageDifference + "%");
          }
         }).catch(error => {
       this.toastrService.error('Something went wrong 2');
      });
  }
  async LoadCustomerBills()
  {
    await this.api.get('mp_customer_invoice.php?&authToken=' + environment.authToken).then((data: any) =>
    {
      this.CustomerBillList = data;
      this.temp   = data;
      var selectedId  = this.view_invoice;
      let selectedRow = this.CustomerBillList.find(item => item.serial_no == selectedId);
      if (selectedRow)
      {
        this.selected = [selectedRow];
        this.invoice_list=this.selected[0];
       // setTimeout(() => this.scrollToSelectedRow(selectedId), 500);
      }
    }).catch(error => { this.toastrService.error('Something went wrong in LoadCustomerInvoice 3'); });
  }

  scrollToSelectedRow(selectedId) {
    const uniqueId = `invoice-row-${selectedId}`;
    const selectedRow = document.getElementById(uniqueId);
    if (selectedRow) {
      selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onActivate(event)
  {

    if (event.type === "click")
    {
      console.log(event.row.serial_number)
      this.view_invoice = event.row.serial_number;
      this.invoice_id   = event.row.invoice_id;
      this.invoice_list = event.row;
      this.name = event.row.customer_name;
      this.invoiceNumber = event.row.invoice_number
      this.selectEdit_data();
      this.load_paymentTransactiond(event.row.invoice_id);
      this.load_paymentTransactiond(event.row.invoice_id);

      this.e_way_bill.controls['bill_no'].setValue(this.invoice_list.e_way_bill);
      this.e_way_bill.controls['vehicle_no'].setValue(this.invoice_list.vehicle_number);
      this.e_way_bill.controls['shipment_mode'].setValue(this.invoice_list.transport_mode);
      this.customer_address(event.row.customer_id);
      this.Load_dispath_data()
    }

  }


 async  selectEdit_data()
    {
        var serial_no =  this.invoice_list['serial_no'];

      this.api.get('mp_customer_invoice_pdf.php?value=' + serial_no  + '&authToken=' + environment.authToken).then((data: any) => {

        this.invoicePdf = data;
        console.log("invoicePdf ",this.invoicePdf)
        this.status   = data[0].status
        if(this.invoicePdf[0].dc_data != null)
        this.invoicePdf[0]['dc_no'] =this.invoicePdf[0].dc_data.map(item => item.dc_number).join(", ");
        console.log(this.invoicePdf[0]);
        this.invoiceItems     = this.invoicePdf[0].invoiceItems;
        this.taxempty         = this.invoicePdf[0].tax_mode;
        this.company_pdf_logo = this.invoicePdf[0].company_details[0].logo;
        this.company_pdf_logo = environment.baseURL + "download_file.php?path=upload/company/" + this.company_pdf_logo + "&authToken=" + environment.authToken
        this.stateCode        = data[0].state_code;
      }).catch(error => {
        this.toastrService.error('Something went wrong');
      });

    }

onSelect({ selected })
{
  this.selected.splice(0, this.selected.length);
  this.selected.push(...selected);
  this.show_edit_btn=true;
}

editbill()
{
  this.edit_dataload();
  this.LoadItemDetails();
  this.selectEdit_data();
  this.show_invoice_edit=true;
  this.show = false;
}

async LoadItemDetails()
{
  await this.api.get('get_data.php?table=item&find=sales&value=1&authToken=' + environment.authToken).then((data: any) =>
  {
    this.ItemList = data;
  }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
}

async edit_dataload()
{
  let invoice_id =  this.invoice_list['invoice_id'];
  await this.api.get('mp_invoice_edit_data.php?value=' +  invoice_id  + '&authToken=' + environment.authToken).then((data: any) => {
     if(data != null)
       {
         this.invoice_item     = data[0];
         this.invoiceitem_list = data[0].invoice_items;
         this.edit_ItemList    = data[0].items_list;
          console.log("edit_ItemList  : ",this.edit_ItemList)
         this.invoice_type     = data[0].inv_type;
         this.customer_id      = data[0].customer_id;
         this.taxempty         = data[0].tax_mode;
       }
     }).catch(error => { this.toastrService.error('Something went wrong'); });

     this.Edit_invoice.controls['customerId'].setValue(this.invoice_list.customer_id);
     this.Edit_invoice.controls['inv_type'].setValue(this.invoice_type);

     if(this.clone_invoice_show == false)
     {
      this.FetchAddress(this.invoice_item);
     }

     if(this.clone_invoice_show == true)
     {
      this.clone_address(this.customer_id);
     }

     this.stateCode =this.invoice_item.place_from_supply_code;
     if(this.stateCode == 33 )
     {
      this.edit_LoadGST('GST');
      this.Edit_invoice.controls['tax_type'].setValue("GST");
     }
    else
     {
      this.edit_LoadGST('IGST');
      this.Edit_invoice.controls['tax_type'].setValue("IGST");
     }
     this.load_invoicenumber( this.invoice_item);
     this.load_invoicenumber( this.invoice_item);

}

clone_address(id)
{

   this.api.get('get_data.php?table=customer_address&find=customer_id&value='+id+'&find1=status&value1=1&authToken=' + environment.authToken).then((data: any) =>
  {
    this.FetchAddress(data)
  }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });


  this.api.get('get_data.php?table=customer_address&find=customer_id&value='+id+'&find1=status&value1=1&authToken=' + environment.authToken).then((data: any) =>
  {
    this.FetchAddress(data)
  }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
}


async FetchAddress(data)
  {

  if(this.clone_invoice_show == true && this.show_invoice_edit == false)
  {
      for (let i = 0; i < data.length; i++)
      {
        if (data[i].set_as_default === 1 && data[i].type === 1 && data[i].status === 1) {
          this.bill_addr   = data[i];
          this.billFrom    = this.bill_addr.cust_addr_id;

          this.billAttention      = this.bill_addr.attention;
          this.billAddress_line_1 = this.bill_addr.address_line_1;
          this.billAddress_line_2 = this.bill_addr.address_line_2;
          this.billCity           = this.bill_addr.city;
          this.billState          = this.bill_addr.state;
          this.billZipcode        = this.bill_addr.zip_code;
          this.Edit_invoice.controls['billFrom'].setValue(this.billFrom);
        }

        if (data[i].set_as_default === 1 && data[i].type === 2 && data[i].status === 1) {
          this.shipp_addr = data[i];
          this.shipFrom   = this.shipp_addr.cust_addr_id;

          this.shipAttention      = this.shipp_addr.attention;
          this.shipAddress_line_1 = this.shipp_addr.address_line_1;
          this.shipAddress_line_2 = this.shipp_addr.address_line_2;
          this.shipCity           = this.shipp_addr.city;
          this.shipState          = this.shipp_addr.state;
          this.shipZipcode        = this.shipp_addr.zip_code;
          this.Edit_invoice.controls['shipFrom'].setValue(this.shipFrom);
        }
      }
    }

  if(this.show_invoice_edit == true && this.clone_invoice_show == false)
  {

      for (let i = 0; i < data.bill_address.length; i++)
      {
        if (data.bill_address[i] ) {
          this.bill_addr   = data.bill_address[i];
          this.billFrom    = this.bill_addr.cust_addr_id;

          this.billAttention      = this.bill_addr.attention;
          this.billAddress_line_1 = this.bill_addr.address_line_1;
          this.billAddress_line_2 = this.bill_addr.address_line_2;
          this.billCity           = this.bill_addr.city;
          this.billState          = this.bill_addr.state;
          this.billZipcode        = this.bill_addr.zip_code;
          this.Edit_invoice.controls['billFrom'].setValue(this.billFrom);
        }

        if (data.ship_address[i] ) {
          this.shipp_addr = data.ship_address[i];
          this.shipFrom   = this.shipp_addr.cust_addr_id;

          this.shipAttention      = this.shipp_addr.attention;
          this.shipAddress_line_1 = this.shipp_addr.address_line_1;
          this.shipAddress_line_2 = this.shipp_addr.address_line_2;
          this.shipCity           = this.shipp_addr.city;
          this.shipState          = this.shipp_addr.state;
          this.shipZipcode        = this.shipp_addr.zip_code;
          this.Edit_invoice.controls['shipFrom'].setValue(this.shipFrom);

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
    this.Edit_invoice.controls["paymentTerms"].setValue(this.payment_terms);
  }

  edit_initProduct()
  {
    let product = this.Edit_invoice.get('product') as FormArray;
    product.push(this.fb.group({
      type        : "new",
      id          : [''],
      dc_id       : [0],
      items       : new FormControl('', Validators.required),
      descriptions: new FormControl(''),
      taxes       : new FormControl('', Validators.required),
      price       : new FormControl('', Validators.required),
      quantity    : new FormControl('', Validators.required),
      amount      : new FormControl('', Validators.required),
      uom         : new FormControl('', Validators.required)
    }))
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

 async load_editpage()
 {
  this.LoadpaymentTerms();
  this.dc_list  =[]
   setTimeout(async() => {
  this.name =this.invoice_list.customer_name;

  if(this.clone_invoice_show == false)
  {
   this.Edit_invoice.controls['invoiceNo'].setValue(this.invoice_list.invoice_number);
   this.Edit_invoice.controls['billDate'].setValue(this.invoice_list.invoice_date);
  }

  this.Edit_invoice.controls['reference_number'].setValue(this.invoice_list.reference_number);
  this.Edit_invoice.controls['dueDate'].setValue(this.invoice_list.invoice_due_date);
  this.Edit_invoice.controls['subTotal'].setValue(0);
  this.Edit_invoice.controls['shippingCharge'].setValue(this.invoice_list.transport);
  this.Edit_invoice.controls['tds_percentage'].setValue(this.invoice_list.tds_percentage);
  this.Edit_invoice.controls['tcs_percentage'].setValue(this.invoice_list.tcs_percentage);
  this.Edit_invoice.controls['TCS'].setValue(this.invoice_list.TCS);
  this.Edit_invoice.controls['TDS'].setValue(this.invoice_list.TDS);
  this.Edit_invoice.controls['roundOff'].setValue(this.invoice_list.round_off);

  this.Edit_invoice.controls['invoice_id'].setValue(this.invoice_list.invoice_id);
  this.Edit_invoice.controls['created_by'].setValue(this.uid);
  this.Edit_invoice.controls['paymentTerms'].setValue(this.invoice_list.payment_term);
  this.Edit_invoice.controls['terms_condition'].setValue(this.invoice_list.terms_condition);
  this.Edit_invoice.controls['notes'].setValue(this.invoice_list.note);
  const dc_data = JSON.parse(this.invoice_list.dc);
  this.Edit_invoice.controls['dc_data'].setValue(dc_data);

  const product1 = this.Edit_invoice.get('product') as FormArray;
  product1.clear();
  this.invoiceitem_list.forEach((item,j) => {
    product1.push(this.fb.group({
      dc_id       : [item.dc_id],
      type        : "edit",
      id          : [item.invoice_item_id],
      items       : [item.item_list_id],
      descriptions: [item.item_description],
      taxes       : [item.tax_percent],
      price       : [item.amount],
      quantity    : [item.qty],
      amount      : [item.total],
      uom         : [item.uom]
    }));

     let qty   = item.qty;
     let price = item.amount;
     this.edit_priceChange(qty, price, j);

   });

  for(let m = 0; m < this.invoiceitem_list.length; m++)
    {
      this.edit_GSTCalculation();
    }


  console.log("Converted JSON:", dc_data);

    if(dc_data != null)
    {
        dc_data.forEach(async  element => {
            await  this.api.get('get_data.php?table=dc&find=dc_id&value='+element.dc_id+'&authToken=' + environment.authToken).then((data: any) =>
                    {
                      console.log("Dc List : ", data)
                      this.dc_list = [...this.dc_list, ...data];
                      console.log(" invoice Dc List : ", this.dc_list)
                    }).catch(error => { this.toastrService.error('Something went wrong in LoadI'); });
        });
    }
    if(this.invoice_type =="items")
    {

     this.Items_DctoInvoice(this.customer_id)
    }

  }, 100);
 }

  //  async  DctoInvoice()
  // {

  //     await  this.api.get('get_data.php?table=dc&find=customer_id&value='+this.customer_id+'&find1=dc_type&value1='+this.invoice_type+'&authToken=' + environment.authToken).then((data: any) =>
  //       {
  //         this.dc_list = data;
  //         console.log("Dc List : ", data)
  //       }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });

  // }
      dc_list:any[]=[]
      dc_item_List:any

  async  Dcitems(event)
    {
      console.log(event)
        console.log("List : ",this.dc_list)
          var dc_no = this.dc_list.find(i => i.dc_id == event.dc_id)
         console.log(dc_no)
      await this.api.get('get_data.php?table=dc_item&find=dc_id&value='+event.dc_id+'&authToken=' + environment.authToken).then((data: any) =>
        {
            this.dc_item_List = data;
            console.log("Dc Item List : ", data)
           const product1 = this.Edit_invoice.get('product') as FormArray;

            // Clear if it only contains one dummy/initial row
            if (product1.length === 1 && !product1.at(0).get('items')?.value && this.invoice_type != "items") {
              product1.clear();
            }

            let savedTypes: any[] = [];
            let savedIds: any[] = [];
            if(this.invoice_type == "items")
            {
                savedTypes = ["new"];
                savedIds   = [];
            }
            if (this.invoice_type == "project") {

                savedTypes = product1.controls.map(ctrl => ctrl.get('type')?.value || '');
                savedIds   = product1.controls.map(ctrl => ctrl.get('id')?.value || '');
                product1.clear();

            }
              console.log('Saved types before clear:', savedTypes);
              console.log('Saved ids before clear:', savedIds);
             const typeValue = savedTypes?.[0] ?? '';
              const idValue   = savedIds?.[0] ?? '';
                console.log('Saved types before clear: idValue', idValue);
              console.log('Saved ids before clear: typeValue', typeValue);
            data.forEach((item: any) => {
              // Avoid duplicates by item_list_id
              const isDuplicate = product1.controls.some(ctrl =>
                ctrl.get('items')?.value === item.item_list_id
              );
              // if (isDuplicate) return;

              // Push new product row
              product1.push(this.fb.group({
                dc_id       : [event.dc_id],
                type        : [typeValue],
                id          : [idValue],
                items       : [item.item_list_id],
                descriptions: [item.item_description],
                taxes       : [item.tax_percent],
                price       : [item.amount],
                quantity    : [item.qty],
                amount      : [item.total],
                uom         : [item.uom]
              }));

            // Call priceChange with latest index
            const newIndex = product1.length - 1;
            this.edit_priceChange(item.qty, item.amount, newIndex);
          });

        }).catch(error => { this.toastrService.error('Something went wrong  '); });
  }



  async  Project_DctoInvoice(event)
  {
      await  this.api.get('project_dc_list.php?project_id='+event+'&authToken=' + environment.authToken).then((data: any) =>
        {
          console.log(" Project Dc : ", data)
          this.dc_list = [...this.dc_list, ...data];
          console.log(" Project Dc List : ", this.dc_list)
        }).catch(error => { this.toastrService.error('Something went wrong  '); });

  }



  async  Items_DctoInvoice(event)
  {

      await  this.api.get('customer_item_dclist.php?customer_id='+event+'&authToken=' + environment.authToken).then((data: any) =>
        {
          if(data != null)
          {
            //  this.dc_list = data
            this.dc_list = [...this.dc_list, ...data];

        }
          console.log(" item Dc List : ",  this.dc_list)
        }).catch(error => { this.toastrService.error('Something went wrong '); });

  }


  SlecetAllDcitems(event)
  {
      console.log(event)
      var data =event

      data.forEach(async element => {
          console.log("element : ",element)
        await this.api.get('get_data.php?table=dc_item&find=dc_id&value='+element.dc_id+'&authToken=' + environment.authToken).then((data: any) =>
        {
            this.dc_item_List = data;
            console.log("Dc Item List : ", data)
           const product1 = this.Edit_invoice.get('product') as FormArray;

            // Clear if it only contains one dummy/initial row
            if (product1.length === 1 && !product1.at(0).get('items')?.value) {
              product1.clear();
            }
            data.forEach((item: any) => {
              // Avoid duplicates by item_list_id
              const isDuplicate = product1.controls.some(ctrl =>
                ctrl.get('items')?.value === item.item_list_id
              );
              // if (isDuplicate) return;

              // Push new product row
              product1.push(this.fb.group({
                 dc_id      : [element.dc_id],
                items       : [item.item_list_id],
                descriptions: [item.item_description],
                taxes       : [item.tax_percent],
                price       : [item.amount],
                quantity    : [item.qty],
                amount      : [item.total],
                uom         : [item.uom]
              }));

            // Call priceChange with latest index
            const newIndex = product1.length - 1;
            this.edit_priceChange(item.qty, item.amount, newIndex);
             console.log(product1.value )
          });

        }).catch(error => { this.toastrService.error('Something went wrong'); });

      });

        console.log("All select ",this.selectedDCs)
  }

dc_id:any
remove_data :any[]=[]

    RemoveDcitems(event) {
      console.log(event)
      this.remove_data = [...this.selectedDCs];
      console.log("Updated list: ", this.selectedDCs);
      const product1 = this.Edit_invoice.get('product') as FormArray;

      for (let i = product1.length - 1; i >= 0; i--) {
        const ctrl = product1.at(i);
        console.log(ctrl.value)
        if (ctrl.get('dc_id')?.value === event.dc_id && ctrl.get('type')?.value == "new") {
          product1.removeAt(i);
        }
        if (ctrl.get('dc_id')?.value === event.dc_id && ctrl.get('type')?.value == "edit") {
          console.log("already selected",ctrl.value)
           this.new_category_id= this.modalService.open(this.delete_item_dc, { size: 'md' });
           this.dc_id = ctrl.value.dc_id
           this.item_index = i
          return
        }
      }
      console.log(product1.length)
      if(product1.length == 0)
      {
        this.edit_initProduct()
      }
      this.edit_SubTotalChange(); // If you want to recalculate totals
    }

  async  DC_itemDelete()
    {
      console.log("delete dc id ",this.dc_id)
       let editproduct=this.Edit_invoice.get('product') as FormArray;
        //  let stringdata =  JSON.stringify( this.Edit_invoice.get('dc_data').value)
       const fordata = {
        dc_id       : this.dc_id,
        dc_data     : JSON.stringify( this.Edit_invoice.get('dc_data').value),
        invoice_id  : this.invoice_list['invoice_id']
       }
       console.log(fordata)
       this.loading=true
     await this.api.post('delete_invoice_dc_Items.php?authToken='+environment.authToken,fordata).then((data: any) =>
        {
             this.new_category_id.close();
             this.loading = false
              editproduct.removeAt(this.item_index)
              this.toastrService.success('Item Deleted Successful');

              this.edit_SubTotalChange();

        }).catch(error =>
        {
            this.toastrService.error('Something went wrong');
        });


    }

   async Cancel() {
    console.log("cancel ")
    this.load_editpage()
    await this.new_category_id.close();
    // restore backup selection
    this.Edit_invoice.controls["dc_data"].setValue([...this.remove_data]);
    this.selectedDCs = [...this.remove_data]; // clone to trigger change detection
}


  CancelAll()
  {
     const product1 = this.Edit_invoice.get('product') as FormArray;

     for (let i = product1.length - 1; i >= 0; i--) {
        const ctrl = product1.at(i);
        console.log(ctrl.value)
        if (ctrl.get('dc_id')?.value === 0 && ctrl.get('type')?.value == "new") {
          product1.removeAt(i);
        }

        if (ctrl.get('dc_id')?.value > 0 && ctrl.get('type')?.value == "edit") {
          console.log("already selected",ctrl.value)
           this.new_category_id= this.modalService.open(this.delete_item_dc, { size: 'md' });
           this.dc_id = ctrl.value.dc_id
           this.item_index = i
          return
        }
      }
  }

async  UnSlecetAllDcitems(event) {
          let product = this.Edit_invoice.get('product') as FormArray;

          if (product.length > 1) {
            // Remove all but the first one
            for (let i = product.length - 1; i > 0; i--) {
              product.removeAt(i);
            }
          }

          // Reset the remaining item (at index 0)
          const firstGroup = product.at(0) as FormGroup;
          firstGroup.reset();
          // this.selectedDCs=[]
       await this.edit_SubTotalChange();
}


async edit_specItem(item,j)
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
     this.price     = data[0].price;
     this.quantity  = 1;
     this.amount    = data[0].price;
     this.descriptions = data[0].description;
     this.uom       = data[0].uom;
   }).catch(error => { this.toastrService.error('Something went wrong'); });
   const formData = {
     taxes: item,
   }

   this.edit_patchValues(item,j);
   this.edit_SubTotalChange();
   this.edit_GSTCalculation();
  }


  async specProject(item,i)
  {
   await this.api.get('get_data.php?table=projects&find=project_id&value=' + item + '&authToken=' + environment.authToken).then((data: any) => {
        this.type_id      = data[0].type;
        this.price        = data[0].project_value;
        this.quantity     = 1;
        this.amount       = data[0].project_value;
        this.descriptions = data[0].description;
        this.uom          = "Nos";
   }).catch(error => { this.toastrService.error('Something went wrong'); });

   await this.api.get('get_data.php?table=product_type&find=id&value=' + this.type_id + '&authToken=' + environment.authToken).then((data: any) => {
     this.taxes      = data[0].tax;
    }).catch(error => { this.toastrService.error('Something went wrong'); });

    const formData = {
      taxes: item,
    }

    this.edit_patchValues(item,i);
    this.edit_SubTotalChange();
    this.edit_GSTCalculation()
  }

 async edit_patchValues(id,j)
  {

    let y = (<FormArray>this.Edit_invoice.controls['product']).at(j);
    y.patchValue({
      taxes        : this.taxes,
      price        : this.price,
      quantity     : this.quantity,
      amount       : this.amount,
      descriptions : this.descriptions,
      uom          : this.uom
    });
  }

  edit_priceChange(qty, price, j)
  {
    this.amount = Number(qty * price).toFixed(2);
    let y       = (<FormArray>this.Edit_invoice.controls['product']).at(j);
    y.patchValue({
      amount : this.amount
    })
    this.edit_SubTotalChange();
  }

 edit_qty(qty, price, j)
  {
    this.amount = Number(qty * price).toFixed(2);
    let y       = (<FormArray>this.Edit_invoice.controls['product']).at(j);
    y.patchValue({
      amount : this.amount
    })
    this.edit_SubTotalChange();
  }

  edit_GSTCalculation()
  {
    this.editGST_Data.forEach(data => {
      data.amount = 0;
    });
     this.total_tax =0;
    let products = (<FormArray>this.Edit_invoice.controls['product']).value;
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
    let edit_arr = this.Edit_invoice.controls['product'].value;
    if (!edit_arr || edit_arr.length === 0) {
          this.subtotal = 0;
          this.Edit_invoice.controls['subTotal'].setValue('0.00');
          return;
        }
     let sum1 = edit_arr .map(a => Number(a.amount) || 0) // ensure `amount` is a number or 0
          .reduce((a, b) => a + b, 0);     // provide initial value 0

    this.subtotal = sum1;
     console.log("subtotal: ",this.subtotal);
    this.Edit_invoice.controls['subTotal'].setValue((sum1).toFixed(2));

    this.edit_GSTCalculation();
    this.edit_FinalTotalCalculation();
    this.tdsCalculation();
    this.tcsCalculation();
  }

  tdsCalculation()
  {

     let tds = ((this.subtotal+this.total_tax)*(this.tds_percent/100)).toFixed(2);
     this.Edit_invoice.controls['TDS'].setValue(tds);
     this.edit_FinalTotalCalculation();
  }

  tcsCalculation()
  {
    let tcs =  ((this.subtotal+this.total_tax)*(this.tcs_percent/100)).toFixed(2);
    this.Edit_invoice.controls['TCS'].setValue(tcs);
    this.edit_FinalTotalCalculation();
  }

  edit_FinalTotalCalculation()
  {
    let editSub_Total       = this.Edit_invoice.controls['subTotal'].value;
    let editTDS_Value       = this.Edit_invoice.controls['TDS'].value;
    let editTCS_Vale        = this.Edit_invoice.controls['TCS'].value;
    let editShipping_Value  = this.Edit_invoice.controls['shippingCharge'].value;
    let editRoundof_Value   = this.Edit_invoice.controls['roundOff'].value;

    let editTotalGST: number = this.editGST_Data.map(a => parseFloat (a.amount)).reduce(function(a, b)
    {
      return a + b;
    });
    let editTotal_Calculation =  (Number(editSub_Total) - Number(editTDS_Value) + Number(editTCS_Vale) + Number(editShipping_Value) + Number(editRoundof_Value)+ Number(editTotalGST)).toFixed(2);
    this.Edit_invoice.controls['total'].setValue(editTotal_Calculation);
  }

  item_DeleteId:any

 edit_onDeleteRow(rowIndex)
  {
    let editproduct = this.Edit_invoice.get('product') as FormArray;
     const delete_data = editproduct.at(rowIndex).value;
     console.log(delete_data)

     this.item_index=rowIndex;
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
    let editproduct=this.Edit_invoice.get('product') as FormArray;
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
       let editproduct=this.Edit_invoice.get('product') as FormArray;
        this.api.get('delete_data.php?authToken='+environment.authToken+'&table=invoice_item&field=invoice_item_id&id='+this.item_DeleteId).then((data: any) =>
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
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  async edit_onSubmit(value)
  {
    let invoice_id =  this.invoice_list['invoice_id'];
    let serial_no =  this.invoice_list['serial_no'];
       Object.keys(this.Edit_invoice.controls).forEach(field => {
       const control = this.Edit_invoice.get(field);
       control.markAsTouched({ onlySelf: true });
       });
       if (this.Edit_invoice.valid)
         {
          const confirmed = confirm("Are you sure you want to update this invoice?");
              console.log(confirmed)
              if (!confirmed) {
                return;
              }

          this.loading=true;
          await this.api.post('mp_invoice_edit_submit.php?value='+invoice_id+'&authToken=' + environment.authToken, value).then((data: any) =>
          {
            console.log(data)
            if (data.status == "success")
            {
              this.loading=false;
              this.toastrService.success('Invoice Updated Succesfully');
              this.Return();
              this.view_invoice = serial_no;
              this.loadonce();
            }
            else { this.toastrService.error('Something went wrong');
            this.loading=false; }
            return true;
          }).catch(error =>
            {
            this.toastrService.error('Something went wrong');
            this.loading=false;
          });
        }
 }

 Return()
 {
      this.show_invoice_edit = false;
      this.show              = true;
      this.LoadCustomerBills();
 }

 download()
 {
    this.fontload();
     let invoice_id =this.invoicePdf[0].invoice_id;
    this.api.get('mp_download_invoice.php?value=' + invoice_id + '&authToken=' + environment.authToken).then((data: any) =>
    {
          var invoice_data = data;
          this.pdfDownload( invoice_data);
    }).catch(error => { this.toastrService.error('Something went wrong'); });
 }


async pdfDownload(files) {

  const font = 'Roboto';
  let docDefinition = {
    info: {
      title:files[0].invoice_number ,
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
                  { text: ' TAX INVOICE', fontSize: 11, bold: true, alignment: 'center' },]
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
      this.getBankObject(files),
      this.getTermsObject(files),

    ],
      defaultStyle: {
        font: 'Roboto',
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
          [{ text: 'UDYAM : ' + test.company_udyam, fontSize: 10, bold: true, alignment: 'center' }]
        ],
      ]
    },
  }

}

getInvoiceObject(files) {

  var test = files[0]
  console.log(test)
 const order_numbers = files[0].dc_data.map(item => item.dc_number.split('/').pop()).join(", ");
 console.log(order_numbers)
  return {

    table: {
      widths: ['*', '*'],
      body: [
        [
          {
            columns: [
              [
                { text: 'Invoice No :', fontSize: 10 },
                { text: 'Invoice Date :', fontSize: 10 },
                { text: 'State: ', fontSize: 10 },
                { text: 'Pin Code : ', fontSize: 10 },
              ],
              [
                { text: test.invoice_number, fontSize: 10 },
                { text: test.invoice_date, fontSize: 10 },
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
                { text: order_numbers ? 'DC No :' : '', fontSize: 10 },
                { text: 'ref  :', fontSize: 10 },


              ],
              [
                { text: test.shipment_mode, fontSize: 10 },
                { text: test.vehicle_number, fontSize: 10 },
                { text: test.place_from_supply, fontSize: 10 },
                { text:order_numbers, fontSize: 10 },
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
            { text: 'GST NO :' + test.customer_gst, fontSize: 10, bold: true },
            { text: test.customer_udyam ? 'Udyam No :'+test.customer_udyam : '', fontSize: 10 ,bold:true},
            { text: 'State :' + test.bill_state, fontSize: 10, bold: true },
            { text: 'Pin Code :' + test.bill_zip_code, alignment: 'left', bold: true, fontSize: 10 },
          ],
          {
            columns: [
              [{ text: 'Ship to party:', bold: true, fontSize: 10 },
              { text: test.ship_attention, bold: true, fontSize: 10 },
              { text: test.ship_address_line_1, fontSize: 10 },
              { text: test.ship_address_line_2, fontSize: 10 },
              { text: 'GST NO :' + test.customer_gst, fontSize: 10, bold: true },
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
    },
  }
}

getItemsObject(files) {
  var test = files[0].invoiceItems;
  var serialNumber = 1;
  if(files[0].place_from_supply_code == 33)
  {
  return {
  table: {
    widths: [21, 103, 31, 27, 26, 35, 22, 32, 22, 32, 64],
    body: [
      [
        { text: '#', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true , alignment: 'center'},
        { text: 'Product Description', alignment: 'center',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 10, bold: true },
        { text: 'HSN', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true , alignment: 'center'},
        { text: 'QTY', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true, alignment: 'center' },
        { text: 'UOM', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true, alignment: 'center' },
        { text: "Unit Rate", border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true, alignment: 'center' },
        { text: 'CGST', border: [true, true, true, false],fillColor: '#CCCCCC',fontSize: 10, bold: true, alignment: 'center', colSpan: 2 },
        {},
        { text: 'SGST', fontSize: 10, bold: true,fillColor: '#CCCCCC', alignment: 'center', colSpan: 2 },
        {},
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
        { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 11,alignment:'center'},
        { text: 'Amt',fillColor: '#CCCCCC', bold: true, fontSize: 10,alignment:'center' },
        { text: '',fillColor: '#CCCCCC', border: [true, false, true, false], bold:true},
      ],
      ...test.map((ed, index) => {
          let cellBorder = [true, true, true, false];
          if (index > 0) {
            cellBorder = [true, true, true, true];
          }

        return [
          { text:  serialNumber++,border:cellBorder, fontSize: 10 , alignment: 'center'},
          { text: [{ text: ed.item_name,bold: true },{ text: '\n' }, { text: ed.item_description },{ text: '\n' },{text:ed.serial_number?"SN : "+ed.serial_number:''}], border: cellBorder, fontSize: 10, alignment: 'left' },
          { text: ed.hsn,border:cellBorder, fontSize: 10 , alignment: 'center'},
          { text: ed.qty,border:cellBorder, fontSize: 10 , alignment: 'center'},
          { text: ed.uom,border:cellBorder, fontSize: 10 , alignment: 'center'},
          { text: ed.amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 10 , alignment: 'center'},
          { text: ed.tax_percent/2 +'%',border:cellBorder, fontSize: 10 ,alignment: 'center'},
          { text: (ed.item_tax/2).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 10 , alignment: 'center'},
          { text: ed.tax_percent/2 +'%',border:cellBorder, fontSize: 10 , alignment: 'center'},
          { text: (ed.item_tax/2).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 10 , alignment: 'center'},
          { text: ed.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'), border: [true, true, true, false], fontSize: 10,  alignment: 'right'}]


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
      widths: [21, 103, 49, 32, 30, 40, 30,63,65],
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

          { text: '',fillColor: '#CCCCCC', border: [true, false, true, false], bold:true},
        ],
        ...test.map((ed, index) => {
            let cellBorder = [true, true, true, false];
            if (index > 0) {
              cellBorder = [true, true, true, true];
            }

          return [
            { text:  serialNumber++,border:cellBorder, fontSize: 10 , alignment: 'center'},
            { text: [{ text: ed.item_name,bold: true },{ text: '\n' }, { text: ed.item_description },{ text: '\n' },{text:ed.serial_number?"SN : "+ed.serial_number:''}], border: cellBorder, fontSize: 10, alignment: 'left' },
            { text: ed.hsn,border:cellBorder, fontSize: 10 , alignment: 'center'},
            { text: ed.qty,border:cellBorder, fontSize: 10 , alignment: 'center'},
            { text: ed.uom,border:cellBorder, fontSize: 10 , alignment: 'center'},
            { text: ed.amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 10 , alignment: 'center'},
            { text: ed.tax_percent +'%',border:cellBorder, fontSize: 10 ,alignment: 'center'},
            { text: (ed.item_tax).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 10 , alignment: 'center'},
            { text: ed.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'), border: [true, true, true, false], fontSize: 10,  alignment: 'right'}]

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



getBankObject(files) {

  var test = files[0].company_details[0]
  var terms =files[0];

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
              { text: terms.payment_term1, margin: [0, 5], fontSize: '10', alignment: 'left' },
              { text: terms.payment_term2, margin: [0, 5], fontSize: '10', alignment: 'left' },
              { text: terms.payment_term3, margin: [0, 5], fontSize: '10', alignment: 'left' }
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
    this.prefix = data[0].payment_receipt;
  }).catch(error => { this.toastrService.error('API Faild : AddNewTrans')});

  await this.api.get('get_data.php?table=payment_transactions&asign_field=tran_id&asign_value=DESC&authToken=' + environment.authToken).then((data) =>
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
  }).catch(error => { });

  let serial_no = this.receipt_serial_no;
  this.invoice_payment.controls['receipt_no'].setValue(serial_no);
}

load_paymentTransactiond(id)
{
  this.payment_view =false;
   this.api.get('get_data.php?table=payment_transactions&find=invoice_id&value='+id+'&asign_field=tran_id&asign_value=DESC&authToken=' + environment.authToken).then((data) =>
  {
    this.payment_transaction = data;
    if(this.payment_transaction!=null)
      {
       this.balance = this.payment_transaction[0].balance;
       if(this.balance == 0)
       {
        this.payment_view = true;
       }
      }
      else{
        this.payment_view = false;
      }
  }).catch(error => { });
}

async openpop()
  {
    this.add_payment = this.modalService.open(this.addPayment, { size: 'md' });
    this.name =this.invoice_list.customer_name;
      if(this.payment_transaction!=null)
      {
        this.balance = this.payment_transaction[0].balance;
        var amount  =  this.balance;
      }
       else{
        var amount   =  this.invoicePdf[0].total;
       }
    this.invoice_payment.controls['from_bank'].setValue(this.name);
    this.invoice_payment.controls['amount'].setValue(amount);
    this.invoice_payment.controls['description'].setValue(this.invoiceNumber);

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
    this.show_invoice_edit = false;
    this.show=true;
    this.clone_invoice_show=false;
  }


  async AddNewTrans(data)
  {
    let invoice_id =this.invoice_list.invoice_id;
    let amount =this.invoice_list.total;


    if(this.payment_transaction != null)
      {
        let balance = this.payment_transaction[0].balance;
        var last_total  =  balance;
      }
       else
       {var last_total  =  this.invoicePdf[0].total; }

       Object.keys(this.invoice_payment.controls).forEach(field =>
        {
          const control = this.invoice_payment.get(field);
          control.markAsTouched({ onlySelf: true });
        });
    if (this.invoice_payment.valid)
    {
      console.log("prefix_data",this.prefix)
      console.log("receipt_serial_no",this.receipt_serial_no)
        const billNoValue = this.prefix+this.receipt_serial_no;
        console.log(billNoValue)
            function normalizeString(str : any) {
              return str.replace(/\s+/g, '').toLowerCase();
            }
            let checking :any
            await this.api.get('get_data.php?table=payment_transactions&authToken=' + environment.authToken).then((data: any) =>

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
       if(last_total >= data.amount)
       {
          const confirmed = confirm("Are you sure you want to confirm this payment?");
              console.log(confirmed)
              if (!confirmed) {
                return;
              }
          this.loading=true;
              await this.api.post('mp_add_invoice_payment.php?value='+invoice_id+'&amount='+amount+'&authToken=' + environment.authToken, data).then((data: any) =>
              {
                if(data.status == "success")
                  {
                    this.toastrService.success('Transaction Succesfully');
                    this.invoice_payment.controls['tran_mode'].reset(0);
                    this.invoice_payment.controls['from_bank'].setValue('');
                    this.invoice_payment.controls['to_bank'].setValue(1);
                    this.invoice_payment.controls['reference'].reset();
                    this.invoice_payment.controls['description'].reset();
                    this.invoice_payment.controls['amount'].setValue(0);
                    this.add_payment.close();
                    this.loading=false;
                   this. load_paymentTransactiond(invoice_id) }
                else
                  { this.toastrService.error(data.status);
                    this.loading=false; }
                  return true;
              }).catch(error => {this.toastrService.error('API Faild : AddNewTrans');
                  this.loading=false;});
         }
         else
         {this.toastrService.error('Amount is greater than the invoice amount '); }
    }
    else
    {
      this.toastrService.error('Please make sure all fields are filled in correctly');
    }
  }

 clone()
  {
    this.edit_dataload();
    this.LoadItemDetails();
    this.selectEdit_data()
    this.clone_invoice_show = true;
    this.show_invoice_edit=false;
    this.show=false;

  }

  async load_invoicenumber(id)
 {
    this.details =id
   await  this.api.get('mp_invoice.php?&value=' + this.details.customer_id+ '&authToken=' + environment.authToken).then((data: any) =>
   {

      let invoice_id        = data[0].serial_no + 1;
      this.prefix_data      = data[0].prefix
      console.log("prefix_data",this.prefix_data)
      this.inv_no           = invoice_id;
      this.view_invoice     = invoice_id;
      this.invoice_type     = this.details.inv_type

      if(this.clone_invoice_show == true)
      {
        this.Edit_invoice.controls['invoiceNo'].setValue(this.inv_no);
        this.Edit_invoice.controls['billDate'].setValue(this.todaysDate);
        this.Edit_invoice.controls['inv_type'].setValue(this.details.inv_type);
      }
   }).catch(error => { this.toastrService.error('Something went wrong') });
}

async onSubmit(bill_data)
  {

    Object.keys(this.Edit_invoice.controls).forEach(field => {
      const control = this.Edit_invoice.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    if (this.Edit_invoice.valid)
    {
      this.view_invoice = this.inv_no
      const billNoValue =this.prefix_data+ this.inv_no;
      function normalizeString(str : any) {
        return str.replace(/\s+/g, '').toLowerCase();
      }
      let checking :any
      await this.api.get('get_data.php?table=invoice&authToken=' + environment.authToken).then((data: any) =>

        {
          if(data != null)
            {
              checking = data.some((item: { invoice_number: any; }) =>  normalizeString(item.invoice_number) ===  normalizeString(billNoValue) );
            }
        }).catch(error =>
          {
              this.toastrService.error('API Faild : Invoice number checking failed');
              this.loading = false;
          });
        if(!checking)
         {
          const confirmed = confirm("Are you sure you want to confirm creating this clone?");
              console.log(confirmed)
              if (!confirmed) {
                return;
              }

              this.loading = true;
              await this.api.post('mp_invoice_create.php?type=new_invoice&authToken=' + environment.authToken, bill_data).then((data: any) =>
              {

                if (data.status == "success")
                {
                  this.toastrService.success('Invoice Added Succesfully');
                  this.loading = false;
                  this.Return();
                  this.show_invoice_edit = false;
                  this.show = true;
                  this.loadonce()
                  this.clone_invoice_show = false;
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
          else{
            this.toastrService.error('Invoice Number already exist');
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

    this.api.get('get_data.php?table=invoice&find=invoice_id&value='+this.invoice_id+'&authToken=' + environment.authToken).then((data: any) => {

       this.e_way_bill.controls['bill_no'].setValue(data[0].e_way_bill);
       this.e_way_bill.controls['vehicle_no'].setValue(data[0].vehicle_number);
       this.e_way_bill.controls['shipment_mode'].setValue(data[0].transport_mode);

    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  async billSubmit(value)
  {
    // Object.keys(this.e_way_bill.controls).forEach(field => {
    //   const control = this.e_way_bill.get(field);
    //   control.markAsTouched({ onlySelf: true });
    // });

     const confirmed = confirm("Are you sure you want to update this e-way bill?");
              console.log(confirmed)
              if (!confirmed) {
                return;
              }


    let invoice_id =this.invoicePdf[0].invoice_id;
    this.view_invoice =this.invoice_list.serial_no;

    await this.api.post('mp_invoice_create.php?invoice_id='+invoice_id+'&type=e_way&authToken=' + environment.authToken, value).then((data: any) =>
    {
      if (data.status == "success")
      {
        this.toastrService.success('Added Succesfully');
        this.loading = false;
        this.Return();
        this.show_invoice_edit = false;
        this.show = true;
        this.loadonce()
        this.clone_invoice_show = false;
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

    await  this.api.get('get_data.php?table=payment_transactions&find=invoice_id&value='+this.invoice_id+'&authToken=' + environment.authToken).then((data: any) => {


       if(data != null)
       {
         {
           this.toastrService.error('Invoice was not able to Delete');
         }
       }
       else
       {
         this.openMd = this.modalService.open(this.delete, { size: 'md' });
       }

        }).catch(error => { this.toastrService.error('Something went wrong'); });

  }

  async ReqDelete()
  {
    let invoice_id =this.invoicePdf[0].invoice_id;

    await this.api.post('mp_delete_invoice.php?table=invoice&field=invoice_id&delete_id='+invoice_id+'&authToken=' + environment.authToken,invoice_id).then((data: any) =>
    {

      if (data.status == "success")
      {
               this.view_invoice = data.id;
               this.toastrService.success('Deleted Succesfully');
               this.loading = false;
               this.Return();
               this.show_invoice_edit = false;
               this.show = true;
               this.loadonce()
               this.clone_invoice_show = false;
               this.openMd.close();
      }
      else { this.toastrService.error('Something went wrong 13');
      this.loading = false;}
      return true;
    }).catch(error =>
      {
      this.toastrService.error('Something went wrong 14');
      this.loading = false;
    });
  }

  customer_address(id)
  {
    this.api.get('get_data.php?table=customer_address&find=customer_id&value=' + id + '&find1=type&value1=1&authToken=' + environment.authToken).then((data: any) => {

        this.alldata = data;
    }).catch(error => { this.toastrService.error('Something went wrong'); });

    this.api.get('get_data.php?table=customer_address&find=customer_id&value=' + id + '&find1=type&value1=2&authToken=' + environment.authToken).then((data: any) => {

      this.alldata1 = data;
  }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  ReloadBillAddr(id)
  {

    this.api.get('get_data.php?table=customer_address&find=cust_addr_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) => {
      this.bill_addr = data[0];

      this.billFrom = this.bill_addr.cust_addr_id;
      this.billAttention = this.bill_addr.attention;
      this.billAddress_line_1 = this.bill_addr.address_line_1;
      this.billAddress_line_2 = this.bill_addr.address_line_2;
      this.billCity = this.bill_addr.city;
      this.billState = this.bill_addr.state;
      this.billZipcode = this.bill_addr.zip_code;
      this.Edit_invoice.controls['billFrom'].setValue(this.billFrom);
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  ReloadShippAddr(id) {

    this.api.get('get_data.php?table=customer_address&find=cust_addr_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) => {
      this.shipp_addr = data[0];

      this.shipFrom = this.shipp_addr.cust_addr_id;
      this.shipAttention = this.shipp_addr.attention;
      this.shipAddress_line_1 = this.shipp_addr.address_line_1;
      this.shipAddress_line_2 = this.shipp_addr.address_line_2;
      this.shipCity = this.shipp_addr.city;
      this.shipState = this.shipp_addr.state;
      this.shipZipcode = this.shipp_addr.zip_code;
      this.Edit_invoice.controls['shipFrom'].setValue(this.shipFrom);

    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  onInputChange()
  {
    const billNoValue = this.inv_no;
    let value = this.CustomerBillList.find(item => item.invoice_number === billNoValue);
       if(value != undefined)
       {
        this.toastrService.error('Invoice number has already been entered')
       }
       if(value == undefined)
       {
       }
  }

  use_advance()
  {

    let customer_id = this.invoice_list.customer_id;
    this.advance.controls['invoice_amount'].setValue(this.invoice_list.total);
    this.advance.controls['invoice_id'].setValue(this.invoice_id);
    this.advance.controls['description'].setValue(this.invoice_list.invoice_number);

    this.api.get('get_data.php?table=customer_balance&find=customer_id&value='+customer_id+'&authToken=' + environment.authToken).then((data: any) => {

      if (data != null)
      {
        function levelFilter(value) {
          if (!value) { return false; }
           return value.invoice_id === null;
          }
            this.advance_list = data.filter(levelFilter);
      }
    }).catch(error => { this.toastrService.error('Something went wrong'); });

     this.add_payment = this.modalService.open(this.use_advancePayment, { size: 'md' });
  }

  Add_advance(data)
  {
   let select = this.advance_list.find(u => u.id == data.advance_id)

    Object.keys(this.advance.controls).forEach(field => {
      const control = this.advance.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    if(this.advance.valid)
    {
      if(select.debit <= this.advance.value.invoice_amount)
        {
           const confirmed = confirm("Are you sure you want to confirm this payment?");
              console.log(confirmed)
              if (!confirmed) {
                return;
              }
          this.api.post('mp_advance_amount_to_invoice.php?tran_id='+select.tran_id+'&authToken=' + environment.authToken, this.advance.value).then((data: any) =>
          {

            if(data.status == "success")
              {
                      this.loading = false;
                      this.toastrService.success('Updated Succesfully');
                      this.load_paymentTransactiond(this.invoice_list.invoice_id);
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
      else{
        this.toastrService.warning("advance amount is greater than the invoice amount")
      }
  }
  else{
    this.toastrService.error('No select the payament');
    }
  }
}
