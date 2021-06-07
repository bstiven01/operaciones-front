import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';

@Injectable({
    providedIn: 'root'
})
export class SitioService {

    // Evento para refrescar la tabla del componente lista operaciones
    @Output() eventRefreshTableListaOperacion = new EventEmitter<boolean>();


    constructor(
        private http: HttpClient
    ) {
        this.eventRefreshTableListaOperacion.emit(false);
    }

    public url: any = WS_URL_OPERACIONES + 'sitioWS/';

    listar(): Observable<any[]> {
        return this.http.get<any[]>(this.url);
    }

}
