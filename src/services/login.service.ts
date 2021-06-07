import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GeneralUtil } from '../utils/general.util';
import { WS_URL_LOGIN } from 'src/utils/rutas';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  public url: any = WS_URL_LOGIN + 'login';

  login(data) {
    return this.http.post(this.url, data, {observe: 'response'});
  }

}
