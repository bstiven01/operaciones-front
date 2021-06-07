export class Bus {
  id: number;
  codigo: string;
  placa: string;
  modelo: string;
  marca: string;
  kilometraje: number;
  idEstado: any;

  constructor(
    id: number,
    codigo?: string,
    placa?: string,
    modelo?: string,
    marca?: string,
    kilometraje?: number,
    idEstado?: any
  ) {

    this.id = id;
    this.codigo = codigo;
    this.placa = placa;
    this.modelo = modelo;
    this.marca = marca;
    this.kilometraje = kilometraje;
    this.idEstado = idEstado;

  }

}
