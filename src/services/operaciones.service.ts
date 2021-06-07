import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';
import { Catalogo } from 'src/models/catalogo.model';

@Injectable({
  providedIn: 'root'
})
export class OperacionesService {

  // Evento para refrescar la tabla del componente lista operaciones
  @Output() eventRefreshTableListaOperacion = new EventEmitter<boolean>();


  constructor(
    private http: HttpClient
  ) {
    this.eventRefreshTableListaOperacion.emit(false);
  }

  public url: any = WS_URL_OPERACIONES + 'detalleServicioWS/';

  listar(fecha): Observable<any[]> {
    return this.http.get<any[]>(this.url + `consultaOperacionActual?fecha=${fecha}`);
  }

  consultaExpecifica(DTOconsulta: any): Observable<any[]> {
    return this.http.post<any[]>(this.url + 'consultaOperacionFiltros', DTOconsulta);
  }

  refreshTable(resp: boolean) {
    this.eventRefreshTableListaOperacion.emit(resp);
  }

  consultaEstadoActualPorOperador(idOperador): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'consultaEstadoActualPorOperador/' + idOperador);
  }

  getByOperadorAndFecha(codigo_operador: string, fecha_inicial: string): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'codigo_operador/' + codigo_operador + '/fechaInicio/' + fecha_inicial);
  }

  getByBusAndFecha(codigo_bus: string, fecha_inicial: string): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'codigo_bus/' + codigo_bus + '/fechaInicio/' + fecha_inicial);
  }

  updateBus(id_bus: number, id_detalle: number): Observable<any> {
    return this.http.get<any>(this.url + 'id_bus/' + id_bus + '/id_detalle/' + id_detalle);
  }


}
