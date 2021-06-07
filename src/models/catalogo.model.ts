import { WS_URL_OPERACIONES } from 'src/utils/rutas';

export class Catalogo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  idCatalogo: Catalogo;

  constructor(
    id: number,
    codigo?: string,
    nombre?: string,
    descripcion?: string,
    idCatalogo?: Catalogo
  ) {
    this.id = id;
    this.codigo = codigo;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.idCatalogo = idCatalogo;
  }

}

export const CATALOGO_ENDPOINT = `${WS_URL_OPERACIONES}catalogoWS`;
