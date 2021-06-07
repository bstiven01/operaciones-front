import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadSinCambioComponent } from './novedad-sin-cambio.component';

describe('NovedadSinCambioComponent', () => {
  let component: NovedadSinCambioComponent;
  let fixture: ComponentFixture<NovedadSinCambioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovedadSinCambioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadSinCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
