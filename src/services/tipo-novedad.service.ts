import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';
import { Observable } from 'rxjs';
import { TipoNovedad } from 'src/models/tipo-novedad.model';

@Injectable({
  providedIn: 'root'
})
export class TipoNovedadService {

  constructor(
    private http: HttpClient
  ) { }

  public url: string = WS_URL_OPERACIONES + 'tipoNovedadWS/';

  consultarTiposNovedad(): Observable<TipoNovedad[]> {
    return this.http.get<TipoNovedad[]>(`${this.url}`);
  }

  consultarByIdTipoNovedad(idTipoNovedad: number): Observable<TipoNovedad[]> {
    return this.http.get<TipoNovedad[]>(`${this.url}idTipoNovedad/${idTipoNovedad}`);
  }

  consultarPadresTipoNovedad(): Observable<TipoNovedad[]> {
    return this.http.get<TipoNovedad[]>(`${this.url}padresTipoNovedad`);
  }

}
