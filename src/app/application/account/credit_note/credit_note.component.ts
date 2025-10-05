import { Component, ElementRef, HostListener, OnInit ,Renderer2,ViewChild} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { loadavg } from 'os';
import { debounceTime, of, Subject, switchMap } from 'rxjs';
@Component({
  selector: 'app-credit_note',
  templateUrl: './credit_note.component.html',
  styleUrls: ['./credit_note.component.scss']
})
export class Credit_noteComponent implements OnInit {


  uid = localStorage.getItem('uid');

  temp      : any;
  List      : any;
  selected  : any[] = [];
  show      : boolean = false;
  Bill_list : any[] = [];
   Total_Bill_list : any[] = [];
  show_new_note       : boolean = false;
  private startX      : number = 0;
  private startWidth  : number = 0;
  private columnIndex : number | null = null;
  private resizing    = false;
  tableWidth          : any= 100 ;
  originalTableHeight      : any
  private dropdownOpen    = false;
  DebitNoteForm            : FormGroup;
public notes               : any;
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
  public isDropdownAppendedToBody: boolean = true;
  formShow                = true;
  CustomerBillList         : any;
  ItemList                 : any;
  All_ItemList             : any;
  BillingAddress           : any;
  ShippingAddress          : any;
  GST_Data                 : any;
  GST_Length               : any;
  type_id                  : any;
  taxmode                  : any;
  note_no                  : any;
  type                     : any;
  price                    : any;
  quantity                 : any;
  amount                   : any;
  descriptions             : any;
  uom                      : any;
  customer_id              : any;
  company_name             : any;
  stateCode                : any;
  payment_terms            : any;
  subtotal                 : any = 0;
  total_tax                : any = 0;
  tax_list                 : any;
  Bill_vendor_name         : any;
  Customer_list            : any;
  vendor_list              : any;
  model_ref                : any;
  loading                  : boolean = false
  vendorInput$ = new Subject<string>();
    @ViewChild(DatatableComponent) table: DatatableComponent;
    @ViewChild('tableResponsive', { static: false }) tableResponsive: ElementRef;
    @ViewChild("Confirmation_return",{static:true}) Confirmation_return:ElementRef;
  constructor(public toastrService: ToastrService, private api: ApiService,private fb: FormBuilder,   private renderer: Renderer2,private modalService  : NgbModal,) {

    this.DebitNoteForm = new FormGroup
  ({
      created_by      : new FormControl(this.uid),
      note_no         : new FormControl(null, [Validators.required]),
      bill_to         : new FormControl(null, [Validators.required]),
      vendor_id       : new FormControl(null, [Validators.required]),
      payment_term    : new FormControl(null, [Validators.required]),
      bill_number     : new FormControl(null, [Validators.required]),
      notes           : new FormControl(null, [Validators.required]),
      terms_condition : new FormControl(null, [Validators.required]),
      total           : new FormControl(null, [Validators.required]),
      type            : new FormControl(null, [Validators.required]),
      subTotal        : new FormControl(null, [Validators.required]),
      product         : this.fb.array([]),
      message         : new FormControl(null),
      reference       : new FormControl(null),

    })

   }

 async ngOnInit() {
   await  this.TableData()
   await  this.initProduct();
   await this.LoadItemDetails();
   await this.Details()
  }

  async Details()
  {
    await this.api.get('get_data.php?table=vendor&find=status&value=1&authToken=' + environment.authToken).then((data: any) =>
    {
      console.log("vendor",data)
      this.vendor_list = data;
    }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });

    await this.api.get('get_data.php?table=customers&find=status&value=1&authToken=' + environment.authToken).then((data: any) =>
    {
      console.log("customers",data)
      this.Customer_list = data;
    }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
  }


 async LoadItemDetails()
  {
    await this.api.get('get_data.php?table=item&authToken=' + environment.authToken).then((data: any) =>
    {
      this.All_ItemList = data;
    }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
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


 async TableData()
  {
     await this.api.get('credit_note_debit_note_list.php?type=credit&authToken='+environment.authToken).then((data: any) =>
        {
           console.log(data)
           this.List=data
            this.temp=[...data];
        }).catch(error => {this.toastrService.error('Something went wrong');});

  }

  updateFilter(event)
  {
        const val = event.target.value.toLowerCase();
              const temp = this.temp.filter((d) => {
                return Object.values(d).some(field =>
                  field != null && field.toString().toLowerCase().indexOf(val) !== -1
                );
              });
              this.List = temp;
          this.table.offset = 0;
  }

  onActivate(event)
  {
      if(event.type =="click")
      {
        console.log(event.row)
        localStorage.setItem("credit_note_id",event.row.id)
        this.show = true
      }
  }

  back()
  {
    this.show=false
    this.ngOnInit()

  }


 async addNote(value)
  {
    console.log(value)
    this.show_new_note = true;
    localStorage.removeItem("credit_note_id");
    this.type = value
    if(value == 'vendor')
    {

      await this.api.get('get_data.php?table=bill&asign_field=bill_id&asign_value=DESC&authToken=' + environment.authToken).then((data: any) => {
            this.Total_Bill_list = data;
            console.log("bill ",this.Total_Bill_list)
          }).catch(error => { this.toastrService.error('Something went wrong'); });


    }
    if(value == 'customer')
    {
       await this.api.get('get_data.php?table=invoice&asign_field=invoice_id&asign_value=DESC&authToken=' + environment.authToken).then((data: any) => {
            this.Total_Bill_list = data;
            console.log("invoice ",this.Total_Bill_list)
          }).catch(error => { this.toastrService.error('Something went wrong'); });
    }
  }


    BillSelection(event)
    {
        this.isDropdownAppendedToBody = false;
        this.formShow = false;
    }

    async FetchAddress(data)
  {
    for (let i = 0; i < data.bill_address.length; i++)
    {

        if (data.bill_address[i].set_as_default === 1 && data.bill_address[i].type === 1 && data.bill_address[i].status === 1 ) {

          this.bill_addr          = data.bill_address[i];
          if(this.type == "customer")
          {
            this.billFrom           = this.bill_addr.cust_addr_id;
          }

          if(this.type == "vendor")
          {
            this.billFrom           = this.bill_addr.vendor_addr_id;
          }

          this.billAttention      = this.bill_addr.attention;
          this.billAddress_line_1 = this.bill_addr.address_line_1;
          this.billAddress_line_2 = this.bill_addr.address_line_2;
          this.billCity           = this.bill_addr.city;
          this.billState          = this.bill_addr.state;
          this.billZipcode        = this.bill_addr.zip_code;
          this.DebitNoteForm.controls['bill_to'].setValue(this.billFrom);

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
        // this.invoice.controls['shipFrom'].setValue(this.shipFrom);

      }
    }
  }

ReturnToList()
{

  this.model_ref = this.modalService.open(this.Confirmation_return, { size: 'sm' });
}

Confirm_back()
{
        this.show_new_note = false
        this.formShow = true;
        this.DebitNoteForm.reset();
        this.billFrom           = null;
        this.billAttention      = null;
        this.billAddress_line_1 = null;
        this.billAddress_line_2 = null;
        this.billCity           = null;
        this.billState          = null;
        this.billZipcode        = null;
        this.model_ref.close();
        this.ngOnInit()
        this.resetTableHeight()
        this.isDropdownAppendedToBody = true
}


async specItem(item,i)
  {
    console.log(item)
      const data = this.ItemList.find(i=> i.item_list_id == item)
        console.log("item bind ",data)
       if(this.taxmode == 1)
       {
        this.taxes        = data.tax_percent;
       }
       if(this.taxmode == 0)
       {
        this.taxes        = 0;
       }
        this.price        = data.amount;
        this.quantity     = data.qty;
        this.amount       = data.total;
        this.descriptions = data.item_description;
        this.uom          = data.uom;

    const formData = {
      taxes: item,
    }

    this.patchValues(i);
    this.SubTotalChange();
    this.GSTCalculation();
    console.log(this.DebitNoteForm.controls['product'].value)
  }


  SubTotalChange() {
        let arr = this.DebitNoteForm.controls['product'].value;

        if (!arr || arr.length === 0) {
          this.subtotal = 0;
          this.DebitNoteForm.controls['subTotal'].setValue('0.00');
          return;
        }

        let sum = arr .map(a => Number(a.amount) || 0) // ensure `amount` is a number or 0
          .reduce((a, b) => a + b, 0);     // provide initial value 0

        this.subtotal = sum;
        this.DebitNoteForm.controls['subTotal'].setValue(sum.toFixed(2));

        // Call other calculations
        this.FinalTotalCalculation();
        this.GSTCalculation();

}


  initProduct()
  {
    let product = this.DebitNoteForm.get('product') as FormArray;
    product.push(this.fb.group({
      dc_id       : new FormControl(''),
      items       : new FormControl('',Validators.required),
      descriptions: new FormControl(''),
      taxes       : new FormControl('', Validators.required),
      price       : new FormControl('', Validators.required),
      quantity    : new FormControl('', Validators.required),
      amount      : new FormControl('', Validators.required),
      uom         : new FormControl('', Validators.required)
    }))
  }


   patchValues(i)
    {
      console.log()
      let x = (<FormArray>this.DebitNoteForm.controls['product']).at(i);
      x.patchValue({
        dc_id    :  0,
        taxes    : this.taxes,
        price    : this.price,
        quantity : this.quantity,
        amount   : this.amount,
        descriptions : this.descriptions,
        uom      : this.uom
      });
    }


     GSTCalculation() {

    this.GST_Data.forEach(data => {
      data.amount = 0;
    });

    this.total_tax = 0;
    let products = (<FormArray>this.DebitNoteForm.controls['product']).value;
    products.forEach(product => {

      let taxValue = ( parseFloat( product.amount) / 100) * parseFloat(product.taxes);
      let taxAmount = parseFloat(taxValue.toFixed(2));
      this.total_tax  += (parseFloat( product.amount) / 100) * parseFloat( product.taxes);
          console.log("Gst Data :   ",this.GST_Data)
           console.log("product",product)
          console.log("amount",product.amount)
          console.log("taxes",product.taxes)
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

  get productControls() {
  return (this.DebitNoteForm.get('product') as FormArray).controls;
}

  GSTCalculation_tax(value,j)
  {
    this.taxes        = parseInt(value);
    let y = (<FormArray>this.DebitNoteForm.controls['product']).at(j);
    y.patchValue({
      taxes        : this.taxes,
     })

    this.SubTotalChange();
    this.GSTCalculation();
    this.FinalTotalCalculation();
  }

  qty(qty, price, i)
  {
      const x = (this.DebitNoteForm.get('product') as FormArray).at(i);
      console.log("item qty change", x.value);
      console.log("item list", this.ItemList);
      const selectedItemId = x.get('items')?.value;
      const item = this.ItemList.find(d => d.item_list_id == selectedItemId);
      console.log("item ",item)
      console.log("qty ",qty)
      console.log(" item qty ",item.qty)
      this.amount = qty * price;
    if(item.qty >= qty )
    {
        x.patchValue({
           amount : this.amount
        });
        this.SubTotalChange();
    }
    else {
          //  Quantity entered exceeds stock or item not found
          x.patchValue({
            quantity: item.qty,
          });

          // Optional: Add a custom error or show a warning
          console.warn(`Quantity exceeds available stock for item: ${selectedItemId}`);
          this.toastrService.warning("Quantity exceeds available stock for item")
          // Optional: Mark control as invalid if needed
          x.get('quantity')?.setErrors({ exceedStock: true });
       }

  }

  priceChange(qty: number, price: number, i: number) {

      const x = (this.DebitNoteForm.get('product') as FormArray).at(i);
      console.log("item qty change", x.value);
      console.log("item list", this.ItemList);

      const selectedItemId = x.get('items')?.value;
      const item = this.ItemList.find(d => d.item_list_id == selectedItemId);
      console.log("item.price ",item.amount)
      console.log("price ",price)
      const def_price = parseFloat(item.amount)
      if (def_price >= price) {
        this.amount = qty * price;

        x.patchValue({
          amount: this.amount
        });

        this.SubTotalChange();
      } else {
          //  Quantity entered exceeds stock or item not found
          x.patchValue({
            price: item.amount,
          });

          // Optional: Add a custom error or show a warning
          console.warn(`Amount exceeds available stock for item: ${selectedItemId}`);

            this.toastrService.warning("Amount exceeds available stock for item")
          // Optional: Mark control as invalid if needed
          x.get('quantity')?.setErrors({ exceedStock: true });
  }
}

  onDeleteRow(rowIndex)
  {
    let product = this.DebitNoteForm.get('product') as FormArray;
    if (product.length > 1) {
      product.removeAt(rowIndex)
    } else {
      product.reset()
    }
    this.SubTotalChange();
  }

  FinalTotalCalculation()
  {
    let Sub_Total       = this.DebitNoteForm.controls['subTotal'].value;

    let TotalGST: number = this.GST_Data.map(a => a.amount).reduce(function(a, b)
    {
      return a + b;
    });
    let Total_Calculation =  Number(Sub_Total) + Number(TotalGST);
    this.DebitNoteForm.controls['total'].setValue((Total_Calculation).toFixed(2));
  }


  Selection(id)
  {
     this.customer_id = id
    console.log(id)
    if(this.type == "vendor")
    {
      this.Bill_list = this.Total_Bill_list.filter(i => i.vendor_id == id )
      console.log(this.Bill_list)
    }
    if(this.type == "customer")
    {
      this.Bill_list = this.Total_Bill_list.filter(i => i.customer_id == id )
      console.log(this.Bill_list)
    }
        this.DebitNoteForm.reset();
        this.billFrom           = null;
        this.billAttention      = null;
        this.billAddress_line_1 = null;
        this.billAddress_line_2 = null;
        this.billCity           = null;
        this.billState          = null;
        this.billZipcode        = null;
    this.DebitNoteForm.controls['type'].setValue(this.type);
    this.DebitNoteForm.controls['created_by'].setValue(this.uid);
    this.DebitNoteForm.controls['subTotal'].setValue(0);
     this.DebitNoteForm.controls['vendor_id'].setValue(this.customer_id);
  }

  async VendorSelection(id)
  {
    this.isDropdownAppendedToBody = false;
    this.formShow = false;

     this.tableWidth=100
    const today = new Date();
    let date = today.toISOString().split('T')[0];


    if(this.type == "vendor")
    {
       const customer = this.Bill_list.find(i => i.bill_id == id)
       this.customer_id = customer.vendor_id
       console.log("customer : ",customer)

       this.Bill_vendor_name = customer
      //  this.DebitNoteForm.controls['vendor_id'].setValue(this.customer_id);
       this.DebitNoteForm.controls['terms_condition'].setValue(customer.terms_condition)
       this.DebitNoteForm.controls['payment_term'].setValue(customer.payment_term)
       this.DebitNoteForm.controls['bill_number'].setValue(customer.bill_number);

          await this.api.get('get_data.php?table=vendor&find=vendor_id&value='+this.customer_id+'&authToken=' + environment.authToken).then((data: any) => {
            this.Bill_vendor_name = data[0].company_name;
            console.log("bill ",data)
          }).catch(error => { this.toastrService.error('Something went wrong'); });

        await  this.api.get('get_data.php?table=bill_item&find=bill_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) =>
        {

          for (let j=0;j<data.length;j++)
            {
               console.log("All_ItemList : ",this.All_ItemList)
                console.log("item_list_id : ",data[j].item_list_id)
                  const item = this.All_ItemList.find(i => i.item_id == data[j].item_list_id)
                  console.log("item : ",item)
                  data[j]['name'] = item.name
            }

            console.log("data ", data)
          this.ItemList = data;
        }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });


                await this.api.get('mp_bill.php?&value=' + this.customer_id + '&authToken=' + environment.authToken).then((data: any) =>
                  {
                    console.log("bill  :",data)
                    this.FetchAddress(data[0]);

                    this.company_name    = data[0].company_name;
                    this.notes           = data[0].notes;
                    this.terms_condition = data[0].terms_condition;
                    this.stateCode       = data[0].place_from_supply_code;
                    this.payment_terms   = data[0].payment_terms;
                    let creditNoteNumber = parseInt(data[0].credit_note);
                    this.taxmode         = data[0].tax_mode;
                      if (isNaN(creditNoteNumber)) {

                        // Handle the error if it's not a valid number
                        console.error("Invalid credit_note value");
                      } else {
                        this.note_no = data[0].credit_prefix + (creditNoteNumber + 1);
                      }

                    const today = new Date();
                    let date = today.toISOString().split('T')[0];

                    if(this.stateCode == 33)
                    {
                      this.LoadGST('GST');
                    }
                    else
                    {
                      this.LoadGST('IGST');
                    }
                  }).catch(error => { this.toastrService.error('Something went wrong'); });

    }
     if(this.type == "customer")
    {
       const customer = this.Bill_list.find(i => i.invoice_id == id)
      //  this.customer_id = customer.customer_id

      //  this.DebitNoteForm.controls['vendor_id'].setValue(this.customer_id);
       this.DebitNoteForm.controls['terms_condition'].setValue(customer.terms_condition)
       this.DebitNoteForm.controls['payment_term'].setValue(customer.payment_term)
       this.DebitNoteForm.controls['bill_number'].setValue(customer.invoice_number);
       console.log("customer : ",customer)


         await this.api.get('get_data.php?table=vendor&find=vendor_id&value='+this.customer_id+'&authToken=' + environment.authToken).then((data: any) => {
            this.Bill_vendor_name = data[0].company_name;
            console.log("bill ",data)
          }).catch(error => { this.toastrService.error('Something went wrong'); });

        await  this.api.get('get_data.php?table=invoice_item&find=invoice_id&value=' + id + '&authToken=' + environment.authToken).then((data: any) =>
        {


          for (let j=0;j<data.length;j++)
            {
                  const item = this.All_ItemList.find(i => i.item_id == data[j].item_list_id)
                  console.log("item : ",item)
                  data[j]['name'] = item.name
            }

            console.log("data ", data)
          this.ItemList = data;
        }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });

        await this.api.get('mp_invoice.php?&value=' + this.customer_id + '&authToken=' + environment.authToken).then((data: any) =>
            {
              this.FetchAddress(data[0]);
              this.company_name    = data[0].company_name;
              this.notes           = data[0].notes;
              this.terms_condition = data[0].terms_condition;
              this.stateCode       = data[0].place_from_supply_code;
              this.payment_terms   = data[0].payment_terms;
              let MyPaymentTerm    = data[0].my_payment_terms;
              this.taxmode         = data[0].tax_mode;

              let creditNoteNumber = parseInt(data[0].credit_note);

                if (isNaN(creditNoteNumber)) {

                  // Handle the error if it's not a valid number
                  console.error("Invalid credit_note value");
                } else {
                  this.note_no = data[0].credit_prefix + (creditNoteNumber + 1);
                }
              const today = new Date();
              let date = today.toISOString().split('T')[0];

                if(this.stateCode == 33)
                {
                  this.LoadGST('GST');
                  // this.invoice.controls['tax_type'].setValue("GST");
                }
                else
                {
                  this.LoadGST('IGST');
                  // this.invoice.controls['tax_type'].setValue("IGST");
                }

            }).catch(error => { this.toastrService.error('Something went wrong'); });
    }

    const formArray         = this.DebitNoteForm.get('product') as FormArray;
    const formArrayControls = formArray.controls;
    for (let i = formArrayControls.length-1; i >= 1; i--)
    {
      const control = formArrayControls[i];
      formArray.removeAt(i);
    }

  }


  async LoadGST(mode)
  {
    await this.api.get('get_data.php?table=tax&find=type&value=' + mode + '&authToken=' + environment.authToken).then((data: any) =>
    {
      this.GST_Data   = data;
      this.tax_list   = data;
      this.GST_Length = data.length;
    }).catch(error => { this.toastrService.error('Something went wrong'); });

    for(let m = 0; m < this.GST_Length; m++)
      {
        this.GST_Data[m]['amount'] = 0;
      }
  }


 async onSubmit(value)
  {
      console.log(value)
       Object.keys(this.DebitNoteForm.controls).forEach(field => {
      const control = this.DebitNoteForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    console.log(this.DebitNoteForm.value.total)

      const total = parseFloat(this.DebitNoteForm.value.total)
    if(this.DebitNoteForm.valid && total > 0)
      {
        this.loading = true
        console.log("valid")
         await this.api.post('credit_note_create_accounts.php?&authToken=' + environment.authToken,this.DebitNoteForm.value).then(async(data: any) =>
            {
              console.log(data)
              if(data.status == "success")
              {
                this.loading = false
                await this.toastrService.success("Created successful");
                this.show_new_note = false ;
                this.DebitNoteForm.reset();
                this.billFrom           = null;
                this.billAttention      = null;
                this.billAddress_line_1 = null;
                this.billAddress_line_2 = null;
                this.billCity           = null;
                this.billState          = null;
                this.billZipcode        = null;

                 const formArray         = this.DebitNoteForm.get('product') as FormArray;
                    const formArrayLength   = formArray.length;
                    const formArrayControls = formArray.controls;
                    for (let i = formArrayControls.length-1; i >= 1; i--)
                    {
                    const control = formArrayControls[i];
                    formArray.removeAt(i);
    }
                await this.ngOnInit();
              }
            }).catch(error => { this.toastrService.error('Something went wrong'); this.loading = false });
      }
      else
      {
        this.toastrService.error("Fill the form")
      }
  }
}
