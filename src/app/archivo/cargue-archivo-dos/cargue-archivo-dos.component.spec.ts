import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueArchivoDosComponent } from './cargue-archivo-dos.component';

describe('CargueArchivoDosComponent', () => {
  let component: CargueArchivoDosComponent;
  let fixture: ComponentFixture<CargueArchivoDosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargueArchivoDosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargueArchivoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
