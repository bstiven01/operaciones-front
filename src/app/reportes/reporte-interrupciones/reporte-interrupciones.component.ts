import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatPaginator, MatSort, MatStepper, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportesService } from 'src/services/reportes.service';
import { GeneralUtil } from 'src/utils/general.util';
import { validateGreaterThan, validateSmallerThan, convertStringThousandsToInteger } from 'src/validators/validators';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReporteInterrupcion } from 'src/models/reporte-interrupcion.model';
import { Catalogo } from 'src/models/catalogo.model';



@Component({
  selector: 'app-reporte-interrupciones',
  templateUrl: './reporte-interrupciones.component.html',
  styleUrls: ['./reporte-interrupciones.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReporteInterrupcionesComponent implements OnInit {

  constructor(
    private spinner: NgxSpinnerService,
    private _reporteServicio: ReportesService,
    private fb: FormBuilder
  ) { }
  mensajeSpiner: string;
  ejecutado: string;
  eliminado: string;
  adicional: string;
  perdido: string;
  total: number;
  ejecutadoTransmi: string;
  eliminadoTransmi: string;
  adicionalTransmi: string;
  perdidoTransmi: string;
  totalTransmi: number;

  data: any;


  myFormTransmilenio: FormGroup;

  list_empresas: any[];
  empresa_ejecutado: any = 0;
  empresa_adicional: any = 0;
  empresa_eliminado: any = 0;
  empresa_perdido: any = 0;

  isLinear = true;

  myFormFechas: FormGroup;


  siguiente = 'SIGUIENTE';
  atras = 'ATRAS';

  //dataSource = ELEMENT_DATA;
  columnsToDisplay = ['fechaInicial', 'fechaFinal', 'externoTotal', 'empresaTotal'];
  expandedElement: PeriodicElement | null;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  ngOnInit() {
    //this.cargarGrafica();


    this.buildFormFechas();
    this.buildForm();

    this.consultar();


  }

  buildForm() {

    this.myFormTransmilenio = this.fb.group({
      ejecutado: [, [Validators.required, validateGreaterThan(this.empresa_ejecutado)]],
      adicional: [, [Validators.required, validateGreaterThan(this.empresa_adicional)]],
      eliminado: [, [Validators.required, validateSmallerThan(this.empresa_eliminado)]],
      perdido: [, [Validators.required, validateSmallerThan(this.empresa_perdido)]],
    });

  }

  buildFormFechas() {
    this.myFormFechas = this.fb.group({
      fecha_inicial: [undefined, [Validators.required]],
      fecha_final: [undefined, [Validators.required]],
    });
  }

  cargarGrafica() {
    this.spinner.show();
    this.mensajeSpiner = 'PROCESANDO';
    this._reporteServicio.consultarGraficaReporteInterrupciones().subscribe(x => {
      this.spinner.hide();
      this.data = x;
    }, error => {
      this.spinner.hide();
      if (error.status != 500) {
        GeneralUtil.MENSAJE(error.statusText, 'error');
      } else {
        GeneralUtil.MENSAJE(error.mensajePeticion, 'error');
      }
    });
  }

  calcular() {
    this.spinner.show();
    this.mensajeSpiner = 'PROCESANDO';
    this._reporteServicio.consultarReporteInterrupciones().subscribe(x => {
      this.spinner.hide();
      this.ejecutado = x.ejecutado;
      this.eliminado = x.eliminado;
      this.adicional = x.adicional;
      this.perdido = x.perdido;
      this.total = Number.parseInt(this.ejecutado) + Number.parseInt(this.adicional) - Number.parseInt(this.perdido) - Number.parseInt(this.eliminado);
    }, error => {
      this.spinner.hide();
      if (error.status != 500) {
        GeneralUtil.MENSAJE(error.statusText, 'error');
      } else {
        GeneralUtil.MENSAJE(error.mensajePeticion, 'error');
      }
    });
  }

  /*submit() {
    this.mensajeSpiner = 'PROCESANDO';
    if (this.ejecutadoTransmi == undefined || this.eliminadoTransmi == undefined || this.adicionalTransmi == undefined || this.perdidoTransmi == undefined) {
      GeneralUtil.MENSAJE('Debe llenar todos los campos para consolidar', 'error');
      return;
    }
    if (this.total == undefined) {
      GeneralUtil.MENSAJE('Debe generar primero para consolidar', 'error');
      return;
    }
    this.spinner.show();
    this.totalTransmi = parseInt(this.ejecutadoTransmi) - parseInt(this.eliminadoTransmi) + parseInt(this.adicionalTransmi) - parseInt(this.perdidoTransmi);
    const varia = [
      {
        "id": null,
        "fecha": new Date(),
        "valor": this.total,
        "idTipo": {
          "id": 155
        }
      },
      {
        "id": null,
        "fecha": new Date(),
        "valor": this.totalTransmi,
        "idTipo": {
          "id": 156
        }
      }
    ]
    this._reporteServicio.crear(varia).subscribe(x => {
      this.spinner.hide();
      if (x.codigoPeticion == 1) {
        GeneralUtil.MENSAJE('Consolidado', 'success');
      } else {
        GeneralUtil.MENSAJE(x.mensajePeticion, 'warning');
      }
    }, error => {
      this.spinner.hide();
      if (error.status != 500) {
        GeneralUtil.MENSAJE(error.statusText, 'error');
      } else {
        GeneralUtil.MENSAJE(error.mensajePeticion, 'error');
      }
    });
  }*/

  parseInt(valueString: string): number {
    return Number.parseInt(valueString);
  }

  guardar() {

  }

  goNext(stepper: MatStepper) {
    stepper.next();
  }

  findKM(stepper: MatStepper) {

    this._reporteServicio.consultarKMEmpresa(
      this.myFormFechas.controls.fecha_inicial.value.toJSON(),
      this.myFormFechas.controls.fecha_final.value.toJSON()).subscribe(resp => {

        this.getInfoEmpresa(resp);

        stepper.next();



      })



  }

  secondStep(stepper: MatStepper) {

    let objectSend: ReporteInterrupcion = {
      empresaAdicional: this.empresa_adicional,
      empresaEjecutado: this.empresa_ejecutado,
      empresaEliminado: this.empresa_eliminado,
      empresaPerdido: this.empresa_perdido,
      empresaTotal: this.empresa_ejecutado + this.empresa_adicional - this.empresa_eliminado - this.empresa_perdido,
      externoAdicional: this.myFormTransmilenio.controls.adicional.value,
      externoEjecutado: this.myFormTransmilenio.controls.ejecutado.value,
      externoEliminado: this.myFormTransmilenio.controls.eliminado.value,
      externoPerdido: this.myFormTransmilenio.controls.perdido.value,
      externoTotal: convertStringThousandsToInteger(this.myFormTransmilenio.controls.ejecutado.value) + convertStringThousandsToInteger(this.myFormTransmilenio.controls.adicional.value)
        - convertStringThousandsToInteger(this.myFormTransmilenio.controls.eliminado.value) - convertStringThousandsToInteger(this.myFormTransmilenio.controls.perdido.value),
      fechaInicial: this.myFormFechas.controls.fecha_inicial.value,
      fechaFinal: this.myFormFechas.controls.fecha_final.value,
      idEstado: new Catalogo(192)
    }

    this._reporteServicio.crear(objectSend).subscribe(resp => {

      GeneralUtil.MENSAJE('Reporte Registrado', 'success');

      stepper.reset();
      this.consultar();

    })

  }



  getInfoEmpresa(resp) {
    this.list_empresas = resp;
    debugger;
    this.list_empresas.forEach(res => {

      switch (res[0]) {
        case 188:
          console.log(res[1])
          this.empresa_ejecutado = res[1];
          break;
        case 189:
          this.empresa_adicional = res[1]
          break;
        case 190:
          this.empresa_eliminado = res[1]
          break;
        case 191:
          this.empresa_perdido = res[1]
          break;

        default:
          break;
      }
    })

  }

  consultar() {
    this._reporteServicio.consultar().subscribe(resp => {
      this.dataSource = new MatTableDataSource(resp);
      console.log(resp);
      this.cargarComplementoTable();

    }, error => {
      GeneralUtil.MENSAJE('¡Error del Sistema!', 'error');

    })
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


  convertStringThousandsToInteger(value: any): number {
    if (value != null && value !== '') {
      value = value.toString().replace(/,/g, '');
      return parseInt(value);
    }
    return value;
  }


}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
  }, {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }, {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`
  }, {
    position: 5,
    name: 'Boron',
    weight: 10.811,
    symbol: 'B',
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`
  }, {
    position: 6,
    name: 'Carbon',
    weight: 12.0107,
    symbol: 'C',
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`
  }, {
    position: 7,
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`
  }, {
    position: 8,
    name: 'Oxygen',
    weight: 15.9994,
    symbol: 'O',
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`
  }, {
    position: 9,
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`
  }, {
    position: 10,
    name: 'Neon',
    weight: 20.1797,
    symbol: 'Ne',
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`
  },
];
