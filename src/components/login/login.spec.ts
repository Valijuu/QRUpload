import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';
import { AuthService, LoginResult } from '../../app/services/auth/auth-service';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let element: HTMLElement;
  let loginResult: LoginResult;
  const login = vi.fn((password: string) => Promise.resolve(loginResult));

  beforeEach(async () => {
    login.mockClear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthService, useValue: { login } }],
    }).compileComponents();
    fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  async function submit(password: string) {
    const input = element.querySelector('input') as HTMLInputElement;
    input.value = password;
    input.dispatchEvent(new Event('input'));
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  }

  it('hat genau ein Passwortfeld und einen Button', () => {
    const inputs = element.querySelectorAll('input');
    expect(inputs.length).toBe(1);
    expect(inputs[0].type).toBe('password');
    expect(element.querySelectorAll('button[type=submit]').length).toBe(1);
  });

  it('führt bei richtigem Passwort zur Galerie', async () => {
    loginResult = 'ok';
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    await submit('geheim');

    expect(login).toHaveBeenCalledWith('geheim');
    expect(navigate).toHaveBeenCalledWith(['/galerie']);
  });

  it('zeigt bei falschem Passwort eine Meldung und bleibt', async () => {
    loginResult = 'wrong';
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');

    await submit('falsch');

    expect(element.querySelector('[role=alert]')?.textContent).toContain('Das Passwort stimmt leider nicht');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('zeigt bei zu vielen Versuchen den Hinweis auf später', async () => {
    loginResult = 'locked';

    await submit('falsch');

    expect(element.querySelector('[role=alert]')?.textContent).toContain('später');
  });

  it('zeigt bei einem sonstigen Fehler eine Meldung', async () => {
    loginResult = 'error';

    await submit('egal');

    expect(element.querySelector('[role=alert]')?.textContent).toContain('nicht geklappt');
  });

  it('verknüpft die Meldung mit dem Feld und setzt den Fokus nach einem Fehler dorthin', async () => {
    loginResult = 'wrong';
    document.body.appendChild(element);

    await submit('falsch');

    const input = element.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const messageId = input.getAttribute('aria-describedby')!;
    expect(element.querySelector(`#${messageId}`)?.textContent).toContain('Passwort');
    expect(document.activeElement).toBe(input);
    element.remove();
  });

  it('schickt nicht doppelt ab, solange die Anmeldung läuft', async () => {
    let finish!: (value: LoginResult) => void;
    login.mockImplementationOnce(() => new Promise<LoginResult>((resolve) => (finish = resolve)));
    const input = element.querySelector('input') as HTMLInputElement;
    input.value = 'geheim';
    input.dispatchEvent(new Event('input'));

    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    finish('wrong');
    await fixture.whenStable();

    expect(login).toHaveBeenCalledTimes(1);
  });

  it('sendet nie per GET und legt das Passwort nicht in URL oder Speicher', async () => {
    loginResult = 'wrong';
    expect(element.querySelector('form')!.getAttribute('method')).toBe('post');

    await submit('geheim');

    expect(location.href).not.toContain('geheim');
    expect(JSON.stringify({ ...localStorage })).not.toContain('geheim');
    expect(JSON.stringify({ ...sessionStorage })).not.toContain('geheim');
  });

  it('schickt ein leeres Passwort nicht ab', async () => {
    await submit('');

    expect(login).not.toHaveBeenCalled();
  });
});
