import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeComponentRoutingModule } from './trade-routing.module';
import { TradeComponent } from './trade.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PancakeSwapService } from 'src/app/services/pancake_swap.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    TradeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TradeComponentRoutingModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule,
    MatButtonModule
  ],
  providers: [
    PancakeSwapService
  ]
})
export class TradeModule { }
