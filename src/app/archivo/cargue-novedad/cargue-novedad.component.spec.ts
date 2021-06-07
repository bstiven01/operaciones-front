import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueNovedadComponent } from './cargue-novedad.component';

describe('CargueNovedadComponent', () => {
  let component: CargueNovedadComponent;
  let fixture: ComponentFixture<CargueNovedadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargueNovedadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargueNovedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
