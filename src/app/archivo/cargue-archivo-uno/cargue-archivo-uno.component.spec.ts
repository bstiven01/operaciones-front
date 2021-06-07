import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueArchivoUnoComponent } from './cargue-archivo-uno.component';

describe('CargueArchivoUnoComponent', () => {
  let component: CargueArchivoUnoComponent;
  let fixture: ComponentFixture<CargueArchivoUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargueArchivoUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargueArchivoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
