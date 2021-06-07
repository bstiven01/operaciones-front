import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';
import { Observable } from 'rxjs';
import { Operador } from 'src/models/operador.model';
import { OperadorHV } from 'src/models/operadorHV.model';

@Injectable({
  providedIn: 'root'
})
export class OperadorService {

  constructor(
    private http: HttpClient
  ) { }

  public url: string = WS_URL_OPERACIONES + 'operadorWS/';

  consultarOperadores(): Observable<Operador[]> {
    return this.http.get<Operador[]>(`${this.url}`);
  }

  consultarOperadorByCodigo(codigo: number): Observable<Operador> {
    return this.http.get<Operador>(`${this.url}codigo/${codigo}`);
  }

  consultarOperadorHVByCodigo(codigo: number): Observable<OperadorHV> {
    return this.http.get<OperadorHV>(`${this.url}codigoOperadorHV/${codigo}`);
  }

  consultarOperadoresByListaIdEstado(lista_estados: number[]): Observable<Operador[]> {
    return this.http.get<Operador[]>(`${this.url}lista_id_estado/${lista_estados}`);
  }

  consultarTodos(): Observable<Operador[]> {
    return this.http.get<Operador[]>(`${this.url}consultar_todos`);
  }

  crearOperador(operador: Operador): Observable<Operador> {
    return this.http.post<Operador>(`${this.url}`, operador);
  }

  actualizarOperador(operador: Operador): Observable<Operador> {
    return this.http.put<Operador>(`${this.url}${operador.id}`, operador);
  }

}

