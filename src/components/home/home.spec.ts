import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Home } from './home';
import { environment } from '../../environments/environment';

describe('Home (Dankeseite)', () => {
  let fixture: ComponentFixture<Home>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('zeigt das Hochzeitsfoto in der Foto-Karte', () => {
    const image = element.querySelector('.wedding-image-card img.wedding-image') as HTMLImageElement;
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe(environment.weddingImageUrl);
  });

  it('startet beim Öffnen schon die Galerie-Anfrage, um das Backend aufzuwecken', () => {
    TestBed.inject(HttpTestingController).expectOne('/api/gallery');
  });

  it('zeigt den Dankestext', () => {
    expect(element.textContent).toContain('DANKE, DASS IHR DA WART');
    expect(element.textContent).toContain('Ihr habt unseren Tag unvergesslich gemacht');
  });

  it('hat genau einen Button und keinen Datum/Ort-Block', () => {
    expect(element.querySelectorAll('button').length).toBe(1);
    expect(element.querySelector('app-date')).toBeNull();
    expect(element.textContent).not.toContain('Datum');
  });
});
