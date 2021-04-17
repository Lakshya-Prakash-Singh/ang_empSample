import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpList2Component } from './emp-list2.component';

describe('EmpList2Component', () => {
  let component: EmpList2Component;
  let fixture: ComponentFixture<EmpList2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpList2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
