import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHolidayAddComponent } from './company-holiday-add.component';

describe('CompanyHolidayAddComponent', () => {
  let component: CompanyHolidayAddComponent;
  let fixture: ComponentFixture<CompanyHolidayAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyHolidayAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyHolidayAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
