import { Component, OnInit } from '@angular/core';
import { UsuarionService } from 'src/services/usuario.service';
import { GeneralUtil } from 'src/utils/general.util';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  constructor(
    private usuarioService : UsuarionService
  ) { }
  public usuarios : any = [];

  ngOnInit()
  {
    this.listar();
  }

  listar()
  {
    this.usuarioService.listar().subscribe(
  		response => {
        this.usuarios = response;
  		},
  		error => {
  			console.log(<any>error);
  		}
    );
  }

  eliminar(id)
  {
    GeneralUtil.CONFIRMACION().subscribe(
  		response => {
        this.usuarioService.eliminar(id).subscribe(
          response => {
            GeneralUtil.MENSAJE("Eliminado correctamente", "success");
            this.listar();
          },
          error => {
            GeneralUtil.MENSAJE("Ha ocurrido un error", "error");
            console.log(<any>error);
          }
        );
  		},
  		error => {
  			console.log(<any>error);
  		}
    );

  }

}
