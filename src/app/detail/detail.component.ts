import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../services/general.service';
import Web3 from 'web3';
import { setInterval } from 'timers';
import { Observable } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';
import { MatTableDataSource } from '@angular/material/table';
import { DecodedMethod } from 'abi-decoder-ts';
import { MatSort } from '@angular/material/sort';
import { HttpHeaders } from '@angular/common/http';
import { PolygonNetworkService } from '../services/polygon_network.service';
import { BinanceNetworkService } from '../services/binance_network.service';
import { SymbolCategoryService } from '../services/symbol_category.service';
import { MatDialog } from '@angular/material/dialog';
import { TradeComponent } from '../pages/trade/trade.component';
import { SocketService } from '../services/socket.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
declare let window: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  static tokenWallet: FormControl = new FormControl();
  tokenWalletTemp: any;

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
  tokenAddress!: any;
  netWorkSelected!: any;
  totalSupply: any;
  marketCap: any;

  filteredOptions: any;
  formGroup!: FormGroup;
  options: any = [];

  obsTimer: Observable<number> = timer(1000, 10000);
  lastTransactions: any = [];

  displayedColumns: string[] = ['index', 'tokensTx', 'value', 'priceToken', 'timestamp', 'indexTxHash'];
  displayedColumnsBuyersAndSellers: string[] = ['wallet', 'total'];

  dataSource: MatTableDataSource<any>;
  dataSourceBuyers: MatTableDataSource<any>;
  dataSourceSellers: MatTableDataSource<any>;


  bnbPrice: any;

  symbolExchangeList: any = [];
  currentQuoteAsset: any = '';
  currentQuoteAssetForm: FormControl;

  symbolsCategories: any = [];
  symbolCategorySelect: FormControl;


  listaPrueba: any = [];
  tamanoInicialPrueba: number = 0;
  tamanoInicialCompleta: number = 0;
  tamanoInicialPruebaFallida: number = 0;
  isConsultaTxCompleta = false;

  pageLength: number = 5;


  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), this.ref);


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public generalService: GeneralService,
    private polygonNetworkService: PolygonNetworkService,
    private binanceNetworkService: BinanceNetworkService,
    private symbolCategoryService: SymbolCategoryService,
    private dialog: MatDialog,
    private socketService: SocketService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.dataSourceBuyers = new MatTableDataSource<any>();
    this.dataSourceSellers = new MatTableDataSource<any>();
    this.currentQuoteAssetForm = new FormControl();
    this.symbolCategorySelect = new FormControl();

  }

  async ngOnInit() {

    this.getBalance();
    this.loadInformation();

    this.paginator.ngOnInit();

  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');

    this.dataSource.sort = this.sort;
  }

  async loadInformation() {
    // this.tokenWallet = this.generalService.getTokenWallet();

    this.tokenAddress = this.route.snapshot.paramMap.get('address');
    this.netWorkSelected = this.route.snapshot.paramMap.get('network');
    console.log('this.netWorkSelected', this.netWorkSelected);

    this.symbolCategorySelect = new FormControl(this.netWorkSelected);

    //consulta informacion del token
    this.searchSymbolByToken(this.tokenAddress);
    //obtiene los datos para funcion de autocompletar
    this.initForm();
    //obtiene informacion del token para el datafeed
    this.getBinanceSymbols();

    // this.getBiggestbuyersOrSellersPooCoin();

    if (this.netWorkSelected == 'polygon-pos') {
      // this.checkBlockBinance();
    } else if (this.netWorkSelected == 'binance-smart-chain') {
      this.checkBlockBinance();
    } else if (this.netWorkSelected == 'ethereum') {
      // this.checkBlockBinance();
    }
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
          }, err => {
            console.log(err);
          })
      }
    })
  }

  selectCoin(item: any) {
    console.log('address', item.address);
    this.tokenAddress = item.address;
    window.location.href = '/detail/' + this.tokenAddress[0].address + '/' + this.netWorkSelected;
  }

  getAddress(item: any) {
    for (let index = 0; index < item.address.length; index++) {
      const element = item.address[index];
      return element;
    }
    return null;
  }

  filterData(enteredData: any) {
    this.filteredOptions = this.options.filter((item: any) => {
      return item.name.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  searchSymbolByToken(tokenAddress: any) {
    this.generalService.searchSymbolByToken(this.tokenAddress)
      .subscribe(response => {
        console.log('--response', response);
        this.token = response[0];
        this.generalService.getInfoCoin(this.token.identifier)
          .subscribe(
            response => {
              response = response[0];
              console.log('------informacion', response);
              this.totalSupply = response.total_supply;
              this.token.logo = response.image;
              this.marketCap = response.total_supply * response.current_price;
            }
          )
      }, err => {
        console.log(err);
      })
  }


  async checkBlockBinance() {
    let eth: any = new Web3();
    let lastBlock = await this.generalService.getLastBlock().toPromise();
    let lastBlockNumber = lastBlock.result.number;
    let initBlock = Number(lastBlockNumber) - 4000;
    let initBlockHex = eth.utils.numberToHex(initBlock);

    this.bnbPrice = await this.generalService.symbolPrice('BNBUSDT').toPromise();
    console.log('###### aqui empieza prueba de rendimiento  #####', this.bnbPrice);

    this.ethGetLogsBinance(initBlockHex);
  }

  async checkBlockEthereum() {

    let eth: any = new Web3();

    let block = await this.generalService.getLastBlock().toPromise();
    let number = block.result.number;
    // console.log('---ultimo block', number);
    // console.log('---ultimo block number', eth.utils.hexToNumber(number));

    let bloqueinicial = Number(number) - 4000;
    // console.log('bloqueinicial', bloqueinicial);
    let bloqueinicialhex = eth.utils.numberToHex(bloqueinicial);
    // console.log('bloqueinicialhex', bloqueinicialhex);


    this.bnbPrice = await this.generalService.symbolPrice('BNBUSDT').toPromise();

    // this.obsTimer.subscribe(currTime => {
    //   this.eth_getLogs(bloqueinicialhex);
    // });
    this.ethGetLogsBinance(bloqueinicialhex);
  }

  async ethGetLogsBinance(block: string) {
    let logs = await this.generalService.eth_getLogs(block, this.tokenAddress).toPromise();
    console.log('###### eth_getLogs  #####', logs);
    console.log('###### eth_getLogs  length #####', logs.result.length);


    //************socket */
    // let user_id = new Date().getTime();
    // this.socketService.connectTx(user_id, logs);
    // this.socketService.getTx(user_id).subscribe((data: any) => {
    //   // console.log('data', data);
    //   this.processTx(data.tx, data.abi_decode);
    // });
    //************fin socket */

    console.log('###### listaPrueba  length #####', this.listaPrueba);
    this.tamanoInicialPrueba = this.listaPrueba.length;
    // let self = this;
    // logs.result.forEach(function (value: any, i: any) {
    //   self.ethGetTransactionByHashBinance(value.transactionHash, i + 1);
    // });

    for (let index = 0; index < logs.result.length; index++) {
      const log = logs.result[index];
      // setTimeout(() => {
      // console.log('log', log);

      await this.ethGetTransactionByHashBinance(log.transactionHash, index + 1);
      // }, 1500);
    }

    console.log('his.lastTransactionshis.lastTransactionshis.lastTransactions',this.lastTransactions);
    
    this.paginator.pageSize = this.pageLength;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.lastTransactions;
    // for (let index = 0; index < logs.result.length; index++) {
    //   const log = logs.result[index];
    //   setTimeout(() => {
    //     this.ethGetTransactionByHashBinance(log.transactionHash, index + 1);
    //   }, 1500);
    // }
  }

  async processTx(tx: any, abi_decode: any) {
    if (tx.result != null) {
      let eth: any = new Web3();

      //let decodeInput = await this.decodeContract(tx.result.input);
      // console.log('decodeInput', decodeInput);
      let decodeInput = abi_decode;

      let indexTokensTx = decodeInput.names.indexOf("amountIn");
      if (indexTokensTx == -1) {
        indexTokensTx = decodeInput.names.indexOf("amountOut");
      }
      if (indexTokensTx == -1) {
        indexTokensTx = decodeInput.names.indexOf("amountOutMin");
      }

      let tokensTx = decodeInput.inputs[indexTokensTx];

      if (Number(eth.utils.fromWei(tx.result.value, 'ether') > 0 && tokensTx != undefined)) {
        // this.lastTransactions.unshift({
        this.lastTransactions.push({
          price: Number(Number(eth.utils.fromWei(tx.result.value, 'ether')) * Number(this.bnbPrice.price)).toFixed(2),
          value: Number(eth.utils.fromWei(tx.result.value, 'ether')).toFixed(4),
          priceToken: Number(Number(Number(Number(eth.utils.fromWei(tx.result.value, 'ether')) * Number(this.bnbPrice.price)).toFixed(2)).valueOf() / Number(eth.utils.fromWei(tokensTx, 'ether')).valueOf()).toFixed(4),
          timestamp: new Date(),
          gas: eth.utils.fromWei(tx.result.gas, 'ether'),
          gasPrice: eth.utils.fromWei(tx.result.gasPrice, 'ether'),
          input: eth.utils.toAscii(tx.result.input),
          decodeInput: decodeInput,
          txHash: tx.result.hash,
          indexTxHash: String(tx.result.hash).substring(0, 6),
          tokensTx: Number(eth.utils.fromWei(tokensTx, 'ether')).toFixed(2)
        });

        this.paginator.pageSize = this.pageLength;
        this.paginator.ngOnInit();
        this.dataSource.paginator = this.paginator;
        // this.dataSource = new MatTableDataSource<any>(this.lastTransactions);
        this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
        this.dataSource.data = this.lastTransactions;

      }
    }
  }

  async ethGetTransactionByHashBinance(txHast: string, index: number) {

    let tx = await this.generalService.eth_getTransactionByHash(txHast, index).toPromise();
    // .subscribe(
    // (tx: any) => {
    // console.log('###### tx #####', tx);
    // console.log('###### listaPrueba  length #####', this.listaPrueba);
    this.tamanoInicialCompleta++;
    if ((this.tamanoInicialCompleta + this.tamanoInicialPruebaFallida) >= this.tamanoInicialPrueba) {

      if (tx.result != null) {

        let eth: any = new Web3();
        // let abi: any = '[{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"minter_","type":"address"},...'
        // let contract_instance: any = eth.contract("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F988", abi = abi)
        let decodeInput = await this.generalService.decodeContract(tx.result.input).toPromise();
        // .subscribe((decodeInput: any) => {
        let indexTokensTx = decodeInput.names.indexOf("amountIn");
        if (indexTokensTx == -1) {
          indexTokensTx = decodeInput.names.indexOf("amountOut");
        }
        if (indexTokensTx == -1) {
          indexTokensTx = decodeInput.names.indexOf("amountOutMin");
        }

        let tokensTx = decodeInput.inputs[indexTokensTx];
        // let decodeInput = 'miguel';
        // console.log('---eth.eth.getBlock(1920050).timestamp', eth.eth.getBlock(1920050).timestamp);

        if (Number(eth.utils.fromWei(tx.result.value, 'ether') > 0 && tokensTx != undefined)) {

          // console.log(`${index} ${txHast}`);

          // this.lastTransactions.unshift({
          this.lastTransactions.push({
            price: Number(Number(eth.utils.fromWei(tx.result.value, 'ether')) * Number(this.bnbPrice.price)).toFixed(2),
            value: Number(eth.utils.fromWei(tx.result.value, 'ether')).toFixed(4),
            priceToken: Number(Number(Number(Number(eth.utils.fromWei(tx.result.value, 'ether')) * Number(this.bnbPrice.price)).toFixed(2)).valueOf() / Number(eth.utils.fromWei(tokensTx, 'ether')).valueOf()).toFixed(4),
            timestamp: new Date(),
            gas: eth.utils.fromWei(tx.result.gas, 'ether'),
            gasPrice: eth.utils.fromWei(tx.result.gasPrice, 'ether'),
            input: eth.utils.toAscii(tx.result.input),
            decodeInput: decodeInput,
            txHash: txHast,
            indexTxHash: String(txHast).substring(0, 6),
            tokensTx: Number(eth.utils.fromWei(tokensTx, 'ether')).toFixed(2)
          });
          // this.dataSource = new MatTableDataSource<any>(this.lastTransactions);
          // this.dataSource.sort = this.sort;
        }
        // }, err => {

        // })
      }


      if (this.isConsultaTxCompleta == false) {
        this.consultaTxCompleta();
      }
    }
    // }, err => {
    //   // console.log('###### err #####', err);
    //   this.tamanoInicialPruebaFallida++;
    //   if ((this.tamanoInicialCompleta + this.tamanoInicialPruebaFallida) >= this.tamanoInicialPrueba) {
    //     if (this.isConsultaTxCompleta == false) {
    //       this.consultaTxCompleta();
    //     }
    //   }
    // }
    // )


    // let tx = await this.generalService.eth_getTransactionByHash(txHast, index).toPromise();

    // console.log('tx', tx);

    // if (tx.result != null) {
    //   let eth: any = new Web3();

    //   let decodeInput = await this.decodeContract(tx.result.input);
    //   // console.log('decodeInput', decodeInput);

    //   let indexTokensTx = decodeInput.names.indexOf("amountIn");
    //   if (indexTokensTx == -1) {
    //     indexTokensTx = decodeInput.names.indexOf("amountOut");
    //   }
    //   if (indexTokensTx == -1) {
    //     indexTokensTx = decodeInput.names.indexOf("amountOutMin");
    //   }

    //   let tokensTx = decodeInput.inputs[indexTokensTx];

    //   if (Number(eth.utils.fromWei(tx.result.value, 'ether') > 0 && tokensTx != undefined)) {
    //     // this.lastTransactions.unshift({
    //     this.lastTransactions.push({
    //       price: Number(Number(eth.utils.fromWei(tx.result.value, 'ether')) * Number(this.bnbPrice.price)).toFixed(2),
    //       value: Number(eth.utils.fromWei(tx.result.value, 'ether')).toFixed(4),
    //       priceToken: Number(Number(Number(Number(eth.utils.fromWei(tx.result.value, 'ether')) * Number(this.bnbPrice.price)).toFixed(2)).valueOf() / Number(eth.utils.fromWei(tokensTx, 'ether')).valueOf()).toFixed(4),
    //       timestamp: new Date(),
    //       gas: eth.utils.fromWei(tx.result.gas, 'ether'),
    //       gasPrice: eth.utils.fromWei(tx.result.gasPrice, 'ether'),
    //       input: eth.utils.toAscii(tx.result.input),
    //       decodeInput: decodeInput,
    //       txHash: txHast,
    //       indexTxHash: String(txHast).substring(0, 6),
    //       tokensTx: Number(eth.utils.fromWei(tokensTx, 'ether')).toFixed(2)
    //     });
    //     this.dataSource = new MatTableDataSource<any>(this.lastTransactions);
    //     this.dataSource.sort = this.sort;
    //   }
    // }
  }

  consultaTxCompleta() {
    this.isConsultaTxCompleta = true;
    console.log("###### consultaTxCompleta #####");
    console.log(this.lastTransactions);
  }

  async decodeContract(data: string) {
    return await this.generalService.decodeContract(data).toPromise();
  }

  getBiggestbuyersOrSellersPooCoin() {

    this.generalService.getBiggestbuyersOrSellersPooCoin(this.tokenAddress, 'buy', new Date().toISOString(), new Date().toISOString())
      .subscribe(response => {
        console.log('--response getBiggestbuyersOrSellersPooCoin', response);
      }, err => {
        console.log(err);
      })
  }


  getBinanceSymbols() {
    this.binanceNetworkService.binanceSymbols()
      .subscribe(response => {
        console.log('--response getBinanceSymbols', response);
        let symbol = String(this.token.symbol).toLocaleUpperCase();
        this.symbolExchangeList = response.symbols.filter((x: any) => x.baseAsset == symbol);
        console.log('--response getBinanceSymbols', this.symbolExchangeList);
        // if (this.symbolExchangeList.length > 0) {
        //   this.currentQuoteAsset = this.symbolExchangeList[0];
        //   console.log('el simbolo ese 0 ', this.currentQuoteAsset);
        //   console.log('+++this.currentQuoteAsset', this.currentQuoteAsset);
        //   this.currentQuoteAssetForm.setValue(this.currentQuoteAsset.symbol);
        // } else {
        //   this.currentQuoteAsset = { symbol: symbol + 'BNB', quoteAsset: 'BNB' };
        //   console.log('+++this.currentQuoteAsset', this.currentQuoteAsset);
        //   this.currentQuoteAssetForm.setValue(symbol);
        //   console.log('el simbolo ese no 0 ', this.currentQuoteAsset);

        // }
        this.currentQuoteAsset = { symbol: symbol, quoteAsset: 'USD' };
        console.log('+++this.currentQuoteAsset', this.currentQuoteAsset);
        this.currentQuoteAssetForm.setValue(symbol);
        console.log('el simbolo ese no 0 ', this.currentQuoteAsset);

      }, err => {
        console.log(err);
      })
  }





  openDialog() {
    const dialogRef = this.dialog.open(TradeComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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


  @HostListener('window:scroll', ['$event'])
  onscroll(event: any) {
    const elem = event.currentTarget;
    if ((elem.innerHeight + elem.pageYOffset + 200) >= document.body.offsetHeight && this.pageLength <= this.lastTransactions.length) {
      console.log('-----evento scrool');

      this.pageLength += 5;
      this.paginator._changePageSize(this.pageLength);
    }
  }



}
