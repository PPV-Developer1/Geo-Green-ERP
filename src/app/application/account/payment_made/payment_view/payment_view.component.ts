import { Color } from './../../../../app.color';
import { Component, OnInit } from '@angular/core';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from "../../../../service/api.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../../../environments/environment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ImgToBase64Service } from "src/app/service/img-to-base64.service";
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
  selector: 'app-payment_view',
  templateUrl: './payment_view.component.html',
  styleUrls: ['./payment_view.component.scss']
})
export class Payment_viewComponent implements OnInit {

  selected        =[];
  SelectionType   = SelectionType;
  paymentlist     :any;
  imgUrl          : string = '../../../assets/img/logo/geogreen.png';
  select_data     :any;
  bill_attention  :any;
  address_line_1  :any;
  address_line_2  :any;
  bill_city       :any;
  bill_zip_code   :any;
  gst_number      :any;
  mobile          :any;
  payment_date    :any;
  reference       :any;
  payment_mode    :any;
  amount_received :any;
  company_name    :any;
  bill_address_line_1:any;
  bill_address_line_2:any;
  city            :any;
  zip_code        :any;
  bill_phone      :any;
  invoice_no      :any;
  invoice_date    :any;
  invoice_amount  :any;
  payment_amount  :any;
  onload_data     :any;
  amount          :any;
  fontFace        :any;
  receipt_no      :any;
  imageToShow     : string | ArrayBuffer;
  temp : any
  select_id = localStorage.getItem('select_id');
   public isMenuCollapsed:boolean = false;
  constructor(private api: ApiService, public toastrService: ToastrService,private imgToBase64: ImgToBase64Service, private _state:AppState)
  {
      this._state.subscribe('menu.isCollapsed', (isCollapsed) =>
        {
            this.isMenuCollapsed = isCollapsed;
        });
  }

  async ngOnInit()
  {
    this.hideMenu();
    this.Loadpaymentlist();
    this. Loadselectdata();
    this.getImageFromService();
    await this.fontload();
    await this.fontload();
  }

   public hideMenu():void{
        this._state.notifyDataChanged('menu.isCollapsed', true);
    }

  fontload()
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
  async Loadpaymentlist()
  {
    await this.api.get('mp_payment_made.php?&authToken=' + environment.authToken).then((data: any) =>
    {
      this.paymentlist = data;
      this.temp=[...data]
      var selectedId  = this.select_id;
      let selectedRow = this.paymentlist.find(item => item.tran_id == selectedId);
      if (selectedRow)
      {
        this.selected = [selectedRow];

        setTimeout(() => this.scrollToSelectedRow(this.select_id), 500);
      }
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorBills'); });
  }

  async Loadselectdata()
  {
    await this.api.get('mp_payment_made.php?tran_id='+this.select_id+'&authToken=' + environment.authToken).then((data: any) =>
    {
      this.onload_data = data;
      this.databind(this.onload_data)
      // var selectedId  = this.view_invoice;
      // let selectedRow = this.CustomerBillList.find(item => item.invoice_id == selectedId);
      // if (selectedRow)
      // {
      //   this.selected = [selectedRow];
      //   this.invoice_list=this.selected[0];
      //   setTimeout(() => this.scrollToSelectedRow(selectedId), 500);
      // }
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorBills'); });
  }

    updateFilter(event) {

    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter((d) => {
      return Object.values(d).some(field =>
        field != null && field.toString().toLowerCase().indexOf(val) !== -1
      );
    });
    this.paymentlist = temp;
    // this.table.offset = 0;
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
    if(event.type=="click")
    {
     this.select_data      = event.row.tran_id;
     this.onload_data      = event.row;
     this.company_name     = event.row.company_name;
     this. address_line_1  = event.row.address_1;
     this. address_line_2  = event.row.address_2;
     this. city            = event.row.city;
     this. zip_code        = event.row.zip_code;
     this. gst_number      = event.row.gst_number;
     this. mobile          = event.row.mobile;
     this.payment_date     = event.row.tran_date;
     this.reference        = event.row.reference;
     this.payment_mode     = event.row.tran_type;
     this.amount_received  = event.row.credit;
     this.bill_address_line_1=event.row.bill_address_line_1;
     this.bill_address_line_2=event.row.bill_address_line_2;
     this.bill_city        = event.row.bill_city;
     this. bill_zip_code   = event.row.bill_zip_code;
     this.bill_phone       = event.row.bill_phone;
     this.bill_attention   = event.row.customer_name;
     this.invoice_no       = event.row.bill_number;
     this.invoice_date     = event.row.tran_date;
     this.invoice_amount   = event.row.total;
     this.payment_amount   = event.row.credit;
     this.receipt_no       = event.row.receipt_no;
    }
  }
  onSelect(event)
  {
   // this.selected = [event.selected[0]]
  }
  databind(data)
  {
    this.company_name      = data[0].company_name;
    this.address_line_1    = data[0].address_1;
    this.address_line_2    = data[0].address_2;
    this.city              = data[0].city;
    this.zip_code          = data[0].zip_code;
    this.gst_number        = data[0].gst_number;
    this.mobile            = data[0].mobile;
    this.payment_date      = data[0].tran_date;
    this.reference         = data[0].reference;
    this.payment_mode      = data[0].tran_type;
    this.amount_received   = data[0].credit;
    this.bill_address_line_1=data[0].bill_address_line_1;
    this.bill_address_line_2=data[0].bill_address_line_2;
    this.bill_city         = data[0].bill_city;
    this.bill_zip_code     = data[0].bill_zip_code;
    this.bill_phone        = data[0].bill_phone;
    this.bill_attention    = data[0].customer_name;
    this.invoice_no        = data[0].bill_number;
    this.invoice_date      = data[0].tran_date;
    this.invoice_amount    = data[0].total;
    this.payment_amount    = data[0].credit;
    this.receipt_no        = data[0].receipt_no;
    this.amount='₹'+this.amount_received

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

  async download()
  {
   await  this.fontload();
     this.api.get('mp_payment_made.php?tran_id='+this.select_id+'&authToken=' + environment.authToken).then((data: any) =>
    {
      this.onload_data = data;
      this.pdfDownload(data);
    }).catch(error => { this.toastrService.error('Something went wrong in LoadVendorBills'); });

  }


async pdfDownload(files) {

  const font = 'Roboto';
  const paidAmount = '₹' + this.amount_received.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const invoiceAmount = '₹' + this.invoice_amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const paymentAmount = '₹' + this.payment_amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');

  const docDefinition = {
    info: {
      title:"Receipt",
    },
    content: [
      {

        columns: [
          {
            width:'*',
            stack: [
            { image: this.imageToShow, width: 200 },
            {text:'',width: 300,},
            ]
          },

          {
            stack: [

            { text: 'GST No: ' + this.gst_number,bold:true,alignment: 'center'  },
            ]
          }
        ],
      },
      {
        columns: [


        ],

      },

      {
        stack: [
          { text: this.company_name, bold: true ,colour:'blue'},
          this.address_line_1 + ', ' + this.address_line_2,
          this.city + '-' + this.zip_code,
        ],
        margin: [0, 10],
      },
      { text: ' ' },

      { text: 'PAYMENT RECEIPT', style: 'header' },
      { text: ' ' },

      {

        columns: [
          [
            { text: 'Receipt No  ' , fontSize: 12, bold:true},
            { text: 'Payment Date ', fontSize: 12 ,bold:true},
            { text: 'Reference No ', fontSize: 12 ,bold:true},
            { text: 'Payment Mode ', fontSize: 12,bold:true },

          ],
          [
            { text:  ' : '+ this.receipt_no, fontSize: 12 },
            { text:  ' : '+ this.payment_date, fontSize: 12 },
            { text:  ' : '+ this.reference, fontSize: 12 },
            { text:  ' : '+ this.payment_mode, fontSize: 12 },
          ],
           [
              { text: 'Amount Paid :',bold:true},
              { text:  paidAmount, bold: true},

           ],

        ],
      },
      { text: ' ' },

      {
        columns: [
          { text: 'Bill To:', bold: true },
        ],
      },
      {
        stack: [
          { text: this.bill_attention, bold: true },
          this.bill_address_line_1 + ', ' + this.bill_address_line_2,
          this.bill_city + '-' + this.bill_zip_code,
          this.bill_phone,
        ],
        margin: [0, 10],
      },
      { text: ' ' },

      {
        text: 'Payment for',
        style: 'subheader',
      },

      {

        table: {
          widths: [ 120,120,120,120],

          body: [
            [
              { text:  'Bill Number',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 12, bold: true , alignment: 'center'},
              { text:  'Bill Date',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 12, bold: true, alignment: 'center' },
              { text: 'Bill Amount',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 12, bold: true, alignment: 'center' },
              { text: 'Payment Amount',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 12, bold: true, alignment: 'center' },
            ],
           [
                { text: this.invoice_no, fontSize: 12, alignment: 'center'},
                { text: this.invoice_date, fontSize: 12, alignment: 'center'},
                { text: invoiceAmount, fontSize: 12 , alignment: 'center'},
                { text: paymentAmount, fontSize: 12 , alignment: 'center'},
               ],
         ]
      },
    }
    ],
    defaultStyle: {
      font: 'Roboto', // Use the registered font name here
    },
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        alignment: 'center',
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
    square:{
      width: 150,
      height: 150,
      display: 'flex',
      fillColor: '#80a376f8',
      margin: [0, 0, 50, 0],
      color: '#fff',
      alignment: 'center',
    }
    },

  };
  pdfMake.createPdf(docDefinition).open();
  // pdfMake.createPdf(docDefinition).download("invoice.pdf");

}


advance_download()
{
  const font = 'Roboto';
  const paidAmount = '₹' + this.amount_received.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const paymentAmount = '₹' + this.payment_amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');

  const docDefinition = {
    info: {
      title:"Receipt",
    },
    content: [
      {

        columns: [
          {
            width:'*',
            stack: [
            { image: this.imageToShow, width: 200 },
            {text:'',width: 300,},
            ]
          },

          {
            stack: [

            { text: 'GST No: ' + this.gst_number,bold:true,alignment: 'center'  },
            ]
          }
        ],
      },
      {
        columns: [


        ],

      },

      {
        stack: [
          { text: this.company_name, bold: true ,colour:'blue'},
          this.address_line_1 + ', ' + this.address_line_2,
          this.city + '-' + this.zip_code,
        ],
        margin: [0, 10],
      },
      { text: ' ' },

      { text: 'VENDOR ADVANCE RECEIPT', style: 'header' },
      { text: ' ' },

      {

        columns: [
          [
            { text: 'Receipt No   ' , fontSize: 12, bold:true},
            { text: 'Payment Date  ', fontSize: 12 ,bold:true},
            { text: 'Reference No ', fontSize: 12 ,bold:true},
            { text: 'Payment Mode ', fontSize: 12,bold:true },

          ],
          [
            { text: ' : '+ this.receipt_no, fontSize: 12 },
            { text:  ' : '+this.payment_date, fontSize: 12 },
            { text: ' : '+ this.reference, fontSize: 12 },
            { text:  ' : '+this.payment_mode, fontSize: 12 },
          ],
           [
              { text: 'Amount Paid :',bold:true},
              { text:  paidAmount, bold: true},

           ],

        ],
      },
      { text: ' ' },

      {
        columns: [
          { text: 'Bill To:', bold: true },
        ],
      },
      {
        stack: [
          { text: this.bill_attention, bold: true },
          this.bill_address_line_1 + ', ' + this.bill_address_line_2,
          this.bill_city + '-' + this.bill_zip_code,
          this.bill_phone,
        ],
        margin: [0, 10],
      },
      { text: ' ' },

      {
        text: 'Payment for',
        style: 'subheader',
      },

      {

        table: {
          widths: [ '*','*'],

          body: [
            [
              { text:  ' Date',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 12, bold: true , alignment: 'center'},
              { text:  'Advance',fillColor: '#CCCCCC', border: [true, true, true, false], fontSize: 12, bold: true, alignment: 'center' },

            ],
            [
                { text: this.invoice_date,border: [true, false, false, true], fontSize: 12, alignment: 'center'},
                { text: paymentAmount,border: [true, false, true, true], fontSize: 12 , alignment: 'center'},
            ],
         ]
      },
    }
    ],
    defaultStyle: {
      font: 'Roboto', // Use the registered font name here
    },
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        alignment: 'center',
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
    square:{
      width: 150,
      height: 150,
      display: 'flex',
      fillColor: '#80a376f8',
      margin: [0, 0, 50, 0],
      color: '#fff',
      alignment: 'center',
    }
    },

  };
  pdfMake.createPdf(docDefinition).open();
}
}
