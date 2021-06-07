import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cambio-operador-disponible',
  templateUrl: './cambio-operador-disponible.component.html',
  styleUrls: ['./cambio-operador-disponible.component.scss']
})
export class CambioOperadorDisponibleComponent implements OnInit {

  countries: any[];

  selectedCountries: any[];

  constructor() {
    this.countries = [
      {name: 'Australia', code: 'AU'},
      {name: 'Brazil', code: 'BR'},
      {name: 'China', code: 'CN'},
      {name: 'Egypt', code: 'EG'},
      {name: 'France', code: 'FR'},
      {name: 'Germany', code: 'DE'},
      {name: 'India', code: 'IN'},
      {name: 'Japan', code: 'JP'},
      {name: 'Spain', code: 'ES'},
      {name: 'United States', code: 'US'}
  ];
  }

  ngOnInit() {
  }

}
