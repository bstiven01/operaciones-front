import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioOperadorComponent } from './formulario-operador.component';

describe('FormularioOperadorComponent', () => {
  let component: FormularioOperadorComponent;
  let fixture: ComponentFixture<FormularioOperadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioOperadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
