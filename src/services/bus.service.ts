import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';
import { Observable } from 'rxjs';
import { Bus } from 'src/models/bus.model';
import { Mensaje } from 'src/models/mensaje.model';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor(
    private http: HttpClient
  ) { }

  public url: string = WS_URL_OPERACIONES + 'busWS/';

  consultarBuses(): Observable<Bus[]> {
    return this.http.get<Bus[]>(`${this.url}`);
  }

  procesarAsignacion(fecha):  Observable<Mensaje>   {
    return this.http.post<Mensaje>(`${this.url}procesarAsignacion?fecha=${fecha}`, null);
  }

  procesarAsignacionParte2(fecha):  Observable<Mensaje>   {
    return this.http.post<Mensaje>(`${this.url}procesarAsignacionPaso2?fecha=${fecha}`, null);
  }

  consultarBusesActivos(): Observable<Bus[]> {
    return this.http.get<Bus[]>(this.url + 'id_estado/18');
  }

  consultarBusPorCodigo(codigo): Observable<Bus> {
    return this.http.get<Bus>(`${this.url}codigo/${codigo}`);
  }

  consultarBusesSinAsignacionDisponibles(date: any): Observable<Bus[]> {
    return this.http.get<Bus[]>(`${this.url}consultarBusesSinAsignacionByEstado/id_estado/18/fecha/${date}`);
  }


}
