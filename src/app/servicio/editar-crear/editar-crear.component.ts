import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { forkJoin, Observable } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { Catalogo } from 'src/models/catalogo.model';
import { Servicio, SERVICIO_ENDPOINT } from 'src/models/servicio.model';
import { CrudHttpService, CrudtHttp } from 'src/services/abstract.service';
import { CatalogoService } from 'src/services/catalogo.service';
import { ServicioService } from 'src/services/servicio.service';
import { GeneralUtil } from 'src/utils/general.util';

@Component({
  selector: 'app-editar-crear',
  templateUrl: './editar-crear.component.html',
  styleUrls: ['./editar-crear.component.scss']
})
export class EditarCrearComponent implements OnInit {
  servicio: Servicio;
  form: FormGroup;
  estados: Observable<Catalogo[]>;
  servicioCrud: CrudtHttp<Servicio>;
  serviciosPadre: Observable<Servicio[]>;
  tipos: Observable<Catalogo[]>;
  onRequest: boolean = true;

  changeAccesorSelect = (field: string, state: 'disable' | 'enable') => this.form.get(field)[state]();
  operacion: 'editar' | 'crear';

  constructor(public dialogRef: MatDialogRef<EditarCrearComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Servicio, private catalogoService: CatalogoService, private servicioCrudFactory: CrudHttpService, private servicioService: ServicioService) {
    this.servicioCrud = this.servicioCrudFactory.get(SERVICIO_ENDPOINT);

    this.serviciosPadre = this.servicioService.consultarServiciosPadre();
    this.estados = this.catalogoService.consultarCatalogoByIdCatalogo(1);
    this.tipos = this.catalogoService.consultarCatalogoByIdCatalogo(52);

    this.servicio = data ? Object.assign({}, data) : {};
    this.operacion = data ? 'editar' : 'crear';
    this.form = new FormGroup({
      codigo: new FormControl(),
      nombre: new FormControl(),
      idEstado: new FormControl(),
      etiqueta: new FormControl(),
      idServicio: new FormControl(),
      idTipoServicio: new FormControl()
    });
    this.form.patchValue(this.servicio);

    this.changeAccesorSelect('idEstado', 'disable');
    this.changeAccesorSelect('idServicio', 'disable');
    this.changeAccesorSelect('idTipoServicio', 'disable');

    forkJoin(this.estados, this.tipos, this.serviciosPadre).subscribe(response=>{

      this.changeAccesorSelect('idEstado', 'enable');
      this.changeAccesorSelect('idServicio', 'enable');
      this.changeAccesorSelect('idTipoServicio', 'enable');
      this.onRequest = false;
    });
  };

  ngOnInit() { }

  ejecutar(){
    Object.assign(this.servicio, this.form.value);
    let operacion = this.operacion == 'editar' ? this.servicioCrud.update(this.servicio, this.servicio.id) : this.servicioCrud.create(this.servicio, this.servicio.id).pipe(flatMap(servicio=>this.servicioService.consultarServiciosPorId(servicio.id).pipe(map(servicios=>servicios[0]))));
    operacion.pipe(
      tap(()=>GeneralUtil.MENSAJE(`Servicio ${this.operacion} correctamente`,'success'))
    ).subscribe(servicio=>{
      this.closeDialog(servicio);
    });
  }

  closeDialog(servicio){
    this.dialogRef.close(servicio);
  }
}
