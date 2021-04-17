import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpList1Component } from './emp-list1.component';

describe('EmpList1Component', () => {
  let component: EmpList1Component;
  let fixture: ComponentFixture<EmpList1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpList1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpList1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
