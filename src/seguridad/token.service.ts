import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//Librería para el token
import { JwtHelperService } from '@auth0/angular-jwt';
import { GeneralUtil } from 'src/utils/general.util';

//Variable del token
const token = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    //Para navegar
    private myRoute: Router
  ) { }
  /**
   * Metodo para setear el token del localstorage
   */
  setToken(token: string) {
    localStorage.setItem("token", token);
  }

  /**
   * Metodo para obtener el token del localstorage
   */
  getToken() {
    return localStorage.getItem("token");
  }
  /**
   * Metodo para cerrar sesion
   */
  cerrarSesion() {
    localStorage.clear();
    GeneralUtil.USER_INFO = null;
    GeneralUtil.LOGIN_STATUS = null;
    window.location.href = "";
  }
  /**
   * Metodo para obtener el token decodificado
   */
  decodificarToken() {
    return token.decodeToken(this.getToken());
  }
  /**
   * Metodo para obtener el validez del token
   */
  validezToken() {
    return token.isTokenExpired(this.getToken());
  }
 

}
