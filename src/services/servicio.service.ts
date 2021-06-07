import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';
import { Observable } from 'rxjs';
import { Servicio } from 'src/models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(
    private http: HttpClient
  ) { }

  public url: string = WS_URL_OPERACIONES + 'servicioWS/';

  consultarServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.url}`);
  }

  consultarServiciosPadre(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.url}padresServicio`);
  }

  consultarServiciosPorId(id): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.url}idServicio/${id}`);
  }

  crearServicio(listaServicios): Observable<any> {
    return this.http.post<any>(this.url + 'crearAllDetalleServicios', listaServicios);
  }


}
