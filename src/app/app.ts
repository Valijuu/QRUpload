import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(router: Router) {
    // Blendet den Ladescreen aus index.html aus, sobald die erste Navigation
    // (inkl. der asynchronen Token-Prüfung im authGuard) abgeschlossen ist.
    router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError,
        ),
      )
      .subscribe(() => {
        document.getElementById('app-loading')?.remove();
      });
  }
}
