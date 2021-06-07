export class TipoNovedad {
    id: number;
    codigo: string;
    nombre: string;
    idTipoNovedad: number;

    constructor(
        id: number,
        codigo?: string,
        nombre?: string,
        idTipoNovedad?: number
      ) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.idTipoNovedad = idTipoNovedad;
      }

}
