import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(
    private _tokenService: TokenService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let idToken = this._tokenService.getToken();
    const cap = localStorage.getItem('Cap');
    if (cap) {
      const cloned3 = req.clone({
        headers: req.headers.set('Captcha', cap)
      });
      return next.handle(cloned3);
    }
    if (idToken != null && !this._tokenService.validezToken()) {
      var cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + idToken)
      });
      return next.handle(cloned);
    } else {
      this._tokenService.cerrarSesion();
    }
  }
}