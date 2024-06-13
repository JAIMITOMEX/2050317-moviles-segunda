import { TestBed } from '@angular/core/testing';

import { FortoServiceService } from './forto-service.service';

describe('FortoServiceService', () => {
  let service: FortoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FortoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
