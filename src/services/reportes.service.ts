import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mensaje } from 'src/models/mensaje.model';
import { ReporteInterrupcion } from 'src/models/reporte-interrupcion.model';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) { }

  public url: string = WS_URL_OPERACIONES + 'reporteWS/';

  consultarReporteInterrupciones(): Observable<any> {
    return this.http.get<any>(`${this.url}reporteInterrupciones`);
  }

  consultarGraficaReporteInterrupciones(): Observable<any> {
    return this.http.get<any>(`${this.url}graficaReporteInterrupciones`);
  }

  /*crear(reportes): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.url}guardarReporteInterrupciones`, reportes);
  }*/

  crear(reporte: ReporteInterrupcion): Observable<ReporteInterrupcion> {
    return this.http.post<ReporteInterrupcion>(`${this.url}`, reporte);
  }

  consultarKMEmpresa(fecha_inicial, fecha_final): Observable<any> {
    return this.http.get<any>(`${this.url}findKMBusiness?fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`);
  }

  consultar(): Observable<any> {
    return this.http.get<any>(`${this.url}`);
  }


}
