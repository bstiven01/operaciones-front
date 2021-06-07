import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralUtil } from 'src/utils/general.util';
import { BusService } from 'src/services/bus.service';
import { ServicioService } from 'src/services/servicio.service';
import { DetalleServicio } from 'src/models/detalle-servicio.model';
import { ActivatedRoute, Router } from '@angular/router';
import { OperadorService } from 'src/services/operador.service';
import { DetalleServicioService } from 'src/services/detalle-servicio.service';
import { Catalogo } from 'src/models/catalogo.model';
import { NovedadesService } from 'src/services/novedad.service';
import { TipoNovedad } from 'src/models/tipo-novedad.model';

@Component({
  selector: 'app-crear-servicio',
  templateUrl: './crear-servicio.component.html',
  styleUrls: ['./crear-servicio.component.scss']
})
export class CrearServicioComponent implements OnInit {

  // FORMULARIO
  myForm: FormGroup;

  // listas para formulario
  todate: Date;
  buses = [];
  servicios = [];
  serviciosAgregar: DetalleServicio[] = [];
  serviciosHijos = [];
  infoConductor = null;
  operador = null;
  mensajeSpiner: string;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private busService: BusService,
    private servicioService: ServicioService,
    private route: ActivatedRoute,
    private operadorService: OperadorService,
    private detalleServicioService: DetalleServicioService,
    private novedadesService: NovedadesService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.buildFormModal();
    this.consultarBuses();
    this.consultarServicios();

    this.route.queryParams.subscribe(params => {
      this.infoConductor = params;
      this.consultarOperador();
    });

    console.log(GeneralUtil.RETORNAR_FECHA_JSONUTCBogota(new Date()))

  }

  consultarOperador() {
    this.operadorService.consultarOperadorByCodigo(this.infoConductor.codigoConductor).subscribe(resp => {
      this.operador = resp;
    }, error => {
      console.error('Error al consultarBuses');
    });
  }

  buildFormModal() {
    this.myForm = this.formBuilder.group({
      idServicio: [undefined, [Validators.required]],
      horaInicio: [undefined, [Validators.required]],
      horaFin: [undefined, [Validators.required]],
      cantidad: [undefined, [Validators.required]],
    });
  }

  eliminarServicio(id) {
    this.serviciosAgregar.splice(id, 1);
  }

  consultarBuses() {
    this.busService.consultarBusesActivos().subscribe(resp => {
      this.buses = resp;
    }, error => {
      console.error('Error al consultarBuses');
    });
  }

  consultarServicios() {
    this.servicioService.consultarServiciosPadre().subscribe(resp => {
      this.servicios = resp;
    }, error => {
      console.error('Error al consultarBuses');
    });
  }

  consultarServiciosPorId() {
    this.servicioService.consultarServiciosPorId(this.myForm.value.idServicio.id).subscribe(resp => {
      this.serviciosHijos = resp;
      this.cargarserviciosAgregar();
    }, error => {
      console.error('Error al consultarBuses');
    });
  }

  submit() {
    if (this.myForm.value.horaInicio > this.myForm.value.horaFin) {
      GeneralUtil.MENSAJE('La hora inicial debe ser menos a la final', 'error');
      return;
    }
    this.serviciosAgregar = [];
    this.consultarServiciosPorId();
  }

  enviarServicios() {
    let servicioEnviar = this.serviciosAgregar;
    let mensaje: string;
    mensaje = 'Servicio reportado';
    GeneralUtil.CONFIRMACION().subscribe(resp => {
      this.spinner.show();
      if (resp) {
        this.detalleServicioService.crear(servicioEnviar).subscribe(resp => {
          this.spinner.hide();
          GeneralUtil.MENSAJE(mensaje, 'success');
          this.enviarNovedad();
        }, error => {
          this.spinner.hide();
          GeneralUtil.MENSAJE('No se agregó ningún servicio.', 'error');
        });

      }
    });
  }

  selectedSelect(o1: any, o2: any): boolean {
    return !o1 || !o2 || !o1.codigo || !o2.codigo ?
      false : (o1.codigo === o2.codigo && o1.id === o2.id);
  }

  cargarserviciosAgregar() {

    let horas = this.calcularHoras();
    let servicios = [];

    for (let i = 0; i < this.myForm.value.cantidad; i++) {
      for (let j = 0; j < this.serviciosHijos.length; j++) {
        servicios.push(this.serviciosHijos[j]);
      }
    }

    for (let i = 0; i < servicios.length; i++) {
      let detalleServicio = new DetalleServicio (
        undefined,
        GeneralUtil.CURRENT_DATE_STRING() + "T" + horas[i]['inicio'],
        GeneralUtil.CURRENT_DATE_STRING() + "T" + horas[i]['fin'],
        undefined,
        undefined,
        1,
        189,
        undefined,
        servicios[i].id,
        this.operador.id,
        this.infoConductor.idBus,
        902,
        902,
        0,
        this.infoConductor.codigoBus,
      );// = new DetalleServicio();

      if (this.infoConductor.tipoServicio === 'DISPO') {
        detalleServicio.idTabla = 260;
      } else if (this.infoConductor.tipoServicio === 'DISPO-R') {
        detalleServicio.idTabla = 261;
      } else if (this.infoConductor.tipoServicio === 'PATIO-N') {
        detalleServicio.idTabla = 268;
      }
      this.serviciosAgregar.push(detalleServicio);
    }

  }

  buscarNombreServicioHijo(id) {
    return this.serviciosHijos.find(ser => ser.id === id).nombre;
  }

  calcularHoras() {
    let horaInicio = GeneralUtil.TIME_TO_DECIMAL(this.myForm.value.horaInicio);
    let horaFin = GeneralUtil.TIME_TO_DECIMAL(this.myForm.value.horaFin);
    let cantidad = (this.myForm.value.cantidad * this.serviciosHijos.length);
    let diferencia = (horaFin - horaInicio) / cantidad;
    let horas = [];

    for (let i = 0; i < cantidad; i++) {
      const hora = {
        inicio: GeneralUtil.CONVERT_NUMBER_TO_TIME(horaInicio + (diferencia * i)),
        fin: GeneralUtil.CONVERT_NUMBER_TO_TIME(horaInicio + (diferencia * (i + 1)))
      };
      horas.push(hora);
    }
    return horas;
  }

  enviarNovedad() {
    let estadoEnviar: Catalogo;
    let mensaje: string;

    estadoEnviar = { id: 36, codigo: 'NOV_REPORTADA', nombre: undefined, descripcion: undefined, idCatalogo: undefined }; // Reportado
    mensaje = 'Novedad reportada';

    let novedadEnviar: any;
    let motivo = 'SERVICIO';

    if (this.infoConductor.tipoServicio === 'DISPO' || this.infoConductor.tipoServicio === 'DISPO-R')
      motivo = 'PROGRAMADO';

    if (this.infoConductor.tipoServicio === 'PATIO-N')
      motivo = 'OFRECIDO';

    novedadEnviar = {
      id: undefined,
      fecha: new Date(),
      fechaInicio: new Date(),
      fechaFin: new Date(),
      valorAnterior: undefined,//this.infoConductor.codigoConductor,
      valorNuevo: undefined,//this.infoConductor.codigoConductor,
      motivo: motivo,
      idDetalleServicio: this.infoConductor.idDetalleServicio,
      idEstado: estadoEnviar,
      idTipo: new TipoNovedad(107),
    };

    this.novedadesService.crearNovedadExtraordinaria(novedadEnviar).subscribe(resp => {
      this.spinner.hide();
      GeneralUtil.MENSAJE(mensaje, 'success');
      this.router.navigate(['/operacion']);
    }, error => {
      this.spinner.hide();
      GeneralUtil.MENSAJE('No se  registro ni se actualizo ningun dato de la novedad.', 'error');
      console.log(error);
    });

  }

}
