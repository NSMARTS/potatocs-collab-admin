import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractRejectComponent } from './contract-reject.component';

describe('ContractRejectComponent', () => {
  let component: ContractRejectComponent;
  let fixture: ComponentFixture<ContractRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractRejectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
