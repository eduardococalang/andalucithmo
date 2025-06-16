import { TestBed } from '@angular/core/testing';

import { FavoritosFirebaseService } from './favoritos-firebase.service';

describe('FavoritosFirebaseService', () => {
  let service: FavoritosFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritosFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
