import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { TipoNovedad } from 'src/models/tipo-novedad.model';
import { Operador } from 'src/models/operador.model';
import { OperadorService } from 'src/services/operador.service';
import { TipoNovedadService } from 'src/services/tipo-novedad.service';
import { NovedadesService } from 'src/services/novedad.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Catalogo } from 'src/models/catalogo.model';
import { GeneralUtil } from 'src/utils/general.util';
import { SitioService } from 'src/services/sitio.service';
import { BusService } from 'src/services/bus.service';

@Component({
  selector: 'app-editar-novedad',
  templateUrl: './editar-novedad.component.html',
  styleUrls: ['./editar-novedad.component.scss']
})
export class EditarNovedadComponent implements OnInit {

  // FORMULARIO
  myForm: FormGroup;

  // listas para formulario
  tiposNovedad: TipoNovedad[];
  operadores: Operador[];
  todate: Date;
  sitios = [];
  buses = [];
  @Input() idNovedad = null;
  novedad = null;
  valorAnterior;


  @Output() mensajeSalida = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private operadorService: OperadorService,
    private tiposNovedadServicio: TipoNovedadService,
    private novedadesService: NovedadesService,
    private spinner: NgxSpinnerService,
    private sitioService: SitioService,
    private busService: BusService
  ) {
  }

  ngOnInit() {

    this.todate = this.fechaAyer();
    this.consultarTiposNovedadOperador();
    this.consultarSitios();
    this.buildFormModal();

  }

  ngOnChanges() {
    if(this.idNovedad !== undefined){
      this.consultarNovedad();
    }
  }

  buildFormModal() {
    this.myForm = this.formBuilder.group({
      id: [undefined],
      idTipoNovedad: [undefined, [Validators.required]],
      motivo: [undefined, [Validators.required, Validators.maxLength(500)]],
      //fInicial: [undefined, [Validators.required]],
      //fFinal: [undefined, [Validators.required]],
      idSitio: [undefined, [Validators.required]],
      //objetoRelacionado: [undefined, [Validators.required]],
    });
    this.myForm.valueChanges.subscribe(console.log);
  }

  consultarNovedad() {
    this.spinner.show();
    this.novedadesService.consultarNovedad(this.idNovedad).subscribe(resp => {
      this.spinner.hide();
      this.novedad = resp;
      this.valorAnterior = resp.objetoRelacionado.codigo;

      if (resp.idTipo.nombreTipoNovedadPadre === 'BUS') {
        this.myForm.addControl('objetoRelacionado', new FormControl(undefined, [Validators.required]));
        this.consultarBuses();
      }

      if (resp.idTipo.nombreTipoNovedadPadre === 'OPERADOR') {
        this.myForm.addControl('objetoRelacionado', new FormControl(undefined, [Validators.required]));
        this.consultarOperadores();
      }

      if (resp.idTipo.nombreTipoNovedadPadre === 'SERVICIO') {
        this.myForm.addControl('objetoRelacionado', new FormControl(undefined));
      }

    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }


  consultarOperadores() {
    this.operadorService.consultarOperadores().subscribe(resp => {
      this.operadores = resp;
    }, error => {
      console.error('Error al consultarOperadores');
    });
  }

  consultarBuses() {
    this.busService.consultarBuses().subscribe(resp => {
      this.buses = resp;
    }, error => {
      console.error('Error al buses');
    });
  }


  consultarSitios() {
    this.sitioService.listar().subscribe(resp => {
      this.sitios = resp;
    }, error => {
      console.error('Error al sitios');
    });
  }

  consultarTiposNovedadOperador() {

    this.tiposNovedadServicio.consultarByIdTipoNovedad(1).subscribe(data => {
      this.tiposNovedad = data;
    }, error => {
    });

  }

  submit(tipo: number) {

    let estadoEnviar: Catalogo;

    let mensaje: string;
    let mensajeConfirmacion: string;

    if (tipo === 1) {
      estadoEnviar = { id: 37, codigo: 'NOV_PENDIENTE', nombre: undefined, descripcion: undefined, idCatalogo: undefined }; // Pendiente
      mensaje = 'Novedad pendiente por terminar';

    }

    if (tipo === 2) {
      estadoEnviar = { id: 36, codigo: 'NOV_REPORTADA', nombre: undefined, descripcion: undefined, idCatalogo: undefined }; // Reportado
      mensaje = 'Novedad Reportada';

    }

    estadoEnviar = { id: 43, codigo: 'NOV_NEUTRO', nombre: undefined, descripcion: undefined, idCatalogo: undefined }; // Neutro

    let novedadEnviar: any;
    novedadEnviar = {
      id: this.novedad.id,
      fecha: new Date(),
      motivo: this.myForm.controls.motivo.value,
      idEstado: estadoEnviar,
      idTipo: this.myForm.controls.idTipoNovedad.value,
      idSitio: this.myForm.controls.idSitio.value,
      idDetalleServicio: this.novedad.idDetalleServicio
    };

    if (this.novedad.idTipo.nombreTipoNovedadPadre === 'BUS' || this.novedad.idTipo.nombreTipoNovedadPadre === 'OPERADOR') {
      novedadEnviar['valorAnterior'] = this.valorAnterior;
      novedadEnviar['valorNuevo'] = this.myForm.controls.objetoRelacionado.value === undefined;
      novedadEnviar['undefined']  = this.myForm.controls.objetoRelacionado.value.codigo;
    }


    GeneralUtil.CONFIRMACION(mensajeConfirmacion).subscribe(resp => {
      this.spinner.show();
      if (resp) {

        this.novedadesService.crearNovedad(novedadEnviar).subscribe(resp => {
          this.spinner.hide();
          GeneralUtil.MENSAJE(mensaje, 'success');
          console.log(resp);
          this.buildFormModal();
        }, error => {
          this.spinner.hide();
          GeneralUtil.MENSAJE('No se  registro ni se actualizo ningun dato de la novedad.', 'error');
          console.log(error);
        });

      }
    });

  }

  selectedSelect(o1: any, o2: any): boolean {
    return o1 === undefined || o1 === null ||
      o2 === undefined || o2 === null ||
      o1.codigo === undefined || o1.codigo === null ||
      o2.codigo === undefined || o2.codigo === null ?
      false : (o1.codigo === o2.codigo && o1.id === o2.id);
  }

  fechaAyer() {
    const fecha = new Date();
    const otraFecha = fecha.setDate(fecha.getDate());
    return new Date(otraFecha);
  }


}
