import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Catalogo } from 'src/models/catalogo.model';
import { Operador } from 'src/models/operador.model';
import { OperadorService } from 'src/services/operador.service';
import { GeneralUtil } from 'src/utils/general.util';
import { FormularioOperadorComponent } from './formulario-operador/formulario-operador.component';

@Component({
  selector: 'app-administracion-operador',
  templateUrl: './administracion-operador.component.html',
  styleUrls: ['./administracion-operador.component.scss']
})
export class AdministracionOperadorComponent implements OnInit {

  operador: Operador;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['codigo', 'numeroDocumento', 'primerNombre', 'primerApellido', 'Editar'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private operadorService: OperadorService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit() {
    this.cargarOperadores();
  }

  cargarOperadores() {
    this.spinner.show();
    this.operadorService.consultarTodos().subscribe(resp => {
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

  openDialog(operador?: Operador): void {
    let dialogRef;

    const width = '650px';
    const height = '465px';

    if (operador !== undefined) {
      dialogRef = this.dialog.open(FormularioOperadorComponent, {
        width: width,
        height: height,
        data:
        {
          id: operador.id,
          codigo: operador.codigo,
          numeroDocumento: operador.numeroDocumento,
          primerNombre: operador.primerNombre,
          segundoNombre: operador.segundoNombre,
          primerApellido: operador.primerApellido,
          segundoApellido: operador.segundoApellido,
          vigenciaLicencia: operador.vigenciaLicencia,
          fechaContratacion: operador.fechaContratacion,
          idTipoDocumento: operador.idTipoDocumento,
          idCategoriaLicencia: operador.idCategoriaLicencia,
          idRh: operador.idRh,
          idEps: operador.idEps,
          idArl: operador.idArl,
          idEstado: operador.idEstado
        },

      });
    } else {
      dialogRef = this.dialog.open(FormularioOperadorComponent, {
        width: width,
        height: height,
        data: {}
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.cargarOperadores();
      }
      this.cargarOperadores();
    });
  }

  deshabilitarOperador(operador: Operador) {
    GeneralUtil.CONFIRMACION('¿Está seguro que desea deshabilitar el operador?')
      .subscribe((resp: boolean) => {
        if (resp) {

          operador.idEstado = new Catalogo(62);

          this.operadorService.actualizarOperador(operador).subscribe(resp => {
            this.cargarOperadores();
            GeneralUtil.MENSAJE('Se deshabilito correctamente el Operador', 'success');
          }, error => {
            GeneralUtil.MENSAJE('Error deshabilitando el Operador', 'error');
          });

        }
      });


  }


}
