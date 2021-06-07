import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { OperadorService } from 'src/services/operador.service';
import { GeneralUtil } from 'src/utils/general.util';
import { NgxSpinnerService } from 'ngx-spinner';
import { NovedadesService } from 'src/services/novedad.service';
import { OperacionesService } from 'src/services/operaciones.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-consulta-operador',
  templateUrl: './consulta-operador.component.html',
  styleUrls: ['./consulta-operador.component.scss']
})
export class ConsultaOperadorComponent implements OnInit {

  // FORMULARIO
  myForm: FormGroup;

  myForm2: FormGroup;

  // banderas usadas en el html
  banderaDatos: boolean;

  numeroNovedades = 0;

  infoOperador: any = null;
  operacionActual: any = null;

  novedades: any[];

  //#region variables
  // @ViewChild('dt', { static: false }) table: Table;
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


  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Fecha', 'Tipo', 'Estado', 'Motivo', 'Ver'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private operadorService: OperadorService,
    private spinner: NgxSpinnerService,
    private novedadService: NovedadesService
  ) { }

  ngOnInit() {

    this.buildCleanForm();
    this.buildElementsTable();
  }

  public buildCleanForm() {

    this.myForm = this.formBuilder.group({
      id: [undefined],
      codigo: [undefined, [Validators.required]],
      numeroDocumento: [''],
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: ['',],
      vigenciaLicencia: ['',],
      fechaContratacion: [''],
      idTipoDocumento: [''],
      idCategoriaLicencia: [''],
      idRh: [''],
      idEps: [''],
      idArl: [''],
      idEstado: [''],
      nombres: [''],
      apellidos: [''],
    });

    // this.myForm.valueChanges.subscribe(console.log);

  }

  consultarOperadorByCodigo() {


    this.spinner.show();
    this.operadorService.consultarOperadorHVByCodigo(this.myForm.controls.codigo.value).subscribe(resp => {
      this.spinner.hide();
      this.cargarNovedades(resp.id);

      if (resp !== null && resp !== undefined) {

        this.banderaDatos = true;
        this.infoOperador = resp;
        this.myForm = this.formBuilder.group({
          id: [resp.id],
          codigo: [resp.codigo, [Validators.required]],
          numeroDocumento: [resp.numeroDocumento],
          primerNombre: [resp.primerNombre],
          segundoNombre: [resp.segundoNombre],
          primerApellido: [resp.primerApellido],
          segundoApellido: [resp.segundoApellido],
          vigenciaLicencia: [resp.vigenciaLicencia],
          fechaContratacion: [resp.fechaContratacion],
          estado: [resp.idEstado.nombre],
          idTipoDocumento: [resp.idTipoDocumento],
          idCategoriaLicencia: [resp.idCategoriaLicencia],
          idRh: [resp.idRh.nombre],
          idEps: [resp.idEps.nombre],
          idArl: [resp.idArl.nombre],
          idEstado: [resp.idEstado],
          nombres: [resp.primerNombre + ' ' + resp.segundoNombre],
          apellidos: [resp.primerApellido + ' ' + resp.segundoApellido],
        });
        // this.listarNovedades();
        this.loadTable();
        this.operacionActual = resp['operacionActual'];

      } else {
        this.spinner.hide();
        GeneralUtil.MENSAJE('No se ha encontrado resultados.', 'error');
        this.banderaDatos = false;
      }


    }, error => {
      GeneralUtil.MENSAJE('No se ha encontrado resultados.', 'error');
      this.banderaDatos = false;


    });

  }

  buildElementsTable() {
    this.cols = [
      { field: 'fecha', header: 'FECHA', totalfield: 'fecha', width: '100px' },
      { field: 'idTipo', subfield: 'nombre', totalfield: 'idTipo.nombre', header: 'TIPO', width: '100px' },
      { field: 'idEstado', subfield: 'nombre', totalfield: 'idEstado.nombre', header: 'ESTADO', width: '100px' },
      { field: 'idSitio', subfield: 'sitio', totalfield: 'idSitio.nombre', header: 'SITIO', width: '100px' },
      { field: 'valorAnterior', totalfield: 'valorAnterior', header: 'ANTERIOR', width: '100px' },
      { field: 'valorNuevo', totalfield: 'valorNuevo', header: 'NUEVO', width: '100px' },
      { field: 'motivo', header: 'MOTIVO', totalfield: 'motivo', width: '450px' }
    ];
    this._selectedColumns = this.cols;

    this.myForm2 = this.formBuilder.group({
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

  }


  // listarNovedades() {
  //   const filtro = { codigoOperador: this.myForm.value.codigo };
  //   this.novedadService.consultaExpecifica(filtro).subscribe((resp) => {
  //     this.numeroNovedades = resp;
  //   }, error => {
  //     console.error(error);
  //   });
  // }

  selectedSelect(o1: any, o2: any): boolean {
    return o1 === undefined || o1 === null ||
      o2 === undefined || o2 === null ||
      o1.codigo === undefined || o1.codigo === null ||
      o2.codigo === undefined || o2.codigo === null ?
      false : (o1.codigo === o2.codigo && o1.id === o2.id);
  }

  loadTable() {
    const filtro = { codigoOperador: this.myForm.value.codigo };

    this.novedadService.consultaExpecifica(filtro).subscribe(resp => {
      this.payload = resp;
    });
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


  cargarNovedades(id_operador: number) {
    this.spinner.show();
    this.novedadService.getByOperador(id_operador).subscribe(resp => {
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

}
