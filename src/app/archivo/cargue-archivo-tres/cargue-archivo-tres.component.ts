import { Component, OnInit } from '@angular/core';
import { GeneralUtil } from 'src/utils/general.util';
import { CargueService } from 'src/services/cargue.service';
import { Mensaje } from 'src/models/mensaje.model';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry, NgxFileDropComponent } from 'ngx-file-drop';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-cargue-archivo-tres',
  templateUrl: './cargue-archivo-tres.component.html',
  styleUrls: ['./cargue-archivo-tres.component.scss']
})
export class CargueArchivoTresComponent implements OnInit {

  files: NgxFileDropEntry[] = [];
  fileDrop: NgxFileDropComponent;
  selectedFile: File;
  nombreArchivoError: string;
  mensajeRespuesta: Mensaje;
  mensajeSpiner: string;
  tablaVisible: string;
  tipoConsulta: string;
  TipoOpcion: string;
  tipo: string;
  constructor(private _cargueService: CargueService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.tipo = 'CARGUE_MANTENIMIENTO';
  }
  
  validarArchivo(nombreArchivo, file) {
    this.files;
    this.selectedFile = file;
    const variable = nombreArchivo.split('.');
    this.mensajeRespuesta = {codigoPeticion: 0,mensajePeticion: '', valorExtra: ''};
    if (variable[variable.length-1] === 'csv') {
      if (variable[0].match('[.¡+=#?!@$%^&*ÑñÁ-Úá-ú]')) {
        this.spinner.hide();

        GeneralUtil.MENSAJE('El nombre del archivo no puede contener los siguientes caracteres ".¡+=#?!@$%^&*ÑñÁ-Úá-ú", por favor modifíquelo e intente nuevamente', 'error');
      } else if (nombreArchivo.length > 34) {
        this.spinner.hide();

        GeneralUtil.MENSAJE('El nombre del archivo supera el límite permitido (34 carácteres)', 'error');
      } else {
        this.insertarProgramacionSemanal();
      }
    } else {
      this.spinner.hide();
      GeneralUtil.MENSAJE('El tipo de archivo ingresado no es válido, ingrese únicamente archivos con extensión “.csv”, por favor verifique e intente nuevamente ', 'error');
    }
  }

  insertarProgramacionSemanal() {
    this._cargueService.validarArchivoMantenimiento(this.selectedFile).subscribe(
      (resp:Mensaje) => {
        this.spinner.hide();
        this.mensajeRespuesta = resp;
        if (this.mensajeRespuesta.codigoPeticion  === 0) {
          GeneralUtil.MENSAJE(resp.mensajePeticion, 'success');
        } else if (this.mensajeRespuesta.codigoPeticion  === 1) {
          GeneralUtil.MENSAJE(resp.mensajePeticion, 'error');
        } else if (this.mensajeRespuesta.codigoPeticion  === 2) {
          this.nombreArchivoError = resp.valorExtra;
          GeneralUtil.MENSAJE(resp.mensajePeticion, 'error');
        }
      }, error => {
        this.spinner.hide();
        if(error.status != 500)
        {
          GeneralUtil.MENSAJE(error.statusText, 'error');
        }else{
          GeneralUtil.MENSAJE(error.mensajePeticion, 'error');
        }
      }
    );
  }
  exportarReporteError() {
    this.spinner.show();
    this.mensajeSpiner = 'DESCARGANDO';
    this._cargueService.descargarArchivoError(this.nombreArchivoError).subscribe(blob => {
      const fileName = this.nombreArchivoError;
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, this.nombreArchivoError);
      } else {
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.download = fileName;
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      this.spinner.hide();
      GeneralUtil.MENSAJE("Se ha descargado el archivo de errores.", 'success');
    }, error => {
        this.spinner.show();
        if(error.status != 500)
        {
          GeneralUtil.MENSAJE(error.statusText, 'error');
        }else{
          GeneralUtil.MENSAJE(error.mensajePeticion, 'error');
        }
    });
  }

 
 
  public dropped(files: NgxFileDropEntry[]) {
    this.spinner.show();
    this.mensajeSpiner = 'SUBIENDO';

    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          this.validarArchivo(droppedFile.relativePath, file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  
  openFileSelector($event){
    this.fileDrop.openFileSelector($event);
  }

  consultarCargue(tipo : string){
    if(tipo === 'TODO'){
      this.TipoOpcion = 'Archivos cargados';
    }else if(tipo === 'ULTIMASEMANA'){
      this.TipoOpcion = 'Recientes';
    }else {
      this.TipoOpcion = 'Archivos con error';
    }
    this.tipoConsulta =  tipo;
  }


}
