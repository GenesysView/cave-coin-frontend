import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiChartComponent } from './multi-chart.component';
import { MultiChartComponentRoutingModule } from './home-routing.module';
import { ComponentsModule } from '../components/components.module';
import { GeneralService } from '../services/general.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SymbolCategoryService } from '../services/symbol_category.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    MultiChartComponent
  ],
  imports: [
    CommonModule,
    MultiChartComponentRoutingModule,
    ComponentsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatSortModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    GeneralService,
    SymbolCategoryService
  ]
})
export class MultiChartModule { }
