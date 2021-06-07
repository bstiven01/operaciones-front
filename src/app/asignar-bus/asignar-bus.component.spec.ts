import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarBusComponent } from './asignar-bus.component';

describe('AsignarBusComponent', () => {
  let component: AsignarBusComponent;
  let fixture: ComponentFixture<AsignarBusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarBusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
