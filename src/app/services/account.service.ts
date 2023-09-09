import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IResponse } from '../interfaces/IResponse';
import { IAuthResponse } from '../interfaces/IAuthResponse';
import { Constants } from '../tools/Constants';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private url: String = Constants.URL;

  constructor(private http: HttpClient) { }

  List(){
    var reqHeader = new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("strToken")
     });
    return this.http.post<IResponse<IAuthResponse>>(`${this.url}WebAccount/Lst`, {}, { headers: reqHeader });
  }
}
