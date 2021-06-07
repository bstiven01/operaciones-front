import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { TipoNovedad } from 'src/models/tipo-novedad.model';
import { OperadorService } from 'src/services/operador.service';
import { TipoNovedadService } from 'src/services/tipo-novedad.service';
import { NovedadesService } from 'src/services/novedad.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Catalogo } from 'src/models/catalogo.model';
import { GeneralUtil } from 'src/utils/general.util';
import { SitioService } from 'src/services/sitio.service';
import { DatePipe } from '@angular/common';
import { BusService } from 'src/services/bus.service';
import { ServicioService } from 'src/services/servicio.service';

@Component({
  selector: 'app-crear-novedad',
  templateUrl: './crear-novedad.component.html',
  styleUrls: ['./crear-novedad.component.scss']
})
export class CrearNovedadComponent implements OnInit {

  // FORMULARIO
  myForm: FormGroup;

  // listas para formulario
  tiposNovedad: TipoNovedad[];
  operadores: any[];
  todate: Date;

  sitios = [];
  buses = [];
  servicios = [];

  // listas para formulario
  padresTipoNovedad: TipoNovedad[];

  // banderas usadas en el html
  ngIfOperador: boolean;
  ngIfBus: boolean;
  ngIfServicio: boolean;
  ngIfBotonesNovedad: boolean;


  constructor(
    private formBuilder: FormBuilder,
    private operadorService: OperadorService,
    private tiposNovedadServicio: TipoNovedadService,
    private novedadesService: NovedadesService,
    private spinner: NgxSpinnerService,
    private sitioService: SitioService,
    private datePipe: DatePipe,
    private busService: BusService,
    private servicioService: ServicioService
  ) {
  }

  ngOnInit() {

    this.consultarPadresTipoNovedad();

    this.buildFormModal();

    this.consultarSitios();

    this.ngIfBotonesNovedad = true;

  }

  llenarSelect(id: any, codigo: any) {
    this.ngIfBotonesNovedad = true;
    this.myForm.setControl(
      'idTipoOculto', new FormControl(undefined, [Validators.required]),
    );

    this.buses = [];
    this.operadores = [];
    this.servicios = [];
    this.tiposNovedad = [];


    this.myForm.patchValue({
      idTipoNovedad: undefined,
      idTipoOculto: undefined,
    });

    this.ngIfBotonesNovedad = true;

    this.tiposNovedadServicio.consultarByIdTipoNovedad(id).subscribe(data => {

      if (id === 4) {
        function removeItemFromArr(arr, item) {
          arr.forEach(element => {
            const i = element.codigo.indexOf(item);
            data.splice(i, 1);
          });

        }
        removeItemFromArr(data, 'NOVASIS_ASIS');

      }

      this.tiposNovedad = data;
    }, error => {
    });
    if (codigo === 'NOVOPE') {


      this.consultarOperadores();
      this.ngIfOperador = true;
      this.ngIfBus = false;
      this.ngIfServicio = false;

      this.myForm.patchValue({
        idTipoNovedad: undefined,
        idTipoOculto: undefined,
      });

    } else if (codigo === 'NOVBUS') {

      this.consultarBuses();
      this.ngIfBus = true;
      this.ngIfOperador = false;
      this.ngIfServicio = false;


    } else if (codigo === 'NOVSER') {

      this.consultarServicios();
      this.ngIfServicio = true;
      this.ngIfOperador = false;
      this.ngIfBus = false;


    } else if (codigo === 'NOVASIS') {

      this.ngIfBus = false;
      this.ngIfOperador = false;
      this.ngIfServicio = false;

      this.myForm.setControl(
        'idTipoOculto', new FormControl(undefined, []),
      );

      this.myForm.patchValue({
        idTipoOculto: undefined,
      });

      this.ngIfBotonesNovedad = false;
    }
  }


  buildFormModal() {
    this.myForm = this.formBuilder.group({
      id: [undefined],
      idPadreTipoNovedad: [undefined, [Validators.required]],
      idTipoNovedad: [undefined, [Validators.required]],
      idTipoOculto: [undefined, []],
      motivo: new FormControl(undefined, [Validators.required, Validators.maxLength(500)]),
      selectedColumns: [''],
      consulta: ['',],
      filtros: ['',],
      Ffecha: [''],
      Ftipo: [''],
      Vanterior: [''],
      Vnuevo: [''],
      Festado: [''],
      Fmotivo: [''],
      fInicial: [undefined, [Validators.required]],
      idSitio: [undefined, [Validators.required]]
    });
    this.myForm.valueChanges.subscribe(console.log);
  }


  consultarOperadores() {
    this.operadorService.consultarOperadores().subscribe(resp => {
      this.operadores = resp;
    }, error => {
      console.error('Error al consultarOperadores');
    });
  }

  consultarSitios() {
    this.sitioService.listar().subscribe(resp => {
      this.sitios = resp;
    }, error => {
      console.error('Error al consultarOperadores');
    });
  }

  consultarTiposNovedadOperador() {

    this.tiposNovedadServicio.consultarByIdTipoNovedad(1).subscribe(data => {
      this.tiposNovedad = data;
    }, error => {
    });

  }

  consultarPadresTipoNovedad() {
    this.tiposNovedadServicio.consultarPadresTipoNovedad().subscribe(resp => {
      this.padresTipoNovedad = resp;
    }, error => {
      console.error('Error al consultarOperadores');
    });
  }


  consultarBuses() {
    const fechaEnviar = new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z';
    this.busService.consultarBusesSinAsignacionDisponibles(fechaEnviar).subscribe(resp => {
      this.buses = resp;
    }, error => {
      console.error('Error al consultarBuses');
    });
  }

  consultarServicios() {
    this.servicioService.consultarServicios().subscribe(resp => {
      this.servicios = resp;
    }, error => {
      console.error('Error al readServicios');
    });
  }


  submit() {

    let estadoEnviar: Catalogo;
    let mensaje: string;

    estadoEnviar = { id: 36, codigo: 'NOV_REPORTADA', nombre: undefined, descripcion: undefined, idCatalogo: undefined }; // Reportado
    mensaje = 'Novedad reportada';


    let novedadEnviar: any;
    novedadEnviar = {
      id: undefined,
      fecha: new Date(),
      valorNuevo: this.myForm.controls.idTipoOculto.value === undefined ?
      undefined : this.myForm.controls.idTipoOculto.value.codigo, // Validacion para inasistencia
      motivo: this.myForm.controls.motivo.value,
      idEstado: estadoEnviar,
      idTipo: this.myForm.controls.idTipoNovedad.value,
      idSitio: this.myForm.controls.idSitio.value,
    };

    GeneralUtil.CONFIRMACION().subscribe(resp => {
      this.spinner.show();
      if (resp) {

        this.novedadesService.crearNovedadExtraordinaria(novedadEnviar).subscribe(resp => {
          this.spinner.hide();
          GeneralUtil.MENSAJE(mensaje, 'success');
          console.log(resp);
          this.closeModal();
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

  closeModal() {
    ($('#modalNovedadExtra') as any).modal('hide');
  }

  fechaAyer() {
    const fecha = new Date();
    const otraFecha = fecha.setDate(fecha.getDate() );
    return new Date(otraFecha);
  }

}
