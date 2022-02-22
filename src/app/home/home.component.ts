import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general.service';
import Web3 from 'web3';
import { SymbolCategoryService } from '../services/symbol_category.service';
import { SocketService } from '../services/socket.service';
declare let window: any;

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  static tokenWallet: FormControl = new FormControl();
  tokenWalletTemp: any;
  currentAccount = null;

  filteredOptions: any;
  formGroup!: FormGroup;
  options: any = [];

  tiles: Tile[] = [
    { text: 'Two', cols: 2, rows: 8, color: 'lightgreen' },
    { text: 'One', cols: 8, rows: 8, color: 'lightblue' },
    { text: 'five', cols: 2, rows: 8, color: 'lightgreen' },
  ];

  intervalSlide = 5000;
  proportionSlide = 25;
  numSlide = 4;
  slides = [
    { 'image': 'https://s.france24.com/media/display/cc347944-0a9a-11eb-b90d-005056bf87d6/w:1280/p:16x9/Bitcoin.webp' },
    { 'image': 'https://fotografias.antena3.com/clipping/cmsimages01/2021/03/02/0CABE1F1-B6D6-4C7E-920E-AFEC2E4E4B57/98.jpg?crop=750,422,x0,y40&width=1900&height=1069&optimize=low&format=webply' },
    { 'image': 'https://cdn.euroinnova.edu.es/img/subidasEditor/funciones%20-%202021-04-22t090510-1619075140.876' },
    { 'image': 'https://ichef.bbci.co.uk/news/640/cpsprodpb/5ECC/production/_118086242_gettyimages-1312494054.jpg' }
  ];


  symbolsCategories: any = [];
  symbolCategorySelect: FormControl;
  private socket: any;


  constructor(
    private fb: FormBuilder,
    public generalService: GeneralService,
    private symbolCategoryService: SymbolCategoryService,
    private router: Router,
    private socketService: SocketService
  ) {
    this.symbolCategorySelect = new FormControl('binance-smart-chain');
  }

  ngOnInit(): void {
    // GeneralService.tokenWallet  = accounts[0];
    // this.tokenWallet = this.generalService.getTokenWallet();
    this.initForm();
    this.getAllSymbolCategory();
    this.getBalance();
    // this.socketService.fetchMovies();
    // this.socketService.OnFetchMovies().subscribe((data: any) => {
    //   console.log('data',data);
    // });
  }

  initForm() {
    this.formGroup = this.fb.group({
      'employee': ['']
    })
    this.formGroup.get('employee')!.valueChanges.subscribe(response => {
      console.log('data is ', response);
      if (response.length >= 2) {
        this.generalService.searchCoin(response)
          .subscribe(response => {
            let netWork = this.symbolCategorySelect.value;
            if (netWork != null) {
              let symbolsList: any = [];
              for (let i = 0; i < response.length; i++) {
                let addresses = response[i].address;
                console.log('addresses.length', addresses.length);

                for (let j = 0; j < addresses.length; j++) {
                  // const address = addresses[j];
                  // if (address.name == netWork) {
                  console.log('j', j);

                  console.log('[addresses[j]]', [addresses[j]]);

                  let item: any = {
                    "_id": response[i]._id,
                    "logo": response[i].logo,
                    "name": response[i].name,
                    "symbol": response[i].symbol,
                    "description": response[i].description,
                    "exchange": response[i].exchange,
                    "identifier": response[i].identifier,
                    "address": []
                  };
                  item.address = [addresses[j]];

                  symbolsList.push(item);
                  // }
                }
              }
              console.log('mira esta cosa ', symbolsList);

              this.options = symbolsList;
              this.filteredOptions = symbolsList;
              this.filterData(symbolsList);
            }
          }, err => {
            console.log(err);
          })
      }
    })
  }


  filterData(enteredData: string) {
    this.filteredOptions = this.options.filter((item: any) => {
      console.log('item', item);

      return item.name.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }


  selectCoin(item: any) {
    console.log('item seleccionado', item);

    // let netWork = this.symbolCategorySelect.value;
    let netWork = item.address[0].name;


    let address = this.getAddress(item);
    console.log('address', address.address);
    this.router.navigate(['detail/' + address.address + '/' + netWork]);
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

  getAllSymbolCategory() {
    this.symbolCategoryService.getAllSymbolCategory()
      .subscribe(response => {
        this.symbolsCategories = response;
      }, err => {
        console.log(err);
      })
  }

  async getBalance() {
    let address = localStorage.getItem('mwl');
    if (address != null) {
      try {
        let balance = await window.ethereum
          .request({
            method: 'eth_getBalance',
            params: [address, "latest"],
          })
        // covert to readable format (account for decimals)
        let read = parseInt(balance) / 10 ** 18; // will need change based on what token
        console.log("Smart Contract Token Balance:" + read.toFixed(5));

        let bnbPrice = await this.generalService.symbolPrice('BNBUSDT').toPromise();
        console.log('bnbPrice', bnbPrice);

        this.tokenWalletTemp = { mycant: read.toFixed(5), currentPrice: bnbPrice.price }
      } catch (error) {
        console.log(error);
      }
    }
  }

}
