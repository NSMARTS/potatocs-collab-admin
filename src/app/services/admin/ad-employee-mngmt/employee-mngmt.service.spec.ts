import { TestBed } from '@angular/core/testing';

import { EmployeeMngmtService } from './employee-mngmt.service';

describe('EmployeeMngmtService', () => {
  let service: EmployeeMngmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeMngmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
