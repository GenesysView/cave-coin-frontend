import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../services/general.service';
import Web3 from 'web3';
import { setInterval } from 'timers';
import { Observable } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  token: any;
  tokenAddress!: any;
  totalSupply: any;

  filteredOptions: any;
  formGroup!: FormGroup;
  options: any = [];

  obsTimer: Observable<number> = timer(1000, 10000);
  lastTransactions: any = [];

  displayedColumns: string[] = ['address', 'value', 'timestamp', 'gas', 'gasPrice'];
  dataSource: MatTableDataSource<any>;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.tokenAddress = this.route.snapshot.paramMap.get('address');
    console.log('this.tokenAddress', this.tokenAddress);

    this.searchSymbolByToken(this.tokenAddress);
    this.getTotalSupply(this.tokenAddress);

    this.initForm();
    this.checkBlock();
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
    console.log('address', item.link);
    this.tokenAddress = item.link;
    this.searchSymbolByToken(this.tokenAddress);
    this.getTotalSupply(this.tokenAddress);
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
      }, err => {
        console.log(err);
      })
  }

  getTotalSupply(tokenAddress: any) {
    this.generalService.getTotalSupply(tokenAddress)
      .subscribe(response => {
        console.log('--response getTotalSupply', response);
        this.totalSupply = response.result;
      }, err => {
        console.log(err);
      })
  }


  async checkBlock() {
    let block = await this.generalService.getLastBlock().toPromise();
    let number = block.result.number;
    console.log('---number block', number);


    this.obsTimer.subscribe(currTime => {
      this.eth_getLogs(number);
    });


    if (block != null && block.result.transactions) {
      block.result.transactions.forEach((txHast: any) => {
        // this.eth_getTransactionByHash(txHast);
      });
    }
  }

  async eth_getTransactionByHash(txHast: string) {
    let tx = await this.generalService.eth_getTransactionByHash(txHast).toPromise();
    console.log('++tx', tx);
    if (tx.result != null) {
      let eth: any = new Web3();
      console.log({ address: tx.result.from, value: eth.utils.fromWei(tx.result.value, 'ether'), timestamp: new Date(), gas: eth.utils.fromWei(tx.result.gas, 'ether'), gasPrice: eth.utils.fromWei(tx.result.gasPrice, 'ether'), v: eth.utils.fromWei(tx.result.v, 'ether'), nonce: eth.utils.fromWei(tx.result.nonce, 'ether') });
      this.lastTransactions.unshift({
        address: tx.result.from,
        value: eth.utils.fromWei(tx.result.value, 'ether'),
        timestamp: new Date(),
        gas: eth.utils.fromWei(tx.result.gas, 'ether'),
        gasPrice: eth.utils.fromWei(tx.result.gasPrice, 'ether')
      });

      this.dataSource = new MatTableDataSource<any>(this.lastTransactions);
      // this.dataSource.data.push({
      //   address: tx.result.from,
      //   value: eth.utils.fromWei(tx.result.value, 'ether'),
      //   timestamp: new Date(),
      //   gas: eth.utils.fromWei(tx.result.gas, 'ether'),
      //   gasPrice: eth.utils.fromWei(tx.result.gasPrice, 'ether')
      // });

    }

  }

  async eth_getLogs(block: string) {
    let logs = await this.generalService.eth_getLogs(block, this.tokenAddress).toPromise();
    console.log('++eth_getLogs', logs);
    logs.result.forEach((log: any) => {
      this.eth_getTransactionByHash(log.transactionHash);
    });
  }









}
