import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueArchivoTresComponent } from './cargue-archivo-tres.component';

describe('CargueArchivoTresComponent', () => {
  let component: CargueArchivoTresComponent;
  let fixture: ComponentFixture<CargueArchivoTresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargueArchivoTresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargueArchivoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
