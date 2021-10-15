import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  }, {
    path: 'detail/:address',
    loadChildren: () => import('./detail/detail.module').then(m => m.DetailModule)
  }, {
    path: 'multi-chart',
    loadChildren: () => import('./multi-chart/multi-chart.module').then(m => m.MultiChartModule)
  }, {
    path: 'tools',
    loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
