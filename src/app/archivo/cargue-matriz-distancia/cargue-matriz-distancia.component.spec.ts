import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueMatrizDistanciaComponent } from './cargue-matriz-distancia.component';

describe('CargueMatrizDistanciaComponent', () => {
  let component: CargueMatrizDistanciaComponent;
  let fixture: ComponentFixture<CargueMatrizDistanciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargueMatrizDistanciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargueMatrizDistanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
