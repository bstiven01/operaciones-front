import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';
import { DisponibilidadBus } from 'src/models/disponibilidad-bus.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadBusService {

  constructor(
    private http: HttpClient
  ) { }

  public url: string = WS_URL_OPERACIONES + 'disponibilidades_bus';

  create(disponibilidad: DisponibilidadBus): Observable<DisponibilidadBus> {
    return this.http.post<DisponibilidadBus>(`${this.url}`, disponibilidad);
  }

  update(disponibilidad: DisponibilidadBus): Observable<DisponibilidadBus> {
    return this.http.put<DisponibilidadBus>(`${this.url}/${disponibilidad.id}`, disponibilidad);
  }

  readByEstado(id_estado: number): Observable<DisponibilidadBus[]> {
    return this.http.get<DisponibilidadBus[]>(`${this.url}/id_estado/${id_estado}`);
  }

}
