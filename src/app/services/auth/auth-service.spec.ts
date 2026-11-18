import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function answer(status: number) {
    const request = http.expectOne('/api/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ password: 'geheim' });
    request.flush(null, { status, statusText: String(status) });
  }

  it('meldet Erfolg bei 204', async () => {
    const result = service.login('geheim');
    answer(204);
    expect(await result).toBe('ok');
  });

  it('meldet falsches Passwort bei 401', async () => {
    const result = service.login('geheim');
    answer(401);
    expect(await result).toBe('wrong');
  });

  it('meldet Sperre bei 429', async () => {
    const result = service.login('geheim');
    answer(429);
    expect(await result).toBe('locked');
  });

  it('meldet sonstige Fehler', async () => {
    const result = service.login('geheim');
    answer(503);
    expect(await result).toBe('error');
  });
});
