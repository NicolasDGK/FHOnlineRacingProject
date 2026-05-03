import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fh5SearchResults } from './fh5-search-results';

describe('Fh5SearchResults', () => {
  let component: Fh5SearchResults;
  let fixture: ComponentFixture<Fh5SearchResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fh5SearchResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fh5SearchResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
