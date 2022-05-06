import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractSignComponent } from './contract-sign.component';

describe('ContractSignComponent', () => {
  let component: ContractSignComponent;
  let fixture: ComponentFixture<ContractSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractSignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
