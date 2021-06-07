import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NovedadDetalle } from 'src/models/novedad-detalle.model';
import { WS_URL_NOVEDADES } from 'src/utils/rutas';

@Injectable({
  providedIn: 'root'
})
export class NovedadDetalleService {

  constructor(
    private http: HttpClient
  ) { }

  public url: string = WS_URL_NOVEDADES + 'novedad_detalles';

  consultar(): Observable<NovedadDetalle[]> {
    return this.http.get<NovedadDetalle[]>(`${this.url}`);
  }

  consultarByNovedad(id_novedad: number): Observable<NovedadDetalle[]> {
    return this.http.get<NovedadDetalle[]>(`${this.url}/novedad?id_novedad=${id_novedad}`);
  }

  crear(novedad: NovedadDetalle): Observable<NovedadDetalle> {
    return this.http.post<NovedadDetalle>(`${this.url}`, novedad);
  }

  crearAll(novedades: NovedadDetalle[]): Observable<any> {
    return this.http.post<any>(`${this.url}/all`, novedades);
  }

  actualizar(novedad: NovedadDetalle): Observable<NovedadDetalle> {
    return this.http.put<NovedadDetalle>(`${this.url}${novedad.id}`, novedad);
  }
}
