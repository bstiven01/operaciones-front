import { Catalogo } from './catalogo.model';
import { Operador } from './operador.model';

export class DisponibilidadOperador {

  id : number;
  idOperador : Operador;
  horaInicio: Date;
  horaFin: Date;
  idTipo: Catalogo
  idEstado: Catalogo;

}
