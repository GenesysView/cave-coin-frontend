import { Component, ComponentFactoryResolver, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TvChartContainerComponent } from '../components/tv-chart-container/tv-chart-container.component';
import { TradeComponent } from '../pages/trade/trade.component';
import { GeneralService } from '../services/general.service';
import { SymbolCategoryService } from '../services/symbol_category.service';

@Component({
  selector: 'app-multi-chart',
  templateUrl: './multi-chart.component.html',
  styleUrls: ['./multi-chart.component.scss']
})
export class MultiChartComponent implements OnInit {

  @ViewChild('container0', { static: true, read: ViewContainerRef }) container0!: ViewContainerRef;
  @ViewChild('container1', { static: true, read: ViewContainerRef }) container1!: ViewContainerRef;
  @ViewChild('container2', { static: true, read: ViewContainerRef }) container2!: ViewContainerRef;
  @ViewChild('container3', { static: true, read: ViewContainerRef }) container3!: ViewContainerRef;
  @ViewChild('container4', { static: true, read: ViewContainerRef }) container4!: ViewContainerRef;
  @ViewChild('container5', { static: true, read: ViewContainerRef }) container5!: ViewContainerRef;
  @ViewChild('container6', { static: true, read: ViewContainerRef }) container6!: ViewContainerRef;
  @ViewChild('container7', { static: true, read: ViewContainerRef }) container7!: ViewContainerRef;
  @ViewChild('container8', { static: true, read: ViewContainerRef }) container8!: ViewContainerRef;

  netWorkSelected: any = 'binance-smart-chain';
  symbol: any = 'ADABNB';
  symboltwo: any = 'DOGECOIN';

  panelIndex = 0;

  panelList = [{
    symbol: 'ADABNB',
    netWorkSelected: 'binance-smart-chain'
  }, {
    symbol: 'ADABNB',
    netWorkSelected: 'binance-smart-chain'
  }];

  filteredOptions: any;
  formGroup!: FormGroup;
  options: any = [];

  symbolsCategories: any = [];
  symbolCategorySelect: FormControl;
  tokenAddress!: any;

  token: any = {
    logo: "",
    name: "",
    symbol: "",
    description: "",
    address: [
      {
        name: "",
        address: "",
      }
    ]
  };

  tradePanelList = [
    {
      estado: false
    }, {
      estado: false
    }, {
      estado: false
    }, {
      estado: false
    }, {
      estado: false
    }, {
      estado: false
    }, {
      estado: false
    }, {
      estado: false
    }, {
      estado: false
    }
  ]

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private generalService: GeneralService,
    private fb: FormBuilder,
    private symbolCategoryService: SymbolCategoryService,
    private dialog: MatDialog
  ) {
    console.log('container0', this.container0);
    this.symbolCategorySelect = new FormControl('binance-smart-chain');
  }

  ngOnInit(): void {

    this.getAllSymbolCategory();
    this.initForm();

  }

  addComponent(componentClass: Type<any>, symbol: any, coin: any, quoteAsset: any, network: any) {
    // Create component dynamically inside the ng-template
    console.log('addComponent', this.panelIndex);
    console.log(symbol);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    let component = null;
    if (this.panelIndex == 0) {
      component = this.container0.createComponent(componentFactory)
      component.instance.symbol = symbol;
      component.instance.coin = coin;
      component.instance.quoteAsset = quoteAsset;
      component.instance.network = network;
      this.tradePanelList[0].estado = true;
    } else if (this.panelIndex == 1) {
      component = this.container1.createComponent(componentFactory)
      component.instance.content = 1;
      component.instance.symbol = symbol;
      component.instance.coin = coin;
      component.instance.quoteAsset = quoteAsset;
      component.instance.network = network;
      this.tradePanelList[1].estado = true;
    } else if (this.panelIndex == 2) {
      component = this.container2.createComponent(componentFactory)
      component.instance.content = 2;
      component.instance.symbol = symbol;
      component.instance.coin = coin;
      component.instance.quoteAsset = quoteAsset;
      component.instance.network = network;
      this.tradePanelList[2].estado = true;
    } else if (this.panelIndex == 3) {
      component = this.container3.createComponent(componentFactory)
      component.instance.content = 3;
      component.instance.symbol = symbol;
      component.instance.coin = coin;
      component.instance.quoteAsset = quoteAsset;
      component.instance.network = network;
      this.tradePanelList[3].estado = true;
    } else if (this.panelIndex == 4) {
      component = this.container4.createComponent(componentFactory)
      component.instance.content = 4;
      component.instance.symbol = symbol;
      component.instance.coin = coin;
      component.instance.quoteAsset = quoteAsset;
      component.instance.network = network;
      this.tradePanelList[4].estado = true;
    } else if (this.panelIndex == 5) {
      component = this.container5.createComponent(componentFactory)
      component.instance.content = 5;
      component.instance.symbol = symbol;
      component.instance.coin = coin;
      component.instance.quoteAsset = quoteAsset;
      component.instance.network = network;
      this.tradePanelList[5].estado = true;
    } else if (this.panelIndex == 6) {
      component = this.container6.createComponent(componentFactory)
      component.instance.content = 6;
      component.instance.symbol = symbol;
      component.instance.coin = coin;
      component.instance.quoteAsset = quoteAsset;
      component.instance.network = network;
      this.tradePanelList[6].estado = true;
    } else if (this.panelIndex == 7) {
      component = this.container7.createComponent(componentFactory)
      component.instance.content = 7;
      component.instance.symbol = symbol;
      component.instance.coin = coin;
      component.instance.quoteAsset = quoteAsset;
      component.instance.network = network;
      this.tradePanelList[7].estado = true;
    } else if (this.panelIndex == 8) {
      component = this.container8.createComponent(componentFactory)
      component.instance.content = 8;
      component.instance.symbol = symbol;
      component.instance.coin = coin;
      component.instance.quoteAsset = quoteAsset;
      component.instance.network = network;
      this.tradePanelList[8].estado = true;
    }
    this.panelIndex++;
    // Push the component so that we can keep track of which components are created
    // this.components.push(component);
  }

  initForm() {
    this.formGroup = this.fb.group({
      'employee': ['']
    })
    this.formGroup.get('employee')!.valueChanges.subscribe(response => {
      console.log('data is ', response);
      if (response.length >= 3) {
        this.generalService.searchCoin(response)
          .subscribe(response => {
            console.log('--response', response);

            this.options = response;
            this.filteredOptions = response;
            this.filterData(response);
          }, (err: any) => {
            console.log(err);
          })
      }
    })
  }


  filterData(enteredData: any) {
    this.filteredOptions = this.options.filter((item: any) => {
      return item.name.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getAllSymbolCategory() {
    this.symbolCategoryService.getAllSymbolCategory()
      .subscribe(response => {
        this.symbolsCategories = response;
      }, err => {
        console.log(err);
      })
  }

  selectCoin(item: any) {
    console.log('seleect item', item);

    console.log('address', item.address);
    this.tokenAddress = item.address[0].address;
    this.generalService.searchSymbolByToken(this.tokenAddress)
      .subscribe(response => {
        console.log('--response', response);
        this.token = response[0];
        let component: any = TvChartContainerComponent;
        this.addComponent(component, String(item.symbol).toLocaleUpperCase(), this.token, 'USD', this.token.address[0].name);
      }, err => {
        console.log(err);
      })
  }

  getAddress(item: any) {
    for (let index = 0; index < item.address.length; index++) {
      const element = item.address[index];
      // if (element.name == 'binance-smart-chain') {
      return element;
      // }
    }
    return null;
  }

  openDialog(index: any) {
    const dialogRef = this.dialog.open(TradeComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
