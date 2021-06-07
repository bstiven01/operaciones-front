import { Bus } from './bus.model';
import { Catalogo } from './catalogo.model';

export class DisponibilidadBus {

  id : number;
  idBus : Bus;
  horaInicio: Date;
  horaFin: Date;
  idTipo: Catalogo
  idEstado: Catalogo;

  constructor(
    id: number,
    idBus?: Bus,
    horaInicio?: Date,
    horaFin?: Date,
    idTipo?: Catalogo,
    idEstado?: Catalogo
  ) {
    this.id = id;
    this.idBus = idBus;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.idTipo = idTipo;
    this.idEstado = idEstado;

  }

}
