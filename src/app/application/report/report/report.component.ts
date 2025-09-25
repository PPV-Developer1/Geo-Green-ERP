import { Component, OnInit,ViewChild ,ElementRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as XLSX from "xlsx";
import {formatDate } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'az-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})


export class ReportComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('headerCheckbox', { static: false }) headerCheckbox: ElementRef;

  report_list      = [];
  report_group     = [];
  temp             = [];
  selected         = [];

  starred          : boolean;
  starred_value    : number;
  date_val         : any;

  transeaction_det : any;
  sale_by_cust     : any;
  print_data       : any;
  totalInvoiceCount: any;
  totalWithoutTax  : any;
  totalSales       : any;
  print_date       : any;
  tran_from_date   : any;
  tran_to_date     : any
  totalBalance     : any;
  totalReceived    : any;
  data_print       : any;
  from_date        : any;
  cust_tran_data   : any;
  print_tran_data  : any;
  name             : any;
  tax_type2        : any;
  print_data_type2 : any;
  cgst_5            : any=0;
  cgst_12           : any=0;
  cgst_18           : any=0;
  cgst_28           : any=0;
  sgst_5            : any=0;
  sgst_12           : any=0;
  sgst_18           : any=0;
  sgst_28           : any=0;
  igst_5            : any=0;
  igst_12           : any=0;
  igst_18           : any=0;
  igst_28           : any=0;
  op_igst_5         : any=0;
  op_igst_12        : any=0;
  op_igst_18        : any=0;
  op_igst_28        : any=0;

  input_tds       :any;
  output_tds      :any;
  input_tcs       :any;
  output_tcs      :any;
  tax_list        :any;
  tax_field       :any;
  feild_value     :any;
  employee_list   :any;
  total_attedance :any;

  public  group_id      : any;
  public  customer_list : any;
  public  vendor_list   : any;
  public expense_account: any;
  public emp_bank_account: any;

  date             : FormGroup;
  customer         : FormGroup;
  expense          : FormGroup;


  view             : boolean = false;
  show             : boolean = false;
  hide             : boolean = true;
  customer_payment : Boolean = false;
  tax_show         : Boolean = false;
  loading          : boolean = false;
  opening_balance  : any
  lastRow: any = null;
  id     : any = null;
  title     : any;
  item_list : any;

  public user_type = localStorage.getItem('type');
  public uid       = localStorage.getItem('type_id');

  constructor(private modalService: NgbModal, public router: Router, public api: ApiService, public toastrService: ToastrService, private fb: FormBuilder,private cdr: ChangeDetectorRef)
  {
    this.date = fb.group({
      fromdate: [null],
      todate  : [null],
    });

    this.customer=fb.group({
      customer_id :[null,Validators.compose([Validators.required])],
      from_date   :[null,Validators.compose([Validators.required])],
      to_date     :[null,Validators.compose([Validators.required])]
    })

    this.expense=fb.group({
      expense_id :[null,Validators.compose([Validators.required])],
    })
  }

async  ngOnInit()
  {

  await  this.api.get('get_data.php?table=main_report_list&find=status&value=1&find1=user_type&value1=' + this.uid + '&&authToken=' + environment.authToken) .then((data: any) =>
    {

      this.report_list = data;
                const groupedData = this.groupBy(data, 'report_group');

                const reportGroupIds = Object.keys(groupedData);
              reportGroupIds.forEach(groupId => {
                const groupData = groupedData[groupId];
              });

             for(let i=0;i<reportGroupIds.length;i++)
              {
                this.api.get('get_data.php?table=report_group&find=status&value=1&find1=id&value1='+reportGroupIds[i]+'&authToken='+environment.authToken).then((data: any) =>
                    {
                            this.report_group[i]= data[0];
                    }).catch(error => {this.toastrService.error('Something went wrong ');});
               }
            })

      .catch(error => {
        this.toastrService.error('Something went wrong ');
      });


    await  this.api.get('get_data.php?table=customers&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
              this.customer_list = data;
      }).catch(error => {this.toastrService.error('Something went wrong ');});

     await this.api.get('get_data.php?table=customers&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
        {
                this.customer_list = data;
        }).catch(error => {this.toastrService.error('Something went wrong ');});


    await  this.api.get('get_data.php?table=vendor&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
              this.vendor_list = data;
      }).catch(error => {this.toastrService.error('Something went wrong ');});

    await  this.api.get('get_data.php?table=expense_account&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
              this.expense_account = data;
      }).catch(error => {this.toastrService.error('Something went wrong ');});


     await this.api.get('get_data.php?table=bank&find=status&value=1&find1=mode&value1=3&authToken='+environment.authToken).then((data: any) =>
      {
              this.emp_bank_account = data;
      }).catch(error => {this.toastrService.error('Something went wrong ');});

   await   this.api.get('get_data.php?table=employee&find=status&value=1&authToken='+environment.authToken).then((data: any) =>
      {
              this.employee_list = data;
      }).catch(error => {this.toastrService.error('Something went wrong ');});

      await   this.api.get('mp_item_list_avg.php?authToken='+environment.authToken).then((data: any) =>
        {
          console.log("item data : ",data)
                this.item_list = data;
        }).catch(error => {this.toastrService.error('Something went wrong ');});

      setTimeout(() => {
        this.show = true
       }, 1000);

 }

  groupBy(array: any[], property: string)
  {
    return array.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});


  }

  load_list(value)
  {
    return this.api.get('get_data.php?table=main_report_list&find=status&value=1&find1=report_group&value1=' + value + '&authToken=' + environment.authToken).then((data: any) => {

      return data;
    }).catch(error => {
      this.toastrService.error('Something went wrong');
      return [];
    });
  }

  public changeStarStatus(_id)
  {
    _id.starred = !_id.starred;

    if(_id.starred)
      this.starred_value = 1;
    else
    this.starred_value = 0;

    this.api.get('update_data_report_star.php?type=update&table=main_report_list&col=starred&value='+this.starred_value+'&where_id='+_id.id).then((data: any) =>
    {
      if(data.status == "success")
      {
        if(_id.starred)
        this.toastrService.success('Successfully Added to wishlist');
      else
        this.toastrService.warning('Removed from wishlist');
      }
    }).catch(error => {this.toastrService.error('Something went wrong');});
  }

  public goToDetail(_id)
  {
    this.id=_id.use_for_development;
    this.title=_id.title
    if(this.id != null)
    {
      this.show=false;
    }
    if(this.id == null)
    {
      this.show=false;
    }

    if(this.id == 'individual_customer_balance')
    {
      this.customer_payment = true;
    }
    if(this.id == 'price_trend')
      {
        this.customer_payment = true;
      }
    if(this.id ==  'individual_vendor_balance')
    {
      this.customer_payment = true;
    }

    if(this.id ==  'expense_report')
    {
      this.customer_payment = true;
    }

    if(this.id ==  'employee_accounts_report')
    {
      this.customer_payment = true;
    }

    if(this.id ==  'attendance_report')
    {
      this.customer_payment = true;
    }

  }

  download(data)
  {
    this.print_date = data;
    let today = new Date();
    let year  = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day   = String(today.getDate()).padStart(2, '0');

    let formattedDate = `${year}-${month}-${day}`;

    let from_date = data.fromdate;
    let to_date   = data.todate;
    this.tran_from_date = data.fromdate;
    this.tran_to_date  = data.todate;

        if(  from_date <= to_date &&  to_date <= formattedDate || formattedDate==to_date)
        {
          this.loading= true;
          if(this.id == "invoice_details")
          {
            this.totalSales        = 0;
            this.totalBalance      = 0;
            this.api.post('mp_invoice_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {
              if (data != null)
                {
                    this.transeaction_det =  data['report'];
                    this.print_data       =  data['download_report'];

                    this.transeaction_det.forEach(data => {
                      this.totalSales += data.Total;
                      this.totalBalance += data.Balance;
                    });

                    this.totalSales     = parseFloat(this.totalSales.toFixed(2));
                    //this.date.reset();

                    const totalRow = {
                      Date:'',
                      Status:'Total',
                      Invoice_No:'',
                      Due_date:'',
                      Reference_number:'',
                      Customer_name: '',
                      Total:  this.totalSales,
                      Balance:this.totalBalance,
                      Paid_Amount:'',
                      Tax_amount:'',
                      Amount_without_tax:'',
                      price_precision:'',
                   };

                   const totalRow_1 = {
                    invoice_id:'',
                    Date:'',
                    Status:'Total',
                    Invoice_No:'',
                    Due_date:'',
                    Reference_number:'',
                    Customer_name: '',
                    Total:  this.totalSales,
                    Balance:this.totalBalance,
                    Paid_Amount:'',
                    Tax_amount:'',
                    Amount_without_tax:'',
                    price_precision:'',
                 };

                   this.transeaction_det.push(totalRow_1);
                   this.print_data.push(totalRow);
                  }
                  else
                  {
                    this.toastrService.warning('No data');
                    //this.date.reset();
                  }
                  this.loading= false;
                })
                .catch(error => {
                  this.toastrService.error('API Failed: report load');
                });
         }

           if (this.id == "sales_by_customer" || this.id == "customer_balances")
            {
                this.totalInvoiceCount = 0;
                this.totalSales        = 0;
                this.totalWithoutTax   = 0;
                this.totalBalance      = 0;
                this.totalReceived     = 0;

              this.api.post('mp_sales_by_customerReport.php?from_date=' + from_date + '&to_date=' + to_date + '&type='+this.id +'&authToken=' + environment.authToken, data).then((data: any[]) => {
                if (data != null)
                  {
                    //console.log("customer balances ",data)
                    this.sale_by_cust = data['report'];
                    this.print_data   = data['download_report'];

                    if(this.id == "sales_by_customer")
                    {
                      this.sale_by_cust.forEach(data => {
                        this.totalInvoiceCount += data.Invoice_Count;
                        this.totalWithoutTax += data.Without_Tax;
                        this.totalSales += data.Sales;
                        this.totalBalance += data.Tax;
                      });
                      this.totalInvoiceCount = parseFloat(this.totalInvoiceCount.toFixed(2));
                      this.totalWithoutTax   = parseFloat(this.totalWithoutTax.toFixed(2));
                      this.totalSales        = parseFloat(this.totalSales.toFixed(2));
                      this.totalBalance      = parseFloat(this.totalBalance.toFixed(2));
                      //this.date.reset();

                      const totalRow = {
                        Customer_Name: 'Total',
                        Invoice_Count: this.totalInvoiceCount,
                        Without_Tax: this.totalWithoutTax,
                        Tax : this.totalBalance,
                        Sales: this.totalSales,
                      };

                      this.print_data.push(totalRow);
                      this.sale_by_cust.push(totalRow);
                    }

             if(this.id == "customer_balances")
                    {
                        this.sale_by_cust.forEach(data => {
                          this.totalBalance += data.Balance;
                          this.totalReceived += data.Received;
                          this.totalSales += data.Sales;
                        });
                        this.totalBalance   = parseFloat(this.totalBalance.toFixed(2));
                        this.totalReceived  = parseFloat(this.totalReceived.toFixed(2));
                        this.totalSales     = parseFloat(this.totalSales.toFixed(2));
                        //this.date.reset();

                        const totalRow = {
                        Customer_Name: 'Total',
                        Sales: this.totalSales,
                        Received: this.totalReceived,
                        Balance: this.totalBalance,
                      };

                      this.print_data.push(totalRow);
                      this.sale_by_cust.push(totalRow);
                    }

                  }
                  else
                  {
                    this.sale_by_cust = null;
                    this.toastrService.warning('No data');
                    //this.date.reset();
                  }
                  this.loading= false;
                  })
                  .catch(error => {
                    this.loading= false;
                    this.toastrService.error('API Failed: report load');
                  });
              }

            if(this.id == "sales_by_item")
              {
                this.totalSales        = 0;
                this.totalBalance      = 0;
                this.totalReceived     = 0;
             this.api.post('mp_items_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {

              if (data != null)
                {
                    this.sale_by_cust  =  data['report'];
                    this.print_data    =  data['download_report'];
                    this.sale_by_cust.forEach(data => {
                      this.totalSales    += data.Qunatity_Sold;
                      this.totalReceived += data.Amount;
                      this.totalBalance  += data.Average_Price;
                    });
                    this.totalBalance   = parseFloat(this.totalBalance.toFixed(2));
                    this.totalReceived  = parseFloat(this.totalReceived.toFixed(2));
                    this.totalSales     = parseFloat(this.totalSales.toFixed(2));
                    //this.date.reset();

                    const totalRow = {
                      Item_Name: 'Total',
                      Qunatity_Sold: this.totalSales,
                      Amount: this.totalReceived,
                      Average_Price: this.totalBalance,
                   };

                   this.print_data.push(totalRow);
                   this.sale_by_cust.push(totalRow);
                  }
                  else
                  {
                    this.sale_by_cust = null;
                    this.toastrService.warning('No data');
                    //this.date.reset();
                  }
                  this.loading= false;
                })
                .catch(error => {
                  this.toastrService.error('API Failed: report load');
                  this.loading= false;
                });
            }

            if(this.id == "payments_received")
            {
              this.totalReceived     = 0;
           this.api.post('mp_payment_received_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {

            if (data != null)
              {
                  this.sale_by_cust  =  data['report'];
                  this.print_data    =  data['download_report'];

                  this.sale_by_cust.forEach(data => {
                    this.totalReceived += data.Amount;
                  });

                    this.totalReceived = parseFloat(this.totalReceived.toFixed(2));

                  //this.date.reset();

                  const totalRow = {
                    Invoive_No: 'Total',
                     Reference_Number: '',
                    Customer_Name: '',
                    Date: '',
                    Amount: this.totalReceived,
                    Payment_Mode: '',
                    Deposited_To: ''
                 };

                 this.print_data.push(totalRow);
                 this.sale_by_cust.push(totalRow);
                }
                else
                {
                  this.sale_by_cust = null;
                  this.print_data   = null;
                  this.toastrService.warning('No data');
                  //this.date.reset();
                }
                this.loading= false;
              })
              .catch(error => {
                this.loading= false;
                this.toastrService.error('API Failed: report load');
              });
          }

      if(this.id == "inventory_summary")
        {

         this.api.post('mp_inventory_summary_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {


          if (data != null)
            {
                this.sale_by_cust  = data['report'];
                this.print_data    =  data['download_report'];
                //this.date.reset();

                if(this.sale_by_cust == null)
                {
                  this.toastrService.warning('No Stock added from Stocklist');
                }
              }
              else
              {
                this.sale_by_cust = null;
                this.print_data   = null;
                this.toastrService.warning('No data');
                //this.date.reset();
              }
              this.loading= false;
            })
            .catch(error => {
              this.loading= false;
              this.toastrService.error('API Failed: loadTransaction');
            });
        }

        if(this.id == "stock_summary_report")
        {
           this.from_date = formatDate(from_date, 'ddMMyy', 'en-US', '+0530');

         this.api.post('mp_stock_summary_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {
          if (data != null)
            {
                this.sale_by_cust  =  data['report'];
                this.print_data    =  data['download_report'];
                //this.date.reset();

                if(this.sale_by_cust == null)
                {
                  this.toastrService.warning('No Stock added from Stocklist');
                }
              }
              else
              {
                this.sale_by_cust = null;
                this.print_data   = null;
                this.toastrService.warning('No data');
                //this.date.reset();
              }
              this.loading= false;
            })
            .catch(error => {
              this.loading= false;
              this.toastrService.error('API Failed: report load');
            });
        }

        if(this.id == "bills_details")
        {
                this.totalSales        = 0;
                this.totalBalance      = 0;

           this.from_date = formatDate(from_date, 'ddMMyy', 'en-US', '+0530');

         this.api.post('mp_bill_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {
          if (data != null)
            {

                this.sale_by_cust  =  data['report'];
                this.print_data    =  data['download_report'];

                this.sale_by_cust.forEach(data => {
                  this.totalSales    += data.Bill_Amount;
                  this.totalBalance  += data.Balance_Amount;
                });

                this.totalBalance   = parseFloat(this.totalBalance.toFixed(2));
                this.totalSales     = parseFloat(this.totalSales.toFixed(2));
                //this.date.reset();

                const totalRow = {
                  Status: '',
                  Bill_Date: '',
                 Customer_Name: '',
                 Due_Date: '',
                 Bill:'',
                 Vendor_Name:'Total',
                 Bill_Amount:this.totalSales,
                 Balance_Amount:this.totalBalance,
              };
              const totalRow1 = {
                bill_id:'',
                Status: '',
                Bill_Date: '',
               Customer_Name: '',
               Due_Date: '',
               Bill:'',
               Vendor_Name:'Total',
               Bill_Amount:this.totalSales,
               Balance_Amount:this.totalBalance,
            };
              this.print_data.push(totalRow);
              this.sale_by_cust.push(totalRow1);
              }
              else
              {
                this.sale_by_cust = null;
                this.print_data   = null;
                this.toastrService.warning('No data');
                //this.date.reset();
              }
              this.loading= false;
            })
            .catch(error => {
              this.loading= false;
              this.toastrService.error('API Failed: report load');
            });
        }

        if(this.id == "payments_made")
            {
              this.totalReceived     = 0;
           this.api.post('mp_payment_made_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {


            if (data != null)
              {

                  this.sale_by_cust  =  data['report'];
                  this.print_data    =  data['download_report'];

                  this.sale_by_cust.forEach(data => {
                    this.totalReceived += data.Amount;
                  });

                    this.totalReceived = parseFloat(this.totalReceived.toFixed(2));

                    const totalRow = {
                      Date: '',
                      Reference: '',
                      Bill: '',
                      Vendor_Name: '',
                      Payment_Mode:'',
                      Notes:'',
                      Paid_Through:'Total',
                      Amount:this.totalReceived,
                  };

                  this.print_data.push(totalRow);
                  this.sale_by_cust.push(totalRow);
                  //this.date.reset();

                }
                else
                {
                  this.sale_by_cust = null;
                  this.print_data   = null;
                  this.toastrService.warning('No data');
                  //this.date.reset();
                }
                this.loading= false;
              })
              .catch(error => {
                this.loading= false;
                this.toastrService.error('API Failed: report load');
              });
          }

          if(this.id == "vendor_balances")
            {
              this.totalReceived     = 0;
              this.totalBalance      = 0;
              this.totalSales        = 0;
           this.api.post('mp_vendor_balance_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {
            if (data != null)
              {
                  this.sale_by_cust  =  data['report'];
                  this.print_data    =  data['download_report'];

                  this.sale_by_cust.forEach(data => {
                    this.totalReceived += data.Paid_Amount;
                    this.totalBalance +=data.Balance;
                    this.totalSales +=data.Bill_Amount;
                  });

                    this.totalReceived =  parseFloat(this.totalReceived.toFixed(2));
                    this.totalBalance  =  parseFloat(this.totalBalance.toFixed(2));
                    this.totalSales    =  parseFloat(this.totalSales.toFixed(2));
                  //this.date.reset();

                  const totalRow = {
                    Vendor_Name: 'Total',
                    Bill_Count: '',
                    Paid_Amount: this.totalReceived,
                    Bill_Amount: this.totalSales,
                    Balance:this.totalBalance,
                  };
                  this.print_data.push(totalRow);
                  this.sale_by_cust.push(totalRow);
                }
                else
                {
                  this.sale_by_cust = null;
                  this.print_data   = null;
                  this.toastrService.warning('No data');
                  //this.date.reset();
                }
                this.loading= false;
              })
              .catch(error => {
                this.loading= false;
                this.toastrService.error('API Failed: report load');
              });
          }


          if(this.id == "purchase_order_details")
            {

              this.totalBalance      = 0;

           this.api.post('mp_po_details_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {
            if (data != null)
              {
                  this.sale_by_cust  =  data['report'];
                  this.print_data    =  data['download_report'];

                  this.sale_by_cust.forEach(data => {
                    this.totalBalance +=data.Amount;
                  });
                    this.totalBalance =  parseFloat(this.totalBalance.toFixed(2));
                  //this.date.reset();

                  const totalRow = {
                    Date      : '',
                    PO_Noumber: '',
                    Vendor_Name:'Total',
                    Amount: this.totalBalance,
                  };
                  this.print_data.push(totalRow);
                  this.sale_by_cust.push(totalRow);
                }
                else
                {
                  this.sale_by_cust = null;
                  this.print_data   = null;
                  this.toastrService.warning('No data');
                  //this.date.reset();
                }
                this.loading= false;
              })
              .catch(error => {
                this.loading= false;
                this.toastrService.error('API Failed: report load');
              });
          }


          if(this.id == "delivery_challan_details")
            {

              this.totalBalance      = 0;

           this.api.post('mp_dc_details_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {
            if (data != null)
              {
                  this.sale_by_cust  =  data['report'];
                  this.print_data    =  data['download_report'];

                  this.sale_by_cust.forEach(data => {

                    this.totalBalance +=data.Amount;

                  });
                    this.totalBalance =  parseFloat(this.totalBalance.toFixed(2));
                    //this.date.reset();

                  const totalRow = {
                    Date      : 'Total',
                    DC_Noumber: '',
                    Customer_Name:'',
                    Amount: this.totalBalance,
                  };
                  this.print_data.push(totalRow);
                  this.sale_by_cust.push(totalRow);
                }
                else
                {
                  this.sale_by_cust = null;
                  this.print_data   = null;
                  this.toastrService.warning('No data');
                  //this.date.reset();
                }
                this.loading= false;
              })
              .catch(error => {
                this.loading= false;
                this.toastrService.error('API Failed: report load');
              });
            }


            if(this.id == "tax_report")
            {
              this.tax_show = true;

              this.totalBalance      = 0;
              this.totalSales        = 0;

              this.cgst_5    = 0;
              this.cgst_12   = 0;
              this.cgst_18   = 0;
              this.cgst_28   = 0;
              this.sgst_5    = 0;
              this.sgst_12   = 0;
              this.sgst_18   = 0;
              this.sgst_28   = 0;
              this.igst_5    = 0;
              this.igst_12   = 0;
              this.igst_18   = 0;
              this.igst_28   = 0;
              this.op_igst_5  = 0;
              this.op_igst_12 = 0;
              this.op_igst_18 = 0;
              this.op_igst_28 = 0;

              this.api.post('mp_tax_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {

                if (data != null)
                  {

                    this.sale_by_cust  =  data['report'];
                    this.print_data    =  data['download_report'];
                    // var total_gst      =  data['gst_total'];
                    // var total_igst      =  data['igst_total'];
                    for(let i=0;i<this.sale_by_cust.length;i++)
                    {
                      if(this.sale_by_cust[i]['Tax_percent'] == 5 && this.sale_by_cust[i]['Name'] =="CGST")
                      {
                        this.cgst_5 = this.sale_by_cust[i]['Tax']*2
                      }
                      if(this.sale_by_cust[i]['Tax_percent'] == 12 && this.sale_by_cust[i]['Name'] =="CGST")
                      {
                        this.cgst_12 = this.sale_by_cust[i]['Tax']*2
                      }
                      if(this.sale_by_cust[i]['Tax_percent'] == 18 && this.sale_by_cust[i]['Name'] =="CGST")
                      {
                        this.cgst_18 = this.sale_by_cust[i]['Tax']*2
                      }
                      if(this.sale_by_cust[i]['Tax_percent'] == 28 && this.sale_by_cust[i]['Name'] =="CGST")
                      {
                        this.cgst_28 = this.sale_by_cust[i]['Tax']*2
                      }

                      if(this.sale_by_cust[i]['Tax_percent'] == 5 && this.sale_by_cust[i]['Name'] =="IGST")
                      {
                        this.igst_5 = this.sale_by_cust[i]['Tax']
                      }
                      if(this.sale_by_cust[i]['Tax_percent'] == 12 && this.sale_by_cust[i]['Name'] =="IGST")
                      {
                        this.igst_12 = this.sale_by_cust[i]['Tax']
                      }
                      if(this.sale_by_cust[i]['Tax_percent'] == 18 && this.sale_by_cust[i]['Name'] =="IGST")
                      {
                        this.igst_18 = this.sale_by_cust[i]['Tax']
                      }
                      if(this.sale_by_cust[i]['Tax_percent'] == 28 && this.sale_by_cust[i]['Name'] =="IGST")
                      {
                        this.igst_28 = this.sale_by_cust[i]['Tax']
                      }
                    }
                    this.sale_by_cust.forEach(data => {

                   this.totalBalance +=data.Amount;
                   this.totalSales +=data.Tax;

                 });
                   this.totalSales =  parseFloat(this.totalSales.toFixed(2));
                    //this.date.reset();

                  const totalRow = {
                    Name      : 'Total',
                    Tax_percent: '',
                    Tax: this.totalSales,
                  };
                  this.print_data.push(totalRow);
                  this.sale_by_cust.push(totalRow);

                  }
                  else{
                    this.toastrService.warning('No Output Tax Data')
                  }
                  this.loading= false;
                })
                .catch(error => {
                  this.loading= false;
                  this.toastrService.error('API Failed: report load');
                });


                this.api.post('mp_tax_report_type2.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {

                  if (data != null)
                    {

                      this.tax_type2           =  data['report'];
                      this.print_data_type2    =  data['download_report'];
                      var totalSales=0

                      for(let i=0;i<this.tax_type2.length;i++)
                      {
                        if(this.tax_type2[i]['Tax_percent'] == 5 && this.tax_type2[i]['Name'] =="CGST")
                        {
                          this.sgst_5 = this.tax_type2[i]['Tax']*2
                        }
                        if(this.tax_type2[i]['Tax_percent'] == 12 && this.tax_type2[i]['Name'] =="CGST")
                        {
                          this.sgst_12 = this.tax_type2[i]['Tax']*2
                        }
                        if(this.tax_type2[i]['Tax_percent'] == 18 && this.tax_type2[i]['Name'] =="CGST")
                        {
                          this.sgst_18 = this.tax_type2[i]['Tax']*2
                        }
                        if(this.tax_type2[i]['Tax_percent'] == 28 && this.tax_type2[i]['Name'] =="CGST")
                        {
                          this.sgst_28 = this.tax_type2[i]['Tax']*2
                        }

                        if(this.tax_type2[i]['Tax_percent'] == 5 && this.tax_type2[i]['Name'] =="IGST")
                        {
                          this.op_igst_5 = this.tax_type2[i]['Tax']
                        }
                        if(this.tax_type2[i]['Tax_percent'] == 12 && this.tax_type2[i]['Name'] =="IGST")
                        {
                          this.op_igst_12 = this.tax_type2[i]['Tax']
                        }
                        if(this.tax_type2[i]['Tax_percent'] == 18 && this.tax_type2[i]['Name'] =="IGST")
                        {
                          this.op_igst_18 = this.tax_type2[i]['Tax']
                        }
                        if(this.tax_type2[i]['Tax_percent'] == 28 && this.tax_type2[i]['Name'] =="IGST")
                        {
                          this.op_igst_28 = this.tax_type2[i]['Tax']
                        }
                      }

                          this.tax_type2.forEach(data => {

                        // this.totalBalance +=data.Amount;
                          totalSales +=data.Tax;

                        });


                          totalSales =  parseFloat(totalSales.toFixed(2));
                          //this.date.reset();

                        const totalRow = {
                          Name      : 'Total',
                          Tax_percent: '',
                          Tax: totalSales,
                        };
                        this.print_data_type2.push(totalRow);
                        this.tax_type2.push(totalRow);

                    }
                    else{
                      this.toastrService.warning('No Input Tax Data')
                    }
                    this.loading= false;
                  })
                  .catch(error => {
                    this.loading= false;
                    this.toastrService.error('API Failed: report load');
                  });

                  this.api.post('mp_tax_report_new.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {

                    if (data != null)
                      {
                        function levelFilter(value) {
                          if (!value) { return false; }
                           return value.Bill_id != null;
                          }

                        this.tax_list     =  data['report'].filter(levelFilter);
                        //this.date.reset();
                      }
                      else{
                        this.toastrService.warning('No Input Tax Data')
                      }
                      this.loading= false;
                    })
                    .catch(error => {
                      this.loading= false;
                      this.toastrService.error('API Failed: report load');
                    });


            }


            if(this.id == "tds_tcs")
            {
              this.input_tcs   = 0;
              this.input_tds   = 0;
              this.output_tcs  = 0;
              this.output_tds  = 0;

           this.api.post('mp_tds_tcs_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {

            if (data != null)
              {

                  function levelFilter(value) {
                    if (!value) { return false; }
                     return (value.tds_percentage >0 || value.tcs_percentage >0);
                    }
                      this.sale_by_cust = data['list'].filter(levelFilter);

                  this.input_tcs   = data['input_tcs'];
                  this.input_tds   = data['input_tds'];
                  this.output_tcs  = data['output_tcs'];
                  this.output_tds  = data['output_tds'];

                 // this.print_data    =  data['download_report'];

                 //this.date.reset();
                }
                else
                {
                  this.sale_by_cust = null;
                  this.print_data   = null;
                  this.toastrService.warning('No data');
                  //this.date.reset();
                }
                this.loading= false;
              })
              .catch(error => {
                this.loading= false;
                this.toastrService.error('API Failed: report load');
              });
            }


            if(this.id == "epf_report")
            {

            this.api.post('mp_epf_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {

              if (data != null)
                {
                    this.sale_by_cust  =  data['report'];

                    this.print_data    =  data['download_report'];

                    let total          = data['total'];

                  //this.date.reset();

                  const totalRow = {
                    Date       :'',
                    Name       : 'Total',
                    Employee   : total.emp_epf,
                    Employer   :  total.epf_com ,
                    Total      : total.total_epf
                  };

                  this.sale_by_cust.push(totalRow);
                  this.print_data.push(totalRow);
                }

                else
                {
                  this.sale_by_cust = null;
                  this.print_data   = null;
                  this.toastrService.warning('No  data');
                  //this.date.reset();
                }
                this.loading= false;
              })
              .catch(error => {
                this.loading= false;
                this.toastrService.error('API Failed: report load');
              });
            }


            if(this.id == "esi_report")
            {

            this.api.post('mp_esi_report.php?from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken, data).then((data: any[]) => {

              if (data != null)
                {
                    this.sale_by_cust  =  data['report'];

                    this.print_data    =  data['download_report'];

                    let total          = data['total'];

                  //this.date.reset();


                  const totalRow = {
                    Date       :'',
                    Name       : 'Total',
                    Employee   : total.emp_esi,
                    Employer   :  total.esi_com ,
                    Total      : total.total_esi
                  };

                  this.sale_by_cust.push(totalRow);
                  this.print_data.push(totalRow);
                }

                else
                {
                  this.sale_by_cust = null;
                  this.print_data   = null;
                  this.toastrService.warning('No data');
                  //this.date.reset();
                }
                this.loading= false;
              })
              .catch(error => {
                this.loading= false;
                this.toastrService.error('API Failed:  report load ');
              });
            }
        }
        else{
          this.toastrService.warning('Choose the Correct Date ');
        }
  }

purchase_list:any
purchase_list_view:boolean=false

 async PriceChecking(event)
  {
     if(event.type == "click")
     {
      console.log(event.row)
      await   this.api.get('mp_item_purchaseReport.php?value='+event.row.item_id+'&authToken='+environment.authToken).then((data: any) =>
        {
                this.purchase_list = data;
                if(data!= null)
                {
                this.purchase_list_view=true
                }
                else{this.toastrService.warning('No data found ');}
        }).catch(error => {this.toastrService.error('Something went wrong ');});
     }
  }

  set_zero2()
  {
    this.purchase_list_view = false
  }
  onSubmit_customer(value)
  {

       this.customer_payment = true;
        if(this.customer.valid)
        {
          let today = new Date();
          let year  = today.getFullYear();
          let month = String(today.getMonth() + 1).padStart(2, '0');
          let day   = String(today.getDate()).padStart(2, '0');

          let formattedDate = `${year}-${month}-${day}`;
          let from_date = this.customer.value.from_date
          let to_date = this.customer.value.to_date

          if(  from_date <= to_date &&  to_date <= formattedDate || formattedDate==to_date)
          {
              if(this.id =='individual_customer_balance')
              {
                  this.totalBalance = 0;
                  this.cust_tran_data=null;
                  let foundCustomer = this.customer_list.find(customer => customer.customer_id ==  value.customer_id);
                  this.name = foundCustomer.company_name;
                this.api.get('mp_individual_customer_balance.php?value=' + value.customer_id + '&from_date='+from_date+'&to_date='+to_date+'&authToken=' + environment.authToken).then((data: any) =>
                  {

                    if(data != null)
                    {
                            //this.customer.reset();
                            this.cust_tran_data   =  data['report'];
                            this.print_tran_data  =  data['download_report'];
                            let due_balance       =  data['balance_due'];

                            const totalRow = {
                            Date:'',
                            Transaction:'',
                            Description:'',
                            Amount:'',
                            Payments:'Balance Due',
                            Balance:due_balance,
                          };

                          const Row = {
                            date:'',
                            transaction:'',
                            description:'Balance Due',
                            amount:'no',
                            payments:'no',
                            balance:due_balance,
                        };
                          // this.print_tran_data.push(totalRow);
                          // this.cust_tran_data.push(Row);

                        }
                      else
                        {
                          //this.customer.reset();
                          this.toastrService.warning('No Data');
                        }
                        this.loading= false;
                      }).catch(error => { this.toastrService.error('Something went wrong');
                      this.loading= false;
                      });
                }

                if(this.id =='individual_vendor_balance')
                {
                    this.totalBalance = 0;
                    this.cust_tran_data=null;
                    let foundCustomer = this.vendor_list.find(vendor => vendor.vendor_id ==  value.customer_id);

                    this.name= foundCustomer.company_name
                  this.api.get('mp_individual_vendor_balance.php?value=' + value.customer_id + '&from_date='+from_date+'&to_date='+to_date+'&authToken=' + environment.authToken).then((data: any) =>
                    {

                      if(data != null)
                      {
                        //this.customer.reset();
                              this.cust_tran_data   =  data['report'];
                              this.print_tran_data  =  data['download_report'];
                              let due_balance       =  data['balance_due'];

                              const totalRow = {
                              Date:'',
                              Transaction:'',
                              Description:'',
                              Amount:'',
                              Payments:'Balance Due',
                              Balance:due_balance,
                            };

                            const Row = {
                              date:'',
                              transaction:'',
                              description:'Balance Due',
                              amount:"no",
                              payments:"no",
                              balance:due_balance,
                          };
                            // this.print_tran_data.push(totalRow);
                            // this.cust_tran_data.push(Row);

                          }
                        else
                          {
                            //this.customer.reset();
                            this.toastrService.warning('No Data');
                          }
                          this.loading= false;

                        }).catch(error => { this.toastrService.error('Something went wrong');
                        this.loading= false;
                        });
                  }

               if(this.id =='expense_report')
                {
                  this.cust_tran_data=null;

                  let foundCustomer = this.expense_account.find(expense => expense.id ==  value.customer_id);

                  if(foundCustomer != undefined)
                      this.name= foundCustomer.account_name
                  if(foundCustomer == undefined)
                     this.name= "All Expense"

                    this.api.get('get_data.php?table=expense&find=exp_account&value='+value.customer_id+'&asign_field=exp_id&asign_value=DESC&authToken=' + environment.authToken).then((data: any) =>
                        {

                          //this.cust_tran_data = data;

                        }).catch(error => {this.toastrService.error('API Faild : loadTranseaction');});


                          this.api.get('mp_expense_report.php?value=' + value.customer_id + '&from_date='+from_date+'&to_date='+to_date+'&authToken=' + environment.authToken).then((data: any) =>
                            {
                              if(data != null)
                                {

                                        //this.customer.reset();
                                        this.cust_tran_data   =  data['report'];
                                        this.print_tran_data  =  data['download_report'];
                                }
                              else
                                {
                                      //this.customer.reset();
                                      this.cust_tran_data = null;
                                      this.print_tran_data = null;
                                      this.toastrService.warning('No Data');
                                }

                                this.loading= false;
                        }).catch(error => { this.toastrService.error('Something went wrong');
                        this.loading= false;
                         });

                  }

                  if(this.id =='employee_accounts_report')
                  {
                    this.cust_tran_data=null;
                    let foundCustomer = this.emp_bank_account.find(expense => expense.bank_id ==  value.customer_id);
                    this.name= foundCustomer.account_name

                    this.api.get('get_data.php?table=bank_transactions&find=bank_id&value='+value.customer_id+'&asign_field=tran_id&asign_value=DESC&authToken=' + environment.authToken).then((data: any) =>
                      {

                        // this.cust_tran_data = data;
                       }).catch(error => {this.toastrService.error('API Faild : loadTranseaction');});

                    this.api.get('mp_emp_account_report.php?value=' + value.customer_id + '&from_date='+from_date+'&to_date='+to_date+'&authToken=' + environment.authToken).then((data: any) =>
                      {

                        if(data != null)
                        {
                                 //this.customer.reset();
                                 this.cust_tran_data   =  data['report'];
                                 this.print_tran_data  =  data['download_report'];
                        }
                          else
                            {
                              //this.customer.reset();
                              this.cust_tran_data = null;
                              this.print_tran_data = null;
                              this.toastrService.warning('No Data');
                            }
                            this.loading= false;
                          }).catch(error => { this.toastrService.error('Something went wrong'); this.loading= false;});
                    }


                    if(this.id == "attendance_report")
                      {
                        this.cust_tran_data=null;
                        let employee = this.employee_list.find(employee => employee.emp_id ==  value.customer_id);
                        if(employee != undefined)
                        {
                          this.name = employee.name+" attendance report "+from_date+" to " +to_date;
                        }
                        else{
                          this.name = "Employee Attendance Report ";
                        }

                       this.api.get('mp_attendance_report.php?emp_id='+value.customer_id+'&from_date=' + from_date + '&to_date=' + to_date + '&authToken=' + environment.authToken).then((data: any) => {
                          if (data != null)
                            {
                              this.sale_by_cust    =  data['report'];
                              this.print_tran_data =  data['download_report'];
                              this.total_attedance =  data['total'];
                              //this.date.reset();

                              if(this.sale_by_cust == null)
                              {
                                this.toastrService.warning('No Data');
                              }
                            }
                            else
                            {
                              this.sale_by_cust = null;
                              this.print_data   = null;
                              this.total_attedance = null;
                              this.toastrService.warning('No data');
                              //this.date.reset();
                            }
                            this.loading= false;
                          })
                          .catch(error => {
                            this.toastrService.error('API Failed: loadTransaction');
                            this.loading= false;
                          });
                      }
                  }else{
                    this.toastrService.error('Choose the correct Date');
                  }
        }
        else{
          this.toastrService.error('Select the List');
        }
  }

  Onsubmit_expense(value)
  {
    this.customer_payment = true;
  }
  print()
  {
    if(this.print_data != null)
    {
      const csvData = this.convertToCSV(this.print_data);
      this.downloadCSVFile(csvData, ''+this.id+ ''+this.print_date.fromdate+' to '+this.print_date.todate+'.csv');
    }
    else{
      this.toastrService.warning('No Data ');
    }
  }
  print_tax()
  {
    if(this.print_data_type2 != null)
    {
      const csvData = this.convertToCSV(this.print_data_type2);
      this.downloadCSVFile(csvData, 'Bill '+this.id+ ''+this.print_date.fromdate+' to '+this.print_date.todate+'.csv');
    }
    else{
      this.toastrService.warning('No Data ');
    }
  }

  OnSelect(event)
  {
    if(event.type === "click")
    {
      if(event.row.status == 2)
      {
        this.toastrService.success('Already Paid');
      }
    }
  }

    onActivate(event)
    {

     if(event.type ==="click")
     {
       let data = event.row
       this.view= true
      if(this.id == "sales_by_customer" && data.Customer_Name  != "Total")
      {
        this.name= data.Customer_Name;
        this.customer_payment = true;

        this.api.get('mp_customer_payment_received.php?from_date='+this.tran_from_date+'&to_date='+this.tran_to_date+'&value=' + data.Customer_id + '&authToken=' + environment.authToken).then((data: any) =>
        {
          if(data != null)
          {
            this.cust_tran_data   =  data['report'];
            this.print_tran_data  =  data['download_report'];
          }else{
            this.toastrService.warning('No Data');
          }
        }).catch(error => { this.toastrService.error('Something went wrong'); });
      }

       if(this.id == "customer_balances" && data.Customer_Name  != "Total")
          {

            this.name= data.Customer_Name;
            this.customer_payment = true;
            this.totalBalance = 0;
          this.api.get('mp_customer_balance_received_report.php?from_date='+this.tran_from_date+'&to_date='+this.tran_to_date+'&value=' + data.Customer_id + '&authToken=' + environment.authToken).then((data: any) =>
            {

              if(data != null)
                        {
                            this.cust_tran_data   =  data['report'];
                            this.print_tran_data  =  data['download_report'];
                            let due_balance       =  data['balance_due'];
                           this.opening_balance = data['opening_balance']
                            const totalRow = {
                            Date:'',
                            Transaction:'',
                            Description:'',
                            Amount:'',
                            Payments:'Balance Due',
                            Balance:due_balance,
                          };

                          const Row = {
                            date:'',
                            transaction:'',
                            description:'Balance Due',
                            amount:'no',
                            payments:'',
                            balance:due_balance,
                        };
                          // this.print_tran_data.push(totalRow);
                          // this.cust_tran_data.push(Row);

                          this.temp=[... this.cust_tran_data];
                      }
              else{
                this.toastrService.warning('No Data');
              }
              }).catch(error => { this.toastrService.error('Something went wrong'); });
            }

            if(this.id == "vendor_balances" && data.Vendor_Name  != "Total")
            {
              this.name= data.Vendor_Name;
              this.customer_payment = true;
              this.api.get('mp_vendor_payment_made_report.php?from_date='+this.tran_from_date+'&to_date='+this.tran_to_date+'&value=' + data.Vendor_id + '&authToken=' + environment.authToken).then((data: any) =>
              {
                if(data != null)
                {
                this.cust_tran_data   =  data['report'];
                this.print_tran_data  =  data['download_report'];
                let due_balance       =  data['balance_due'];

                const totalRow = {
                  Date:'',
                  Transaction:'',
                  Description:'',
                  Amount:'',
                  Payments:'Balance Due',
                  Balance:due_balance,
              };

              const Row = {
                date:'',
                transaction:'',
                description:'Balance Due',
                amount:'no',
                payments:'no',
                balance:due_balance,
              };
              // this.print_tran_data.push(totalRow);
              // this.cust_tran_data.push(Row);

            }
            else{
              this.toastrService.warning('No Data');
            }
              }).catch(error => { this.toastrService.error('Something went wrong'); });
         }


         if(this.id == 'inventory_summary')
         {

          if(event.row.Stock_on_Hand)
          {
            this.name= data.Item_Name;
            this.customer_payment = true;
            this.api.get('mp_each_item_summary.php?value=' + data.Item_id + '&authToken=' + environment.authToken).then((data: any) =>
            {
              if(data != null)
              {
              this.cust_tran_data   =  data['report'];
              this.print_tran_data  =  data['download_report'];
              }else{
                this.toastrService.warning('No Data');
              }
            }).catch(error => { this.toastrService.error('Something went wrong'); });
          }
         }


          if(this.id =="tax_report")
          {
            this.name= data.Name+data.Tax_percent+"%";
            this.customer_payment = true;
              if(data.Invoice_id != null)
              {
                var field ='invoice_id'
                var value = data.Invoice_id;
                this.tax_field = 'invoice_id';
                this.feild_value = data.Invoice_id;
              }
              if(data.Bill_id != null)
              {
                var field = 'bill_id'
                var value = data.Bill_id;
                this.tax_field = 'bill_id';
                this.feild_value = data.Bill_id;
              }
             this.api.get('mp_tax_report_list.php?find='+field+'&value='+value+'&authToken='+environment.authToken).then((data: any) =>
            {
              if(data != null)
              {

              this.cust_tran_data   =  data;
              }
              else
              {
                this.toastrService.warning('No Data');
              }
            }).catch(error => { this.toastrService.error('Something went wrong'); });
          }

          if(this.id =="invoice_details")
          {

            this.api.get('get_data.php?table=payment_transactions&find=invoice_id&value='+event.row.invoice_id+'&authToken=' + environment.authToken).then((data: any) => {

              if(data != null)
              {
                this.name= data.Item_Name;
                this.customer_payment =  true;
                this.cust_tran_data   =  data;
              }else{
                this.toastrService.warning('No Data');
              }

               }).catch(error => { this.toastrService.error('Something went wrong'); });
          }


          if(this.id =="bills_details")
          {

            this.api.get('get_data.php?table=payment_made&find=bill_id&value='+event.row.bill_id+'&authToken=' + environment.authToken).then((data: any) => {

              if(data != null)
              {

                this.name= data.Item_Name;
                this.customer_payment =  true;
                this.cust_tran_data   =  data;
              }else{
                this.toastrService.warning('No Data');
              }

               }).catch(error => { this.toastrService.error('Something went wrong'); });
          }
  }
}

  print_tran()
  {
    if(this.print_tran_data != null)
    {
    const csvData = this.convertToCSV(this.print_tran_data);
    this.downloadCSVFile(csvData, this.name + ' _transaction'+this.print_date.fromdate+' to '+this.print_date.todate+'.csv');
    }
    else{
      this.toastrService.warning('No Data');
    }
  }

  print_balan()
  {
    if(this.print_tran_data != null)
    {
    const csvData = this.convertToCSV(this.print_tran_data);
    this.downloadCSVFile(csvData, this.name +'.csv');
    }
    else{
      this.toastrService.warning('No Data');
    }
  }

  convertToCSV(data: any[]): string
  {
    const csvArray = [];
    const headers = Object.keys(data[0]);
    csvArray.push(headers.join(','));

    data.forEach(item => {
      const row = headers.map(key => item[key]);
      csvArray.push(row.join(','));
    });

    return csvArray.join('\n');
  }

  downloadCSVFile(csvData: string, filename: string)
  {

    const csvBlob = new Blob([csvData],  { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();

    URL.revokeObjectURL(url);
  }


  set_zero()
  {
    this.id=null;
    this.show=true;
    this.sale_by_cust = null;
    this.print_data = null;
    this.customer_payment = false;
    this.cust_tran_data = null;
    this.date.reset()
    this.customer.reset();
    this.tax_show = false;
    this.tax_type2=false;
    this.cgst_5    = 0;
    this.cgst_12   = 0;
    this.cgst_18   = 0;
    this.cgst_28   = 0;
    this.sgst_5    = 0;
    this.sgst_12   = 0;
    this.sgst_18   = 0;
    this.sgst_28   = 0;
    this.igst_5    = 0;
    this.igst_12   = 0;
    this.igst_18   = 0;
    this.igst_28   = 0;
    this.op_igst_5  = 0;
    this.op_igst_12 = 0;
    this.op_igst_18 = 0;
    this.op_igst_28 = 0;
    this.selected.splice(0, this.selected.length);
    this.input_tcs   = 0;
    this.input_tds   = 0;
    this.output_tcs  = 0;
    this.output_tds  = 0;

    this.cust_tran_data = null;
    this.print_tran_data = null;
    this.tax_list = null;
  }

  set_zero1()
  {

    this.print_tran_data = null;
    this.cust_tran_data = null;
    this.customer.reset();;
    this.tax_show = false;
    this.tax_type2=false;
    this.customer_payment = false;

    if(this.id == "individual_customer_balance" || this.id =="individual_vendor_balance"|| this.id =="expense_report" ||
       this.id =="employee_accounts_report" || this.id == "attendance_report" ||  this.id == "price_trend"  )
    {
       this.id = null;
       this.show = true
    }

  }

  updateFilter(event)
   {
              const val = event.target.value.toLowerCase();
                const temp = this.temp.filter((d) => {
                  return Object.values(d).some(field =>
                    field != null && field.toString().toLowerCase().indexOf(val) !== -1
                  );
                });
                this.cust_tran_data = temp;
                this.table.offset = 0;
   }


   onSelect_all(event)
   {
     // this.selected.splice(0, this.selected.length);

      if (event && Array.isArray(event.selected)) {
          this.selected.push(...event.selected);
          event = null;
      }
      else {
         // console.error('Invalid event structure:', event);
      }

      this.cdr.detectChanges();

      this.updateHeaderCheckboxState();
  }

   esi_pay()
   {
    if(this.selected.length != 0)
    {
    let length = 0;
    this.loading = true;
     const promises = this.selected.map(list =>
      this.api.post(`single_field_update.php?table=esi_ledger&field=id&value=${list.id}&up_field=status&update=2&authToken=${environment.authToken}`, null)
      );

    Promise.all(promises)
      .then(results => {

        results.forEach(data_rt => {
          if (data_rt.status === 'success') {
                length++
          } else {
            this.toastrService.error('Something went wrong');
          }

          if (this.selected.length === length)
          {
            this.toastrService.success('Paid Successfully');

            this.api.post('mp_esi_report.php?from_date=' + this.tran_from_date + '&to_date=' + this.tran_to_date + '&authToken=' + environment.authToken,null).then((data: any[]) => {

              if (data != null)
                {
                    this.sale_by_cust  =  data['report'];

                    this.print_data    =  data['download_report'];

                    let total          = data['total'];

                  //this.date.reset();

                  const totalRow = {
                    Date       :'',
                    Name       : 'Total',
                    Employee   : total.emp_esi,
                    Employer   :  total.esi_com ,
                    Total      : total.total_esi
                  };

                  this.sale_by_cust.push(totalRow);
                  this.print_data.push(totalRow);
                }

                else
                {
                  this.sale_by_cust = null;
                  this.print_data   = null;
                  this.toastrService.warning('No data');
                  //this.date.reset();
                }
                this.loading = false
              })
              .catch(error => {
                this.toastrService.error('API Failed: loadTransaction');
                this.loading = false
              });
              this.selected.splice(0, this.selected.length);
          }
        });
      })
    }
    else{
      this.toastrService.warning('No selected Data ');
    }
  }

  updateHeaderCheckboxState() {
    if (this.headerCheckbox) {
      this.headerCheckbox.nativeElement.checked = false;
      this.headerCheckbox.nativeElement.indeterminate = false;
    }
  }

  epf_pay()
  {
   if(this.selected.length != 0)
   {
    let length = 0;
    this.loading = true;
    const promises = this.selected.map(list =>
     this.api.post(`single_field_update.php?table=epf_ledger&field=id&value=${list.id}&up_field=status&update=2&authToken=${environment.authToken}`, null)
     );

   Promise.all(promises)
     .then(results => {

       results.forEach(data_rt => {
         if (data_rt.status === 'success') {
               length++
         } else {
           this.toastrService.error('Something went wrong');
         }

         if (this.selected.length === length)
         {
           this.toastrService.success('Paid Successfully');

           this.api.post('mp_epf_report.php?from_date=' + this.tran_from_date + '&to_date=' + this.tran_to_date + '&authToken=' + environment.authToken,null).then((data: any[]) => {

             if (data != null)
               {
                   this.sale_by_cust  =  data['report'];

                   this.print_data    =  data['download_report'];

                   let total          = data['total'];

                 //this.date.reset();

                 const totalRow = {
                   Date       :'',
                   Name       : 'Total',
                   Employee   : total.emp_epf,
                   Employer   :  total.epf_com ,
                   Total      : total.total_epf
                 };

                 this.sale_by_cust.push(totalRow);
                 this.print_data.push(totalRow);
               }

               else
               {
                 this.sale_by_cust = null;
                 this.print_data   = null;
                 this.toastrService.warning('No data');
                 //this.date.reset();
               }
               this.loading = false
             })
             .catch(error => {
              this.loading = false
               this.toastrService.error('API Failed: loadTransaction');
             });
             this.selected.splice(0, this.selected.length);
         }
       });
     })
   }
   else{
    this.toastrService.warning('No selected Data ');
  }
 }

 tax_paid()
 {
  if(this.selected.length != 0)
  {
  let length = 0;
  this.loading = true
   const promises = this.selected.map(list =>
    this.api.post(`single_field_update.php?table=gst_ledger&field=id&value=${list.id}&up_field=status&update=2&authToken=${environment.authToken}`, null)
    );

  Promise.all(promises)
    .then(results => {

      results.forEach(data_rt => {
        if (data_rt.status === 'success') {
              length++
        } else {
          this.toastrService.error('Something went wrong');
        }

        if (this.selected.length === length)
        {
          this.toastrService.success('Paid Successfully');

          this.api.get('mp_tax_report_list.php?find='+this.tax_field+'&value='+this.feild_value+'&authToken='+environment.authToken).then((data: any) =>
          {
            if(data != null)
            {
            this.cust_tran_data   =  data;
            }
            else
            {
              this.toastrService.warning('No Data');
            }
          }).catch(error => { this.toastrService.error('Something went wrong'); });


          this.api.post('mp_tax_report_new.php?from_date=' + this.tran_from_date + '&to_date=' + this.tran_to_date + '&authToken=' + environment.authToken, null).then((data: any[]) => {

            if (data != null)
              {

                this.tax_list     =  data['report'];

                //this.date.reset();
              }
              else{
                this.toastrService.warning('No Input Tax Data')
              }
              this.loading= false;
            })
            .catch(error => {
              this.loading= false;
              this.toastrService.error('API Failed: loadTransaction');
            });
            this.selected.splice(0, this.selected.length);
        }
      });
    })

  }
  else{
    this.toastrService.warning('No selected Data ');
  }
 }


  tds_tcs_pay()
  {
    if(this.selected.length != 0)
    {
    let length = 0;
    this.loading = true
    const promises = this.selected.map(list =>
      this.api.post(`single_field_update.php?table=tds_ledger&field=id&value=${list.id}&up_field=status&update=2&authToken=${environment.authToken}`, null)
      );

    Promise.all(promises)
      .then(results => {

        results.forEach(data_rt => {
          if (data_rt.status === 'success') {
                length++
          } else {
            this.toastrService.error('Something went wrong');
          }

          if (this.selected.length === length)
          {
            this.toastrService.success('Paid Successfully');

            this.api.post('mp_tds_tcs_report.php?from_date=' + this.tran_from_date + '&to_date=' + this.tran_to_date + '&authToken=' + environment.authToken, null).then((data: any[]) => {
              if (data != null)
                {
                  //  this.sale_by_cust  =  data['list'];
                  function levelFilter(value) {
                      if (!value) { return false; }
                      return (value.tds_percentage >0 || value.tcs_percentage >0);
                      }
                      this.sale_by_cust = data['list'].filter(levelFilter);
                    this.input_tcs   = data['input_tcs'];
                    this.input_tds   = data['input_tds'];
                    this.output_tcs  = data['output_tcs'];
                    this.output_tds  = data['output_tds'];

                  // this.print_data    =  data['download_report'];

                  //this.date.reset();
                  }
                  else
                  {
                    this.sale_by_cust = null;
                    this.print_data   = null;
                    this.toastrService.warning('No data');
                    //this.date.reset();
                  }
                  this.loading= false;
                })
                .catch(error => {
                  this.loading = true
                  this.toastrService.error('API Failed: loadTransaction');
                });
                this.selected.splice(0, this.selected.length);
          }
        });
      })
    }
    else{
      this.toastrService.warning('No selected Data ');
    }
  }
}
