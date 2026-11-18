import { TestBed } from '@angular/core/testing';
import { Welcome } from './welcome';

describe('Welcome', () => {
  it('zeigt Eyebrow, Titel, Untertitel und Dankestext', async () => {
    await TestBed.configureTestingModule({ imports: [Welcome] }).compileComponents();
    const fixture = TestBed.createComponent(Welcome);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.eyebrow')?.textContent).toBe('DANKE, DASS IHR DA WART');
    expect(element.querySelector('.title')?.textContent).toBe('Ihr habt unseren Tag unvergesslich gemacht');
    expect(element.querySelector('.subtitle')?.textContent).toContain('Von Herzen');
    expect(element.querySelector('.guest-text')?.textContent).toContain('Fotos');
  });
});
