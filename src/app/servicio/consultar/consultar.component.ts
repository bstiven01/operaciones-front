import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EMPTY, Observable, OperatorFunction } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Servicio, SERVICIO_ENDPOINT } from 'src/models/servicio.model';
import { CrudtHttp, CrudHttpService } from 'src/services/abstract.service';
import { GeneralUtil } from 'src/utils/general.util';
import { WS_URL_OPERACIONES } from 'src/utils/rutas';
import { EditarCrearComponent } from '../editar-crear/editar-crear.component';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss']
})
export class ConsultarComponent implements OnInit {
  servicioHttp: CrudtHttp<Servicio>;
  servicios: Servicio[] = [];
  serviciosObservable: Observable<Servicio[]>;
  selectedColumns = [];
  servicioSeleccionado: Servicio;
  loading = true;
  columnas = [ ];
  httpServicio: CrudtHttp<Servicio>;
  errorHandler: OperatorFunction<any, Observable<any>>;
  

  constructor(private crudService: CrudHttpService, private dialogService: MatDialog) {
    this.errorHandler = catchError(()=>{
      this.loading = false;
      GeneralUtil.MENSAJE('Error de comunicación con el servidor','error')
      return EMPTY;
    });
   }

  ngOnInit() {
    this.httpServicio = this.crudService.get<Servicio>(SERVICIO_ENDPOINT);
    this.serviciosObservable = this.httpServicio.list().pipe(
      tap(response => this.servicios = response),
      tap(response => this.columnas = Object.keys(response[0]).filter(v=>!v.toLowerCase().includes('id')))
    );
   this.getServicios(); 
  }

  getServicios(){
    this.loading = true;
    this.serviciosObservable.pipe(this.errorHandler).subscribe(_=>this.loading = false);
  }

  editar(servicio: Servicio, key: number){
    this.dialogService.open<EditarCrearComponent, Servicio, Servicio>(EditarCrearComponent, {data: servicio, disableClose:true}).afterClosed().subscribe(response=>{
      if(response) this.servicios[key] = response
    });
  }

  crear(){
    this.dialogService.open<EditarCrearComponent, undefined, Servicio>(EditarCrearComponent).afterClosed().subscribe(response=>{
      if(response) this.servicios.unshift(response)
    });
  }

  eliminar(servicio: Servicio, index: number){
    this.loading = true;
    this.httpServicio.delete(
      servicio.id
    ).pipe(this.errorHandler).subscribe(()=>{
      this.servicios.splice(index, 1);
      this.loading = false;
    });
  }
}
