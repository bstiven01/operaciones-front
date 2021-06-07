import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-seleccion-boton',
  templateUrl: './seleccion-boton.component.html',
  styleUrls: ['./seleccion-boton.component.scss']
})
export class SeleccionBotonComponent implements OnInit {

  nombre: string;

  constructor(
    public dialogRef: MatDialogRef<SeleccionBotonComponent>,
    @Inject(MAT_DIALOG_DATA) public lista_elementos: any,
  ) { }

  ngOnInit() {
  }


  seleccion(element: any){
    this.dialogRef.close(element);
  }
}
