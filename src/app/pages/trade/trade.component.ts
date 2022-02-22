import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PancakeSwapService } from 'src/app/services/pancake_swap.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {

  tokensList: any = [
    {
      icon: 'https://r.poocoin.app/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
      text: 'BNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
    },
    {
      icon: 'https://poocoin.app/images/tokens/busd.png',
      text: 'BUSD',
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    }, {
      icon: 'https://r.poocoin.app/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png',
      text: 'USDT',
      address: '0x55d398326f99059fF775485246999027B3197955'
    }
    , {
      icon: 'https://r.poocoin.app/smartchain/assets/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c/logo.png',
      text: 'BTCB',
      address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c'
    }
    , {
      icon: 'https://r.poocoin.app/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png',
      text: 'ETH',
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
    }
  ];

  toForm: FormControl;
  fromForm: FormControl;
  slippage: FormControl;

  constructor(
    private _pancakeSwapService: PancakeSwapService
  ) {
    this.toForm = new FormControl('BNB');
    this.fromForm = new FormControl('USDT');
    this.slippage = new FormControl();
  }

  ngOnInit() { }

  autoSlippage() {
    this.slippage = new FormControl(0.5);
  }

  getSwapPrice() {

    this._pancakeSwapService.getPrice('0x3ee2200efb3400fabb9aacf31297cbdd1d435d47', '0xb27adaffb9fea1801459a1a81b17218288c097cc')

      // this._pancakeSwapService.getPrice(this.fromForm.value.address, this.toForm.value.address)
      .subscribe(
        (response: any) => {
          console.log('response', response);
        }, err => {
          console.log(err);
        }
      )
  }

}
