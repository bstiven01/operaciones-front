import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Table } from 'primeng/table/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NovedadesService } from 'src/services/novedad.service';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ServicioService } from 'src/services/servicio.service';
import { OperacionesService } from 'src/services/operaciones.service';
import { BusService } from 'src/services/bus.service';
import { OperadorService } from 'src/services/operador.service';
import { MatDialog } from '@angular/material';
import { NovedadSinCambioComponent } from '../novedad-sin-cambio/novedad-sin-cambio.component';
import { NovedadCambioBusComponent } from '../novedad-cambio-bus/novedad-cambio-bus.component';
import { NovedadCambioOperadorComponent } from '../novedad-cambio-operador/novedad-cambio-operador.component';
import { GeneralUtil } from 'src/utils/general.util';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-listado-novedades',
  templateUrl: './listado-novedades.component.html',
  styleUrls: ['./listado-novedades.component.scss']
})
export class ListadoNovedadesComponent implements OnInit {

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
  novedadSeleccionada: any;
  //#endregion

  idNovedad;

  //#region objetos
  filters: any[] = [
    { id: 'f1', Etiqueta: 'Código Operador' },
    { id: 'f2', Etiqueta: 'Código Servicio' },
    { id: 'f3', Etiqueta: 'Código Tabla' },
    { id: 'f4', Etiqueta: 'Código Bus' },
  ]
  //#endregion

  configuracion_bus = { id: 1, nombre: 'BUS', nombre_pascal: 'Bus', color: 'primary', icono: 'directions_bus' };
  configuracion_servicio = { id: 2, nombre: 'SERVICIO', nombre_pascal: 'Servicio', color: 'primary', icono: 'pin_drop' }
  configuracion_operador = { id: 3, nombre: 'OPERADOR', nombre_pascal: 'Operador', color: 'primary', icono: 'airline_seat_recline_normal' }


  reportar = { id: 2, nombre: 'REPORTAR', nombre_pascal: 'Reportar' }

  minDate: Date;
  maxDate: Date;

  constructor(private formBuilder: FormBuilder,
    private _noveService: NovedadesService,
    private _operadorService: OperadorService,
    private _busService: BusService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.buildForm();
    this.consultaGeneral();
  }

  recibirSalida(e) {
    this.buildForm();
    this.consultaGeneral();
  }

  abrirModalNovedad(id) {
    this.idNovedad = id;
  }

  private buildForm() {
    let today = new Date();
    let day = today.getDay();
    let prevWeek = day - 7;
    this.minDate = new Date();
    this.minDate.setDate(prevWeek);

    this.cols = [
      { field: 'colores', header: '', alternativeHeader: 'ESTADO', width: '2px' },
      { field: 'accion', header: 'Detalle', alternativeHeader: 'DETALLE', width: '25px' },
      { field: 'fecha', header: 'FECHA', alternativeHeader: 'FECHA', totalfield: 'fecha', width: '100px' },
      { field: 'motivo', header: 'MOTIVO', alternativeHeader: 'MOTIVO', totalfield: 'motivo', width: '30px' },
      { field: 'idEstado', subfield: 'nombre', totalfield: 'idEstado.nombre', header: 'ESTADO', alternativeHeader: 'ESTADO', width: '100px' },
      { field: 'idTipo', subfield: 'nombreTipoNovedadPadre', totalfield: 'idTipo.nombreTipoNovedadPadre', header: 'CLASE', alternativeHeader: 'CLASE', width: '100px' },
      { field: 'idTipo', subfield: 'nombre', totalfield: 'idTipo.nombre', header: 'TIPO', alternativeHeader: 'TIPO', width: '100px' }
    ];
    this._selectedColumns = this.cols;
    this.formulario = this.formBuilder.group({
      selectedColumns: [''],
      consulta: ['', Validators.required],
      filtros: ['', Validators.required],
      Ffecha: [''],
      Fmotivo: [''],
      Festado: [''],
      Ftipo: [''],
      Ctipo: [''],
      date: [''],
    });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  //needs refactor
  set selectedColumns(val: any[]) {
    if (val != null) {
      this._selectedColumns = this.cols.filter(col => val.includes(col));
    }
  }

  consultaEspecifica() {
    const valorCampo = this.formulario.get('filtros').value;
    const valorSeleccionado = valorCampo.split("&", 2);
    const valorBusqueda = this.formulario.get('consulta').value;
    if (this.formulario.get('consulta').errors == undefined && this.formulario.get('filtros').errors == undefined) {
      this.filtroActual = 'Mostrando registros asociados al ' + valorSeleccionado[1] + ': ' + valorBusqueda;
      this.loading = true;
      this.payloadRespuesta = {
        "codigoOperador": valorSeleccionado == 'f1' ? valorBusqueda : null,
        "codigoServicio": valorSeleccionado == 'f2' ? valorBusqueda : null,
        "codigoTabla": valorSeleccionado == 'f3' ? valorBusqueda : null,
        "codigoBus": valorSeleccionado == 'f4' ? valorBusqueda : null
      }
      this._noveService.consultaExpecifica(this.payloadRespuesta).subscribe((resp) => {
        this.payload = resp;
        this.resetTable();
      }, error => {
        console.error(error);
      });
    }
  }

  consultaGeneral() {
    this.loading = true;
    let stringDate = this.formulario.get('date').value;
    //debugger;
    //let pipe = new DatePipe('en-US'); // Use your own locale
    //const myFormattedDate = pipe.transform(stringDate, 'dd/MM/yyyy');
    this._noveService.consultarByFecha(GeneralUtil.RETORNAR_FECHA_JSONUTCBogota(stringDate == null ? new Date() : stringDate)).subscribe((resp) => {
      this.payload = resp;
      this.resetTable();
    }, error => {
      console.error(error);
    });
  }
  resetTable() {
    this.loading = false;
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
  }

  consultarDetalle(ope: any) {
    const index = this.payload.findIndex(fruit => fruit.id === ope.id);
    if (this.payload[index].valnuevo == undefined) {
      let tipoNov: string = this.payload[index].idTipo.nombreTipoNovedadPadre;
      var codigoObjAntiguo: string = this.payload[index].valorAnterior;
      var codigoObjNuevo: string = this.payload[index].valorNuevo;
      if (tipoNov === 'OPERADOR') {
        this._operadorService.consultarOperadorByCodigo(+codigoObjAntiguo).subscribe(x => {
          this.payload[index].valAnterior = x
        });
        this._operadorService.consultarOperadorByCodigo(+codigoObjNuevo).subscribe(x => {
          this.payload[index].valnuevo = x
        });
      } else if (tipoNov === 'BUS') {
        this._busService.consultarBusPorCodigo(codigoObjAntiguo).subscribe(x => {
          this.payload[index].valAnterior = x
        });
        this._busService.consultarBusPorCodigo(codigoObjNuevo).subscribe(x => {
          this.payload[index].valnuevo = x
        });
      }
    }
  }

  seleccionarNovedad(event, car: any, overlaypanel: OverlayPanel) {
    this.novedadSeleccionada = car;
    overlaypanel.toggle(event);
  }

  openNovedadSinCambio(novedad: any): void {

    let configuracion;

    novedad.idTipo.nombreTipoNovedadPadre == 'BUS' ? configuracion = this.configuracion_bus : null
    novedad.idTipo.nombreTipoNovedadPadre == 'OPERADOR' ? configuracion = this.configuracion_operador : null
    novedad.idTipo.nombreTipoNovedadPadre == 'SERVICIO' ? configuracion = this.configuracion_servicio : null

    const width = '650px';
    const height = '330px';

    let dialogRef = this.dialog.open(NovedadSinCambioComponent, {
      width: width,
      height: height,
      data:
      {
        configuracion: configuracion,
        novedad: novedad,
        tipo: this.reportar
      },

    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.consultaGeneral();
      }
    });
  }

  openNovedadCambio(novedad: any): void {
    debugger;

    let tipo = novedad.idTipo.idTipoNovedad.nombre;
    let configuracion;

    if (tipo === 'BUS') {

      this.openCambioBus(novedad);

    }

    if (tipo === 'OPERADOR') {

      this.openNovedadCambioOperador(novedad);

    }

    novedad.idTipo.nombreTipoNovedadPadre == 'SERVICIO' ? configuracion = this.configuracion_servicio : null



  }

  openCambioBus(novedad: any) {
    let configuracion = this.configuracion_bus

    let dialogRef;

    const width = '90%';
    const height = '630px';


    dialogRef = this.dialog.open(NovedadCambioBusComponent, {
      width: width,
      height: height,
      data:
      {
        configuracion: configuracion,
        datos: undefined,
        novedad: novedad
      },

    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.consultaGeneral();
      }
    });

  }

  openNovedadCambioOperador(novedad: any): void {

    let configuracion = this.configuracion_operador

    let dialogRef;

    const width = '90%';
    const height = '630px';

    dialogRef = this.dialog.open(NovedadCambioOperadorComponent, {
      width: width,
      height: height,
      data:
      {
        configuracion: configuracion,
        novedad: novedad
      },

    });


    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.consultaGeneral();
      }
    });
  }

}
