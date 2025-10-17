import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ImgToBase64Service } from 'src/app/service/img-to-base64.service';
import { AppState } from 'src/app/app.state';

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
  selector: 'app-debit_note_view',
  templateUrl: './debit_note_view.component.html',
  styleUrls: ['./debit_note_view.component.scss']
})
export class Debit_note_viewComponent implements OnInit {

  List            : any
   selected        = []
   SelectionType   = SelectionType;
   Selected_ID     = localStorage.getItem("debit_note_id")

   Details         : any
   form            : FormGroup;
   modalRef        : any
   imageToShow     : string | ArrayBuffer;
    imgUrl          : string = '../../../../assets/img/logo/geogreen.png';
   company_profile : any
   billToAddress   : any
   private startX      : number = 0;
   private startWidth  : number = 0;
   private columnIndex : number | null = null;
   private resizing    = false;
   tableWidth          : any= 100 ;
   originalTableHeight : any
   private dropdownOpen      = false;
   show_edit_note  : boolean = false
   show        = false

   taxes         :any
   subtotal      :any
   GST_Length    :any
   statecode     :any
   bill_number   :any
    All_ItemList :any
   price       : any;
   quantity    : any;
   amount      : any;
   descriptions: any;
   uom         : any;
   GST_Data    : any;
   total_tax   : number;
   ItemList    : any;
   notes       : any;
   item_DeleteId : any;
   item_index  : any;
   temp        : any;

   @ViewChild("add",{static:true}) add:ElementRef;
   @ViewChild('tableResponsive', { static: false }) tableResponsive: ElementRef;
   @ViewChild("delete_item",{static:true}) delete_item:ElementRef;
   @ViewChild("delete_note",{static:true}) delete_note:ElementRef;

   constructor(public toastrService: ToastrService, private api: ApiService,public fb:FormBuilder,private modalService  : NgbModal,private _state : AppState,
                private imgToBase64: ImgToBase64Service,private renderer: Renderer2)
   {
     this.form=fb.group(
     {
       message         : ['',Validators.compose([Validators.required])],
       reference       : ['',Validators.compose([Validators.required])],
       note_no         : [],
       bill_to         : [],
       vendor_id       : [],
       payment_term    : [],
       bill_number     : [],
       notes           : [],
       terms_condition : [],
       total           : [],
       type            : [],
       subTotal        : [],
       product         : this.fb.array([]),

     })
   }

  async ngOnInit() {
     this._state.notifyDataChanged('menu.isCollapsed', true);
    await this.TableData()
    await this.getImageFromService()
    await this.LoadItemDetails()
     setTimeout(() => {
         this.show=true
     }, 100);
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



  async LoadItemDetails()
   {
     await this.api.get('get_data.php?table=item&authToken=' + environment.authToken).then((data: any) =>
     {
       this.All_ItemList = data;
     }).catch(error => { this.toastrService.error('Something went wrong in LoadItemDetails'); });
   }


   async TableData()
     {
        await this.api.get('credit_note_debit_note_list.php?type=debit&authToken='+environment.authToken).then((data: any) =>
           {
              console.log(data)
              this.List=data
              this.temp  = [...data]
             var selectedId  = this.Selected_ID;
             console.log("Selected_ID : ",this.Selected_ID)
             let selectedRow = this.List.find(item => item.id == selectedId || item.serial_no == this.Selected_ID);
             console.log("selectedRow : ",selectedRow)
             if (selectedRow)
             {
               this.selected = [selectedRow];
               this.Details = selectedRow
               setTimeout(() => this.scrollToSelectedRow(this.Selected_ID), 500);
             }
           }).catch(error => {this.toastrService.error('Something went wrong');});

     }

      updateFilter(event) {
          const val = event.target.value.toLowerCase();
          const temp = this.temp.filter((d) => {
            return Object.values(d).some(field =>
              field != null && field.toString().toLowerCase().indexOf(val) !== -1
            );
          });
          this.List = temp;
    // this.table.offset = 0;
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
         if(event.type=="click")
         {
           this.Details = event.row
           console.log(this.Details)
         }
     }
   onSelect(event)
   {

   }


 async  edit()
   {
     console.log("Details",this.Details)
     this.form.controls['message'].setValue(this.Details.message)
     this.form.controls['reference'].setValue(this.Details.reference)
     this.form.controls['notes'].setValue(this.Details.note)
     this.notes =this.Details.note

     // this.modalRef = this.modalService.open(this.add, { size: 'md' });
     if(this.Details.place_from_supply_code == 33)
     {
     await this.edit_LoadGST('GST')
     }
     if(this.Details.place_from_supply_code != 33)
     {
     await this.edit_LoadGST('IGST')
     }

       if(this.Details.type =="customer")
       {
        await this.api.get('get_data.php?table=invoice_item&find=invoice_id&value=' + this.Details.invoice_id + '&authToken=' + environment.authToken).then((data: any) =>
       {
         console.log("invoice item",data)

         for (let j=0;j<data.length;j++)
                 {
                       const item = this.All_ItemList.find(i => i.item_id == data[j].item_list_id)
                       data[j]['name'] = item.name
                 }
               this.ItemList = data;
           }).catch(error => { this.toastrService.error('Something went wrong' ); });
     }

     if(this.Details.type =="vendor")
       {
        await this.api.get('get_data.php?table=bill_item&find=bill_id&value=' + this.Details.bill_id + '&authToken=' + environment.authToken).then((data: any) =>
       {
         console.log("invoice item",data)

         for (let j=0;j<data.length;j++)
                 {
                       const item = this.All_ItemList.find(i => i.item_id == data[j].item_list_id)
                       data[j]['name'] = item.name
                 }
               this.ItemList = data;
           }).catch(error => { this.toastrService.error('Something went wrong' ); });
     }

      const product1 = this.form.get('product') as FormArray;
       product1.clear();

       console.log(this.Details.item_list)
       this.Details.item_list.forEach((item,j) => {
         product1.push(this.fb.group({
           type        : "edit",
           id          : [item.id],
           items       : [item.item_list_id],
           descriptions: [item.item_description],
           taxes       : [item.tax_percent],
           price       : [item.amount],
           quantity    : [item.qty],
           uom         : [item.uom],
           amount      : [item.total],
         }));

          let qty   = item.qty;
          let price = item.amount;
          this.priceChange(qty, price, j);

         })
     for(let m = 0; m < this.Details.item_list.length; m++)
     {
       this.GSTCalculation();
     }

     this.show_edit_note = true
     this.show = false
 }

 async specItem(item,i)
   {
     console.log(item)
       const data = this.ItemList.find(i=> i.item_list_id == item)
         this.taxes        = data.tax_percent;
         this.price        = data.amount;
         this.quantity     = data.qty;
         this.amount       = data.total;
         this.descriptions = data.item_description;
         this.uom          = data.uom;

     this.patchValues(i);
     this.SubTotalChange();
     this.GSTCalculation();
   }

  async edit_LoadGST(mode)
   {
       await this.api.get('get_data.php?table=tax&find=type&value=' + mode + '&authToken=' + environment.authToken).then((data: any) =>
       {
        this.GST_Data     = data;
        this.GST_Length   = data.length;
        this.GST_Length   = data.length;
       }).catch(error => { this.toastrService.error('Something went wrong' ); });

         for(let n = 0; n < this.GST_Length; n++)
         {
           this.GST_Data[n]['amount'] = 0;
         }
   }

  SubTotalChange() {
         let arr = this.form.controls['product'].value;

         if (!arr || arr.length === 0) {
           this.subtotal = 0;
           this.form.controls['subTotal'].setValue('0.00');
           return;
         }

         let sum = arr .map(a => Number(a.amount) || 0) .reduce((a, b) => a + b, 0);
         this.subtotal = sum;
         this.form.controls['subTotal'].setValue(sum.toFixed(2));
         this.FinalTotalCalculation();
         this.GSTCalculation();

 }


   initProduct()
   {
     let product = this.form.get('product') as FormArray;
     product.push(this.fb.group({
       type        :new FormControl('new'),
       id          : new FormControl(''),
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
       let x = (<FormArray>this.form.controls['product']).at(i);
       x.patchValue({
         dc_id    :  0,
         taxes    : this.taxes,
         price    : this.amount,
         quantity : this.quantity,
         // amount   : this.total,
         descriptions : this.descriptions,
         uom      : this.uom
       });
     }


      GSTCalculation() {

     this.GST_Data.forEach(data => {
       data.amount = 0;
     });

     this.total_tax = 0;
     let products = (<FormArray>this.form.controls['product']).value;
     products.forEach(product => {

       let taxValue = ( parseFloat( product.amount) / 100) * parseFloat(product.taxes);
       let taxAmount = parseFloat(taxValue.toFixed(2));
       this.total_tax  += (parseFloat( product.amount) / 100) * parseFloat( product.taxes);
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
   return (this.form.get('product') as FormArray).controls;
 }

   GSTCalculation_tax(value,j)
   {
     this.taxes        = parseInt(value);
     let y = (<FormArray>this.form.controls['product']).at(j);
     y.patchValue({
       taxes        : this.taxes,
      })

     this.SubTotalChange();
     this.GSTCalculation();
     this.FinalTotalCalculation();
   }

   qty(qty, price, i)
   {
       const x = (this.form.get('product') as FormArray).at(i);
       const selectedItemId = x.get('items')?.value;
       const item = this.ItemList.find(d => d.item_list_id == selectedItemId);
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

           this.toastrService.warning("Quantity exceeds available stock for item")
           // Optional: Mark control as invalid if needed
           x.get('quantity')?.setErrors({ exceedStock: true });
        }

   }

   priceChange(qty: number, price: number, i: number) {

       const x = (this.form.get('product') as FormArray).at(i);
       const selectedItemId = x.get('items')?.value;
       console.log("ItemList ",this.ItemList)
       console.log("selectedItemId",selectedItemId)
       const item = this.ItemList.find(d => d.item_list_id == selectedItemId);
       const def_price = parseFloat(item.amount)
       console.log("def_price",def_price)
        console.log("price",price)
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
             this.toastrService.warning("Amount exceeds available stock for item")
           // Optional: Mark control as invalid if needed
           x.get('quantity')?.setErrors({ exceedStock: true });
   }
 }


   onDeleteRow(rowIndex)
   {
     this.item_index = rowIndex
     let editproduct=this.form.get('product') as FormArray;
     const delete_data = editproduct.at(rowIndex).value;
     console.log(delete_data)
     if (delete_data.type=="new" && editproduct.length>0)
     {
       editproduct.removeAt(rowIndex)
     }
     else if(delete_data.type=="edit")
     {
       this.item_DeleteId = delete_data.id
       this.modalRef= this.modalService.open(this.delete_item, { size: 'md' });
     }
     else
     {
       editproduct.reset()
     }
     this.SubTotalChange()
   }

    async Delete()
     {
        let editproduct=this.form.get('product') as FormArray;
       await  this.api.get('delete_data.php?authToken='+environment.authToken+'&table=debit_note_item&field=id&id='+this.item_DeleteId).then( async(data: any) =>
         {
               editproduct.removeAt(this.item_index)
              await this.toastrService.success('Item Deleted Successful');
              await this.modalRef.close()
             await  this.SubTotalChange();

         }).catch(error =>
         {
             this.toastrService.error('Something went wrong');
         });
     }

   FinalTotalCalculation()
   {
     let Sub_Total       = this.form.controls['subTotal'].value;

     let TotalGST: number = this.GST_Data.map(a => a.amount).reduce(function(a, b)
     {
       return a + b;
     });
     let Total_Calculation =  Number(Sub_Total) + Number(TotalGST);
     this.form.controls['total'].setValue((Total_Calculation).toFixed(2));
   }




  async company_details()
   {
      await  this.api.get('get_data.php?table=company_profile&authToken=' + environment.authToken).then((data: any) => {
             this.company_profile = data[0]
         }).catch(error => { this.toastrService.error('Something went wrong'); });
   }


    async pdfDownload() {
           await  this.company_details()
     let docDefinition = {
       info: {
         title:this.Details.debit_note_no,
       },
       content: [
         {
                   stack: [
                     this.getCompanyDetails(),
                     this.getMobileDetails(),
                     this.getGstObject(),
                     {
                       table: {
                         widths: ['*'],
                         body: [
                           [
                             [
                               [
                                 { text: ' DEBIT NOTE', fontSize: 11, bold: true,border: [false, false, false, false], alignment: 'center' },]
                             ],
                           ],
                         ]
                       },
                       layout: {
                           // Horizontal lines: only top and bottom of the table
                           hLineWidth: function (i, node) {
                             return (i === 0 || i === node.table.body.length) ? 0 : 0;
                           },
                           // Vertical lines: remove completely
                           vLineWidth: function (i, node) {
                             return 0;
                           }
                       }
                   },

                   this.getInvoiceObject(),
                   this.getBillObject(),
                   this.getItemsObject(),
                   this.getItemstotalObject(),
                   this.getBankObject(),
                   this.getTermsObject(),
                 ]
           }
        ],
         footer: function(currentPage, pageCount) {
               return {
                 columns: [
                   { text: 'For ' + "Geo green enviro engg erp", alignment: 'left', margin: [40, 0, 0, 0],  fontSize: 8 },
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
    // pdfMake.createPdf(docDefinition).download("invoice.pdf");
   }

   getCompanyDetails() {
   var test = this.company_profile;
       console.log(test)
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

 getMobileDetails() {
   var test = this.company_profile
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
         vLineWidth: function (i, node) {
         return 0; // remove vertical lines
     },
     },
   }
 }

 getGstObject() {

   var test = this.company_profile
   return {
     table: {
       widths: ['*', '*'],
       body: [
         [
           [
             { text: 'GSTIN :' + test.gst_number, fontSize: 10, bold: true,border: [false, true, false, false], alignment: 'center' },
           ],
           [{  text: 'UDYAM : ' + test.udyam_no,  fontSize: 10, bold: true,border: [false, false, false, false], alignment: 'center' }]
         ],
       ]
     },
     layout: {
       hLineWidth: function (i, node) {
         return (i === 0 || i === node.table.body.length) ? 1 : 0;
       },
         vLineWidth: function (i, node) {

         // Only draw vertical line between column 0 and 1
         return (i === 1) ? 1 : 0;

     },
     },
   }

 }

 getInvoiceObject() {

   var test = this.Details
   return {

     table: {
       widths: ['*', '*'],
       body: [
         [
           {
             columns: [
               [
                 { text: 'Debit Note No :', fontSize: 10 },
                 { text: 'Date :', fontSize: 10 },
                 { text: 'State: ', fontSize: 10 },
                 { text: 'Pin Code : ', fontSize: 10 },
               ],
               [
                 { text: test.debit_note_no, fontSize: 10 },
                 { text: test.generate_date, fontSize: 10 },
                 { text: test.state, fontSize: 10 },
                 { text: this.company_profile.pincode, fontSize: 10 },
               ]

             ]
           },

           {
             columns: [
              [


                { text: test.type =='vendor'?'Bill No :':'Invoice No', fontSize: 10 },
              ],
              [

                { text: test.bill_number?test.bill_number:test.invoice_no, fontSize: 10 },

              ]
            ]
           },
         ],
       ]
     },
      layout: {
       hLineWidth: function (i, node) {
         return (i === 1 || i === node.table.body.length) ? 1 : 1;
       },
      vLineWidth: function (i, node) {
         return (i === 1) ? 1 : 0; // remove vertical lines
     },
     },
   }
 }

 getBillObject() {

   var test = this.Details

   return {
     table: {
       widths: ['*'],
       body: [
         [
           [
             { text: 'To:', bold: true, fontSize: 10 },
             { text: test.attention, bold: true, fontSize: 10 },
             { text: test.address_line_1, fontSize: 10 },
             { text: test.address_line_2, fontSize: 10 },
             { text: 'GST No :' + test.gst_number, fontSize: 10, bold: true },
             { text: test.udyam_number ? 'Udyam No :'+test.udyam_number : '', fontSize: 10 ,bold:true},
             { text: 'State :' + test.state, fontSize: 10,  },
             { text: 'Pin Code :' + test.pincode, alignment: 'left', bold: true, fontSize: 10 },
           ],
         ],
       ]
     },
     layout: {
       layout: 'lightHorizontalLines',
       hLineWidth: function (i, node) {
         return (i === 0 || i === node.table.body.length) ? 0 : 0;
       },
        vLineWidth: function (i, node) {
         return  0; // remove vertical lines
     },
     },
   }
 }

 getItemsObject() {

   var test = this.Details.item_list;
   var serialNumber = 1;
   if(this.Details.place_from_supply_code == 33)
   {
   return {
   table: {
     widths: [10, 112, 40,27, 27, 35, 19, 33, 19, 33,60],
     body: [
       [
         { text: '#', border: [false, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true , alignment: 'center'},
         { text: 'Product Description', alignment: 'center',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 9, bold: true },
         { text: 'HSN', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true , alignment: 'center'},
         { text: 'QTY', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true, alignment: 'center' },
         { text: 'UOM', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true, alignment: 'center' },
         { text: "Unit Rate", border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 8, bold: true, alignment: 'center' },
         { text: 'CGST', border: [true, true, false, false],fillColor: '#CCCCCC',fontSize: 8, bold: true, alignment: 'center', colSpan: 2 },
         {},
         { text: 'SGST', fontSize: 8, bold: true,fillColor: '#CCCCCC', alignment: 'center', colSpan: 2 },
         {},
         { text: 'Amount', border: [true, true, false, false],fillColor: '#CCCCCC', fontSize: 8, bold: true ,alignment: 'center'},
       ],
       [
         { text: '',fillColor: '#CCCCCC', border: [false, false, true, false] },
         { text: '',fillColor: '#CCCCCC', border: [true, false, true, false] },
         { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
         { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
         { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
         { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
         { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 9 ,alignment:'center'},
         { text: 'Amt',fillColor: '#CCCCCC', bold: true, fontSize: 8,alignment:'center' },
         { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 9,alignment:'center'},
         { text: 'Amt',fillColor: '#CCCCCC', bold: true, fontSize: 8,alignment:'center' },
         { text: '',fillColor: '#CCCCCC', border: [true, false, false, false], bold:true},
       ],
       ...test.map((ed, index) => {
           let cellBorder = [false, true, true, false];
           if (index > 0) {
             cellBorder = [false, true, true, false];
           }

         return [
           { text:  serialNumber++,border:cellBorder, fontSize: 8 , alignment: 'center'},
           { text: [{ text: ed.name,bold: true },{ text: '\n' }, { text: ed.item_description },], border: cellBorder, fontSize: 9, alignment: 'left' },
           { text: ed.hsn,border:cellBorder, fontSize: 8 , alignment: 'center'},
           { text: ed.qty,border:cellBorder, fontSize: 8 , alignment: 'center'},
           { text: ed.uom,border:cellBorder, fontSize: 8 , alignment: 'center'},
           { text: ed.amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 8 , alignment: 'center'},
           { text: ed.tax_percent/2 +'%',border:cellBorder, fontSize: 8 ,alignment: 'center'},
           { text: (ed.tax_amount/2).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 8 , alignment: 'center'},
           { text: ed.tax_percent/2 +'%',border:cellBorder, fontSize: 8 , alignment: 'center'},
           { text: (ed.tax_amount/2).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 8 , alignment: 'center'},
           { text: ed.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'), border: [true, true, false, false], fontSize: 8,  alignment: 'right'}]
         },
         )
       ],
     }
     }
   }

   if(this.Details.place_from_supply_code != 33)
     {
     return {
     table: {
       widths: [11, 130, 57, 35, 32, 40, 30,43,55],
       body: [
         [
           { text: '#', border: [false, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true , alignment: 'center'},
           { text: 'Product Description', alignment: 'center',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 10, bold: true },
           { text: 'HSN', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true , alignment: 'center'},
           { text: 'QTY', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true, alignment: 'center' },
           { text: 'UOM', border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true, alignment: 'center' },
           { text: "Unit Rate", border: [true, true, true, false],fillColor: '#CCCCCC', fontSize: 10, bold: true, alignment: 'center' },
           { text: 'IGST', border: [true, true, false, false],fillColor: '#CCCCCC',fontSize: 10, bold: true, alignment: 'center', colSpan: 2 },
           { text: '',fillColor: '#CCCCCC',border: [false, false, false, false]},
           { text: 'Amount', border: [true, true, false, false],fillColor: '#CCCCCC', fontSize: 10, bold: true ,alignment: 'center'},
         ],
         [
           { text: '',fillColor: '#CCCCCC', border: [false, false, true, false] },
           { text: '',fillColor: '#CCCCCC', border: [true, false, true, false] },
           { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
           { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
           { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
           { text: '', fillColor: '#CCCCCC',border: [true, false, true, false] },
           { text: '%',fillColor: '#CCCCCC', bold: true, fontSize: 11 ,alignment:'center'},
           { text: 'Amt',fillColor: '#CCCCCC', bold: true, fontSize: 10,alignment:'center' },
           { text: '',fillColor: '#CCCCCC', border: [true, false, false, false], bold:true},
         ],
         ...test.map((ed, index) => {
             let cellBorder = [false, true, true, false];
             if (index > 0) {
               cellBorder = [false, true, true, false];
             }

           return [
             { text:  serialNumber++,border:cellBorder, fontSize: 9 , alignment: 'center'},
             { text: [{ text: ed.name,bold: true },{ text: '\n' }, { text: ed.item_description },], border: cellBorder, fontSize: 9, alignment: 'left' },
             { text: ed.hsn,border:cellBorder, fontSize: 9 , alignment: 'center'},
             { text: ed.qty,border:cellBorder, fontSize: 9 , alignment: 'center'},
             { text: ed.uom,border:cellBorder, fontSize: 9 , alignment: 'center'},
             { text: ed.amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 9 , alignment: 'center'},
             { text: ed.tax_percent +'%',border:cellBorder, fontSize: 9 ,alignment: 'center'},
             { text: (ed.tax_amount).toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'),border:cellBorder, fontSize: 9 , alignment: 'center'},
             { text: ed.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'), border: [true, true, false, false], fontSize: 9,  alignment: 'right'}]
           },
           )
         ],
       }
     }
   }
 }

 getItemstotalObject() {

   var test = this.Details;
   var tax  = this.Details.tax_data;
   const without_tax = '₹' + test.sub_total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
   const tax_5     =  tax.tax_5.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
   const tax_12    =  tax.tax_12.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
   const tax_18    =  tax.tax_18.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
   const tax_28    =  tax.tax_28.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
   const round_off =  test.round_off?.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
   const total     = '₹' + test.total_amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');

   var rows = [
     [
       { text: 'Total Amount Before Tax', fontSize: 10, colSpan: 11, alignment: 'right',border:[false, true, true, false] },
       '', '', '', '', '', '', '', '', '', '',
       { text: without_tax, fontSize: 10 ,alignment: 'right',border: [true, true, false, false]}
     ],

   ];

   if (tax.tax_5 > 0) {
     rows.push([
       { text: 'GST (5%)', fontSize: 10, colSpan: 11, alignment: 'right',border:[false, true, true, false]},
       '', '', '', '', '', '', '', '', '', '',
       { text: tax_5, fontSize: 10 ,alignment: 'right',border: [true, true, false, false]}
     ]);
   }

   if (tax.tax_12 > 0) {
     rows.push([
       { text: 'GST (12%)', fontSize: 10, colSpan: 11, alignment: 'right' ,border:[false, true, true, false]},
       '', '', '', '', '', '', '', '', '', '',
       { text: tax_12, fontSize: 10, alignment: 'right',border: [true, true, false, false]}
     ]);
   }

   if (tax.tax_18 > 0) {
     rows.push([
       { text: 'GST (18%)', fontSize: 10, colSpan: 11, alignment: 'right',border:[false, true, true, false] },
       '', '', '', '', '', '', '', '', '', '',
       { text: tax_18, fontSize: 10, alignment: 'right',border: [true, true, false, false] }
     ]);
   }

   if (tax.tax_28 > 0) {
     rows.push([
       { text: 'GST (28%)', fontSize: 10, colSpan: 11, alignment: 'right',border:[false, true, true, false] },
       '', '', '', '', '', '', '', '', '', '',
       { text:tax_28, fontSize: 10, alignment: 'right',border: [true, true, false, false] }
     ]);
   }

   rows.push(
     // [

     //   { text: 'Round off',  fontSize: 10, colSpan: 11, alignment: 'right' },
     //   '', '', '', '', '', '', '', '', '', '',
     //   { text: round_off, fontSize: 10, alignment: 'right' }
     // ],
     [
       { text: 'Total', fontSize: 10, colSpan: 11, alignment: 'right', border:[false, true, true, true] },
       '', '', '', '', '', '', '', '', '', '',
       { text: total, fontSize: 10, alignment: 'right',border: [true, true, false, true] }
     ]);

   return {
     table: {
       widths:[20, 103, 23, 23, 20, 35, 34, 15, 32, 15, 22, 65],
       body: rows
     }
   };
 }

 getBankObject() {

   var test = this.Details;
   return {

     table: {
       widths: ['*', '*'],
       body: [
         [
           [
            [
               { text: 'Message :', bold: true, italics: true, fontSize: '10', alignment: 'left',border: [true, true, false, false] },
               { text: test.message, margin: [0, 10], italics: true, fontSize: '10', alignment: 'left',border: [true, true, false, false] },
             ]
           ],

           [
            [
               { text: 'Reference :', bold: true, italics: true, fontSize: '10', alignment: 'left',border: [true, true, false, false] },
               { text: test.reference, margin: [0, 10], italics: true, fontSize: '10', alignment: 'left',border: [true, true, false, false] },
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
        vLineWidth: function (i, node) {
         return  0; // remove vertical lines
     },
     },
   }
 }



 getTermsObject() {
  var test = this.company_profile;

   return {
     table: {
       widths: ['*', '*'],
       body: [
         [
           [
             [
               { text: 'For '+test.company_name, margin: [0, 10, 0, 0], bold: true, fontSize: '10', alignment: 'left',border: [true, true, false, false] },
               { text: 'Authorised Signatory', margin: [0, 35, 0, 0], bold: true, italics: true, fontSize: '10', alignment: 'left',border: [true, true, false, false] },]
           ],
           [
             [
               { text: 'Terms & Conditions of Credit Note :', bold: true, italics: true, fontSize: '10', alignment: 'left',border: [true, true, false, false] },
               { text: test.credit_note_terms, margin: [0, 10], italics: true, fontSize: '10', alignment: 'left',border: [true, true, false, false] },
             ]
           ],
         ],

       ]
     },
     layout: {

       layout: 'lightHorizontalLines',

       hLineWidth: function (i, node) {
         return (i === 0 || i === node.table.body.length) ? 0 : 0;
       },
        vLineWidth: function (i, node) {
         return  0; // remove vertical lines
     },
     },
   }
 }

 async  onSubmit(value)
   {


     console.log(value)
     if(this.form.value.total>0)
     {
       const confirmed = confirm("Are you sure you want to update this debit note?");
        if (!confirmed) {
          return;
        }
       await this.api.post('debit_note_update.php?debit_note_id='+this.Details.id+'&authToken=' + environment.authToken,this.form.value).then(async(data: any) =>
               {
                 console.log(data)
                 if(data.status == "success")
                 {
                   await this.toastrService.success("Updated successful");
                   this.show_edit_note = false ;
                   this.form.reset();
                   this.Selected_ID = this.Details.id
                   await this.ngOnInit();
                 }
               }).catch(error => { this.toastrService.error('Something went wrong'); });
     }
     else{
       this.toastrService.error("Please fill the correct details!")
     }
   }

   ReturnToList()
   {
     this.show_edit_note = false
     this.show = true
     this.form.reset()
   }

   remove()
   {
           this.modalRef= this.modalService.open(this.delete_note, { size: 'md' });
   }
    async ReqDelete()
   {

         await this.api.get('mp_delete_invoice.php?table=debit_note&field=id&item_field=debit_note_id&delete_id='+this.Details.id+'&authToken=' + environment.authToken).then((data: any) =>
         {
           if (data.status == "success")
           {
                   this.Selected_ID = data.id
                    this.toastrService.success('Deleted Succesfully');
                    this.ngOnInit();
                    this.show = true;
                    this.modalRef.close()

           }
           else { this.toastrService.error('Something went wrong');}
           return true;
         }).catch(error =>
           {
           this.toastrService.error('Something went wrong');
         });

   }
}
