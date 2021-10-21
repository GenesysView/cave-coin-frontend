import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private http: HttpClient
  ) { }

  searchCoin(coinName: string): Observable<any> {

    const url = `https://www.cavecoin.app:3011/tokens/searchByNameAndSymbol/${coinName}`;
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

    const url = `https://www.cavecoin.app:3011/tokens/byToken/${token}`;
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

  eth_getTransactionByHash(txHast: string): Observable<any> {
    let request = {
      jsonrpc: "2.0",
      method: "eth_getTransactionByHash",
      params: [
        txHast
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

  eth_getLogs(block:string, address:string): Observable<any> {
    let request = {
      jsonrpc: "2.0",
      id: 3206,
      method: "eth_getLogs",
      params: [
        {
          fromBlock: block,
          toBlock: "latest",
          address: address
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


}
