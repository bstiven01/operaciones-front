import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';
import { Observable } from 'rxjs';
import { Bus } from 'src/models/bus.model';
import { Mensaje } from 'src/models/mensaje.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleServicioService {

  constructor(
    private http: HttpClient
  ) { }

  public url: string = WS_URL_OPERACIONES + 'detalleServicioWS/';


  crear(detalle): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.url}crearAllDetalleServicios`, detalle);
  }

  get(detalle): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.url}crearAllDetalleServicios`, detalle);
  }


}
