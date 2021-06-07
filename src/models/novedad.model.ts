import { Catalogo } from './catalogo.model';
import { DisponibilidadBus } from './disponibilidad-bus.model';
import { DisponibilidadOperador } from './disponibilidad-operador.model';
import { TipoNovedad } from './tipo-novedad.model';

export interface Novedad {
    id: number;
    fecha: Date;
    fechaInicio: Date;
    fechaFin: Date;
    valorAnterior?: string;
    valorNuevo?: string;
    motivo: string;
    idDetalleServicio: any;
    idEstado: Catalogo;
    idTipo: TipoNovedad;
    idSitio: any;
    idBus?: any;
    idOperador?: any;
    idDisponibilidadOperador?: DisponibilidadOperador;
    idDisponibilidadBus?: DisponibilidadBus;

}
