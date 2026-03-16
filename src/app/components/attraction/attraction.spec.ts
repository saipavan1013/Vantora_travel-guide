import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Attraction } from './attraction';

describe('Attraction', () => {
  let component: Attraction;
  let fixture: ComponentFixture<Attraction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Attraction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Attraction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
