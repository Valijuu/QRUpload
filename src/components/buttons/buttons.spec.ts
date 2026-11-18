import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Buttons } from './buttons';

describe('Buttons', () => {
  let fixture: ComponentFixture<Buttons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Buttons],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Buttons);
    await fixture.whenStable();
  });

  it('zeigt genau einen Button "Zu den Fotos"', () => {
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button.primary-btn');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent?.trim()).toBe('Zu den Fotos');
  });

  it('führt zur Galerie', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

    expect(navigate).toHaveBeenCalledWith(['/galerie']);
  });
});
