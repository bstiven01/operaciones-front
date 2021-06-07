import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionOperadorComponent } from './administracion-operador.component';

describe('AdministracionOperadorComponent', () => {
  let component: AdministracionOperadorComponent;
  let fixture: ComponentFixture<AdministracionOperadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracionOperadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
