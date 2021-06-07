import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GeneralUtil } from '../utils/general.util';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(
    private http : HttpClient
  ) { }

  //public url : any = GeneralUtil.WS_URL + "configuracion/";
  public url : any = GeneralUtil + "configuracion/";

  consultar(): any 
  {
    const headers = GeneralUtil.HEADERS('application/json');
  	return this.http.get(this.url + "consultar/", {headers : headers}); 
  }

  editar(data) : any
  {
    const headers = GeneralUtil.HEADERS('application/json');
  	return this.http.put(this.url + "editar/", data, {headers : headers}); 
  }

}
