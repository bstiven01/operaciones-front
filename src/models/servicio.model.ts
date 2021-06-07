import { WS_URL_OPERACIONES } from 'src/utils/rutas';

export interface Servicio {
    id?: number;
    codigo?: string;
    nombre?: string;
    idEstado?: number;
    etiqueta?: string;
    idServicio?: number;
    idTipoServicio?: number;
    nombreEstadoServicio?: string;
    nombreServicioPadre?: string;
    nombreTipoServicio?: string;
}

export const SERVICIO_ENDPOINT = `${WS_URL_OPERACIONES}servicioWS`;