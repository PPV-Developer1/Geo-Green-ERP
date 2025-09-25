import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { DashboardComponent } from './dashboard.component';
import { DynamicChartComponent } from './dynamic-chart/dynamic-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { INRModule } from 'src/app/pipe/INR/INR.module';
import 'chart.js/dist/Chart.js';


type PathMatch = "full" | "prefix" | undefined;

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' as PathMatch }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    PipesModule,
    INRModule,
    DirectivesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    DashboardComponent,
    DynamicChartComponent,
  ]
})

export class DashboardModule { }
