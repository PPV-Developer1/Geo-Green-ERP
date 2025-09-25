import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import 'chart.js/dist/Chart.js';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { Ng2ChartsComponent } from './ng2-charts/ng2-charts.component';

export const routes: Routes = [
  { path: '', redirectTo: 'ng2charts', pathMatch: 'full' },
  { path: 'ng2charts', component: Ng2ChartsComponent,  data: { breadcrumb: 'Ng2 Charts' }  }
];

@NgModule({
  imports: [
    CommonModule,
    NgChartsModule,
    DirectivesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    Ng2ChartsComponent
  ]
})

export class ChartingModule { }
