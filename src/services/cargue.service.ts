import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje } from 'src/models/mensaje.model';
import { WS_URL_CARGUE } from 'src/utils/rutas';

@Injectable({
  providedIn: 'root'
})
export class CargueService {

  constructor(private http: HttpClient) { }

  public url: any = WS_URL_CARGUE;

  validarArchivo(archivo: File) : Observable<Mensaje>  {
    const archivoACargar = new FormData();
    archivoACargar.append('file', archivo);
    return this.http.post<Mensaje>(this.url + 'detalleServicioWS/cargueArchivoProgramacion/', archivoACargar);
  }

  validarArchivoKilometros(archivo: File) : Observable<Mensaje>  {
    const archivoACargar = new FormData();
    archivoACargar.append('file', archivo);
    return this.http.post<Mensaje>(this.url + 'cargueKmWS/cargueArchivoKilometraje/', archivoACargar);
  }

  validarArchivoActualizarKilometros(archivo: File) : Observable<Mensaje>  {
    const archivoACargar = new FormData();
    archivoACargar.append('file', archivo);
    return this.http.post<Mensaje>(this.url + 'cargueKmWS/cargueArchivoActualizarKilometraje/', archivoACargar);
  }
  
  validarArchivoMantenimiento(archivo: File) : Observable<Mensaje>  {
    const archivoACargar = new FormData();
    archivoACargar.append('file', archivo);
    return this.http.post<Mensaje>(this.url + 'cargueWS/cargueArchivoMantenimiento/', archivoACargar);
  }
  
  validarArchivoNovedad(archivo: File) : Observable<Mensaje>  {
    const archivoACargar = new FormData();
    archivoACargar.append('file', archivo);
    return this.http.post<Mensaje>(this.url + 'cargueNovedadWS/cargueArchivoNovedad/', archivoACargar);
  }

  validarArchivoMatrizDistancia(archivo: File) : Observable<Mensaje>  {
    const archivoACargar = new FormData();
    archivoACargar.append('file', archivo);
    return this.http.post<Mensaje>(this.url + 'detalleServicioWS/cargueArchivoMatrizDistancia/', archivoACargar);
  }

  descargarArchivoError(nombre: string) {
    return this.http.get(this.url + 'detalleServicioWS/descargarArchivoError?nombreArchivo=' + nombre, {responseType: 'blob'});
  }

  consultaExpecificaCargue(opcion: string, tipo: string): Observable<any[]> {
    return this.http.get<any[]>(this.url + "cargueWS/consultaCargue?opcion="+opcion+"&tipo="+tipo);
  }
}
