import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';
import { Observable } from 'rxjs';
import { Catalogo } from 'src/models/catalogo.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(
    private http: HttpClient
  ) { }

  public url: string = WS_URL_OPERACIONES + 'catalogoWS/';

  consultarCatalogoByIdCatalogo(idCatalogo: number): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.url}idCatalogo/${idCatalogo}`);
  }

  consultarById(idCatalogo: number): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.url}id/${idCatalogo}`);
  }
}
