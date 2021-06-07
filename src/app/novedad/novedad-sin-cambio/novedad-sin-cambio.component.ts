import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Bus } from 'src/models/bus.model';
import { Operador } from 'src/models/operador.model';
import { TipoNovedad } from 'src/models/tipo-novedad.model';
import { Novedad } from 'src/models/novedad.model';
import { SitioService } from 'src/services/sitio.service';
import { TipoNovedadService } from 'src/services/tipo-novedad.service';
import { Catalogo } from 'src/models/catalogo.model';
import { NovedadesService } from 'src/services/novedad.service';
import { GeneralUtil } from 'src/utils/general.util';

@Component({
  selector: 'app-novedad-sin-cambio',
  templateUrl: './novedad-sin-cambio.component.html',
  styleUrls: ['./novedad-sin-cambio.component.scss']
})
export class NovedadSinCambioComponent implements OnInit {

  myForm: FormGroup;

  typesOfShoes = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers', 'Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  tiposDeNovedad: TipoNovedad[];
  tiposDeSitio: any[];

  mensajeCampoRequerido = 'Campo Requerido';
  nombre: string;

  ifOperador: boolean;
  ifBus: boolean;
  ifNuevoBus: boolean;
  ifNuevoOperador: boolean;

  tiposDeBus: Bus[];
  tiposDeOperador: Operador[];

  configuracion: any;
  tipo: any;

  idBus: any;
  idOperador: any;
  idDetalleServicio: any;

  valorNuevo: string;

  banderaBotones: boolean;


  constructor(
    private tiposNovedadServicio: TipoNovedadService,
    private fb: FormBuilder,
    private sitioService: SitioService,
    public dialogRef: MatDialogRef<NovedadSinCambioComponent>,
    @Inject(MAT_DIALOG_DATA) public element: any,
    private novedadesService: NovedadesService
  ) { }

  ngOnInit() {
    debugger;


    this.consultarSitios();

    // this.tipo = this.element.tipo;
    // debugger;
    // if (this.tipo == undefined) {
    //   this.buildFromDetalle();
    // } else {

    // }

    if (!!this.element.detalle) {
      this.buildFromDetalle();
    } else if (!!this.element.novedad) {
      this.buildFromNovedad();
    }


    this.configuracion = this.element.configuracion;



    this.setConfiguracion();

  }

  buildFromDetalle() {
    debugger;

    this.idBus = new Bus(this.element.detalle.idBus);
    this.idOperador = new Operador(this.element.detalle.idConductor);
    this.idDetalleServicio = this.element.detalle.idDetalleServicio;

    this.myForm = this.fb.group({
      id: [undefined],
      idTipoNovedad: [undefined, [Validators.required]],
      idSitio: [undefined, [Validators.required]],
      idBus: [undefined],
      idOperador: [undefined],
      motivo: [undefined, [Validators.required, Validators.maxLength(50)]],
    });


  }

  buildFromNovedad() {
    this.idBus = this.element.novedad.idBus;
    this.idOperador = this.element.novedad.idOperador
    this.idDetalleServicio = this.element.novedad.idDetalleServicio;

    debugger;
    this.myForm = this.fb.group({
      id: this.element.novedad.id,
      idTipoNovedad: [this.element.novedad.idTipo, [Validators.required]],
      idSitio: [this.element.novedad.idSitio, [Validators.required]],
      idBus: [this.idBus],
      idOperador: [this.idOperador],
      motivo: [this.element.novedad.motivo, [Validators.required, Validators.maxLength(50)]],
    });

    this.banderaBotones = !!this.element.novedad.id && this.element.novedad.idEstado.codigo === 'NOV_REPORTADA' ? true : false

    if (this.banderaBotones) {
      this.myForm.disable()
    }


  }

  setConfiguracion() {

    this.nombre = this.configuracion.nombre_pascal;

    if (this.configuracion.id === 1) {
      this.consultarTiposNovedadBus();

    } else if (this.configuracion.id === 2) {
      this.consultarTiposNovedadServicio();
    }


  }

  consultarTiposNovedadBus() {
    this.tiposNovedadServicio.consultarByIdTipoNovedad(2).subscribe(resp => {
      this.tiposDeNovedad = resp;
    }, error => {

    })
  }

  consultarTiposNovedadServicio() {
    this.tiposNovedadServicio.consultarByIdTipoNovedad(3).subscribe(resp => {
      this.tiposDeNovedad = resp;
    }, error => {

    })
  }

  consultarSitios() {
    this.sitioService.listar().subscribe(resp => {
      this.tiposDeSitio = resp;
    }, error => {
      console.error('Error al consultar Sitios');
    });
  }

  reportada() {

    debugger;
    let novedad: Novedad = {
      id: this.myForm.controls.id.value,
      fecha: new Date(),
      fechaInicio:  new Date(),
      fechaFin: undefined,
      idTipo: this.myForm.controls.idTipoNovedad.value,
      idSitio: this.myForm.controls.idSitio.value,
      motivo: this.myForm.controls.motivo.value,
      idEstado: new Catalogo(36),// Reportada
      idDetalleServicio: this.idDetalleServicio,
      idBus: this.idBus,
      idOperador: this.idOperador,
      valorNuevo: this.valorNuevo,

    }

    this.novedadesService.reportada(novedad, false).subscribe(resp => {
      GeneralUtil.MENSAJE('Se creo la novedad.', 'success');
      this.closeDialog(true);
    }, error => {
      GeneralUtil.MENSAJE('No se registro ni se actualizo ningun dato de la novedad.', 'error');
      this.closeDialog(false)
    })

  }

  pendiente() {

    debugger;
    let novedad: Novedad = {
      id: this.myForm.controls.id.value,
      fecha: new Date(),
      fechaInicio: new Date(),
      fechaFin: undefined,
      idTipo: this.myForm.controls.idTipoNovedad.value,
      idSitio: this.myForm.controls.idSitio.value,
      motivo: this.myForm.controls.motivo.value,
      idEstado: new Catalogo(37),// Pendiente
      idDetalleServicio: this.idDetalleServicio,
      idBus: this.idBus,
      idOperador: this.idOperador,
      valorNuevo: this.valorNuevo,

    }

    this.novedadesService.pendiente(novedad, false).subscribe(resp => {
      GeneralUtil.MENSAJE('Se creo la novedad.', 'success');
      this.closeDialog(true);
    }, error => {
      GeneralUtil.MENSAJE('No se registro ni se actualizo ningun dato de la novedad.', 'error');
      this.closeDialog(false)
    })

  }

  selectedSelect(o1: any, o2: any): boolean {
    return !o1 || !o2 || !o1.codigo || !o2.codigo ?
      false : (o1.codigo === o2.codigo && o1.id === o2.id);
  }

  closeDialog(element: any) {
    this.dialogRef.close(element);
  }

}
