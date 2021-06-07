import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaNovedadComponent } from './lista-novedad.component';

describe('ListaNovedadComponent', () => {
  let component: ListaNovedadComponent;
  let fixture: ComponentFixture<ListaNovedadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaNovedadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaNovedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
