import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { NovedadCambioBusComponent } from 'src/app/novedad/novedad-cambio-bus/novedad-cambio-bus.component';
import { NovedadCambioOperadorComponent } from 'src/app/novedad/novedad-cambio-operador/novedad-cambio-operador.component';
import { NovedadSinCambioComponent } from 'src/app/novedad/novedad-sin-cambio/novedad-sin-cambio.component';
import { NovedadesService } from 'src/services/novedad.service';
import { GeneralUtil } from 'src/utils/general.util';

@Component({
  selector: 'app-reporte-operacion',
  templateUrl: './reporte-operacion.component.html',
  styleUrls: ['./reporte-operacion.component.scss']
})
export class ReporteOperacionComponent implements OnInit {

  payload: any[];
  loading: boolean;
  data: any;
  idNovedad;

  cols: any[] = [
    { field: 'fecha', header: 'FECHA', width: '30%' },
    { field: 'idTipo.nombre', header: 'TIPO', width: '30%' },
    { field: 'motivo', header: 'MOTIVO', width: '70%' },
    { field: 'editar', header: 'MOTIVO', width: '30%' }
  ];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Fecha', 'Tipo', 'Estado', 'Motivo', 'Ver'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  configuracion_bus = { id: 1, nombre: 'BUS', nombre_pascal: 'Bus', color: 'primary', icono: 'directions_bus' };
  configuracion_servicio = { id: 2, nombre: 'SERVICIO', nombre_pascal: 'Servicio', color: 'primary', icono: 'pin_drop' }
  configuracion_operador = { id: 3, nombre: 'OPERADOR', nombre_pascal: 'Operador', color: 'primary', icono: 'airline_seat_recline_normal' }

  reportar = { id: 2, nombre: 'REPORTAR', nombre_pascal: 'Reportar' }

  constructor(private novedadService: NovedadesService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
    ) { }


  ngOnInit() {
    this.cargarNovedades();
    this.consultaGraficoHome();
  }

  consultaGraficoHome() {
    this.loading = true;
    this.novedadService.consultaGraficoHome().subscribe((resp) => {
      this.data = {
        labels: resp.label,
        datasets: [
          {
            data: resp.data,
            backgroundColor: resp.colores,
            hoverBackgroundColor: resp.colores
          }]
      };

    }, error => {
      console.error(error);
    });
  }

  abrirModalNovedad(id) {
    this.idNovedad = id;
  }

  /*consultaNovedadesHome() {
    this.loading = true;
    this._novedadesService.consultaNovedadesHome().subscribe((resp) => {
      this.payload = resp;
      this.loading = false;

    }, error => {
      console.error(error);
    });
  }*/

  recibirSalida(e) {
    this.cargarNovedades();
    //this.consultaNovedadesHome();
    this.consultaGraficoHome();
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  // Line chart
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  cargarNovedades() {
    this.spinner.show();
    this.novedadService.consultaNovedadesHome().subscribe(resp => {
      this.dataSource = new MatTableDataSource(resp);
      this.spinner.hide();

    }, error => {
      this.spinner.hide();
      GeneralUtil.MENSAJE('¡Error del Sistema!', 'error');
    }, () => {
      this.cargarComplementoTable();
    });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toUpperCase();
  }

  cargarComplementoTable() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data: any, filtro) => {
      const dataStr = JSON.stringify(data).toUpperCase();
      return dataStr.indexOf(filtro.toUpperCase()) !== -1;
    };

    /*this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'ideps.nombre': return item.ideps.nombre;
        default: return item[property];
      }
    };*/
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
        this.cargarNovedades();
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
        this.cargarNovedades();
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
        this.cargarNovedades();
      }
    });
  }


}
