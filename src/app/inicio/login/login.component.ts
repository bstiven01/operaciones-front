import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/services/login.service';
import { GeneralUtil } from 'src/utils/general.util';
import { Login } from 'src/models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
  ) { }

  public formulario: FormGroup;

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    const login: Login = new Login();
    login.username = this.formulario.value.username;
    login.password = this.formulario.value.password;
    localStorage.setItem('Cap','123456789552');
    this.loginService.login(login).subscribe(
      response => {
        localStorage.removeItem('Cap');
        GeneralUtil.MENSAJE('Ingreso correcto', 'success');
        localStorage.setItem('loginstatus', 'true');
        const token = response.headers.get('Authorization');
        const userinfo = response.body;
        userinfo['token'] = token;
        localStorage.setItem('token',token);
        localStorage.setItem('userinfo', JSON.stringify(userinfo));
        window.location.href = '';
      }, error => {
        GeneralUtil.MENSAJE('Verificar información', 'error');
      }
    );
  }

}
