import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './inicio/login/login.component';
import { InicioComponent } from './inicio/inicio/inicio.component';
import { HeaderComponent } from './complements/header/header.component';
import { MenuComponent } from './complements/menu/menu.component';
import { FooterComponent } from './complements/footer/footer.component';
import { NotfoundComponent } from './complements/notfound/notfound.component';
//import { UsuarioComponent } from './usuario/usuario/usuario.component';
//import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
//import { AgregarUsuarioComponent } from './usuario/agregar-usuario/agregar-usuario.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfiguracionComponent } from './configuracion/configuracion/configuracion.component';
import { UnauthorizedComponent } from './complements/unauthorized/unauthorized.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { CambioComponent } from './cambio/cambio/cambio.component';
import { ReporteOperacionComponent } from './operacion/reporte-operacion/reporte-operacion.component';
import { ChartsModule } from 'ng2-charts';
import { ListaOperacionComponent } from './operacion/lista-operacion/lista-operacion.component';
import { CrearNovedadComponent } from './novedad/crear-novedad/crear-novedad.component';
import { ListaNovedadComponent } from './novedad/lista-novedad/lista-novedad.component';
import { CargueArchivoComponent } from './archivo/cargue-archivo/cargue-archivo.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { UsuarioComponent } from './usuario/usuario/usuario.component';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { AgregarUsuarioComponent } from './usuario/agregar-usuario/agregar-usuario.component';
import { ChartModule } from 'primeng/chart';
import { ListadoNovedadesComponent } from './novedad/listado-novedades/listado-novedades.component';
import { OperacionIndexComponent } from './operacion/operacion-index/operacion-index.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';


//
import { NgxSpinnerModule } from "ngx-spinner";
import { ConsultarArchivoComponent } from './archivo/consultar-archivo/consultar-archivo.component';
import { AsistenciaComponent } from './novedad/asistencia/asistencia.component';
import { NgxSpinnerService } from 'ngx-spinner';
//Dependencias seguridad
import { AuthInterceptor } from 'src/seguridad/auth.interceptor';
import { ConsultaOperadorComponent } from './operador/consulta-operador/consulta-operador.component';
import { CargueArchivoUnoComponent } from './archivo/cargue-archivo-uno/cargue-archivo-uno.component';
import { CargueArchivoDosComponent } from './archivo/cargue-archivo-dos/cargue-archivo-dos.component';
import { CargueArchivoTresComponent } from './archivo/cargue-archivo-tres/cargue-archivo-tres.component';

// Select
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { ɵs } from '@ng-select/ng-select';
import { EditarNovedadComponent } from './novedad/editar-novedad/editar-novedad.component';
import { CrearServicioComponent } from './servicio/crear-servicio/crear-servicio.component';
import { CargueNovedadComponent } from './archivo/cargue-novedad/cargue-novedad.component';
import { CargueMatrizDistanciaComponent } from './archivo/cargue-matriz-distancia/cargue-matriz-distancia.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ReporteInterrupcionesComponent } from './reportes/reporte-interrupciones/reporte-interrupciones.component';
import { CambioOperadorDisponibleComponent } from './novedad/cambio-operador-disponible/cambio-operador-disponible.component';
import { ConsultarComponent } from './servicio/consultar/consultar.component';
import { MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { EditarCrearComponent } from './servicio/editar-crear/editar-crear.component';


// NG PRIME
import { ListboxModule } from 'primeng/listbox';
import { CardModule, } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AdministracionOperadorComponent } from './configuracion/administracion-operador/administracion-operador.component';


import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';


import { FormularioOperadorComponent } from './configuracion/administracion-operador/formulario-operador/formulario-operador.component';
import { NovedadCambioBusComponent } from './novedad/novedad-cambio-bus/novedad-cambio-bus.component';
import { NovedadCambioOperadorComponent } from './novedad/novedad-cambio-operador/novedad-cambio-operador.component';
import { NovedadSinCambioComponent } from './novedad/novedad-sin-cambio/novedad-sin-cambio.component';
import { SeleccionBotonComponent } from './util-component/seleccion-boton/seleccion-boton.component';
import { AsignarBusComponent } from './asignar-bus/asignar-bus.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    NotfoundComponent,
    UsuarioComponent,
    EditarUsuarioComponent,
    AgregarUsuarioComponent,
    ConfiguracionComponent,
    UnauthorizedComponent,
    CambioComponent,
    ReporteOperacionComponent,
    ListaOperacionComponent,
    CrearNovedadComponent,
    ListaNovedadComponent,
    CargueArchivoComponent,
    ListadoNovedadesComponent,
    OperacionIndexComponent,
    ConsultarArchivoComponent,
    AsistenciaComponent,
    ConsultaOperadorComponent,
    CargueArchivoUnoComponent,
    CargueArchivoDosComponent,
    CargueArchivoTresComponent,
    EditarNovedadComponent,
    CrearServicioComponent,
    CargueNovedadComponent,
    CargueMatrizDistanciaComponent,
    ReporteInterrupcionesComponent,
    CambioOperadorDisponibleComponent,
    AdministracionOperadorComponent,
    FormularioOperadorComponent,
    NovedadCambioBusComponent,
    NovedadCambioOperadorComponent,
    NovedadSinCambioComponent,
    SeleccionBotonComponent,
    ConsultarComponent,
    EditarCrearComponent,
    AsignarBusComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    NgxFileDropModule,
    NgxPermissionsModule.forRoot(),
    TableModule,
    BrowserAnimationsModule,
    CalendarModule,
    MultiSelectModule,
    ChartModule,
    TabMenuModule,
    ContextMenuModule,
    NgxSpinnerModule,
    OverlayPanelModule,
    ToggleButtonModule,
    NgSelectModule,
    TooltipModule,
    InplaceModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    InputTextModule,
    ListboxModule,
    CardModule,
    ButtonModule,
    FlexLayoutModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    InputTextModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DatePipe,
    NgxSpinnerService,
    NgSelectConfig,
    ɵs
  ],
  entryComponents: [
    FormularioOperadorComponent,
    NovedadCambioBusComponent,
    NovedadCambioOperadorComponent,
    NovedadSinCambioComponent,
    SeleccionBotonComponent,
    CrearServicioComponent,
    EditarCrearComponent,
    AsignarBusComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
