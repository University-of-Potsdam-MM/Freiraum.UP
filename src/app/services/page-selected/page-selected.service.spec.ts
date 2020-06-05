import { TestBed } from '@angular/core/testing';

import { PageSelectedService } from './page-selected.service';

describe('PageSelectedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageSelectedService = TestBed.get(PageSelectedService);
    expect(service).toBeTruthy();
  });
});
