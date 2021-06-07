import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCrearComponent } from './editar-crear.component';

describe('EditarCrearComponent', () => {
  let component: EditarCrearComponent;
  let fixture: ComponentFixture<EditarCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
