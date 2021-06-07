export class DetalleServicio {
    id : number;
    horaInicio? : string;
    horaFin? : string;
    evento? : string;
    busVirtual : string;
    parte? : number;
    idEstado? : any;
    idTabla? : any;
    idServicio? : any;
    idOperador? : any;
    idBus? : any;
    idSitioInicio? : any;
    idSitioFin? : any;
    distancia? : any;
    codigo_bus?: any; //pendiente borrar crear sercicio

    constructor(
      id : number,
      horaInicio? : string,
      horaFin? : string,
      evento? : string,
      busVirtual? : string,
      parte? : number,
      idEstado? : number,
      idTabla? : number,
      idServicio? : number,
      idOperador? : number,
      idBus? : number,
      idSitioInicio? : number,
      idSitioFin? : number,
      distancia? : number,
      codigo_bus?: any,

    ) {
      this.id = id;
      this.horaInicio = horaInicio;
      this.horaFin = horaFin;
      this.evento = evento;
      this.busVirtual = busVirtual;
      this.parte = parte;
      this.idEstado = idEstado;
      this.idTabla = idTabla;
      this.idServicio = idServicio;
      this.idOperador = idOperador;
      this.idBus = idBus;
      this.idSitioInicio = idSitioInicio;
      this.idSitioFin = idSitioFin;
      this.distancia = distancia;
      this.codigo_bus = codigo_bus;
    }

}
