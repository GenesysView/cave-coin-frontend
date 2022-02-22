import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PancakeSwapService {

  constructor(
    private http: HttpClient
  ) { }


  getPrice(tokenFrom: string, tokenTo: string): Observable<any> {
    const url = `https://cavecoin.app:3011/pancake_swap/swap`;
    return this.http.post(url, { tokenFrom: tokenFrom, tokenTo: tokenTo }).pipe(
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
