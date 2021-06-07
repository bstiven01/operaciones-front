import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BusService } from 'src/services/bus.service';
import { GeneralUtil } from 'src/utils/general.util';

@Component({
  selector: 'app-cambio',
  templateUrl: './cambio.component.html',
  styleUrls: ['./cambio.component.scss']
})
export class CambioComponent implements OnInit {

  mensajeSpiner: string;
  descripcionSpiner: string;
  value: Date;
  es: any;

  constructor(private spinner: NgxSpinnerService, private _busServicio: BusService
  ) { }

  public dias: any = [
    "LUN", "MAR", "MIER", "JUE", "VIER", "SAB", "DOM"
  ];

  ngOnInit() {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
      today: 'Hoy',
      clear: 'Borrar'
  }
  this.value = new Date();
  }

  procesar() {
    this.spinner.show();
    this.mensajeSpiner = 'PROCESANDO';
    this.descripcionSpiner = 'Parte 1 de 2';
    let pipe = new DatePipe('en-US'); // Use your own locale
    const myFormattedDate = pipe.transform(this.value, 'dd/MM/yyyy');
    this._busServicio.procesarAsignacion(myFormattedDate).subscribe(x => {
      //this.descripcionSpiner = 'Parte 2 de 2';
      // this._busServicio.procesarAsignacionParte2(myFormattedDate).subscribe(y=>{
         this.spinner.hide();
      //   GeneralUtil.MENSAJE(x.mensajePeticion, 'success');
      // })
    }, error => {
      this.spinner.hide();
      if (error.status != 500) {
        GeneralUtil.MENSAJE(error.statusText, 'error');
      } else {
        GeneralUtil.MENSAJE(error.mensajePeticion, 'error');
      }
    });

  }


}
