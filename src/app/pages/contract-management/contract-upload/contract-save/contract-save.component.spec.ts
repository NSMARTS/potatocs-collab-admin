import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractSaveComponent } from './contract-save.component';

describe('ContractSaveComponent', () => {
  let component: ContractSaveComponent;
  let fixture: ComponentFixture<ContractSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractSaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
