import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../tools/Constants';
import { IResponseG } from '../interfaces/IResponseG';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  public url: string = Constants.URL
  constructor(private http: HttpClient) { }
  
  List() {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("strToken")
    });
    return this.http.post<IResponseG>(`${this.url}WebEmail/Lst`, {}, { headers: reqHeader });
  }

  Add(data: any) {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("strToken")
    });
    return this.http.post<IResponseG>(`${this.url}WebEmail/Add`, data, { headers: reqHeader });
  }

  Update(data: any) {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("strToken")
    });
    return this.http.post<IResponseG>(`${this.url}WebEmail/Update`, data, { headers: reqHeader });
  }
}
