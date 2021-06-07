import { Component, OnInit } from '@angular/core';
import { GeneralUtil } from 'src/utils/general.util';
import { UsuarionService } from 'src/services/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(
    private usuarioService : UsuarionService
  ) { }


  ngOnInit()
  {
    
  }

}
