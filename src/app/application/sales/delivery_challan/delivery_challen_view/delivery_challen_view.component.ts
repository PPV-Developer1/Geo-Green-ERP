import { Component, OnInit, ViewChild,ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from "../../../../service/api.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../../../environments/environment";
import { Router } from '@angular/router';
import { FormControl, FormGroup,FormBuilder, FormArray, Validators } from '@angular/forms';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ScriptService } from 'src/app/service/script.service';
import { ImgToBase64Service } from "src/app/service/img-to-base64.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { AnyARecord } from 'dns';
import { AppState } from 'src/app/app.state';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  'Roboto': {
    normal:'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-Italic.ttf'
  }
}

@Component({
  selector   : 'app-delivery_challen_view',
  templateUrl: './delivery_challen_view.component.html',
  styleUrls  : ['./delivery_challen_view.component.scss']
})
export class Delivery_challen_viewComponent implements OnInit {
  public router    : Router;

  SelectionType        = SelectionType;
  selected             = [];
  invoicePdf           = [];
  invoiceItems         : [];
  returnable_dc_show        : boolean = false
  show_new_bill             : boolean = true;
  loading                   : boolean = false;
  show                      : boolean = true;
  show_edit_btn             : boolean = false;
  show_dc_edit              : boolean = false;
  public formShow           : boolean = true;
  clone_dc_show             : boolean = false;

  total_tax                 : any;
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

  type_id                  : any;
  inv_no                   : any;
  amount                   : any;
  descriptions             : any;
  invoiceDate              : any;
  followingDay             : any;
  day                      : any;
  month                    : any;
  year                     : any;
  fullDate                 : any;
  dueValues                : any = 0;

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
  alldata                  : any;
  alldata1                 : any;

  uom                      : any;
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
  dc_id                    : any;
  item_DeleteId            : any;
  item_index               : any;
  Edit_dc                  : FormGroup;
  e_way_bill               : FormGroup;

  ItemList                 : any;
  editGST_Data             : any;
  editGST_Length           : any;
  invoice_item             : any;
  invoiceitem_list         : any;
  selectdata               : any;
  dc_list                  : any;
  name                     : any;
  GST_Data                 : any;
  GST_Length               : any;
  invoice_type             : any;
  edit_ItemList            : any;
  dcitem_list              : any;
  dcPdf                    : any;
  details                  : any;
  new_category_id          : any;
  tds_percent              : any = 0;
  tcs_percent              : any = 0;
  subtotal                 : any;
  taxempty                 : any;
  status                   : any
  Dispatch_items           : any
  Dispatch_total           : any
  Dispatch_percentage      : any
  Difference_amount        : any
  imageToShow              : string | ArrayBuffer;
  today                     = new Date();
  todaysDate                = '';
  private startX: number = 0;
  private startWidth: number = 0;
  private columnIndex: number | null = null;
  private resizing = false;
  tableWidth :any= 100 ;
  originalTableHeight      : any
  private dropdownOpen = false;

  imgUrl: string = '../../../../assets/img/logo/geogreen.png';

  public view_dc           = localStorage.getItem('view_bill');
  public uid               = localStorage.getItem('uid');
  public user              = localStorage.getItem('type');

  @ViewChild("delete",{static:true}) delete:ElementRef;
  @ViewChild('tableResponsive', { static: false }) tableResponsive: ElementRef;
  temp: any;

  constructor(private api: ApiService,private modalService: NgbModal, public toastrService: ToastrService,private imgToBase64: ImgToBase64Service,private _state : AppState,
     router:Router, public fb: FormBuilder, private renderer: Renderer2) { this.router = router;

  this.Edit_dc = fb.group(
    {
      created_by : [this.uid],
      customerId : ['', Validators.compose([Validators.required])],
      billFrom   : [null],
      shipFrom   : [null],
      dcNo       : [null, Validators.compose([Validators.required])],
      reference_number: [null],
      billDate   : [(new Date()).toISOString().substring(0, 10), Validators.compose([Validators.required])],
      paymentTerms: ['', Validators.compose([Validators.required])],
      dueDate    : [(new Date()).toISOString().substring(0, 10), Validators.compose([Validators.required])],
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
      product    : this.fb.array([]),
      dc_id      : [null],
      inv_type   : [null],
      size       : [null],
      prefix     : [null]
    })

    this.e_way_bill = fb.group({
      bill_no :[null,Validators.compose([Validators.required])],
      vehicle_no:[null,Validators.compose([Validators.required])],
      shipment_mode:[null,Validators.compose([Validators.required])],
    })
  }
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("ewayBill", { static: true }) ewayBill   : ElementRef;
  @ViewChild("delete_item",{static:true}) delete_item:ElementRef;

  async ngOnInit()
  {
    this._state.notifyDataChanged('menu.isCollapsed', true);
    this.loadonce();
    this.LoadCustomerBills();
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

  fontloader()
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

  async loadonce()
  {
    await this.api.get('mp_customer_dc_pdf.php?value=' + this.view_dc + '&authToken=' + environment.authToken).then(async (data: any) => {


      this.invoicePdf = data;
      this.status = data[0].status;
      this.dc_id = data[0].dc_id;
      this.company_pdf_logo = this.invoicePdf[0].company_details[0].logo;
      this.company_pdf_logo = environment.baseURL + "download_file.php?path=upload/company/" +  this.company_pdf_logo + "&authToken=" + environment.authToken

      this.invoiceItems = this.invoicePdf[0].invoiceItems;

      this.company_gst_no = this.invoicePdf[0].gst_number;
      this.company_tan_no = this.invoicePdf[0].tan_number;
      this.taxempty       = this.invoicePdf[0].tax_mode;
      this.stateCode      = data[0].place_from_supply_code;
      this.name = data[0].customer_name;
      this.customer_address(data[0].customer_id);
       await  this.Load_dispath_data()

    }).catch(error => {
       this.toastrService.error('Something went wrong');
      });
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

 async Load_dispath_data()
  {
      await this.api.get('mp_invoice_dc_item_dispatch_data.php?id=' + this.dc_id + '&type=DC&authToken=' + environment.authToken).then((data: any) => {
          console.log("dispatch data ",data)
          this.Dispatch_items = data.item
          this.Dispatch_total = data.item_total

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


         }).catch(error => {
       this.toastrService.error('Something went wrong');
      });
  }
  async LoadCustomerBills()
  {
    await this.api.get('mp_customer_dc.php?&authToken=' + environment.authToken).then((data: any) =>
    {
      this.CustomerBillList = data;
      if(data.length > 0)
        this.temp=[...data]
      var selectedId  = this.view_dc;
      let selectedRow = this.CustomerBillList.find(item => item.serial_no == selectedId);
      if (selectedRow)
      {
        this.selected = [selectedRow];
        this.dc_list  = this.selected[0];
       // setTimeout(() => this.scrollToSelectedRow(selectedId), 500);
      }
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  scrollToSelectedRow(selectedId)
  {
      const uniqueId = `dc-row-${selectedId}`;
      const selectedRow = document.getElementById(uniqueId);
      if (selectedRow) {
        selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  }

 async onActivate(event)
  {
    if (event.type === "click")
    {
      console.log(event.row)
      this.dc_id   = event.row.dc_id;
      this.dc_list = event.row;
      this.name = event.row.customer_name;
      this.selectEdit_data();
      this.view_dc=event.row.serial_no;
      this.e_way_bill.controls['bill_no'].setValue(this.dc_list.e_way_bill);
      this.e_way_bill.controls['vehicle_no'].setValue(this.dc_list.vehicle_number);
      this.e_way_bill.controls['shipment_mode'].setValue(this.dc_list.transport_mode);

      this.returnable_dc_show = false
    await  this.customer_address(event.row.customer_id);
    await  this.Load_dispath_data()

    }
  }

  selectEdit_data()
    {
         var serial_no =  this.dc_list['serial_no'];

         this.api.get('mp_customer_dc_pdf.php?value=' + serial_no + '&authToken=' + environment.authToken).then((data: any) => {
          this.invoicePdf   = data;
          this.invoiceItems = this.invoicePdf[0].invoiceItems;
          this.taxempty     = data[0].tax_mode;
          this.stateCode    = data[0].place_from_supply_code;
          this.status       = data[0].status;
          this.company_pdf_logo = this.invoicePdf[0].company_details[0].logo;

          this.company_pdf_logo = environment.baseURL + "download_file.php?path=upload/company/" +  this.company_pdf_logo + "&authToken=" + environment.authToken

        }).catch(error => {
          this.toastrService.error('Something went wrong');
        });

    }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.show_edit_btn=true;
  }

editbill()
{
  this.show_dc_edit = true;
  this.returnable_dc_show = true
  this.show         = false;
  this.edit_dataload();
  this.LoadItemDetails();
}

async LoadItemDetails()
{
  await this.api.get('get_data.php?table=item&authToken=' + environment.authToken).then((data: any) =>
  {
    this.ItemList = data;
  }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
}

    async edit_dataload()
    {
      var dc_id =  this.dc_list['dc_id'];
      await this.api.get('mp_dc_edit_data.php?value=' +  dc_id  + '&authToken=' + environment.authToken).then((data: any) => {
        if(data != null)
          {

            this.invoice_item     = data[0];
            this.invoice_type     = data[0].dc_type;
            this.dcitem_list      = data[0].dc_items;
            this.invoice_item     = data[0];

            this.edit_ItemList    = data[0].items_list;

            this.taxempty         = data[0].tax_mode;
          }
        }).catch(error => { this.toastrService.error('Something went wrong'); });

        this.Edit_dc.controls['customerId'].setValue(this.dc_list.customer_id);
        this.Edit_dc.controls['inv_type'].setValue(this.invoice_type);
        this.FetchAddress(this.invoice_item);
        this.stateCode =this.invoice_item.place_from_supply_code;


        if(this.clone_dc_show == false)
        {
          this.FetchAddress(this.invoice_item);
        }

        if(this.clone_dc_show == true)
        {
          this.clone_address(this.dc_list.customer_id);
        }
        if(this.stateCode == 33)
        {
          this.edit_LoadGST('GST');
        }
        else
        {
          this.edit_LoadGST('IGST');
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

  }
async FetchAddress(data)
  {

  if(this.clone_dc_show == true && this.show_dc_edit == false)
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
          this.Edit_dc.controls['billFrom'].setValue(this.billFrom);
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
          this.Edit_dc.controls['shipFrom'].setValue(this.shipFrom);


        }
      }
    }

  if(this.show_dc_edit == true && this.clone_dc_show == false)
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
          this.Edit_dc.controls['billFrom'].setValue(this.billFrom);
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
          this.Edit_dc.controls['shipFrom'].setValue(this.shipFrom);

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
    this.Edit_dc.controls["paymentTerms"].setValue(this.payment_terms);
  }

  edit_initProduct()
  {
    let product = this.Edit_dc.get('product') as FormArray;
    product.push(this.fb.group({
      type        : "new",
      id          : [''],
      items       : new FormControl(''),
      descriptions: new FormControl(''),
      taxes       : new FormControl('', Validators.required),
      price       : new FormControl('', Validators.required),
      quantity    : new FormControl('', Validators.required),
      amount      : new FormControl('', Validators.required),
      uom         : new FormControl('', Validators.required),
      hsn         : new FormControl(''),
    }))
  }

  tax_list : any

  async edit_LoadGST(mode)
  {
      await this.api.get('get_data.php?table=tax&find=type&value=' + mode + '&authToken=' + environment.authToken).then((data: any) =>
      {
       this.tax_list = data
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
    if(this.clone_dc_show == false)
    {
      this.Edit_dc.controls['dcNo'].setValue(this.dc_list.dc_number);
    }
  this.Edit_dc.controls['reference_number'].setValue(this.dc_list.reference_number);
  this.Edit_dc.controls['billDate'].setValue(this.dc_list.dc_date);
  this.Edit_dc.controls['paymentTerms'].setValue(this.dc_list.payment_term);
  this.Edit_dc.controls['dueDate'].setValue(this.dc_list.dc_due_date);
  this.Edit_dc.controls['subTotal'].setValue(0)
  this.Edit_dc.controls['shippingCharge'].setValue(this.dc_list.transport);
  this.Edit_dc.controls['tcs_percentage'].setValue(this.dc_list.tcs_percentage);
  this.Edit_dc.controls['tds_percentage'].setValue(this.dc_list.tds_percentage);
  this.Edit_dc.controls['TCS'].setValue(this.dc_list.TCS);
  this.Edit_dc.controls['TDS'].setValue(this.dc_list.TDS);
  this.Edit_dc.controls['roundOff'].setValue(this.dc_list.round_off);
  this.Edit_dc.controls['terms_condition'].setValue(this.dc_list.terms_condition);
  this.Edit_dc.controls['dc_id'].setValue(this.dc_list.dc_id);
  this.Edit_dc.controls['created_by'].setValue(this.uid);
  this.Edit_dc.controls['notes'].setValue(this.dc_list.note);
  this.notes =  this.dc_list.note
  this.terms_condition = this.dc_list.terms_condition
  this.fullDate = this.dc_list.dc_due_date
  const product1 = this.Edit_dc.get('product') as FormArray;
  product1.clear();
  if(this.invoice_type != "return dc")
    {
            this.dcitem_list.forEach((item,j) => {
              product1.push(this.fb.group({
                type        : "edit",
                id          : [item.dc_item_id],
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
    }

    if(this.invoice_type == "return dc")
      {

          this.dcitem_list.forEach((item,j) => {
            product1.push(this.fb.group({
              type        : "edit",
              id          : [item.dc_item_id],
              items       : [item.item_list_id],
              descriptions: [item.item_description],
              taxes       : [item.tax_percent],
              price       : [item.amount],
              quantity    : [item.qty],
              amount      : [item.total],
              uom         : [item.uom],
              hsn         : [item.hsn]
            }));

        let qty   = item.qty;
        let price = item.amount;
        this.edit_priceChange(qty, price, j);
      });
      }
  for(let m = 0; m < this.dcitem_list.length; m++)
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
      this.uom          = data[0].uom
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
        this.uom          = "Nos"
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

    }).catch(error => { this.toastrService.error('Something went wrong'); });

    const formData = {
      taxes: item,
    }

    this.edit_patchValues(item,i);
    this.edit_SubTotalChange();
    this.edit_GSTCalculation()
  }

  edit_patchValues(id,j)
  {
    let y = (<FormArray>this.Edit_dc.controls['product']).at(j);
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
    let y       = (<FormArray>this.Edit_dc.controls['product']).at(j);
    y.patchValue({
      amount : this.amount
    })
    this.edit_SubTotalChange();
  }

 edit_qty(qty, price, j)
  {
    this.amount = Number(qty * price).toFixed(2);
    let y       = (<FormArray>this.Edit_dc.controls['product']).at(j);
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
     this.total_tax = 0;
    let products = (<FormArray>this.Edit_dc.controls['product']).value;
    products.forEach(product => {
      let taxValue = (product.amount / 100) * parseInt(product.taxes);
      let taxAmount = parseFloat(taxValue.toFixed(2));
       this.total_tax += taxAmount;
      this.editGST_Data.forEach(data => {

        if (data.rate === parseInt(product.taxes))
        {
          data.amount += taxAmount;
          data.amount = parseFloat(data.amount.toFixed(2));
        }
      });
    });

    this.edit_FinalTotalCalculation();
  }


  GSTCalculation_tax(value,j)
  {
    this.taxes        = parseInt(value);
    let y = (<FormArray>this.Edit_dc.controls['product']).at(j);
    y.patchValue({
      taxes        : this.taxes,
     })
    this.edit_SubTotalChange();
    this.edit_GSTCalculation();

    this.edit_FinalTotalCalculation();
  }

 edit_SubTotalChange()
  {
    let edit_arr = this.Edit_dc.controls['product'].value;
    let sum1: number = edit_arr.map(a => parseFloat(a.amount)).reduce(function(a, b) {
      return a + b;
    });
    this.subtotal = (sum1).toFixed(2);
    this.Edit_dc.controls['subTotal'].setValue((sum1).toFixed(2));
    // if (typeof sum1 === 'number') {
    //   let sum1value =Number(sum1).toFixed(2);
    //  this.Edit_po.controls['subTotal'].setValue(sum1value);
    //  console.log(sum1value); // Output: 10.35
    // } else {
    //   console.log('sum1 is not a valid number');
    // }

    this.edit_GSTCalculation();
    this.edit_FinalTotalCalculation();
    this.tdsCalculation();
    this.tcsCalculation();
  }


    Delete()
    {
       let editproduct=this.Edit_dc.get('product') as FormArray;
        this.api.get('delete_data.php?authToken='+environment.authToken+'&table=dc_item&field=dc_item_id&id='+this.item_DeleteId).then((data: any) =>
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

  tdsCalculation()
  {
     let subtotal = Number(this.subtotal) + this.total_tax
     let tds =  ((subtotal )*(this.tds_percent/100)).toFixed(2);
     this.Edit_dc.controls['TDS'].setValue(tds);
     this.edit_FinalTotalCalculation();
  }

  tcsCalculation()
  {
    let subtotal = Number(this.subtotal) + this.total_tax
    let tcs =  ((subtotal )*(this.tcs_percent/100)).toFixed(2);
    this.Edit_dc.controls['TCS'].setValue(tcs);
    this.edit_FinalTotalCalculation();
  }

  edit_FinalTotalCalculation()
  {
    let editSub_Total       = this.Edit_dc.controls['subTotal'].value;
    let editTDS_Value       = this.Edit_dc.controls['TDS'].value;
    let editTCS_Vale        = this.Edit_dc.controls['TCS'].value;
    let editShipping_Value  = this.Edit_dc.controls['shippingCharge'].value;
    let editRoundof_Value   = this.Edit_dc.controls['roundOff'].value;

    let editTotalGST: number = this.editGST_Data.map(a => parseFloat (a.amount)).reduce(function(a, b)
    {
      return a + b;
    });
    let editTotal_Calculation =  (Number(editSub_Total) - Number(editTDS_Value) + Number(editTCS_Vale) + Number(editShipping_Value) + Number(editRoundof_Value)+ Number(editTotalGST)).toFixed(2);
    this.Edit_dc.controls['total'].setValue(editTotal_Calculation);
  }



 edit_onDeleteRow(rowIndex)
  {
    let editproduct = this.Edit_dc.get('product') as FormArray;
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
    let editproduct=this.Edit_dc.get('product') as FormArray;
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
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }
  async edit_onSubmit(value)
  {
    var dc_id =  this.dc_list['dc_id'];
    var serial_no =  this.dc_list['serial_no'];
       Object.keys(this.Edit_dc.controls).forEach(field => {
       const control = this.Edit_dc.get(field);
       control.markAsTouched({ onlySelf: true });
       });
       if (this.Edit_dc.valid)
        {
          const confirmed = confirm("Are you sure you want to update this dc?");
              console.log(confirmed)
              if (!confirmed) {
                return;
              }

          this.loading = true;
          await this.api.post('mp_dc_edit_submit.php?value='+dc_id+'&authToken=' + environment.authToken, value).then((data: any) =>
          {

            if (data.status == "success")
            {
              this.loading = false;
              this.toastrService.success('DC Updated Succesfully');
              this.Return();
              this.returnable_dc_show = false
              this.view_dc = serial_no;
              this.loadonce();
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
 }

 Return()
 {
      this.show_dc_edit = false;
      this.show         = true;
      this.LoadCustomerBills();
      this.returnable_dc_show = false
 }

 async download()
 {

  let dc_id =this.invoicePdf[0].dc_id;
  await this.fontloader();

  this.api.get('mp_download_dc.php?value=' + dc_id + '&authToken=' + environment.authToken).then((data: any) => {
      var invoice_data = data;
     this.pdfDownload( invoice_data);
  }).catch(error => { this.toastrService.error('Something went wrong'); });

 }

async pdfDownload(files) {

  let docDefinition = {
    info:{
       title: files[0].dc_number ,
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
                  { text: ' DELIVERY CHALLAN', fontSize: 11, bold: true, alignment: 'center' },]
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
          [{ text: 'UDYAM : ' + test.company_udyam, fontSize: 10, bold: true, alignment: 'center' }]
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
                { text: 'DC No :', fontSize: 10 },
                { text: 'DC Date :', fontSize: 10 },
                { text: 'State: ', fontSize: 10 },
                { text: 'Pin Code : ', fontSize: 10 },
              ],
              [
                { text: test.dc_number, fontSize: 10 },
                { text: test.dc_date, fontSize: 10 },
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

  var test = files[0].dcItems;
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
          { text: [{ text: ed.item_name,bold: true },{ text: '\n' }, { text: ed.item_description },{ text: '\n' },{text:ed.serial_number?"SN : "+ed.serial_number:''},], border: cellBorder, fontSize: 10, alignment: 'left' },
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
            { text: [{ text: ed.item_name,bold: true },{ text: '\n' }, { text: ed.item_description },{ text: '\n' },{text:ed.serial_number?"SN : "+ed.serial_number:''},], border: cellBorder, fontSize: 10, alignment: 'left' },
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
  const tax_5       =  tax.tax_5.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const tax_12      =  tax.tax_12.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const tax_18      =  tax.tax_18.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const tax_28      =  tax.tax_28.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const round_off   =  test.round_off.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const total       = '₹' + test.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
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
      { text: 'Ship Charge', fontSize: 10, colSpan: 11, alignment: 'right' },
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
   var value =files[0]
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
              { text: 'For ' +test.company_name, margin: [0, 10, 0, 0], bold: true, fontSize: '10', alignment: 'left' },
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

  cancel()
  {
    this.show_dc_edit = false;
    this.show=true;
    this.clone_dc_show=false;
    this.returnable_dc_show = false
  }



  clone()
  {
    this.clone_dc_show = true;
    this.show_dc_edit=false;
    this.show=false;
    this.returnable_dc_show = false
    this.edit_dataload();
    this.LoadItemDetails();
    this.selectEdit_data()

  }
prefix_data:any
  async load_invoicenumber(id)
 {

    this.details =id
    this.todaysDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
      await  this.api.get('mp_dc.php?&value=' + this.details.customer_id+ '&authToken=' + environment.authToken).then((data: any) =>
      {

          let dc_id             = data[0].serial_no + 1;
          this.prefix_data      = data[0].prefix ;
          this.inv_no           = dc_id;
          this.view_dc          = dc_id;
          this.invoice_type     = this.details.dc_type
          if(this.clone_dc_show == true)
          {
            this.Edit_dc.controls['dcNo'].setValue(this.inv_no );
            this.Edit_dc.controls['billDate'].setValue(this.todaysDate);
          }
      }).catch(error => { this.toastrService.error('Something went wrong ') });
}

async onSubmit(bill_data)
  {
    Object.keys(this.Edit_dc.controls).forEach(field => {
      const control = this.Edit_dc.get(field);
      control.markAsTouched({ onlySelf: true });
    });
      if (this.Edit_dc.valid)
      {
            const billNoValue = this.prefix_data+this.inv_no;
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
                const confirmed = confirm("Are you sure you want to confirm creating this clone?");
                      console.log(confirmed)
                      if (!confirmed) {
                        return;
                      }
                  this.loading = true;
                  await this.api.post('mp_dc_create.php?type=new_dc&authToken=' + environment.authToken, bill_data).then((data: any) =>
                  {
                    if (data.status == "success")
                    {
                      this.toastrService.success('DC Added Succesfully');
                      this.loading = false;
                      this.Return();
                      this.show_dc_edit = false;
                      this.show = true;
                      this.loadonce()
                      this.clone_dc_show = false;

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
                  this.toastrService.error('Dc Number was already Exist');
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
    this.api.get('get_data.php?table=dc&find=dc_id&value='+this.dc_id+'&authToken=' + environment.authToken).then((data: any) => {

      this.e_way_bill.controls['bill_no'].setValue(data[0].e_way_bill);
      this.e_way_bill.controls['vehicle_no'].setValue(data[0].vehicle_number);
      this.e_way_bill.controls['shipment_mode'].setValue(data[0].transport_mode);
   }).catch(error => { this.toastrService.error('Something went wrong 1'); });
  }

  async billSubmit(value)
  {
      const confirmed = confirm("Are you sure you want to update this dc?");
              console.log(confirmed)
              if (!confirmed) {
                return;
              }
  let dc_id =this.invoicePdf[0].dc_id;
  this.view_dc =this.dc_list.serial_no;
      await this.api.post('mp_dc_create.php?dc_id='+dc_id+'&type=e_way&authToken=' + environment.authToken, value).then((data: any) =>
      {
          if (data.status == "success")
          {
            this.toastrService.success(' Added Succesfully');
            this.loading = false;
            this.Return();
            this.show_dc_edit = false;
            this.show = true;
            this.loadonce()
            this.clone_dc_show = false;
            this.new_category_id.close();
            this.e_way_bill.reset();
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
    let dc_id =this.invoicePdf[0].dc_id;
    await this.api.post('mp_delete_data.php?table=dc&field=dc_id&delete_id='+dc_id+'&authToken=' + environment.authToken,dc_id).then((data: any) =>
    {
      if (data.status == "success")
      {
               this.view_dc = data.id;
               this.toastrService.success('Deleted Succesfully');
               this.loading = false;
               this.Return();
               this.show_dc_edit = false;
               this.show = true;
               this.loadonce()
               this.clone_dc_show = false;
               this.openMd.close();
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
    const confirmed = confirm("Are you sure you want to update this address?");
              console.log(confirmed)
              if (!confirmed) {
                return;
              }
    this.api.get('get_data.php?table=customer_address&find=cust_addr_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) => {
      this.bill_addr = data[0];

      this.billFrom = this.bill_addr.cust_addr_id;
      this.billAttention = this.bill_addr.attention;
      this.billAddress_line_1 = this.bill_addr.address_line_1;
      this.billAddress_line_2 = this.bill_addr.address_line_2;
      this.billCity = this.bill_addr.city;
      this.billState = this.bill_addr.state;
      this.billZipcode = this.bill_addr.zip_code;
      this.Edit_dc.controls['billFrom'].setValue(this.billFrom);
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  ReloadShippAddr(id) {
     const confirmed = confirm("Are you sure you want to update this address?");
              console.log(confirmed)
              if (!confirmed) {
                return;
              }
    this.api.get('get_data.php?table=customer_address&find=cust_addr_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) => {
      this.shipp_addr = data[0];

      this.shipFrom = this.shipp_addr.cust_addr_id;
      this.shipAttention = this.shipp_addr.attention;
      this.shipAddress_line_1 = this.shipp_addr.address_line_1;
      this.shipAddress_line_2 = this.shipp_addr.address_line_2;
      this.shipCity = this.shipp_addr.city;
      this.shipState = this.shipp_addr.state;
      this.shipZipcode = this.shipp_addr.zip_code;
      this.Edit_dc.controls['shipFrom'].setValue(this.shipFrom);
    }).catch(error => { this.toastrService.error('Something went wrong'); });
  }

  onInputChange()
  {
    const billNoValue = this.inv_no;
    let value = this.CustomerBillList.find(item => item.dc_number === billNoValue);
       if(value != undefined)
       {
        this.toastrService.error('DC number has already been entered')
       }
       if(value == undefined)
       {
       }
  }
}
