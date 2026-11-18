import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GALLERY_URL } from '../../app/route-paths';
import { AuthService, LoginResult } from '../../app/services/auth/auth-service';

const MESSAGES: Record<Exclude<LoginResult, 'ok'>, string> = {
  wrong: 'Das Passwort stimmt leider nicht. Bitte versucht es noch einmal.',
  locked: 'Zu viele Versuche. Bitte versucht es in einer Minute später noch einmal.',
  error: 'Die Anmeldung hat gerade nicht geklappt. Bitte versucht es später noch einmal.',
};

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly password = signal('');
  protected readonly message = signal<string | null>(null);
  protected readonly busy = signal(false);

  protected updatePassword(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.password() || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.message.set(null);
    const result = await this.auth.login(this.password());
    this.busy.set(false);
    if (result === 'ok') {
      await this.router.navigate([GALLERY_URL]);
      return;
    }
    this.message.set(MESSAGES[result]);
  }
}
