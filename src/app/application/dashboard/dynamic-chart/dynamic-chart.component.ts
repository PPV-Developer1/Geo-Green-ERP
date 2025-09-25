import { Component, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AppConfig } from "../../../app.config";

@Component({
  selector: 'az-dynamic-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dynamic-chart.component.html'
})
export class DynamicChartComponent {
    public config:any;
    public configFn:any;

    public lineChartType:string = 'line';
    public lineChartData: ChartConfiguration<'line'>['data'] = {
        datasets: []
    };
    public lineChartOptions: ChartOptions<'line'>;

    public pieChartType: string = 'pie';
    public pieChartData: ChartConfiguration<'pie'>['data'] = {
        datasets: []
    };
    public pieChartOptions: ChartOptions<'pie'>;
    public pieChartLegend: boolean = true;

    constructor(private _appConfig:AppConfig){
        this.config = this._appConfig.config;
        this.configFn = this._appConfig;
    }

    ngOnInit() {

      this.lineChartData.labels = ['April', 'May', 'June', 'July', 'Augest', 'Septemer', 'October', 'November', 'December', 'January', 'February', 'March'];
        this.lineChartData.datasets = [
            {
                data: [11700, 10320, 25080, 32501, 24556, 49855, 21580],
                label: 'Web',
                fill: true,
                tension: 0.5,
                borderWidth: 2,
                backgroundColor: this.configFn.rgba(this.config.colors.danger, 0.5),
                borderColor: this.config.colors.danger,
                pointBorderColor: this.config.colors.default,
                pointHoverBorderColor:  this.config.colors.danger,
                pointHoverBackgroundColor: this.config.colors.default,
                hoverBackgroundColor:  this.config.colors.danger
            },
            {
                data: [28080, 42750, 40548, 19256, 29566, 32589, 47500],
                label: 'Mobile',
                fill: true,
                tension: 0.5,
                borderWidth: 2,
                backgroundColor: this.configFn.rgba(this.config.colors.info, 0.5),
                borderColor: this.config.colors.info,
                pointBorderColor: this.config.colors.default,
                pointHoverBorderColor:  this.config.colors.info,
                pointHoverBackgroundColor: this.config.colors.default,
                hoverBackgroundColor:  this.config.colors.info
            },
        ];
        this.lineChartOptions = {
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        color: this.configFn.rgba(this.config.colors.gray, 0.7),
                        stepSize: 5000
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


        this.pieChartData.labels = [['Profit'], ['Fees'], ['Tax']];
        this.pieChartData.datasets = [{
            data: [ 570, 150, 300 ],
            backgroundColor: [
                this.configFn.rgba(this.config.colors.success, 0.7),
                this.configFn.rgba(this.config.colors.warning, 0.7),
                this.configFn.rgba(this.config.colors.danger, 0.7)
            ],
            hoverBackgroundColor: [
                this.config.colors.success,
                this.config.colors.warning,
                this.config.colors.danger
            ],
            borderColor: this.config.colors.grayLight,
            borderWidth: 1,
            hoverBorderWidth: 3
        }];
        this.pieChartOptions = {
            plugins: {
                title: {
                    display: true,
                    text: 'Corporate Info With %',
                    color: this.config.colors.gray,
                    font: {
                        size: 14,
                        style: 'normal',
                        weight: 'normal'
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: this.configFn.rgba(this.config.colors.gray, 0.9),
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: this.configFn.rgba(this.config.colors.main, 0.7),
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            var total: any = context.dataset.data.reduce((previousValue: any, currentValue) => previousValue + currentValue);
                            var currentValue: any = context.parsed;
                            var precentage = Math.floor(((currentValue/total) * 100)+0.5);
                            if (label) {
                                label += ': ';
                            }
                            label = context.label[0] + ': ' + precentage + '%';
                            return label;
                        }
                    }
                }
            }
        }

    }



    public randomizeType():void {
        this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
        this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
    }

    public chartClicked(e:any):void {
       // console.log(e);
    }

    public chartHovered(e:any):void {
       // console.log(e);
    }


}
