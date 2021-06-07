import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadCambioOperadorComponent } from './novedad-cambio-operador.component';

describe('NovedadCambioOperadorComponent', () => {
  let component: NovedadCambioOperadorComponent;
  let fixture: ComponentFixture<NovedadCambioOperadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovedadCambioOperadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadCambioOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
