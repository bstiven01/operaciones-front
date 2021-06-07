import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaOperadorComponent } from './consulta-operador.component';

describe('ConsultaOperadorComponent', () => {
  let component: ConsultaOperadorComponent;
  let fixture: ComponentFixture<ConsultaOperadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaOperadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
