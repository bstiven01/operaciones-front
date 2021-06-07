import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WS_URL_NOVEDADES, WS_URL_OPERACIONES } from 'src/utils/rutas';
import { Novedad } from 'src/models/novedad.model';

@Injectable({
    providedIn: 'root'
})
export class NovedadesService {

    objetoModal: any;

    constructor(
        private http: HttpClient
    ) { }

    public url: any =  WS_URL_OPERACIONES +  'novedadWS/';
    public urlNovedades: any =  WS_URL_NOVEDADES +  'novedades';

    consultaNovedadesHome(): Observable<any[]> {
        return this.http.get<any[]>(this.url + 'consultaNovedadesHome');
    }

    consultarNovedad(id): Observable<any> {
        return this.http.get<any[]>(this.url + 'consultarNovedad/' + id);
    }

    consultarByFecha(fecha: string): Observable<Novedad[]> {
        return this.http.get<Novedad[]>(`${this.urlNovedades}?fecha=${fecha}`);
    }

    consultaExpecifica(DTOconsulta: any): Observable<any[]> {
        return this.http.post<any[]>(this.url + 'consultaListaNovedadesFiltro', DTOconsulta);
    }

    contarNovedades(DTOconsulta: any): Observable<any> {
        return this.http.post<any[]>(this.url + 'contarNovedadesFiltro', DTOconsulta);
    }

    crearNovedad(novedad: Novedad): Observable<Novedad> {
        return this.http.post<Novedad>(this.url, novedad);
    }

    actualizarNovedad(novedad: Novedad): Observable<Novedad> {
        return this.http.put<Novedad>(`${this.url}${novedad.id}`, novedad);
    }

    crearNovedadExtraordinaria(novedad: Novedad): Observable<Novedad> {
        return this.http.post<Novedad>(`${this.url}novedadExtraordinaria`, novedad);

    }

    consultaGraficoHome(): Observable<any> {
        return this.http.get<any[]>(`${this.url}consultaGraficoTiposNovedad`);
    }

    getAll():Observable<any> {
      return this.http.get<any[]>(`${this.urlNovedades}`);
    }

    create(novedad: Novedad):Observable<any> {
      return this.http.post<any[]>(`${this.urlNovedades}`, novedad);
    }

    pendiente(novedad: Novedad, cambio: boolean):Observable<any> {
      return this.http.post<any[]>(`${this.urlNovedades}/pendiente/cambio/`+cambio, novedad);
    }

    reportada(novedad: Novedad, cambio: boolean):Observable<any> {
      return this.http.post<any[]>(`${this.urlNovedades}/reportada/cambio/`+cambio, novedad);
    }

    getByOperador(id_operador: number):Observable<any> {
      return this.http.get<any[]>(`${this.url}operador/${id_operador}`);
    }


}
