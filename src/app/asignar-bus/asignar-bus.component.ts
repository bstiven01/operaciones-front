import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSelectionList, MatSelectionListChange, MAT_DIALOG_DATA } from '@angular/material';
import { Catalogo } from 'src/models/catalogo.model';
import { DisponibilidadBus } from 'src/models/disponibilidad-bus.model';
import { DisponibilidadBusService } from 'src/services/disponibilidad-bus.service';
import { OperacionesService } from 'src/services/operaciones.service';
import { GeneralUtil } from 'src/utils/general.util';

@Component({
  selector: 'app-asignar-bus',
  templateUrl: './asignar-bus.component.html',
  styleUrls: ['./asignar-bus.component.scss']
})
export class AsignarBusComponent implements OnInit {

  listDiponibilidadBuses: DisponibilidadBus[];
  nombre_operador: string;

  myForm: FormGroup;

  @ViewChild('disponibilidadBuses', { static: true }) disponibilidadBuses: MatSelectionList;

  constructor(
    private disponibilidadBusService: DisponibilidadBusService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AsignarBusComponent>,
    @Inject(MAT_DIALOG_DATA) public element: any,
    private operacionesService: OperacionesService

  ) { }

  ngOnInit() {

    this.consultarDisponibilidadBuses();
    this.nombre_operador = this.element.detalle.nombreCompletoCondutor;
    console.log(this.element);
    this.buildForm();

    this.disponibilidadBuses.selectionChange.subscribe((s: MatSelectionListChange) => {
      this.disponibilidadBuses.deselectAll();
      s.option.selected = true;
      //this.valorNuevo = s.option.value.idBus.codigo;
    });

  }

  buildForm() {

    this.myForm = this.fb.group({
      idDisponibilidadBus: []
    });

  }

  consultarDisponibilidadBuses() {

    this.disponibilidadBusService.readByEstado(162).subscribe((resp) => {
      this.listDiponibilidadBuses = resp;
    })
      , ((error) => {
        console.error('Error al consultar disponibilidad de buses');
      })

  }

  guardar() {

    let busDispo: DisponibilidadBus;
        busDispo = this.myForm.controls.idDisponibilidadBus.value[0];
        busDispo.idEstado = new Catalogo(164);

        debugger;

    this.operacionesService.updateBus(this.myForm.controls.idDisponibilidadBus.value[0].idBus.id, this.element.detalle.idDetalleServicio)
      .subscribe(resp => {


        this.disponibilidadBusService.update(busDispo).subscribe(resp => {

          GeneralUtil.MENSAJE('Se asigno el bus.', 'success');
          this.closeDialog(true);

        }), error => {
          GeneralUtil.MENSAJE('Error en el proceso.', 'error');
          this.closeDialog(false)
        }

      }, error => {
        GeneralUtil.MENSAJE('No se actualizo el bus.', 'error');
        this.closeDialog(false)
      })

  }

  closeDialog(element: any) {
    this.dialogRef.close(element);
  }

}
