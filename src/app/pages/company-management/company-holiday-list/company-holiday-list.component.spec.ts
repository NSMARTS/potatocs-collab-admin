import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHolidayListComponent } from './company-holiday-list.component';

describe('CompanyHolidayListComponent', () => {
  let component: CompanyHolidayListComponent;
  let fixture: ComponentFixture<CompanyHolidayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyHolidayListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyHolidayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
