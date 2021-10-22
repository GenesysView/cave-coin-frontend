import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './admin/pages/auth/guards';
import { DashboardPageComponent } from './admin/pages/dashboard/containers';
import { NotFoundComponent } from './admin/pages/not-found/not-found.component';

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
  },





  {
    path: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: DashboardPageComponent
  },
  {
    path: 'typography',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/pages/typography/typography.module').then(m => m.TypographyModule)
  },
  {
    path: 'tables',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/pages/tables/tables.module').then(m => m.TablesModule)
  },
  {
    path: 'notification',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/pages/notification/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'ui',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/pages/ui-elements/ui-elements.module').then(m => m.UiElementsModule)
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: 'login',
    loadChildren: () => import('./admin/pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
