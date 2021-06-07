import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSelectionList, MatSelectionListChange, MAT_DIALOG_DATA } from '@angular/material';
import { Bus } from 'src/models/bus.model';
import { Catalogo } from 'src/models/catalogo.model';
import { DetalleServicio } from 'src/models/detalle-servicio.model';
import { DisponibilidadBus } from 'src/models/disponibilidad-bus.model';
import { NovedadDetalle } from 'src/models/novedad-detalle.model';
import { Novedad } from 'src/models/novedad.model';
import { Operador } from 'src/models/operador.model';
import { TipoNovedad } from 'src/models/tipo-novedad.model';
import { BusService } from 'src/services/bus.service';
import { DisponibilidadBusService } from 'src/services/disponibilidad-bus.service';
import { NovedadDetalleService } from 'src/services/novedad-detalle.service';
import { NovedadesService } from 'src/services/novedad.service';
import { OperacionesService } from 'src/services/operaciones.service';
import { SitioService } from 'src/services/sitio.service';
import { TipoNovedadService } from 'src/services/tipo-novedad.service';
import { GeneralUtil } from 'src/utils/general.util';

@Component({
  selector: 'app-novedad-cambio-bus',
  templateUrl: './novedad-cambio-bus.component.html',
  styleUrls: ['./novedad-cambio-bus.component.scss']
})
export class NovedadCambioBusComponent implements OnInit {

  myForm: FormGroup;

  tiposDeNovedad: TipoNovedad[];
  tiposDeSitio: any[];
  tiposDeBus: Bus[];
  mensajeCampoRequerido = 'Campo Requerido';

  nombre_bus: string;

  idDetalleServicio: any;
  idBus: any;
  idOperador: any;

  banderaBotones: boolean;

  listDetalleServicios: DetalleServicio[];
  listDiponibilidadBuses: DisponibilidadBus[];

  @ViewChild('disponibilidadBuses', { static: true }) disponibilidadBuses: MatSelectionList;
  @ViewChild('servicios', { static: true }) servicios: MatSelectionList;


  valorNuevo: string;

  listaDeDetallesGuardados: NovedadDetalle[];

  objectNovedad: Novedad;


  constructor(
    private tiposNovedadServicio: TipoNovedadService,
    private fb: FormBuilder,
    private sitioService: SitioService,
    public dialogRef: MatDialogRef<NovedadCambioBusComponent>,
    @Inject(MAT_DIALOG_DATA) public element: any,
    private busService: BusService,
    private novedadesService: NovedadesService,
    private operacionesService: OperacionesService,
    private novedadDetalleService: NovedadDetalleService,
    private disponibilidadBusService: DisponibilidadBusService,
  ) { }

  async ngOnInit() {

    this.consultarTiposNovedad();
    this.consultarSitios();

    //this.consultarBuses();

    //this.buildForm();

    if (!!this.element.novedad) {

      this.objectNovedad = this.element.novedad;
      await this.buildFromNovedad();
      //this.setNuevoBus();

      let fecha = this.objectNovedad.idDetalleServicio.horaInicio.substring(0, 19);
      if (this.banderaBotones) {
        this.listDiponibilidadBuses = [];
        this.listDiponibilidadBuses.push(this.objectNovedad.idDisponibilidadBus);

        await this.consultarNovedadesDetalle(this.objectNovedad.id);
        this.listDetalleServicios = [];
        this.listaDeDetallesGuardados.forEach((resp) => {
          this.listDetalleServicios.push(resp.idDetalleServicio);
        })

      } else {
        await this.consultarDisponibilidadBuses();
        await this.consultarDetallesServicios(fecha, this.element.novedad.idBus.codigo);
        await this.consultarNovedadesDetalle(this.element.novedad.id);
      }

    } else if (!!this.element.detalle) {
      this.buildFromDetalle();

      this.consultarDisponibilidadBuses();
      let fecha = GeneralUtil.FECHA_STRING_DETALLE_TO_JSON(this.element.detalle.fecha + '-' + this.element.detalle.horaInicio)
      this.consultarDetallesServicios(fecha, this.element.detalle.codigoBus);
    }

    this.disponibilidadBuses.selectionChange.subscribe((s: MatSelectionListChange) => {
      this.disponibilidadBuses.deselectAll();
      s.option.selected = true;
      this.valorNuevo = s.option.value.idBus.codigo;
    });

    this.disponibilidadBuses.options.forEach((element) => {

      if (this.element.novedad.idDisponibilidadBus.id === element.value.id) {
        element.selected = true;
        this.valorNuevo = element.value.idBus.codigo;
      }
    })

    this.servicios.options.forEach((element) => {

      this.listaDeDetallesGuardados.forEach((guardado) => {
        if (element.value.id === guardado.idDetalleServicio.id) {
          element.selected = true;
        }
      })
    })



  }

  buildForm() {

    this.myForm = this.fb.group({
      id: [undefined],
      idTipoNovedad: [undefined, [Validators.required]],
      idSitio: [undefined, [Validators.required]],
      motivo: [undefined, [Validators.required, Validators.maxLength(50)]],
    });

  }

  async buildFromDetalle() {

    this.myForm = this.fb.group({
      id: [undefined],
      idTipoNovedad: [undefined, [Validators.required]],
      idSitio: [undefined, [Validators.required]],
      motivo: [undefined, [Validators.required, Validators.maxLength(50)]],
      servicios: [undefined, [Validators.required]],
      idDisponibilidadBus: [undefined, [Validators.required]],
    });

    this.idDetalleServicio = this.element.detalle.idDetalleServicio;
    this.idBus = new Bus(this.element.detalle.idBus);
    this.idOperador = new Operador(this.element.detalle.idConductor);

    this.nombre_bus = this.element.detalle.codigoBus;

  }

  async buildFromNovedad() {

    this.myForm = this.fb.group({
      id: [this.element.novedad.id],
      idTipoNovedad: [this.element.novedad.idTipo, [Validators.required]],
      idSitio: [this.element.novedad.idSitio, [Validators.required]],
      motivo: [this.element.novedad.motivo, [Validators.required, Validators.maxLength(50)]],
      servicios: [undefined, [Validators.required]],
      idDisponibilidadBus: [undefined, [Validators.required]],
    });

    this.nombre_bus = this.element.novedad.idBus.codigo

    this.idDetalleServicio = this.element.novedad.idDetalleServicio;
    this.idBus = this.element.novedad.idBus;
    this.idOperador = this.element.novedad.idOperador;

    this.banderaBotones = !!this.element.novedad.id && this.element.novedad.idEstado.codigo === 'NOV_REPORTADA' ? true : false

    if (this.banderaBotones) {
      this.myForm.disable()
    }

  }

  async consultarDisponibilidadBuses() {

    await this.disponibilidadBusService.readByEstado(162).toPromise()
      .then((resp) => {
        this.listDiponibilidadBuses = resp;
      })
      .catch((error) => {
        console.error('Error al consultar disponibilidad de bus');
      })

  }

  async consultarDetallesServicios(fecha_json: string, codigo_bus: string) {

    await this.operacionesService.getByBusAndFecha(codigo_bus, fecha_json).toPromise().then(resp => {
      this.listDetalleServicios = [];
      resp.forEach((resp) => {
        let res: DetalleServicio = {
          id: resp.idDetalleServicio,
          busVirtual: resp.busVirtual,
          horaInicio: resp.horaInicio,
          horaFin: resp.horaFin,
          idServicio: resp.linea
        }
        this.listDetalleServicios.push(res);
      })
    }).catch((error) => {
      console.error('Error al consultar detalles');
    });

  }

  async consultarNovedadesDetalle(id_novedad: number) {

    await this.novedadDetalleService.consultarByNovedad(id_novedad).toPromise()
      .then((resp) => {

        this.listaDeDetallesGuardados = resp;

      }).catch((error) => {

      })

  }

  consultarTiposNovedad() {
    this.tiposNovedadServicio.consultarByIdTipoNovedad(2).subscribe(resp => {
      this.tiposDeNovedad = resp;
    }, error => {
      console.error('Error al consultar TiposNovedad');
    })
  }

  consultarSitios() {
    this.sitioService.listar().subscribe(resp => {
      this.tiposDeSitio = resp;
    }, error => {
      console.error('Error al consultar Sitios');
    });
  }

  consultarBuses() {
    this.busService.consultarBusesActivos().subscribe(resp => {
      this.tiposDeBus = resp;
    }, error => {
      console.error('Error al consultar Buses');
    });
  }

  setNuevoBus() {
    this.busService.consultarBusPorCodigo(this.element.novedad.valorNuevo).subscribe(resp => {

      let objetoEncontrado = this.tiposDeBus.find(bus => bus.id === resp.id);

      if (!!objetoEncontrado)
        this.myForm.patchValue({
          idNuevoBus: objetoEncontrado,
        });

    }, error => {

    }, () => {
      this.myForm.controls.idNuevoBus.setValidators([Validators.required])
      this.myForm.controls.idNuevoBus.updateValueAndValidity()
    })

  }


  async pendiente() {

    this.myForm.touched

    if (this.myForm.invalid)
      return;

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
      valorNuevo: this.myForm.controls.idDisponibilidadBus.value[0].idBus.codigo,
      idDisponibilidadBus: this.myForm.controls.idDisponibilidadBus.value[0],

    }

    let respuesta;

    await this.novedadesService.pendiente(novedad, true).toPromise()
      .then(resp => {
        respuesta = resp.id;
      })
      .catch(error => {
        GeneralUtil.MENSAJE('No se registro ni se actualizo ningun dato de la novedad.', 'error');
        this.closeDialog(false)
      })

    await this.crearNovedaDetalle(respuesta);

  }

  async crearNovedaDetalle(id_novedad: number) {
    let listDetalle: NovedadDetalle[] = [];

    debugger;

    this.servicios._value.forEach((ser: any) => {
      listDetalle.push({
        id: null,
        idDetalleServicio: ser.id,
        idEstado: null,
        idNovedad: id_novedad,
        idTipo: null
      })
    })



    await this.novedadDetalleService.crearAll(listDetalle).toPromise().then(resp => {

      GeneralUtil.MENSAJE('Se creo la novedad.', 'success');
      this.closeDialog(true);

    })

  }

  async actualizarNovedaDetalle(id_novedad: number) {
    let listDetalle: NovedadDetalle[] = [];

    debugger;

    this.servicios._value.forEach((ser: any) => {
      listDetalle.push({
        id: null,
        idDetalleServicio: ser.id,
        idEstado: null,
        idNovedad: id_novedad,
        idTipo: null
      })
    })



    await this.novedadDetalleService.crearAll(listDetalle).toPromise().then(resp => {

    })
      .catch(error => {
        GeneralUtil.MENSAJE('No se registro ni se actualizo ningun dato de la novedad.', 'error');
        this.closeDialog(false)
      });

  }

  async reportar() {

    this.myForm.touched

    if (this.myForm.invalid)
      return;

    debugger;
    let novedad: Novedad = {
      id: this.myForm.controls.id.value,
      fecha: new Date(),
      fechaInicio: new Date(),
      fechaFin: undefined,
      idTipo: this.myForm.controls.idTipoNovedad.value,
      idSitio: this.myForm.controls.idSitio.value,
      motivo: this.myForm.controls.motivo.value,
      idEstado: new Catalogo(36),// Reportada
      idDetalleServicio: this.idDetalleServicio,
      idBus: this.idBus,
      idOperador: this.idOperador,
      valorNuevo: this.myForm.controls.idDisponibilidadBus.value[0].idBus.codigo,
      idDisponibilidadBus: this.myForm.controls.idDisponibilidadBus.value[0],

    }

    let respuesta;

    await this.novedadesService.pendiente(novedad, true).toPromise()
      .then(resp => {
        respuesta = resp;
      })
      .catch(error => {
        GeneralUtil.MENSAJE('No se registro ni se actualizo ningun dato de la novedad.', 'error');
        this.closeDialog(false)
      });



    await this.actualizarNovedaDetalle(respuesta.id);

    await this.novedadesService.reportada(respuesta, true).toPromise()
      .then(resp => {
        respuesta = resp;

        GeneralUtil.MENSAJE('Se reporto la novedad.', 'success');
        this.closeDialog(true);
      })
      .catch(error => {
        GeneralUtil.MENSAJE('No se registro ni se actualizo ningun dato de la novedad.', 'error');
        this.closeDialog(false)
      });

  }

  sect() {
    if (this.servicios.options.first.selected) {
      this.servicios.deselectAll();
    } else {
      this.servicios.selectAll();
    }
  }

  selectedSelect(o1: any, o2: any): boolean {
    return !o1 || !o2 || !o1.codigo || !o2.codigo ?
      false : (o1.codigo === o2.codigo && o1.id === o2.id);
  }

  closeDialog(element: any) {
    this.dialogRef.close(element);
  }

}
