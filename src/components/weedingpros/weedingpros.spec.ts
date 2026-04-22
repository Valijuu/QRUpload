import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Weedingpros } from './weedingpros';

describe('Weedingpros', () => {
  let component: Weedingpros;
  let fixture: ComponentFixture<Weedingpros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Weedingpros],
    }).compileComponents();

    fixture = TestBed.createComponent(Weedingpros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
