import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiredEmployeeListComponent } from './retired-employee-list.component';

describe('RetiredEmployeeListComponent', () => {
  let component: RetiredEmployeeListComponent;
  let fixture: ComponentFixture<RetiredEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetiredEmployeeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetiredEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
