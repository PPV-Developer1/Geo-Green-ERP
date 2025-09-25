import { Component, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AppConfig } from "../../../app.config";

@Component({
  selector: 'az-ng2-charts',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './ng2-charts.component.html'
})
export class Ng2ChartsComponent  { 
    public config:any;
    public configFn:any;

    public verticalBarChartType: string = 'bar'; 
    public verticalBarChartLegend: boolean = true;
    public verticalBarChartPlugins = [];
    public verticalBarChartData: ChartConfiguration<'bar'>['data'] = { datasets: [] }; 
    public verticalBarChartOptions: ChartOptions<'bar'>;

    public horizontalBarChartType: string = 'bar'; 
    public horizontalBarChartLegend: boolean = true;
    public horizontalBarChartPlugins = [];
    public horizontalBarChartData: ChartConfiguration<'bar'>['data'] = { datasets: [] }; 
    public horizontalBarChartOptions: ChartOptions<'bar'>;

    public lineChartType: string = 'line'; 
    public lineChartLegend: boolean = true;
    public lineChartData: ChartConfiguration<'line'>['data'] = { datasets: [] };
    public lineChartOptions: ChartOptions<'line'>;

    public doughnutChartType: string = 'doughnut';
    public pieChartType: string = 'pie';
    public pieChartData: ChartConfiguration<'pie'>['data'] = { datasets: [] };
    public pieChartOptions: ChartOptions<'pie'>;
    public pieChartLegend: boolean = true;

    public radarChartType: string = 'radar';
    public radarChartLegend: boolean = true;
    public radarChartData: ChartConfiguration<'radar'>['data'] = { datasets: [] };
    public radarChartOptions: ChartOptions<'radar'>;

    public polarAreaChartType: string = 'polarArea';
    public polarAreaChartLegend: boolean = true;
    public polarAreaChartData: ChartConfiguration<'polarArea'>['data'] = { datasets: [] };
    public polarAreaChartOptions: ChartOptions<'polarArea'>; 
    
    constructor(private _appConfig:AppConfig){
        this.config = this._appConfig.config;
        this.configFn = this._appConfig;       
    } 

    ngOnInit() { 
        //--- Vertical Bar Chart --- 
        this.verticalBarChartData.labels = ['2007', '2008', '2009', '2010', '2011', '2012'];
        this.verticalBarChartData.datasets = [
            { 
                data: [59, 80, 72, 56, 55, 40], 
                label: 'Series A',           
                borderWidth: 2, 
                backgroundColor: this.configFn.rgba(this.config.colors.danger, 0.5),
                borderColor: this.config.colors.danger,
                hoverBackgroundColor: this.config.colors.danger
            },
            { 
                data: [48, 40, 19, 75, 27, 80], 
                label: 'Series B',
                borderWidth: 2,
                backgroundColor: this.configFn.rgba(this.config.colors.info, 0.5),
                borderColor: this.config.colors.info,
                hoverBackgroundColor: this.config.colors.info 
            }
        ]; 
        this.verticalBarChartOptions = {
            responsive: true, 
            scales: {
                y: {
                    display: true,
                    beginAtZero: true, 
                    ticks: { 
                        color: this.configFn.rgba(this.config.colors.gray, 0.7),
                        stepSize: 10,
                        font: {
                            size: 14
                        }
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
                        color: this.configFn.rgba(this.config.colors.gray, 0.7),
                        stepSize: 10,
                        font: {
                            size: 14
                        }
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
                    backgroundColor: this.configFn.rgba(this.config.colors.main, 0.6)             
                }
            }
        };

        //--- Horizontal  Bar Chart --- 
        this.horizontalBarChartData.labels = ['2007', '2008', '2009', '2010', '2011', '2012'];
        this.horizontalBarChartData.datasets = [
            { 
                data: [59, 80, 72, 56, 55, 40], 
                label: 'Series A',           
                borderWidth: 2, 
                backgroundColor: this.configFn.rgba(this.config.colors.danger, 0.5),
                borderColor: this.config.colors.danger,
                hoverBackgroundColor: this.config.colors.danger
            },
            { 
                data: [48, 40, 19, 75, 27, 80], 
                label: 'Series B',
                borderWidth: 2,
                backgroundColor: this.configFn.rgba(this.config.colors.info, 0.5),
                borderColor: this.config.colors.info,
                hoverBackgroundColor: this.config.colors.info 
            }
        ]; 
        this.horizontalBarChartOptions = {
            responsive: true,
            indexAxis: 'y',
            scales: {
                y: {
                    display: true,
                    beginAtZero: true, 
                    ticks: { 
                        color: this.configFn.rgba(this.config.colors.gray, 0.7),
                        stepSize: 10,
                        font: {
                            size: 14
                        }
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
                        color: this.configFn.rgba(this.config.colors.gray, 0.7),
                        stepSize: 10,
                        font: {
                            size: 14
                        }
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
                    backgroundColor: this.configFn.rgba(this.config.colors.main, 0.6)             
                }
            }
        };

        //--- Line Chart ---
        this.lineChartData.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        this.lineChartData.datasets = [
            { 
                data: [65, 59, 80, 81, 56, 55, 40], 
                label: 'Series A',
                fill: true, 
                tension: 0.5,            
                borderWidth: 2,
                backgroundColor: this.configFn.rgba(this.config.colors.success, 0.5),
                borderColor: this.config.colors.success,
                pointBorderColor: this.config.colors.default,
                pointHoverBorderColor:  this.config.colors.success,
                pointHoverBackgroundColor: this.config.colors.default,
                hoverBackgroundColor:  this.config.colors.success
            },
            { 
                data: [28, 48, 40, 19, 86, 27, 90], 
                label: 'Series B',
                fill: true,
                tension: 0.5,
                borderWidth: 2,
                backgroundColor: this.configFn.rgba(this.config.colors.warning, 0.5),
                borderColor: this.config.colors.warning,
                pointBorderColor: this.config.colors.default,
                pointHoverBorderColor:  this.config.colors.warning,
                pointHoverBackgroundColor: this.config.colors.default,
                hoverBackgroundColor:  this.config.colors.warning
            },
            { 
                data: [18, 48, 77, 9, 100, 27, 40], 
                label: 'Series C',
                fill: true,
                tension: 0.5,
                borderWidth: 2,
                backgroundColor: this.configFn.rgba(this.config.colors.primary, 0.5),
                borderColor: this.config.colors.primary,
                pointBorderColor: this.config.colors.default,
                pointHoverBorderColor:  this.config.colors.primary,
                pointHoverBackgroundColor: this.config.colors.default,
                hoverBackgroundColor:  this.config.colors.primary
            }
        ];
        this.lineChartOptions = {
            scales: {
                y: {
                    display: true,
                    beginAtZero: true,
                    ticks: { 
                        color: this.configFn.rgba(this.config.colors.gray, 0.7),
                        stepSize: 10
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
        };

        //--- Doughnut/Pie Chart ---
        this.pieChartData.labels = [['Downloads'], ['Sales'], ['Orders']];
        this.pieChartData.datasets = [{
            data: [350, 420, 130],
            backgroundColor: [
                this.configFn.rgba(this.config.colors.success, 0.6),
                this.configFn.rgba(this.config.colors.warning, 0.6),
                this.configFn.rgba(this.config.colors.danger, 0.6)   
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
        };

        //--- Radar Chart ---
        this.radarChartData.labels = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];
        this.radarChartData.datasets = [
            { 
                data: [65, 59, 90, 81, 56, 55, 40], 
                label: 'Series A',
                fill: true,            
                borderWidth: 2,
                backgroundColor: this.configFn.rgba(this.config.colors.danger, 0.5),
                borderColor: this.config.colors.danger,
                pointBorderColor: this.config.colors.default,
                pointHoverBorderColor:  this.config.colors.danger,
                pointHoverBackgroundColor: this.config.colors.default,
                hoverBackgroundColor:  this.config.colors.danger
            },
            { 
                data: [28, 48, 40, 19, 96, 27, 100], 
                label: 'Series B',
                fill: true,
                borderWidth: 2,
                backgroundColor: this.configFn.rgba(this.config.colors.primary, 0.5),
                borderColor: this.config.colors.primary,
                pointBorderColor: this.config.colors.default,
                pointHoverBorderColor:  this.config.colors.primary,
                pointHoverBackgroundColor: this.config.colors.default,
                hoverBackgroundColor:  this.config.colors.primary
            } 
        ];
        this.radarChartOptions = {
            scales: {
                r: {
                    angleLines: {
                        display: true,
                        lineWidth: 2,
                        color: this.configFn.rgba(this.config.colors.gray, 0.3)
                    },
                    pointLabels:{
                        color: this.configFn.rgba(this.config.colors.gray, 0.7),
                        backdropColor: this.configFn.rgba(this.config.colors.gray, 0.1)
                    },
                },
                y: {
                    display: false,
                    beginAtZero: true,
                    ticks: { 
                        color: this.configFn.rgba(this.config.colors.gray, 0.7),
                        stepSize: 10
                    } 
                },
                x: {
                    display: false,
                    beginAtZero: true,
                    ticks: { 
                        color: this.configFn.rgba(this.config.colors.gray, 0.7)
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
        };


        //--- Polar Area Chart ---
        this.polarAreaChartData.labels = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
        this.polarAreaChartData.datasets = [{
            data: [300, 500, 100, 240, 130],
            backgroundColor: [
                this.configFn.rgba(this.config.colors.success, 0.6),
                this.configFn.rgba(this.config.colors.warning, 0.6),
                this.configFn.rgba(this.config.colors.danger, 0.6),
                this.configFn.rgba(this.config.colors.primary, 0.6),
                this.configFn.rgba(this.config.colors.info, 0.6)        
            ],
            hoverBackgroundColor: [
                this.config.colors.success,
                this.config.colors.warning,
                this.config.colors.danger,
                this.config.colors.primary,
                this.config.colors.info
            ],
            borderColor: this.config.colors.default,
            borderWidth: 1,
            hoverBorderWidth: 3
        }];
        this.polarAreaChartOptions = {
            scales: {
                y: {
                    display: false,
                    beginAtZero: true,
                    ticks: { 
                        color: this.config.colors.main,
                        stepSize: 10
                    },
                    grid: {
                        display: true,
                        color: this.configFn.rgba(this.config.colors.gray, 0.1)
                    }
                },
                x: {
                    display: false,
                    beginAtZero: true,
                    ticks: { 
                        color: this.config.colors.main,
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
    //console.log(e);
    }

    public chartHovered(e:any):void {
    //console.log(e);
    }



}
