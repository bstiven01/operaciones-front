import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from 'src/services/configuracion.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GeneralUtil } from 'src/utils/general.util';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  constructor(
    private configuracionService : ConfiguracionService,
    private formBuilder: FormBuilder,
  ) { }

  public formulario : FormGroup;
  public configuracion : any = null;
  public logo : any = null;
  public imagePath;

  ngOnInit()
  {
    this.formulario = this.formBuilder.group({
      nombreEmpresa: ['', Validators.required],
      nombreAdmin: ['', Validators.required],
      correoAdmin: ['', Validators.required],
      asuntoEmailCliente: ['', Validators.required],
      asuntoEmailAdmin: ['', Validators.required],
      textoEmailCliente: ['', Validators.required],
      textoEmailAdmin: ['', Validators.required],
      logo: ['', Validators.required],
    });
    this.consultar();
  }

  editar()
  {
    let data = this.formulario.value;
    data['_id'] = this.configuracion['_id'];
    data['logo'] = this.logo;
    this.configuracionService.editar(data).subscribe(
      response => { 
         GeneralUtil.MENSAJE("Configuración editado correctamente", "success");
      },
      error => {
        GeneralUtil.MENSAJE("Verificar información", "error");
        console.log(<any>error);
      }
    );
  }

  consultar()
  {
    this.configuracionService.consultar().subscribe(
      response => { 
        this.configuracion = response;
        this.logo = response['logo'];
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  fileChanged(e) {
    if(e.target.files.length > 0)
    {
      if(e.type != "text/xml")
      {
        let file = e.target.files[0];
        var reader = new FileReader();
        this.imagePath = file;
        reader.readAsDataURL(file); 
        reader.onload = (_event) => { 
          this.logo = reader.result; 
        }
      }
    }else{
      this.formulario.value.logo = null;
      this.configuracion['logo'] = null;
    }
  }

  getBase64(file) {
    let me = this;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //me.modelvalue = reader.result;
      return reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

}
