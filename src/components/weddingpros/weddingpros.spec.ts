import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Weddingpros } from './weddingpros';

describe('Weddingpros', () => {
  let component: Weddingpros;
  let fixture: ComponentFixture<Weddingpros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Weddingpros],
    }).compileComponents();

    fixture = TestBed.createComponent(Weddingpros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
