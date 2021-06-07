import { Catalogo } from './catalogo.model';

export interface OperadorHV {
    id: number;
    codigo: string;
    numeroDocumento: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    vigenciaLicencia: Date;
    fechaContratacion: Date;
    idTipoDocumento: Catalogo;
    idCategoriaLicencia: Catalogo;
    idRh: Catalogo;
    idEps: Catalogo;
    idArl: Catalogo;
    idEstado: Catalogo;

}
