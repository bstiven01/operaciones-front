export class Operador {
  id: number;
  codigo: string;
  numeroDocumento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  vigenciaLicencia: Date;
  fechaContratacion: Date;
  idTipoDocumento: any;
  idCategoriaLicencia: any;
  idRh: any;
  idEps: any;
  idArl: any;
  idEstado: any;

  constructor(
    id: number,
    codigo?: string,
    numeroDocumento?: string,
    primerNombre?: string,
    segundoNombre?: string,
    primerApellido?: string,
    segundoApellido?: string,
    vigenciaLicencia?: Date,
    fechaContratacion?: Date,
    idTipoDocumento?: any,
    idCategoriaLicencia?: any,
    idRh?: any,
    idEps?: any,
    idArl?: any,
    idEstado?: any) {

    this.id = id;
    this.codigo = codigo;
    this.numeroDocumento = numeroDocumento;
    this.primerNombre = primerNombre;
    this.segundoNombre = segundoNombre;
    this.primerApellido = primerApellido;
    this.segundoApellido = segundoApellido;
    this.vigenciaLicencia = vigenciaLicencia;
    this.fechaContratacion = fechaContratacion;
    this.idTipoDocumento = idTipoDocumento;
    this.idCategoriaLicencia = idCategoriaLicencia;
    this.idRh = idRh;
    this.idEps = idEps;
    this.idArl = idArl;
    this.idEstado = idEstado;
  }

}
