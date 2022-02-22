import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail.component';
import { DetailComponentRoutingModule } from './detail-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralService } from '../services/general.service';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';
import { PolygonNetworkService } from '../services/polygon_network.service';
import { EthereumNetworkService } from '../services/ethereum_network.service';
import { ComponentsModule } from '../components/components.module';
import { BinanceNetworkService } from '../services/binance_network.service';
import { MatSelectModule } from '@angular/material/select';
import { SymbolCategoryService } from '../services/symbol_category.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { SocketService } from '../services/socket.service';

const config: SocketIoConfig = { url: 'https://cavecoin.app:3011' };

@NgModule({
  declarations: [
    DetailComponent
  ],
  imports: [
    CommonModule,
    DetailComponentRoutingModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatSortModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    MatButtonModule,
    MatDialogModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    GeneralService,
    PolygonNetworkService,
    EthereumNetworkService,
    BinanceNetworkService,
    SymbolCategoryService,
    CookieService,
    SocketService
  ]
})
export class DetailModule { }
