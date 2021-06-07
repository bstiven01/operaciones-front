import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioOperadorDisponibleComponent } from './cambio-operador-disponible.component';

describe('CambioOperadorDisponibleComponent', () => {
  let component: CambioOperadorDisponibleComponent;
  let fixture: ComponentFixture<CambioOperadorDisponibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioOperadorDisponibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioOperadorDisponibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
