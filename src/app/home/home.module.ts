import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeComponentRoutingModule } from './home-routing.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { GeneralService } from '../services/general.service';
import { HttpClientModule } from '@angular/common/http';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { SymbolCategoryService } from '../services/symbol_category.service';
import { ComponentsModule } from '../components/components.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../services/socket.service';

const config: SocketIoConfig = { url: 'https://cavecoin.app:3011' };

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeComponentRoutingModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCarouselModule,
    ComponentsModule,
    SocketIoModule.forRoot(config)
  ],
  providers:[
    GeneralService,
    SymbolCategoryService,
    CookieService,
    SocketService
  ]
})
export class HomeModule { }
