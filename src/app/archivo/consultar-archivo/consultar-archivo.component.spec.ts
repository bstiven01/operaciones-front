import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarArchivoComponent } from './consultar-archivo.component';

describe('ConsultarArchivoComponent', () => {
  let component: ConsultarArchivoComponent;
  let fixture: ComponentFixture<ConsultarArchivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarArchivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
