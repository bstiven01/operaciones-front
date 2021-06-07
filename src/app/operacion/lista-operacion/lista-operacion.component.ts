import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { OperacionesService } from 'src/services/operaciones.service';
import { Table } from 'primeng/table/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api/menuitem';
import { NovedadesService } from 'src/services/novedad.service';
import * as jQuery from 'jquery';
import { GeneralUtil } from 'src/utils/general.util';
import { NgxSpinnerService } from 'ngx-spinner';
import { AsistenciaComponent } from 'src/app/novedad/asistencia/asistencia.component'
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { NovedadCambioBusComponent } from 'src/app/novedad/novedad-cambio-bus/novedad-cambio-bus.component';
import { NovedadCambioOperadorComponent } from 'src/app/novedad/novedad-cambio-operador/novedad-cambio-operador.component';
import { NovedadSinCambioComponent } from 'src/app/novedad/novedad-sin-cambio/novedad-sin-cambio.component';
import { SeleccionBotonComponent } from 'src/app/util-component/seleccion-boton/seleccion-boton.component';
import { AsignarBusComponent } from 'src/app/asignar-bus/asignar-bus.component';



@Component({
  selector: 'app-lista-operacion',
  templateUrl: './lista-operacion.component.html',
  styleUrls: ['./lista-operacion.component.scss']
})
export class ListaOperacionComponent implements OnInit {

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
  checked1: boolean;
  minDate: Date;
  maxDate: Date;
  //#endregion

  idNovedad;

  //#region objetos
  filters: any[] = [
    { id: 'f1', Etiqueta: 'Código conductor' },
    { id: 'f2', Etiqueta: 'Tipo tarea' },
    { id: 'f3', Etiqueta: 'Desde' },
    { id: 'f4', Etiqueta: 'Hasta' },
    { id: 'f5', Etiqueta: 'Vehículo real' },
    { id: 'f6', Etiqueta: 'Servicio vehículo' }
  ];
  //#endregion

  // Menu click derecho ContextMenu
  //selectedOperacion: any;
  //items: MenuItem[];

  // Bandera para html
  ngIfModal: boolean;
  asistenciaHabilitada = false;

  // variable para usar atributos o metodos del componente hijo
  @ViewChild(AsistenciaComponent, { static: false }) asistencia: AsistenciaComponent;

  configuracion_bus = { id: 1, nombre: 'BUS', nombre_pascal: 'Bus', color: 'primary', icono: 'directions_bus' };
  configuracion_servicio = { id: 2, nombre: 'SERVICIO', nombre_pascal: 'Servicio', color: 'primary', icono: 'pin_drop' }
  configuracion_operador = { id: 3, nombre: 'OPERADOR', nombre_pascal: 'Operador', color: 'primary', icono: 'airline_seat_recline_normal' }

  pendiente = { id: 1, nombre: 'PENDIENTE', nombre_pascal: 'Pendiente' }
  reportar = { id: 2, nombre: 'REPORTAR', nombre_pascal: 'Reportar' }

  constructor(
    private formBuilder: FormBuilder,
    private _opeService: OperacionesService,
    private novedadesService: NovedadesService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public dialog: MatDialog,

  ) { }

  ngOnInit() {
    this.buildForm();
    this.consultaGeneral();

    this._opeService.eventRefreshTableListaOperacion
      .subscribe((data: boolean) => {
        if (data) {
          this.consultaGeneral();
        }
      });
  }

  abrirModalNovedad(id) {
    this.idNovedad = id;
  }

  recibirSalida(e) {
    this.buildForm();
    this.consultaGeneral();
  }

  irServicios(ope) {
    let infoServicio = {
      codigoConductor: ope.codigoConductor,
      fecha: ope.fecha,
      horaFin: ope.horaFin,
      horaInicio: ope.horaInicio,
      nombreCompletoCondutor: ope.nombreCompletoCondutor,
      tipoServicio: ope.linea.codigo,
      idDetalleServicio: ope.idDetalleServicio,
      codigoBus: ope.codigoBus,
      idBus: ope.idBus,

    };
    this.router.navigate(['/servicio/crear'], { queryParams: infoServicio });
  }

  buscarAsistencia(data) {
    const novedad = data.find(nov => nov.idTipo.codigo === 'NOVASIS_ASIS' || nov.idTipo.codigo === 'NOVASIS_INASIS');
    if (novedad === undefined) {
      this.asistenciaHabilitada = false;
    } else {
      this.asistenciaHabilitada = true;
    }
  }

  private buildForm() {
    let today = new Date();
    let day = today.getDay();
    let prevWeek = day - 7;
    this.minDate = new Date();
    this.minDate.setDate(prevWeek);
    //this.maxDate = new Date();
    this.cols = [
      { field: 'iconsNoveda', header: '', textoAlternativo: 'NOVEDADES', width: '76px' },
      { field: 'accion', header: '', textoAlternativo: 'ACCIONES', width: '140px' },
      { field: 'codigoConductor', totalfield: 'codigoConductor', header: 'CÓDIGO CONDUCTOR', textoAlternativo: 'CÓDIGO CONDUCTOR', width: '150px' },
      { field: 'nombreCompletoCondutor', totalfield: 'nombreCompletoCondutor', header: 'CONDUCTOR', textoAlternativo: 'CONDUCTOR', width: '250px' },
      { field: 'codigoBus', totalfield: 'codigoBus', header: 'VEHÍCULO REAL', textoAlternativo: 'VEHÍCULO REAL', width: '130px' },
      { field: 'tabla', totalfield: 'tabla', header: 'TABLA', textoAlternativo: 'TABLA', width: '100px' },
      { field: 'busVirtual', totalfield: 'busVirtual', header: 'SERVICIO VEHÍCULO', textoAlternativo: 'SERVICIO VEHÍCULO', width: '150px' },
      { field: 'nombreLinea', totalfield: 'linea.nombre', header: 'SERVICIO', textoAlternativo: 'SERVICIO', width: '250px' },
      { field: 'sitioDesde', totalfield: 'sitioDesde', header: 'DESDE', textoAlternativo: 'DESDE', width: '250px' },
      { field: 'horaInicio', totalfield: 'horaInicio', header: 'HORA INICIO', textoAlternativo: 'HORA INICIO', width: '150px' },
      { field: 'sitioHasta', totalfield: 'sitioHasta', header: 'HASTA', textoAlternativo: 'HASTA', width: '250px' },
      { field: 'horaFin', totalfield: 'horaFin', header: 'HORA FIN', textoAlternativo: 'HORA FIN', width: '150px' }
    ];
    this._selectedColumns = this.cols;
    this.formulario = this.formBuilder.group({
      consulta: ['', Validators.required],
      filtros: ['', Validators.required],
      Ffecha: [''],
      date: [''],
      FcodigoConductor: [''],
      FnombreCompletoCondutor: [''],
      Fparte: [''],
      FtipoTarea: [''],
      FsitioDesde: [''],
      FsitioHasta: [''],
      FhoraInicio: [''],
      FhoraFin: [''],
      FcodigoBus: [''],
      Flinea: [''],
      FbusVirtual: [''],
      FAsistentcia: [false],
      selectedColumns: [''],
    });

    // items row menu
    //this.items = [
    // { label: 'Asistio', icon: 'pi pi-check', command: (event) => this.makeAsistencia(this.selectedOperacion) },
    //{ label: 'Menu', icon: 'pi pi-eye', command: (event) => this.openNovedades(this.selectedOperacion) }
    //];

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

  //deprecated
  // consultaEspecifica() {
  //   const valorSeleccionado = this.formulario.get('filtros').value;
  //   const valorBusqueda = this.formulario.get('consulta').value;
  //   if (this.formulario.get('consulta').errors == undefined && this.formulario.get('filtros').errors == undefined) {
  //     this.loading = true;
  //     this.payloadRespuesta = {
  //       "busquedaCodigoConductor": valorSeleccionado == 'f1' ? valorBusqueda : null,
  //       "busquedatipoTarea": valorSeleccionado == 'f2' ? valorBusqueda : null,
  //       "busquedasitioDesde": valorSeleccionado == 'f3' ? valorBusqueda : null,
  //       "busquedasitioHasta": valorSeleccionado == 'f4' ? valorBusqueda : null,
  //       "busquedacodigoBus": valorSeleccionado == 'f5' ? valorBusqueda : null,
  //       "busquedabusVirtual": valorSeleccionado == 'f6' ? valorBusqueda : null
  //     }

  //     this._opeService.consultaExpecifica(this.payloadRespuesta).subscribe((resp) => {
  //       this.payload = resp;
  //       this.payload.forEach(registo => {
  //         registo.novedades.forEach(novedad => {
  //           let estadoNovedad = novedad.idEstado.codigo;
  //           let tipoNovedad = novedad.idTipo.codigo;
  //           if (estadoNovedad == 'NOV_NEUTRO' && tipoNovedad == 'NOVASIS_ASIS') {
  //             registo.tieneAsistencia = true;
  //           } else if (estadoNovedad == 'NOV_NEUTRO' && tipoNovedad != 'NOVASIS_ASIS') {
  //             registo.tieneInAsistencia = true;
  //           }
  //           if (estadoNovedad == 'NOV_PENDIENTE') {
  //             registo.tieneNovedadesPendientes = true;
  //           }
  //           if (estadoNovedad == 'NOV_REPORTADA') {
  //             registo.tieneNovedadesReportadas = true;
  //           }
  //         })
  //       })
  //       if(this.payload && this.payload.length < 1){
  //         this.payload = undefined;
  //       }
  //       this.resetTable();
  //     }, error => {
  //       this.resetTable();
  //       console.error(error);
  //     });
  //   }

  // }

  consultaGeneral() {
    this.loading = true;
    let stringDate = this.formulario.get('date').value;
    let pipe = new DatePipe('en-US'); // Use your own locale
    const myFormattedDate = pipe.transform(stringDate, 'dd/MM/yyyy');

    this._opeService.listar(myFormattedDate).subscribe((resp) => {
      if (resp.length > 0) {
        this.payload = resp;
        this.payload.forEach(registo => {
          registo.nombreLinea = registo.linea.nombre;
          registo.novedades.forEach(novedad => {
            let estadoNovedad = novedad.idEstado.codigo;
            let tipoNovedad = novedad.idTipo.codigo;
            if (estadoNovedad == 'NOV_NEUTRO' && tipoNovedad == 'NOVASIS_ASIS') {
              registo.tieneAsistencia = true;
            } else if (estadoNovedad == 'NOV_NEUTRO' && tipoNovedad != 'NOVASIS_ASIS') {
              registo.tieneInAsistencia = true;
            }
            if (estadoNovedad === 'NOV_PENDIENTE') {
              registo.tieneNovedadesPendientes = true;
            }
            if (estadoNovedad === 'NOV_REPORTADA') {
              registo.tieneNovedadesReportadas = true;
            }
          });
        });
      }
      if (this.payload && this.payload.length < 1) {
        this.payload = undefined;
      }
      this.resetTable();
    }, error => {
      console.error(error);
      this.loading = false;
    });
  }

  resetTable() {
    this.loading = false;
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
  }

  makeAsistencia(objeto: any) {

    let novedadAsistencia: any;
    novedadAsistencia = {
      id: undefined,
      fecha: new Date(),
      valorAnterior: undefined,
      valorNuevo: '',
      motivo: undefined,
      idDetalleServicio: objeto.idDetalleServicio,
      idEstado: { id: 43, codigo: 'NOV_NEUTRO', nombre: undefined, descripcion: undefined, idCatalogo: undefined }, // Neutro
      idTipo: { id: 5, codigo: 'NOVASIS_ASIS', nombre: undefined, descripcion: undefined, idTipoNovedad: 4 }, // asistencia -- asistio
    };

    const mensajeConfirmacion = `Se marcara la asistencia para el operador: ${objeto.codigoConductor} - ${objeto.nombreCompletoCondutor}`;


    GeneralUtil.CONFIRMACION(mensajeConfirmacion).subscribe(confirmacion => {
      this.spinner.show();
      if (confirmacion) {
        this.novedadesService.crearNovedad(novedadAsistencia).subscribe(resp => {
          this.spinner.hide();


          console.log(resp);
          this.consultaGeneral();
        }, error => {
          this.spinner.hide();
          GeneralUtil.MENSAJE('No se  registro ni se actualizo ningun dato de la novedad.', 'error');
          console.log(error);
          this.consultaGeneral();
        });

      }
    });
  }

  openNovedades(objeto: any) {

    this.novedadesService.objetoModal = undefined;

    this.novedadesService.objetoModal = objeto;
    this.ngIfModal = true;
    this.buscarAsistencia(objeto.novedades);
    ($('#myModal') as any).modal('show');
    if (this.asistencia !== undefined) {
      this.asistencia.buildFormModal();
      this.asistencia.llenarTabla();
    }
  }

  filtrarAsistencia(e) {
    if (this.checked1) {
      this.table.filter(['INICIO-S', 'RELEVO', 'RELEVO-P'], 'linea.codigo', 'in');
    } else {
      this.table.reset();
    }
  }

  openCambioSeleccion(detalle: any) {

    let dialogRef;

    const width = '530px';
    const height = '116px';

    let lista_seleccion = [];
    lista_seleccion.push(this.configuracion_bus);
    lista_seleccion.push(this.configuracion_operador);


    dialogRef = this.dialog.open(SeleccionBotonComponent, {
      width: width,
      height: height,
      data: lista_seleccion,

    });


    dialogRef.afterClosed().subscribe((result: any) => {

      const id = !result ? 0 : result.id;

      if (id === 1) {
        this.openNovedadCambioBus(detalle, result);

      } else if (id === 3) {
        this.openNovedadCambioOperador(detalle, result);
      }
    });

  }

  openNovedadCambioBus(detalle: any, configuracion: any): void {
    let dialogRef;

    const width = '90%';
    const height = '630px';

    if (detalle !== undefined) {
      dialogRef = this.dialog.open(NovedadCambioBusComponent, {
        width: width,
        height: height,
        data:
        {
          configuracion: configuracion,
          detalle: detalle
        },

      });
    } else {
      dialogRef = this.dialog.open(NovedadCambioBusComponent, {
        width: width,
        height: height,
        data: {}
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.consultaGeneral();
      }
    });
  }

  openNovedadCambioOperador(detalle: any, configuracion: any): void {
    let dialogRef;

    const width = '90%';
    const height = '630px';

    if (detalle !== undefined) {
      dialogRef = this.dialog.open(NovedadCambioOperadorComponent, {
        width: width,
        height: height,
        data:
        {
          configuracion: configuracion,
          detalle: detalle
        },

      });
    } else {
      dialogRef = this.dialog.open(NovedadCambioOperadorComponent, {
        width: width,
        height: height,
        data: {}
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.consultaGeneral();
      }
    });
  }

  openSinCambioSeleccion(detalle: any) {

    let dialogRef;

    const width = '530px';
    const height = '116px';

    let lista_seleccion = [];
    lista_seleccion.push(this.configuracion_bus);
    lista_seleccion.push(this.configuracion_servicio);


    dialogRef = this.dialog.open(SeleccionBotonComponent, {
      width: width,
      height: height,
      data: lista_seleccion,

    });


    dialogRef.afterClosed().subscribe((result: any) => {

      const id = !result ? 0 : result.id;

      if (id === 1) {

        this.openNovedadSinCambio(detalle, result);

      } else if (id === 2) {

        this.openNovedadSinCambio(detalle, result);

      }
    });

  }

  openNovedadSinCambio(detalle: any, configuracion: any): void {
    let dialogRef;

    const width = '650px';
    const height = '330px';

    if (detalle !== undefined) {
      dialogRef = this.dialog.open(NovedadSinCambioComponent, {
        width: width,
        height: height,
        data:
        {
          configuracion: configuracion,
          detalle: detalle
        },

      });
    } else {
      dialogRef = this.dialog.open(NovedadSinCambioComponent, {
        width: width,
        height: height,
        data: {}
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.consultaGeneral();
      }
    });
  }

  openAsignarBus(detalle: any) {
    debugger;

    if (!!detalle.codigoBus) {
      GeneralUtil.MENSAJE('Servicio ya tiene un bus asignado', 'warning');
      return;
    }
    let dialogRef;

    const width = '450px';
    const height = '480px';

    if (detalle !== undefined) {
      dialogRef = this.dialog.open(AsignarBusComponent, {
        width: width,
        height: height,
        data:
        {
          detalle: detalle
        },

      });
    } else {
      dialogRef = this.dialog.open(AsignarBusComponent, {
        width: width,
        height: height,
        data: {}
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.consultaGeneral();
      }
    });
  }

}
