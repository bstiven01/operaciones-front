import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { CrearNovedadComponent } from 'src/app/novedad/crear-novedad/crear-novedad.component';

@Component({
  selector: 'app-operacion-index',
  templateUrl: './operacion-index.component.html',
  styleUrls: ['./operacion-index.component.scss']
})
export class OperacionIndexComponent implements OnInit {

  items: MenuItem[];
  activeItem: MenuItem;
  @ViewChild('menuItems', { static: false }) menu: MenuItem[];

  public active = '1';

  // variable para usar atributos o metodos del componente hijo
  @ViewChild(CrearNovedadComponent, { static: false }) componentNovedadExtra: CrearNovedadComponent;

  constructor() { }

  ngOnInit() {
    /*
    this.items = [
      { label: 'Operaciones', icon: 'fas fa-cogs', id: "1" },
      { label: 'Novedades', icon: 'fas fa-flag-checkered', id: "2" }
    ];
    this.activeItem = this.items[0];
    */
  }

  activateMenu(id) {
    this.active = id;
  }

  openNovedadExtraordinaria() {
    ($('#modalNovedadExtra') as any).modal('show');

    if (this.componentNovedadExtra !== undefined) {
      this.componentNovedadExtra.buildFormModal();
    }
  }

}
