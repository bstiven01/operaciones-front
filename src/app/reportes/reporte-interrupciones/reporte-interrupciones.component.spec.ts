import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInterrupcionesComponent } from './reporte-interrupciones.component';

describe('ReporteInterrupcionesComponent', () => {
  let component: ReporteInterrupcionesComponent;
  let fixture: ComponentFixture<ReporteInterrupcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteInterrupcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteInterrupcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
