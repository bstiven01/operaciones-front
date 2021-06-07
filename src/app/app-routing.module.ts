import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio/inicio.component';
import { NotfoundComponent } from './complements/notfound/notfound.component';
import { UsuarioComponent } from './usuario/usuario/usuario.component';
import { AgregarUsuarioComponent } from './usuario/agregar-usuario/agregar-usuario.component';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';

import { ConfiguracionComponent } from './configuracion/configuracion/configuracion.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UnauthorizedComponent } from './complements/unauthorized/unauthorized.component';
import { CambioComponent } from './cambio/cambio/cambio.component';
import { ListaOperacionComponent } from './operacion/lista-operacion/lista-operacion.component';
import { ReporteOperacionComponent } from './operacion/reporte-operacion/reporte-operacion.component';
import { CargueArchivoComponent } from './archivo/cargue-archivo/cargue-archivo.component';
import { OperacionIndexComponent } from './operacion/operacion-index/operacion-index.component';
import { ConsultaOperadorComponent } from './operador/consulta-operador/consulta-operador.component';
import { CargueArchivoUnoComponent } from './archivo/cargue-archivo-uno/cargue-archivo-uno.component';
import { CargueArchivoDosComponent } from './archivo/cargue-archivo-dos/cargue-archivo-dos.component';
import { CargueArchivoTresComponent } from './archivo/cargue-archivo-tres/cargue-archivo-tres.component';
import { CrearServicioComponent } from './servicio/crear-servicio/crear-servicio.component';
import { CargueNovedadComponent } from './archivo/cargue-novedad/cargue-novedad.component';
import { CargueMatrizDistanciaComponent } from './archivo/cargue-matriz-distancia/cargue-matriz-distancia.component';
import { ReporteInterrupcionesComponent } from './reportes/reporte-interrupciones/reporte-interrupciones.component';
import { AdministracionOperadorComponent } from './configuracion/administracion-operador/administracion-operador.component';
import { NovedadCambioOperadorComponent } from './novedad/novedad-cambio-operador/novedad-cambio-operador.component';
import { NovedadCambioBusComponent } from './novedad/novedad-cambio-bus/novedad-cambio-bus.component';
import { NovedadSinCambioComponent } from './novedad/novedad-sin-cambio/novedad-sin-cambio.component';
import { CambioOperadorDisponibleComponent } from './novedad/cambio-operador-disponible/cambio-operador-disponible.component';
import { ConsultarComponent as ConsultarServicioComponent } from './servicio/consultar/consultar.component';


const routes: Routes = [

  { path:  '', component: InicioComponent },

  // Operacion
  { path:  'operacion', component: OperacionIndexComponent },
  { path:  'operacion/reporte', component: ReporteOperacionComponent },

  // Cambio
  { path:  'cambio', component: CambioComponent },

  // Archivo
  { path:  'archivo', component: CargueArchivoComponent },
  { path:  'archivo/uno', component: CargueArchivoUnoComponent },
  { path:  'archivo/dos', component: CargueArchivoDosComponent },
  { path:  'archivo/tres', component: CargueArchivoTresComponent },
  { path:  'archivo/novedad', component: CargueNovedadComponent },
  { path:  'archivo/matriz', component: CargueMatrizDistanciaComponent },


  // Operador
  { path:  'operador/consulta', component: ConsultaOperadorComponent },

  // Servicio
  {
    path:  'servicio',
    children:[
      {path: '', component: ConsultarServicioComponent},
      {path: 'crear', component: CrearServicioComponent},
      {path: 'editar/:id', component: CrearServicioComponent}
    ]
  },

  //Reportes
  { path:  'reportes/interrupciones', component: ReporteInterrupcionesComponent },

  //Configuracion
  { path:  'configuracion/operadores', component: AdministracionOperadorComponent },
  { path:  'configuracion/prueba', component: NovedadCambioOperadorComponent },


  { path:  '401', component: UnauthorizedComponent },

  { path:  '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
