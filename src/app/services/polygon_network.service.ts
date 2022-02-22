import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PolygonNetworkService {

  constructor(
    private http: HttpClient
  ) { }


  getLastBlock(): Observable<any> {
    let request = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "eth_getBlockByNumber",
      "params": [
        "latest",
        false
      ]
    }
    const url = `https://matic-mainnet-full-rpc.bwarelabs.com/`;
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
    const url = `https://matic-mainnet-full-rpc.bwarelabs.com/`;
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
          address: address
        }
      ]
    }
    const url = `https://matic-mainnet-full-rpc.bwarelabs.com/`;
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
}
