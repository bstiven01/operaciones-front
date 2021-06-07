import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Table } from 'primeng/table/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CargueService } from 'src/services/cargue.service';
import { GeneralUtil } from 'src/utils/general.util';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-consultar-archivo',
  templateUrl: './consultar-archivo.component.html',
  styleUrls: ['./consultar-archivo.component.scss']
})
export class ConsultarArchivoComponent implements OnInit {

  //#region Variables
  @Input() tipoConsulta: string;
  @Input() tipo: string;
  @ViewChild('dt', { static: false }) table: Table;
  public formulario: FormGroup;
  loading: boolean;
  _selectedColumns: any[];
  cols: any[];
  payload: any[];
  mensajeSpiner: string;

  //#endregion

  constructor(private formBuilder: FormBuilder,
              private _cargueService: CargueService) { }

  ngOnInit() {
    this.buildForm();
  
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.tipoConsulta);
    this.consultaCargue();
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

  private buildForm() {
    this.cols = [
      { field: 'nombreArchivo', header: 'NOMBRE ARCHIVO', textoAlternativo:'NOMBRE ARCHIVO', width: '300px' },
      { field: 'fechaCargue', header: 'FECHA', textoAlternativo:'FECHA', width: '200px' },
      { field: 'idEstado',subfield:'nombre',fullfield:'idEstado.nombre',header: 'ESTADO',textoAlternativo:'ESTADO', width: '100px' },
      { field: 'boton',header: '',textoAlternativo:'ARCHIVO', width: '100px' }
    ];
    this._selectedColumns = this.cols;
    this.formulario = this.formBuilder.group({
      Ffecha: [''],
      FnombreArchivo: [''],
      FidEstado: [''],
      selectedColumns: [''],
    });
  }

  resetTable() {
    this.payload = [];
    this.loading = false;
    this.table.sortOrder = 0;
    this.table.sortField = '';
    //this.table.reset();
  }

  consultaCargue() {
    this.loading = true;
    this._cargueService.consultaExpecificaCargue(this.tipoConsulta, this.tipo).subscribe((resp) => {
      this.resetTable();
      this.payload = resp;
    }, error => {
      if(error.status != 500)
        {
          GeneralUtil.MENSAJE(error.statusText, 'error');
        }else{
          GeneralUtil.MENSAJE(error.mensajePeticion, 'error');
        }
      this.resetTable();
    });
  }

  exportarReporte(nombre, codigoEstado) {

    this.mensajeSpiner = 'DESCARGANDO';
    if(codigoEstado === 'ESTADO_ERRONEO'){
      const variable = nombre.split('.');
      nombre = variable[0] + 'ERROR.'+variable[1]; 
    }
    this._cargueService.descargarArchivoError(nombre).subscribe(blob => {
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, nombre);
      } else {
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.download = nombre;
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      GeneralUtil.MENSAJE("Se ha descargado el archivo.", 'success');
    }, error => {
        if(error.status != 500)
        {
          GeneralUtil.MENSAJE(error.statusText, 'error');
        }else{
          GeneralUtil.MENSAJE(error.mensajePeticion, 'error');
        }
    });
  }
  
}
