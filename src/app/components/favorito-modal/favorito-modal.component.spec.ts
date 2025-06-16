import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritoModalComponent } from './favorito-modal.component';

describe('FavoritoModalComponent', () => {
  let component: FavoritoModalComponent;
  let fixture: ComponentFixture<FavoritoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
