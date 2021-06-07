import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DisponibilidadOperador } from 'src/models/disponibilidad-operador.model';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadOperadorService {

  constructor(
    private http: HttpClient
  ) { }

  public url: string = WS_URL_OPERACIONES + 'disponibilidades_operador';

  create(disponibilidad: DisponibilidadOperador): Observable<DisponibilidadOperador> {
    return this.http.post<DisponibilidadOperador>(`${this.url}`, disponibilidad);
  }

  update(disponibilidad: DisponibilidadOperador): Observable<DisponibilidadOperador> {
    return this.http.put<DisponibilidadOperador>(`${this.url}/id/${disponibilidad.id}`, disponibilidad);
  }

  readByEstado(id_estado: number): Observable<DisponibilidadOperador[]> {
    return this.http.get<DisponibilidadOperador[]>(`${this.url}/id_estado/${id_estado}`);
  }

}
