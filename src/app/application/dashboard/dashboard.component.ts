import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppConfig } from "../../app.config";
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';
import { ApiService } from "../../service/api.service";
import { environment } from "../../../environments/environment";
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'az-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ DashboardService ]
})
export class DashboardComponent implements OnInit  {
    public router         : Router;
    public config         : any;
    public configFn       : any;
    public bgColor        : any;
    public weatherData    : any;
    public dashboard_data : any;

    public date           = new Date();
    public user_type      = localStorage.getItem('type');
    public chart_disp     = 0; // Wait for async function complete

    public lineChartType    :string = 'line';
    public lineChartData: ChartConfiguration<'line'>['data'] = {
      datasets: []
    };
    public lineChartOptions: ChartOptions<'line'>;

    public invoice_count          :number;
    public total_invoice_value    :number;
    public bill_count             :number;
    public total_bill_value       :number;
    public total_balance_value    :number;
    public project_count          :number;
    public yet_to_dispatch_count  :number;
    public vendor_count           :number;
    public customer_count         :number;
    public total_receivables      :number;
    public total_payables         :number;
    public total_store_worth      :number;
    public total_bank_worth       :number;

    public chart_apl  :number;
    public chart_may  :number;
    public chart_jun  :number;
    public chart_jul  :number;
    public chart_aug  :number;
    public chart_sep  :number;
    public chart_oct  :number;
    public chart_nov  :number;
    public chart_dec  :number;
    public chart_jan  :number;
    public chart_feb  :number;
    public chart_mar  :number;

    public chart1_apl :number;
    public chart1_may :number;
    public chart1_jun :number;
    public chart1_jul :number;
    public chart1_aug :number;
    public chart1_sep :number;
    public chart1_oct :number;
    public chart1_nov :number;
    public chart1_dec :number;
    public chart1_jan :number;
    public chart1_feb :number;
    public chart1_mar :number;

    constructor(router:Router, private _appConfig:AppConfig, private _dashboardService:DashboardService , private api : ApiService)
    {
        this.router = router;
        this.config = this._appConfig.config;
        this.configFn = this._appConfig;
        this.weatherData = _dashboardService.getWeatherData();
    }


    async ngOnInit()
    {
      await this.api.get('mp_dashboard.php?authToken='+environment.authToken).then((data: any) =>
      {
        this.dashboard_data = data;
      }).catch();

      this.chartData();
      this.chart_disp = 1; 
    }


    async chartData()
    {
      this.invoice_count          = this.dashboard_data.invoice_count;
      this.total_invoice_value    = this.dashboard_data.total_invoice_value;
      this.bill_count             = this.dashboard_data.bill_count;
      this.total_bill_value       = this.dashboard_data.total_bill_value;
      this.total_balance_value    = this.dashboard_data.total_balance_value;
      this.project_count          = this.dashboard_data.project_count;
      this.yet_to_dispatch_count  = this.dashboard_data.yet_to_dispatch_count;
      this.vendor_count           = this.dashboard_data.vendor_count;
      this.customer_count         = this.dashboard_data.customer_count;
      this.total_receivables      = this.dashboard_data.total_receivables;
      this.total_payables         = this.dashboard_data.total_payables;
      this.total_store_worth      = this.dashboard_data.total_store_worth;
      this.total_bank_worth       = this.dashboard_data.total_bank_worth;

      this.chart_apl              = this.dashboard_data.chart_April;
      this.chart_may              = this.dashboard_data.chart_May;

      if (this.chart_may == null)
        this.chart_may = this.chart_apl;

      this.chart_jun = this.dashboard_data.chart_June;
      if (this.chart_jun == null)
        this.chart_jun = this.chart_may;

      this.chart_jul = this.dashboard_data.chart_July;
      if (this.chart_jul == null)
        this.chart_jul = this.chart_jun;

      this.chart_aug = this.dashboard_data.chart_August;
      if (this.chart_aug == null)
        this.chart_aug = this.chart_jul;

      this.chart_sep = this.dashboard_data.chart_September;
      if (this.chart_sep == null)
        this.chart_sep = this.chart_aug;

      this.chart_oct = this.dashboard_data.chart_October;
      if (this.chart_oct == null)
        this.chart_oct = this.chart_sep;

      this.chart_nov = this.dashboard_data.chart_November;
      if (this.chart_nov == null)
        this.chart_nov = this.chart_oct;

      this.chart_dec = this.dashboard_data.chart_December;
      if (this.chart_dec == null)
        this.chart_dec = this.chart_nov;

      this.chart_jan = this.dashboard_data.chart_January;
      if (this.chart_jan == null)
        this.chart_jan = this.chart_dec;

      this.chart_feb = this.dashboard_data.chart_February;
      if (this.chart_feb == null)
        this.chart_feb = this.chart_jan;

      this.chart_mar = this.dashboard_data.chart_March;
      if (this.chart_mar == null)
        this.chart_mar = this.chart_feb;

      //*************************************************** */
      this.chart1_apl = this.dashboard_data.chart1_April;

      this.chart1_may = this.dashboard_data.chart1_May;
      if (this.chart1_may == null)
        this.chart1_may = this.chart1_apl;

      this.chart1_jun = this.dashboard_data.chart1_June;
      if (this.chart1_jun == null)
        this.chart1_jun = this.chart1_may;

      this.chart1_jul = this.dashboard_data.chart1_July;
      if (this.chart1_jul == null)
        this.chart1_jul = this.chart1_jun;

      this.chart1_aug = this.dashboard_data.chart1_August;
      if (this.chart1_aug == null)
        this.chart1_aug = this.chart1_jul;

      this.chart1_sep = this.dashboard_data.chart1_September;
      if (this.chart1_sep == null)
        this.chart1_sep = this.chart1_aug;

      this.chart1_oct = this.dashboard_data.chart1_October;
      if (this.chart1_oct == null)
        this.chart1_oct = this.chart1_sep;

      this.chart1_nov = this.dashboard_data.chart1_November;
      if (this.chart1_nov == null)
        this.chart1_nov = this.chart1_oct;

      this.chart1_dec = this.dashboard_data.chart1_December;
      if (this.chart1_dec == null)
        this.chart1_dec = this.chart1_nov;

      this.chart1_jan = this.dashboard_data.chart1_January;
      if (this.chart1_jan == null)
        this.chart1_jan = this.chart1_dec;

      this.chart1_feb = this.dashboard_data.chart1_February;
      if (this.chart1_feb == null)
        this.chart1_feb = this.chart1_jan;

      this.chart1_mar = this.dashboard_data.chart1_March;
      if (this.chart1_mar == null)
        this.chart1_mar = this.chart1_feb;

        this.lineChartData.labels = ['April', 'May', 'June', 'July', 'Augest', 'Septemer', 'October', 'November', 'December', 'January', 'February', 'March'];
        this.lineChartData.datasets = [
            {
                data: [this.chart_apl,
                  this.chart_may,
                  this.chart_jun,
                  this.chart_jul,
                  this.chart_aug,
                  this.chart_sep,
                  this.chart_oct,
                  this.chart_nov,
                  this.chart_dec,
                  this.chart_jan,
                  this.chart_feb,
                  this.chart_mar,],
                label: 'Sales',
                fill: true,
                tension: 0.5,
                borderWidth               : 2,
                backgroundColor           : this.configFn.rgba(this.config.colors.success, 0.5),
                borderColor               : this.config.colors.success,
                pointBorderColor          : this.config.colors.default,
                pointHoverBorderColor     :  this.config.colors.success,
                pointHoverBackgroundColor : this.config.colors.default,
                hoverBackgroundColor      :  this.config.colors.success
            },
            {
                data: [this.chart1_apl,
                  this.chart1_may,
                  this.chart1_jun,
                  this.chart1_jul,
                  this.chart1_aug,
                  this.chart1_sep,
                  this.chart1_oct,
                  this.chart1_nov,
                  this.chart1_dec,
                  this.chart1_jan,
                  this.chart1_feb,
                  this.chart1_mar,],
                label: 'Purchase',
                fill: true,
                tension: 0.5,
                borderWidth               : 2,
                backgroundColor           : this.configFn.rgba(this.config.colors.danger, 0.5),
                borderColor               : this.config.colors.danger,
                pointBorderColor          : this.config.colors.default,
                pointHoverBorderColor     : this.config.colors.danger,
                pointHoverBackgroundColor : this.config.colors.default,
                hoverBackgroundColor      :  this.config.colors.danger
            },
        ];
        this.lineChartOptions = {
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        color: this.configFn.rgba(this.config.colors.gray, 0.7),

                    },
                    grid: {
                        display: true,
                        color: this.configFn.rgba(this.config.colors.gray, 0.1)
                    }
                },
                x: {
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        color: this.configFn.rgba(this.config.colors.gray, 0.7)
                    },
                    grid: {
                        display: true,
                        color: this.configFn.rgba(this.config.colors.gray, 0.1)
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: this.configFn.rgba(this.config.colors.gray, 0.9),
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: this.configFn.rgba(this.config.colors.main, 0.7)
                }
            }
        }
    }
    public chartClicked(e:any):void {

   }

   public chartHovered(e:any):void {

   }

}

