import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ImgToBase64Service } from 'src/app/service/img-to-base64.service';

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
  selector: 'app-credit_note_view',
  templateUrl: './credit_note_view.component.html',
  styleUrls: ['./credit_note_view.component.scss']
})
export class Credit_note_viewComponent implements OnInit {

  List            : any
  selected        = []
  SelectionType   = SelectionType;
  Selected_ID     = localStorage.getItem("credit_note_id")

  Details         : any
  form            : FormGroup;
  modalRef        : any
  imageToShow     : string | ArrayBuffer;
   imgUrl          : string = '../../../../assets/img/logo/geogreen.png';
  company_profile : any
  billToAddress   : any

    @ViewChild("add",{static:true}) add:ElementRef;

  constructor(public toastrService: ToastrService, private api: ApiService,public fb:FormBuilder,private modalService  : NgbModal, private imgToBase64: ImgToBase64Service,)
  {
    this.form=fb.group(
    {
      message    : ['',Validators.compose([Validators.required])],
      reference : ['',Validators.compose([Validators.required])],
      rount_off : ['',Validators.compose([Validators.required])],
    })
  }
  show=false
 async ngOnInit() {
   await this.TableData()
   await this.getImageFromService()
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
  async TableData()
    {
       await this.api.get('credit_note_debit_note_list.php?type=credit&authToken='+environment.authToken).then((data: any) =>
          {
             console.log(data)
             this.List=data
            var selectedId  = this.Selected_ID;
            let selectedRow = this.List.find(item => item.id == selectedId);
            if (selectedRow)
            {
              this.selected = [selectedRow];
              this.Details = selectedRow
              setTimeout(() => this.scrollToSelectedRow(this.Selected_ID), 500);
            }
          }).catch(error => {this.toastrService.error('Something went wrong');});

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

  edit()
  {
    this.form.controls['message'].setValue(this.Details.message)
    this.form.controls['reference'].setValue(this.Details.reference)
    this.form.controls['rount_off'].setValue(this.Details.round_off)
    this.modalRef = this.modalService.open(this.add, { size: 'md' });
  }

 async Add(value)
  {
      Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });

      console.log(value)
      if(this.form.valid)
      {
          await this.api.post('post_update_data.php?table=credit_note&field=id&value=' + this.Details.id + '&authToken=' + environment.authToken, this.form.value).then(async (data_rt: any) => {
                      console.log(data_rt)
                    if (data_rt.status == "success")
                    {
                      await this.toastrService.success('Updated Succesfully');
                           await this.api.get('credit_note_debit_note_list.php?type=credit&authToken='+environment.authToken).then((data: any) =>
                              {
                                console.log(data)
                                this.List=data
                                let selectedRow = this.List.find(item => item.id == this.Details.id);
                                if (selectedRow)
                                {
                                  this.selected = [selectedRow];
                                  this.Details = selectedRow

                                }
                              }).catch(error => {this.toastrService.error('Something went wrong');});
                       this.modalRef.close()
                    }
                    else { this.toastrService.error(data_rt.status); }
                  }).catch(error => { this.toastrService.error('Somthing went wrong'); });
      }
  }

 async company_details()
  {
     await  this.api.get('get_data.php?table=company_profile&authToken=' + environment.authToken).then((data: any) => {
            this.company_profile = data[0]
        }).catch(error => { this.toastrService.error('Something went wrong'); });

        //  await  this.api.get('get_data.php?table=vendor_address&find=vendor_addr_id&value='+this.Details.bill_to+'&authToken=' + environment.authToken).then((data: any) => {
        //     this.billToAddress = data[0]
        //     console.log(data)
        // }).catch(error => { this.toastrService.error('Something went wrong'); });
  }


   async pdfDownload() {
          await  this.company_details()
    let docDefinition = {
      info: {
        title:this.Details.credit_note_no,
      },
      content: [

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
                    { text: ' CREDIT NOTE', fontSize: 11, bold: true, alignment: 'center' },]
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

        this.getInvoiceObject(),
        this.getBillObject(),
        this.getItemsObject(),
        this.getItemstotalObject(),
        this.getBankObject(),
        this.getTermsObject(),

      ],
      defaultStyle: {
        font: 'Roboto', // Use the registered font name here
      },
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
            { text: 'GSTIN :' + test.gst_number, fontSize: 10, bold: true, alignment: 'center' },
          ],
          [{  text: 'UDYAM : ' + test.udyam_no,  fontSize: 10, bold: true, alignment: 'center' }]
        ],
      ]
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
                { text: 'Credit Note No :', fontSize: 10 },
                { text: 'Date :', fontSize: 10 },
                { text: 'State: ', fontSize: 10 },
                { text: 'Pin Code : ', fontSize: 10 },
              ],
              [
                { text: test.credit_note_no, fontSize: 10 },
                { text: test.generate_date, fontSize: 10 },
                { text: test.state, fontSize: 10 },
                { text: test.zip_code, fontSize: 10 },
              ]

            ]
          },

          {
            columns: [
              [


                { text: 'Bill No :', fontSize: 10 },
              ],
              [

                { text: test.bill_number, fontSize: 10 },

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
            { text: 'Pin Code :' + test.zip_code, alignment: 'left', bold: true, fontSize: 10 },
          ],
          // {
          //   columns: [
          //      [
          //     // { text: 'Ship to party:', bold: true, fontSize: 10 },
          //     // { text: test.ship_attention, bold: true, fontSize: 10 },
          //     // { text: test.ship_address_line_1, fontSize: 10 },
          //     // { text: test.ship_address_line_2, fontSize: 10 },
          //     // { text: 'GST No :' + test.vendor_gst, fontSize: 10, bold: true },
          //     // { text: 'State :' + test.ship_state, fontSize: 10, },
          //     // { text: 'Pin Code :' + test.ship_zip_code, alignment: 'left', bold: true, fontSize: 10 },
          //     ],
          //   ]
          // },
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

getItemsObject() {

  var test = this.Details.item_list;
  var serialNumber = 1;
  if(this.Details.place_from_supply_code != 33)
  {
  return {
  table: {
    widths: [10, 112, 50,35, 34, 35, 19, 33, 19, 33,35],
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
        { text: '',fillColor: '#CCCCCC', border: [true, false, true, false], bold:true},
      ],
      ...test.map((ed, index) => {
          let cellBorder = [true, true, true, false];
          if (index > 0) {
            cellBorder = [true, true, true, true];
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
          { text: ed.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'), border: [true, true, true, false], fontSize: 8,  alignment: 'right'}]
        },
        )
      ],
    }
    }
  }

  if(this.Details.place_from_supply_code == 33)
    {
    return {
    table: {
      widths: [11, 130, 57, 35, 32, 40, 30,43,55],
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
              cellBorder = [true, true, true, false];
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
            { text: ed.total.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'), border: [true, true, true, false], fontSize: 9,  alignment: 'right'}]
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
  const round_off =  test.round_off.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
  const total     = '₹' + test.total_amount.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');

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

getBankObject() {

  var test = this.Details;
  return {

    table: {
      widths: ['*', '*'],
      body: [
        [
          [
           [
              { text: 'Message:', bold: true, italics: true, fontSize: '10', alignment: 'left' },
              { text: test.message, margin: [0, 10], italics: true, fontSize: '10', alignment: 'left' },
            ]
          ],

          [
           [
              { text: 'Reference:', bold: true, italics: true, fontSize: '10', alignment: 'left' },
              { text: test.reference, margin: [0, 10], italics: true, fontSize: '10', alignment: 'left' },
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



getTermsObject() {
 var test = this.company_profile;

  return {
    table: {
      widths: ['*', '*'],
      body: [
        [
          [
            [
              { text: 'For '+test.company_name, margin: [0, 10, 0, 0], bold: true, fontSize: '10', alignment: 'left' },
              { text: 'Authorised Signatory', margin: [0, 35, 0, 0], bold: true, italics: true, fontSize: '10', alignment: 'left' },]
          ],
          [
            [
              { text: 'Terms & Conditions of Credit Note:', bold: true, italics: true, fontSize: '10', alignment: 'left' },
              { text: test.credit_note_terms, margin: [0, 10], italics: true, fontSize: '10', alignment: 'left' },
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
}
