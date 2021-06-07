import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Table } from 'primeng/table/table';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { TipoNovedad } from 'src/models/tipo-novedad.model';
import { Operador } from 'src/models/operador.model';
import { Bus } from 'src/models/bus.model';
import { Catalogo } from 'src/models/catalogo.model';
import { Servicio } from 'src/models/servicio.model';
import { BusService } from 'src/services/bus.service';
import { OperadorService } from 'src/services/operador.service';
import { ServicioService } from 'src/services/servicio.service';
import { TipoNovedadService } from 'src/services/tipo-novedad.service';
import { NovedadesService } from 'src/services/novedad.service';
import { GeneralUtil } from 'src/utils/general.util';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilterUtils } from 'primeng/utils';
import { DatePipe } from '@angular/common';
import { Novedad } from 'src/models/novedad.model';
import { OperacionesService } from 'src/services/operaciones.service';
import { SitioService } from 'src/services/sitio.service';


@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss']
})
export class AsistenciaComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private busService: BusService,
    private operadorService: OperadorService,
    private servicioService: ServicioService,
    private tiposNovedadServicio: TipoNovedadService,
    private novedadesService: NovedadesService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private operacionesService: OperacionesService,
    private sitioService: SitioService
  ) { }

  //#region variables
  @ViewChild('dt', { static: false }) table: Table;
  public formulario: FormGroup;
  payload: any[];
  payloadRespuesta: any;
  loading: boolean;
  campoBusqueda: string;
  camposeleccionado: string;
  _selectedColumns: any[];
  cols: any[];
  filtroActual: string = undefined;
  //#endregion

  @Input() asistenciaHabilitada;

  //#region objetos
  filters: any[] = [
    { id: 'f1', Etiqueta: 'Código Operador' },
    { id: 'f2', Etiqueta: 'Código Servicio' },
    { id: 'f3', Etiqueta: 'Código Tabla' },
    { id: 'f4', Etiqueta: 'Código Bus' },
  ];
  //#endregion

  // FORMULARIO
  myForm: FormGroup;

  // listas para formulario
  padresTipoNovedad: TipoNovedad[];
  tiposNovedad: TipoNovedad[];

  operadores: Operador[];
  buses: Bus[];
  servicios: Servicio[];

  // banderas usadas en el html
  ngIfOperador: boolean;
  ngIfBus: boolean;
  ngIfServicio: boolean;
  ngIfBotonesNovedad: boolean;
  ngIfBotonesAsistencia: boolean;
  sitios = [];


  ngOnInit() {

    this.consultarPadresTipoNovedad();

    this.buildFormModal();

    this.llenarTabla();

    this.consultarSitios();

    this.ngIfBotonesNovedad = true;

  }

  ngOnChanges() {
    this.consultarPadresTipoNovedad();
    console.log(" Asistencia: " + this.asistenciaHabilitada)
  }


  public buildFormModal() {
    this.cols = [
      { field: 'fecha', header: 'FECHA', totalfield: 'fecha', width: '100px' },
      { field: 'idTipo', subfield: 'nombre', totalfield: 'idTipo.nombre', header: 'TIPO', width: '100px' },
      { field: 'idEstado', subfield: 'nombre', totalfield: 'idEstado.nombre', header: 'ESTADO', width: '100px' },
      { field: 'idSitio', subfield: 'sitio', totalfield: 'idSitio.nombre', header: 'SITIO', width: '100px' },
      { field: 'accion', header: '', textoAlternativo: 'ACCIONES', width: '100px' },
      { field: 'valorAnterior', totalfield: 'valorAnterior', header: 'ANTERIOR', width: '100px' },
      { field: 'valorNuevo', totalfield: 'valorNuevo', header: 'NUEVO', width: '100px' },
      { field: 'motivo', header: 'MOTIVO', totalfield: 'motivo', width: '450px' }
    ];
    this._selectedColumns = this.cols;

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
      idSitio: [undefined, [Validators.required]]
    });

    // Filtro especial por fecha
    FilterUtils['fechaDate'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {

        return false;
      }
      console.log(this.datePipe.transform(value, 'dd/MM/yyyy, HH:mm:ss'));
      return this.datePipe.transform(value, 'dd/MM/yyyy, HH:mm:ss').includes(filter);

    };

    // this.myForm.valueChanges.subscribe(console.log);

  }

  consultarSitios() {
    this.sitioService.listar().subscribe(resp => {
      this.sitios = resp;
    }, error => {
      console.error('Error al consultarOperadores');
    });
  }

  consultarPadresTipoNovedad() {
    this.tiposNovedadServicio.consultarPadresTipoNovedad().subscribe(resp => {

      this.padresTipoNovedad = resp;

      for (let i = 0; i < this.padresTipoNovedad.length; i++) {
        if ( this.asistenciaHabilitada === true) {
          if (this.padresTipoNovedad[i].codigo === 'NOVASIS') {
            this.padresTipoNovedad.splice(i, 1);
          }
        }
      }

    }, error => {
      console.error('Error al consultarOperadores');
    });
  }

  consultarOperadores() {
    let listaEstados: number[] = [];
    listaEstados.push(56);//Disponible
    listaEstados.push(57);//Patio
    this.operadorService.consultarOperadoresByListaIdEstado(listaEstados).subscribe(resp => {
      this.operadores = resp;
    }, error => {
      console.error('Error al consultarOperadores');
    });
  }

  consultarBuses() {

    let fechaString = this.novedadesService.objetoModal.fecha
    let fecha = GeneralUtil.FECHA_STRING_TO_DATE(fechaString);
    let fechaEnviar = GeneralUtil.RETORNAR_FECHA_JSONUTCBogota(fecha);

    //se consultan los buses sin asignacion segun la fecha de detalle servicio
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

  llenarSelect(id: any, codigo: any) {
    this.ngIfBotonesNovedad = true;
    this.ngIfBotonesAsistencia = false;
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
      this.ngIfBotonesAsistencia = true;
    }
  }

  submit(tipo: number) {

    let estadoEnviar: Catalogo;

    let mensaje: string;
    let mensajeConfirmacion: string;

    if (tipo === 1) {
      estadoEnviar = { id: 37, codigo: 'NOV_PENDIENTE', nombre: undefined, descripcion: undefined, idCatalogo: undefined }; // Pendiente
      mensaje = 'Novedad pendiente por terminar';

    } else if (tipo === 2) {
      estadoEnviar = { id: 36, codigo: 'NOV_REPORTADA', nombre: undefined, descripcion: undefined, idCatalogo: undefined }; // Reportado
      mensaje = 'Novedad Reportada';

    } else if (tipo === 3) {
      if (this.myForm.controls.idTipoNovedad.value.codigo === 'NOVASIS_ASIS') {
        mensaje = 'Asistencia Reportada';
        mensajeConfirmacion = `Se marcara la asistencia para el operador:
        ${this.novedadesService.objetoModal.codigoConductor} - ${this.novedadesService.objetoModal.nombreCompletoCondutor}`;

      } else {
        mensaje = 'Inasistencia Reportada';
        mensajeConfirmacion = `Se marcara la inasistencia para el operador:
        ${this.novedadesService.objetoModal.codigoConductor} - ${this.novedadesService.objetoModal.nombreCompletoCondutor}`;
      }
      estadoEnviar = { id: 43, codigo: 'NOV_NEUTRO', nombre: undefined, descripcion: undefined, idCatalogo: undefined }; // Neutro

    }

    let valorAnteriorEnviar: string;
    switch (this.myForm.controls.idPadreTipoNovedad.value.codigo) {
      case 'NOVOPE': // Operador
        valorAnteriorEnviar = this.novedadesService.objetoModal.codigoConductor;
        break;
      case 'NOVBUS': // Bus
        valorAnteriorEnviar = this.novedadesService.objetoModal.codigoBus;
        break;
      case 'NOVSER': // Servicio
        valorAnteriorEnviar = this.novedadesService.objetoModal.codigo;
        break;
      case 'NOVASIS': // Asistencia
        break;
    }


    let novedadEnviar: any;
    novedadEnviar = {
      id: undefined,
      fecha: new Date(),
      valorAnterior: valorAnteriorEnviar,
      valorNuevo: this.myForm.controls.idTipoOculto.value === undefined ?
        undefined : this.myForm.controls.idTipoOculto.value.codigo, // Validacion para inasistencia
      motivo: this.myForm.controls.motivo.value,
      idDetalleServicio: this.novedadesService.objetoModal.idDetalleServicio,
      idEstado: estadoEnviar,
      idTipo: this.myForm.controls.idTipoNovedad.value,
      idSitio: this.myForm.controls.idSitio.value,
    };

    GeneralUtil.CONFIRMACION(mensajeConfirmacion).subscribe(resp => {
      this.spinner.show();
      if (resp) {

        this.novedadesService.crearNovedad(novedadEnviar).subscribe(resp => {
          this.spinner.hide();
          GeneralUtil.MENSAJE(mensaje, 'success');
          console.log(resp);
          this.closeModal();
          this.buildFormModal();
          this.operacionesService.refreshTable(true);
        }, error => {
          this.spinner.hide();
          GeneralUtil.MENSAJE('No se  registro ni se actualizo ningun dato de la novedad.', 'error');
          console.log(error);
          this.operacionesService.refreshTable(true);
        });

      }
    });

  }

  makeAsistencia() {

    let novedadAsistencia: any;
    novedadAsistencia = {
      id: undefined,
      fecha: new Date(),
      valorAnterior: undefined,
      valorNuevo: '',
      motivo: undefined,
      idDetalleServicio: this.novedadesService.objetoModal.idDetalleServicio,
      idEstado: { id: 43, codigo: 'NOV_NEUTRO', nombre: undefined, descripcion: undefined, idCatalogo: undefined }, // Estado_Neutro,
      idTipo: { id: 5, codigo: 'NOVASIS_ASIS', nombre: undefined, descripcion: undefined, idTipoNovedad: 4 }, // asistencia -- asistio
    };

    const mensajeConfirmacion = `Se marcara la asistencia para el operador:
    ${this.novedadesService.objetoModal.codigoConductor} - ${this.novedadesService.objetoModal.nombreCompletoCondutor}`;

    GeneralUtil.CONFIRMACION(mensajeConfirmacion).subscribe(resp => {
      this.spinner.show();
      if (resp) {

        this.novedadesService.crearNovedad(novedadAsistencia).subscribe(resp => {
          this.spinner.hide();
          GeneralUtil.MENSAJE('Asistencia Registrada.', 'success');
          console.log(resp);
          this.closeModal();
          this.buildFormModal();
          this.operacionesService.refreshTable(true);
        }, error => {
          this.spinner.hide();
          GeneralUtil.MENSAJE('No se  registro ni se actualizo ningun dato de la novedad.', 'error');
          console.log(error);
          this.operacionesService.refreshTable(true);
        });

      }
    });
  }

  makeInasistencia() {

    this.ngIfServicio = false;
    this.ngIfOperador = false;
    this.ngIfBus = false;

    this.myForm.patchValue({
      idPadreTipoNovedad: { id: 4, codigo: 'NOVASIS', nombre: 'REPORTE ASISTENCIA', idTipoNovedad: null },
      idTipoNovedad: { id: 6, codigo: 'NOVASIS_INASIS', nombre: 'INASISTENCIA', idTipoNovedad: 4 },
    });
    this.ngIfBotonesNovedad = false;
    this.ngIfBotonesAsistencia = true;

  }

  reportar(ope: Novedad) {

    let novedadEnviar: any;
    novedadEnviar = {
      id: ope.id,
      fecha: ope.fecha,
      valorAnterior: ope.valorAnterior,
      valorNuevo: ope.valorNuevo,
      motivo: ope.motivo,
      idDetalleServicio: ope.idDetalleServicio,
      idEstado: { id: 36, codigo: 'NOV_REPORTADA', nombre: undefined, descripcion: undefined, idCatalogo: undefined }, // Reportado,
      idTipo: ope.idTipo,
    };

    GeneralUtil.CONFIRMACION().subscribe(resp => {
      this.spinner.show();
      if (resp) {

        this.novedadesService.actualizarNovedad(novedadEnviar).subscribe(resp => {
          this.spinner.hide();
          GeneralUtil.MENSAJE('Novedad Reportada', 'success');
          console.log(resp);
          this.closeModal();
          this.buildFormModal();
          this.operacionesService.refreshTable(true);
        }, error => {
          this.spinner.hide();
          GeneralUtil.MENSAJE('No se  registro ni se actualizo ningun dato de la novedad.', 'error');
          console.log(error);
          this.operacionesService.refreshTable(true);
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

  llenarTabla() {
    this.payload = this.novedadesService.objetoModal.novedades;
  }

  // Filtros de la tabla
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    if (val != null) {
      this._selectedColumns = this.cols.filter(col => val.includes(col));
    }
  }

  closeModal() {
    ($('#myModal') as any).modal('hide');
  }

}
