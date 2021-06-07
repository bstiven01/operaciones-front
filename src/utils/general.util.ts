import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralUtil {

  constructor() { }

  public static LOGIN_STATUS = localStorage.getItem('loginstatus');
  public static USER_INFO = JSON.parse(localStorage.getItem('userinfo'));

  public static LOGIN_HEADERS(contenttype) {
    return {
      'Content-Type': contenttype
    };
  }

  public static HEADERS(contenttype: any): any {
    let json;
    if (contenttype == null) {
      json = {
        Authorization: GeneralUtil.USER_INFO.token,
      };
    } else {
      json = {
        Authorization: GeneralUtil.USER_INFO.token,
        'Content-Type': contenttype
      };
    }
    return json;
  }

  public static CONFIRMACION(descripcion?: string, title?: string): Observable<boolean> {
    return new Observable<boolean>(subs => {
      Swal.fire({
        title: (title !== undefined ? title : '¡Confirmación!'),
        text: descripcion,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          subs.next(true);
          subs.complete();
        }
        if (result.dismiss) {
          subs.next(false);
          subs.complete();
        }
      });
    });
  }

  public static MENSAJE(msg, type: 'success' | 'error' | 'warning', titleparameter?) {
    let title = titleparameter == undefined ? 'Mensaje' : titleparameter;
    if (type == 'success')
      title = '!Buen trabajo!'
    else if (type == 'error')
      title = 'Error'

    Swal.fire(
      title,
      msg,
      type
    );
  }



  public static EMAIL_VAL(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true);
    } else {
      return (false);
    }
  }


  public static CONVERT_NUMBER_TO_TIME(decimalTimeString) {
    debugger
    let prueba = this.DECIMAL_TO_TIME(decimalTimeString)
    var n = new Date(0, 0,0,prueba.inicio, prueba.fin);
    //n.setSeconds(+decimalTimeString * 60 * 60);
    console.log(this.CURRENT_DATE_TIME_STRING(n).substring(11,19));
    //console.log(this.RETORNAR_FECHA_JSONUTCBogota(n).slice(0, 8));
    return this.CURRENT_DATE_TIME_STRING(n).substring(11,19);
  }

  public static TIME_TO_DECIMAL(t) {
    debugger;
    t = t.split(':');
    return t = parseFloat(t[0] + '.' + t[1]);
  }

  public static DECIMAL_TO_TIME(t) {
    debugger;
    t = t.toString().split('.');
    return {inicio: t[0], fin: t[1]};
  }

  public static CURRENT_DATE_STRING() {
    var today = new Date(new Date());
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var fulldate = yyyy + '-' + mm + '-' + dd;
    return fulldate;
  }

  public static CURRENT_DATE_TIME_STRING(today: Date) {

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var HH = String(today.getHours()).padStart(2, '0');
    var MI = String(today.getMinutes()).padStart(2, '0');
    var SS = String(today.getSeconds()).padStart(2, '0');

    var fulldate = yyyy + '-' + mm + '-' + dd + '-' + HH + ':' + MI + ':' + SS;
    return fulldate;
  }

  public static RETORNAR_FECHA_JSONUTCBogota(date: Date): any {
    return new Date(date.valueOf() - 18000000).toJSON();
  }

  public static FECHA_STRING_TO_DATE(fecha: string): Date {
    var parts = fecha.split("-");
    var dt = new Date(parseInt(parts[2], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[0], 10));
    return dt;

  }

  //'24-03-2020-08:00:00 -> 2020-03-24T08:00:00'
  public static FECHA_STRING_DETALLE_TO_JSON(fecha: string): string {
    var parts = fecha.split("-");
    let nueva_formato = parts[2] + '-' + parts[1] + '-' + parts[0] + 'T' + parts[3]
    return nueva_formato;

  }

}
