import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionBotonComponent } from './seleccion-boton.component';

describe('SeleccionBotonComponent', () => {
  let component: SeleccionBotonComponent;
  let fixture: ComponentFixture<SeleccionBotonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionBotonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionBotonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
