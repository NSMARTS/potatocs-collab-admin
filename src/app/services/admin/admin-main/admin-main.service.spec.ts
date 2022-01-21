import { TestBed } from '@angular/core/testing';

import { AdminMainService } from './admin-main.service';

describe('AdminMainService', () => {
  let service: AdminMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
