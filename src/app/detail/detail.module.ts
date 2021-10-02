import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail.component';
import { DetailComponentRoutingModule } from './detail-routing.module';



@NgModule({
  declarations: [
    DetailComponent
  ],
  imports: [
    CommonModule,
    DetailComponentRoutingModule
  ]
})
export class DetailModule { }
