import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  static tokenWallet: FormControl = new FormControl();
  constructor(
    private http: HttpClient
  ) { }


  searchCoin(coinName: string): Observable<any> {

    const url = `http://localhost:3010/tokens/searchByNameAndSymbol/${coinName}/binance-smart-chain`;
    return this.http.get(url).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }

  searchSymbolByToken(token: string): Observable<any> {

    const url = `https://cavecoin.app:3011/tokens/byToken/${token}`;
    return this.http.get(url).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }


  decodeContract(data: string): Observable<any> {
    const url = `http://localhost:3010/abi/decode`;
    return this.http.post(url, { data: data }).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }

  getTotalSupply(token: string): Observable<any> {

    const url = `https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=${token}&apikey=84EXUSUKB597G83S5FHXIPQ97JW52YA2MI`;
    return this.http.get(url).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }

  ethBlockNumber(): Observable<any> {
    let request = {
      "jsonrpc": "2.0",
      "method": "eth_blockNumber",
      "params": [
        "latest",
        false
      ]
    }
    const url = `https://bsc-dataseed1.defibit.io`;
    return this.http.post(url, request).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }

  getLastBlock(): Observable<any> {
    let request = {
      "jsonrpc": "2.0",
      "method": "eth_getBlockByNumber",
      "params": [
        "latest",
        false
      ]
    }
    const url = `https://bsc-dataseed1.defibit.io`;
    return this.http.post(url, request).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }

  eth_getTransactionByHash(txHast: string, index: number): Observable<any> {
    let request = {
      jsonrpc: "2.0",
      method: "eth_getTransactionByHash",
      params: [
        txHast
      ],
      id: index
    }
    const url = `https://bsc-dataseed1.defibit.io`;
    return this.http.post(url, request).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }

  eth_getLogs(block: string, address: string): Observable<any> {
    let request = {
      jsonrpc: "2.0",
      id: 3206,
      method: "eth_getLogs",
      params: [
        {
          fromBlock: block,
          toBlock: "latest",
          address: address,
          topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
          ],
        }
      ]
    }
    const url = `https://bsc-dataseed1.defibit.io`;
    return this.http.post(url, request).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }


  eth_call(initBlock: string, lastBlock: string, address: string): Observable<any> {
    let request = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getLogs",
      "params": [
        {
          "fromBlock": initBlock,
          "toBlock": lastBlock,
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
          ],
          "address": address
        }
      ]
    }
    const url = `https://bsc-dataseed1.defibit.io`;
    return this.http.post(url, request).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }


  symbolPrice(symbol: string): Observable<any> {

    const url = `https://testnet.binance.vision/api/v3/ticker/price?symbol=${symbol}`;
    return this.http.get(url).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }


  getBiggestbuyersOrSellersPooCoin(address: string, operationType: string, fromDate: any, toDate: any): Observable<any> {

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', 'https://poocoin.app');

    const url = `https://api1.poocoin.app/top-trades?address=${address}&from=${fromDate}&to=${toDate}&type=${operationType}`;
    return this.http.get(url, { 'headers': headers }).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }


  getTxList(address: string, firstBlock: any, lastBlock: any): Observable<any> {

    const url = `https://api.bscscan.com/api?module=token&action=txlist&address=0xb27adaffb9fea1801459a1a81b17218288c097cc&startblock=${firstBlock}&endblock=${lastBlock}&sort=desc&apikey=84EXUSUKB597G83S5FHXIPQ97JW52YA2MI`;
    return this.http.get(url).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }

  getBinanceTest(firstBlock: string): Observable<any> {
    let request: any = {
      firstBlock: firstBlock
    }

    const url = `https://cavecoin.app:3011/tokens/getOHLCVHistorical`;
    return this.http.post(url, request).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }

  getInfoCoin(identificador: string): Observable<any> {

    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${identificador}&per_page=100&page=1&sparkline=false`;
    return this.http.get(url).pipe(
      map(
        (res: any) => {
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }

  // updateTokenWallet(token:String){
  //   this.tokenWallet.setValue(token);
  // }

  // getTokenWallet(){
  //   return this.tokenWallet;
  // }






}
