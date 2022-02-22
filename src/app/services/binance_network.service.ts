import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BinanceNetworkService {

  constructor(
    private http: HttpClient
  ) { }


  getBlockNoByTime(timestamp: string): Observable<any> {
    const url = `https://api.bscscan.com/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=84EXUSUKB597G83S5FHXIPQ97JW52YA2MI`;
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

  binanceSymbols(): Observable<any> {
    const url = `https://api.binance.com/api/v1/exchangeInfo`;
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
