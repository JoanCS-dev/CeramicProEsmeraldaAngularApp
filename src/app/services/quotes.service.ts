import { Injectable } from '@angular/core';
import { Constants } from '../tools/Constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponseG } from '../interfaces/IResponseG';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  public url: string = Constants.URL;

  constructor(private http: HttpClient) { }

  List() {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("strToken")
    });
    return this.http.post<IResponseG>(`${this.url}WebQuotes/Lst`, {}, { headers: reqHeader });
  }

  Cancel(data: any){
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("strToken")
    });
    return this.http.post<IResponseG>(`${this.url}WebQuotes/Cancel`, data, { headers: reqHeader });
  }

  Accept(data: any){
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("strToken")
    });
    return this.http.post<IResponseG>(`${this.url}WebQuotes/Accept`, data, { headers: reqHeader });
  }
}
