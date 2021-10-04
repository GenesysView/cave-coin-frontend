import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultiChartComponent } from './multi-chart.component';


const routes: Routes = [
  {
    path: '',
    component: MultiChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiChartComponentRoutingModule {}
