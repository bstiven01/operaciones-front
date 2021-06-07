import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadCambioBusComponent } from './novedad-cambio-bus.component';

describe('NovedadCambioBusComponent', () => {
  let component: NovedadCambioBusComponent;
  let fixture: ComponentFixture<NovedadCambioBusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovedadCambioBusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadCambioBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
