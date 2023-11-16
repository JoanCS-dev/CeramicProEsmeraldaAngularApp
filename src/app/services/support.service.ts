import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Constants } from '../tools/Constants';
import { IResponseG } from '../interfaces/IResponseG';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  private url: String = Constants.URL;

  constructor(private http: HttpClient) { }

  add(req: any){
    return this.http.post<IResponseG>(`${this.url}WebSupport/Add`, req);
  }
}
