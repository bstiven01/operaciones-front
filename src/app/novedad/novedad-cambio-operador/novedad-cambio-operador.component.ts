import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSelectionList, MatSelectionListChange, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { Bus } from 'src/models/bus.model';
import { Catalogo } from 'src/models/catalogo.model';
import { DetalleServicio } from 'src/models/detalle-servicio.model';
import { DisponibilidadOperador } from 'src/models/disponibilidad-operador.model';
import { NovedadDetalle } from 'src/models/novedad-detalle.model';
import { Novedad } from 'src/models/novedad.model';
import { Operador } from 'src/models/operador.model';
import { TipoNovedad } from 'src/models/tipo-novedad.model';
import { DisponibilidadOperadorService } from 'src/services/disponibilidad-operador.service';
import { NovedadDetalleService } from 'src/services/novedad-detalle.service';
import { NovedadesService } from 'src/services/novedad.service';
import { OperacionesService } from 'src/services/operaciones.service';
import { SitioService } from 'src/services/sitio.service';
import { TipoNovedadService } from 'src/services/tipo-novedad.service';
import { GeneralUtil } from 'src/utils/general.util';

@Component({
  selector: 'app-novedad-cambio-operador',
  templateUrl: './novedad-cambio-operador.component.html',
  styleUrls: ['./novedad-cambio-operador.component.scss']
})
export class NovedadCambioOperadorComponent implements OnInit {

  myForm: FormGroup;

  tiposDeNovedad: TipoNovedad[];
  tiposDeSitio: any[];
  mensajeCampoRequerido = 'Campo Requerido';

  listDetalleServicios: DetalleServicio[];
  listDiponibilidadOperadores: DisponibilidadOperador[];

  nombre_operador: string;
  codigo_operador: string;

  @ViewChild('disponibilidadOperadores', { static: true }) disponibilidadOperadores: MatSelectionList;
  @ViewChild('servicios', { static: true }) servicios: MatSelectionList;

  idDetalleServicio: any;
  idBus: any;
  idOperador: any;
  valorNuevo: string;

  banderaBotones: boolean;

  listaDeDetallesGuardados: NovedadDetalle[];

  objectNovedad: Novedad;


  constructor(
    private tiposNovedadServicio: TipoNovedadService,
    private fb: FormBuilder,
    private sitioService: SitioService,
    public dialogRef: MatDialogRef<NovedadCambioOperadorComponent>,
    @Inject(MAT_DIALOG_DATA) public element: any,
    private operacionesService: OperacionesService,
    private novedadDetalleService: NovedadDetalleService,
    private novedadesService: NovedadesService,
    private disponibilidadOperadorService: DisponibilidadOperadorService,
  ) {

  }

  async ngOnInit() {

    this.consultarTiposNovedad();
    this.consultarSitios();

    if (!!this.element.novedad) {

      this.objectNovedad = this.element.novedad;
      await this.buildFromNovedad();

      let fecha = this.objectNovedad.idDetalleServicio.horaInicio.substring(0, 19);
      if (this.banderaBotones) {
        //await this.consultarDisponibilidadOperadores();
        this.listDiponibilidadOperadores = [];
        this.listDiponibilidadOperadores.push(this.objectNovedad.idDisponibilidadOperador);
        //await this.consultarDetallesServicios(fecha, this.element.novedad.idOperador.codigo);
        await this.consultarNovedadesDetalle(this.objectNovedad.id);
        this.listDetalleServicios = [];
        this.listaDeDetallesGuardados.forEach((resp) => {
          this.listDetalleServicios.push(resp.idDetalleServicio);
        })
        /*this.disponibilidadOperadores.options.forEach((element) => {

          if (this.element.novedad.idDisponibilidadOperador.id === element.value.id) {
            element.selected = true;
            this.valorNuevo = element.value.idOperador.codigo;
          } else {

          }
        })*/

      } else {
        await this.consultarDisponibilidadOperadores();
        await this.consultarDetallesServicios(fecha, this.element.novedad.idOperador.codigo);
        await this.consultarNovedadesDetalle(this.element.novedad.id);
      }



    } else if (!!this.element.detalle) {
      debugger;
      this.buildFromDetalle();
      this.consultarDisponibilidadOperadores();
      let fecha = GeneralUtil.FECHA_STRING_DETALLE_TO_JSON(this.element.detalle.fecha + '-' + this.element.detalle.horaInicio)
      this.consultarDetallesServicios(fecha, this.element.detalle.codigoConductor);
    }

    this.disponibilidadOperadores.selectionChange.subscribe((s: MatSelectionListChange) => {
      this.disponibilidadOperadores.deselectAll();
      s.option.selected = true;
      this.valorNuevo = s.option.value.idOperador.codigo;
      console.log(s)
      debugger;
      this.myForm.patchValue({
        //idDisponibilidadOperador: s.option.value
      });
    });

    /*this.servicios.selectionChange.subscribe((s: MatSelectionListChange) => {
      console.log(s)
      this.myForm.patchValue({
      servicios: s.option.value
      });
    });*/

    this.disponibilidadOperadores.options.forEach((element) => {

      if (this.element.novedad.idDisponibilidadOperador.id === element.value.id) {
        element.selected = true;
        this.valorNuevo = element.value.idOperador.codigo;
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
      servicios: [undefined, [Validators.required]],
      idDisponibilidadOperador: [undefined, [Validators.required]],
    });

  }

  buildFromDetalle() {

    this.myForm = this.fb.group({
      id: [undefined],
      idTipoNovedad: [undefined, [Validators.required]],
      idSitio: [undefined, [Validators.required]],
      motivo: [undefined, [Validators.required, Validators.maxLength(50)]],
      servicios: [undefined, [Validators.required]],
      idDisponibilidadOperador: [undefined, [Validators.required]],
    });
    debugger;
    this.idDetalleServicio = new DetalleServicio(this.element.detalle.idDetalleServicio);
    this.idBus = new Bus(this.element.detalle.idBus);
    this.idOperador = new Operador(this.element.detalle.idConductor);

    this.nombre_operador = this.element.detalle.nombreCompletoCondutor;
    this.codigo_operador = this.element.detalle.codigoConductor;

  }

  async buildFromNovedad() {
    debugger;
    let novedad = this.element.novedad;

    this.myForm = this.fb.group({
      id: [novedad.id],
      idTipoNovedad: [novedad.idTipo, [Validators.required]],
      idSitio: [novedad.idSitio, [Validators.required]],
      motivo: [novedad.motivo, [Validators.required, Validators.maxLength(50)]],
      servicios: [undefined, [Validators.required]],
      idDisponibilidadOperador: [undefined, [Validators.required]],
    });
    debugger;
    this.idDetalleServicio = novedad.idDetalleServicio;
    this.idBus = novedad.idBus;
    this.idOperador = novedad.idOperador;

    this.nombre_operador =
      novedad.idOperador.primerNombre + ' ' +
      novedad.idOperador.segundoNombre + ' ' +
      novedad.idOperador.primerApellido + ' ' +
      novedad.idOperador.segundoApellido;

    this.codigo_operador = novedad.idOperador.codigo;

    this.banderaBotones = !!this.element.novedad.id && this.element.novedad.idEstado.codigo === 'NOV_REPORTADA' ? true : false

    if (this.banderaBotones) {
      this.myForm.disable()
    }

  }

  consultarTiposNovedad() {
    this.tiposNovedadServicio.consultarByIdTipoNovedad(1).subscribe(resp => {
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

  async consultarDetallesServicios(fecha_json: string, codigo_operador: string) {

    await this.operacionesService.getByOperadorAndFecha(codigo_operador, fecha_json).toPromise().then(resp => {
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

  async consultarNovedadesDetalleGuardados(id_novedad: number) {

    await this.novedadDetalleService.consultarByNovedad(id_novedad).toPromise()
      .then((resp) => {
        this.listDetalleServicios = []
        resp.forEach((element) => {
          this.listDetalleServicios.push(element.idDetalleServicio)
        })


      }).catch((error) => {

      })

  }

  async consultarDisponibilidadOperadores() {

    await this.disponibilidadOperadorService.readByEstado(162).toPromise().then((resp) => {
      this.listDiponibilidadOperadores = resp;
    }).catch((error) => {
      console.error('Error al consultar disponibilidad de operadores');
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
      valorNuevo: this.valorNuevo,
      idDisponibilidadOperador: this.myForm.controls.idDisponibilidadOperador.value[0],

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



    await this.crearNovedaDetalle(respuesta)


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
      valorNuevo: this.valorNuevo,
      idDisponibilidadOperador: this.myForm.controls.idDisponibilidadOperador.value[0],

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
