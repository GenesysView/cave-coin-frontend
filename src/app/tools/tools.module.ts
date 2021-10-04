import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsComponent } from './tools.component';
import { ToolsComponentRoutingModule } from './tools-routing.module';



@NgModule({
  declarations: [
    ToolsComponent
  ],
  imports: [
    CommonModule,
    ToolsComponentRoutingModule
  ]
})
export class ToolsModule { }
