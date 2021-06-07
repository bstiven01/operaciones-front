import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarionService } from 'src/services/usuario.service';
//import { CatalogoService } from 'src/services/catalogo.service';
import { GeneralUtil } from 'src/utils/general.util';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarionService,
   // private catalogoService: CatalogoService,
    private router: Router,
    private route : ActivatedRoute
  ) { }

  public formulario: FormGroup;
  public roles: any = [];
  public emails: any = [];
  public usuario : any = null;
  public id : any = null;

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
      rpassword: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      celular: ['', Validators.required],
      rol: ['', Validators.required],
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.consultar(this.id);
    //this.listarRoles("ROL_USUARIO");
  }


  consultar(id)
  {
    this.usuarioService.consultar(id).subscribe(
      response => { 
        this.usuario = response;
        let x = 0;
        response.emails.forEach(element => {
          let email : any = {id : x, value : element};
          this.emails.push(email);
        });
        console.log(this.usuario)
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  editar() {

    let emailList = [];
    this.emails.forEach(element => {
      if (GeneralUtil.EMAIL_VAL(element['value']) === true) {
        emailList.push(element['value']);
      }
    });

    if (this.formulario.value.password != this.formulario.value.rpassword) {
      GeneralUtil.MENSAJE("Las contraseñas no coinciden", "error");
      return;
    }

    let data = {
      "_id" : this.id,
      "usuario": this.formulario.value.usuario,
      "password": this.formulario.value.password,
      "nombre": this.formulario.value.nombre,
      "email": this.formulario.value.email,
      "emails": emailList,
      "celular": this.formulario.value.celular,
      "rol" : this.formulario.value.rol,
    };

    this.usuarioService.editar(data).subscribe(
      response => { 
        GeneralUtil.MENSAJE("Usuario editado correctamente", "success");
        this.router.navigate(['/usuario']);
      },
      error => {
        GeneralUtil.MENSAJE("Verificar información", "error");
        console.log(<any>error);
      }
    );
  }

  agregarEmail() {
    if (this.emails.length == 0) {
      let txt = { id: 0, value: null };
      this.emails.push(txt);
    } else {
      let txt = { id: this.emails[this.emails.length - 1].id + 1, value: null };
      this.emails.push(txt);
    }
  }

  eliminarEmail(i) {
    this.emails.splice(i, 1);
  }

  /*
  listarRoles(tipo) {
    this.catalogoService.listar(tipo).subscribe(
      response => {
        this.roles = response;
        console.log(this.roles);
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  */

}
