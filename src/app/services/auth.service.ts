import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IResponse } from '../interfaces/IResponse';
import { IAuthResponse } from '../interfaces/IAuthResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: String = "https://ceramicproesmeralda.azurewebsites.net/Api/"

  constructor(private http: HttpClient) { }

  auth(req: any){
    return this.http.post<IResponse<IAuthResponse>>(`${this.url}WebAccount/Auth`, req);
  }
}
