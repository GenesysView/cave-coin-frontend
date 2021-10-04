import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiChartComponent } from './multi-chart.component';
import { MultiChartComponentRoutingModule } from './home-routing.module';



@NgModule({
  declarations: [
    MultiChartComponent
  ],
  imports: [
    CommonModule,
    MultiChartComponentRoutingModule
  ]
})
export class MultiChartModule { }
