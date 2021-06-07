import { WS_URL_OPERACIONES } from 'src/utils/rutas';

export interface ReporteInterrupcion {
    id?: number;
    empresaEjecutado?: number;
    empresaAdicional?: number;
    empresaEliminado?: number;
    empresaPerdido?: number;
    empresaTotal?: number;
    externoEjecutado?: number;
    externoAdicional?: number;
    externoEliminado?: number;
    externoPerdido?: number;
    externoTotal?: number;
    fechaInicial: any;
    fechaFinal: any;
    idEstado: any;
}

export const SERVICIO_ENDPOINT = `${WS_URL_OPERACIONES}servicioWS`;