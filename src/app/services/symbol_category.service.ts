import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SymbolCategoryService {

  constructor(
    private http: HttpClient
  ) { }

  getAllSymbolCategory(): Observable<any> {
    const url = `https://cavecoin.app:3011/symbol_category`;
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
