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

  
}
