import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Catalogo } from 'src/models/catalogo.model';
import { Operador } from 'src/models/operador.model';
import { CatalogoService } from 'src/services/catalogo.service';
import { OperadorService } from 'src/services/operador.service';
import { GeneralUtil } from 'src/utils/general.util';

@Component({
  selector: 'app-formulario-operador',
  templateUrl: './formulario-operador.component.html',
  styleUrls: ['./formulario-operador.component.scss']
})
export class FormularioOperadorComponent implements OnInit {

  myForm: FormGroup;

  tiposDeDocumento: Catalogo[];
  tiposDeLicencia: Catalogo[];
  tiposDeRh: Catalogo[];
  tiposDeEps: Catalogo[];
  tiposDeArl: Catalogo[];
  tiposDeEstado: Catalogo[];

  mensajeCampoRequerido = 'Campo Requerido';
  nombre: string;

  banderaEditar: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormularioOperadorComponent>,
    @Inject(MAT_DIALOG_DATA) public element: Operador,
    private catalogoService: CatalogoService,
    private operadorService: OperadorService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {

    this.readCatalogosByIdPadre(4);
    this.readCatalogosByIdPadre(6);
    this.readCatalogosByIdPadre(8);
    this.readCatalogosByIdPadre(11);
    this.readCatalogosByIdPadre(13);
    this.readCatalogosByIdPadre(15);

    this.buildForm();
    this.setConfiguracion();

  }

  buildForm() {

    this.myForm = this.fb.group({
      id: [undefined],
      codigo: [undefined, [Validators.required, Validators.maxLength(50)]],
      idTipoDocumento: [undefined, [Validators.required]],
      numeroDocumento: [undefined, [Validators.required, Validators.maxLength(50)]],
      primerNombre: [undefined, [Validators.required, Validators.maxLength(50)]],
      segundoNombre: [undefined, [Validators.maxLength(50)]],
      primerApellido: [undefined, [Validators.required, Validators.maxLength(50)]],
      segundoApellido: [undefined, [Validators.maxLength(50)]],
      vigenciaLicencia: [undefined, [Validators.required]],
      fechaContratacion: [undefined, [Validators.required]],
      idCategoriaLicencia: [undefined, [Validators.required]],
      idRh: [undefined, [Validators.required]],
      idEps: [undefined, [Validators.required]],
      idArl: [undefined, [Validators.required]],
      idEstado: [undefined, [Validators.required]],
    });


    if (Object.keys(this.element).length !== 0) { // Se realiza esta validacion para llenar los datos
      this.banderaEditar = true;
      this.cargarDatos();
    }

  }

  cargarDatos() {

    this.myForm.patchValue({
      id: this.element.id,
      codigo: this.element.codigo,
      idTipoDocumento: this.element.idTipoDocumento,
      numeroDocumento: this.element.numeroDocumento,
      primerNombre: this.element.primerNombre,
      segundoNombre: this.element.segundoNombre,
      primerApellido: this.element.primerApellido,
      segundoApellido: this.element.segundoApellido,
      vigenciaLicencia: this.element.vigenciaLicencia,
      fechaContratacion: this.element.fechaContratacion,
      idCategoriaLicencia: this.element.idCategoriaLicencia,
      idRh: this.element.idRh,
      idEps: this.element.idEps,
      idArl: this.element.idArl,
      idEstado: this.element.idEstado,
    });

  }

  setConfiguracion() {

    if (this.banderaEditar) {
      this.nombre = 'ACTUALIZAR';
    } else {
      this.nombre = 'CREAR';
    }
  }

  submit() {

    if (this.myForm.invalid)
      this.myForm.markAllAsTouched();

    if (this.myForm.valid) {
      this.spinner.show();

      if (!this.banderaEditar) {

        this.operadorService.crearOperador(this.myForm.value).subscribe(resp => {
          console.log('Se realiza la creacion');
          GeneralUtil.MENSAJE('¡Se realizo la creación del operador!', 'success');
          this.spinner.hide();
          this.closeDialog(true);

        },
          error => {
            this.spinner.hide();
            GeneralUtil.MENSAJE('¡Error del Sistema!', 'error');
          });

      } else {

        this.operadorService.actualizarOperador(this.myForm.value).subscribe(resp => {
          console.log('Se realiza la actualizacion');
          GeneralUtil.MENSAJE('¡Se realizo la actualización del operador!', 'success');
          this.spinner.hide();
          this.closeDialog(true);

        },
          error => {
            this.spinner.hide();
            GeneralUtil.MENSAJE('¡Error del Sistema!', 'error');
          });

      }

    }
  }

  readCatalogosByIdPadre(id: number) {
    this.catalogoService.consultarCatalogoByIdCatalogo(id).subscribe(resp => {
      switch (id) {
        case 4:
          this.tiposDeDocumento = resp;
          break;
        case 6:
          this.tiposDeLicencia = resp;
          break;
        case 8:
          this.tiposDeRh = resp;
          break;
        case 11:
          this.tiposDeEps = resp;
          break;
        case 13:
          this.tiposDeArl = resp;
          break;
        case 15:
          this.tiposDeEstado = resp;
          break;
      }
    }, error => {
      console.error('Error al consultar los catalogos');
    });
  }

  selectedSelect(o1: any, o2: any): boolean {
    return !o1 || !o2 || !o1.nombre || !o2.nombre ?
      false : (o1.nombre === o2.nombre && o1.id === o2.id);
  }

  closeDialog(change?: boolean): void {
    this.dialogRef.close(change);
  }


}
