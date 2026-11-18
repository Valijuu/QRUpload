import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

const WIDE_ROUTE_FLAG = 'wide';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly route = inject(ActivatedRoute);
  protected readonly wide = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError,
        ),
      )
      .subscribe(() => {
        // Ladescreen aus index.html ausblenden, sobald die erste Navigation fertig ist
        document.getElementById('app-loading')?.remove();
        this.wide.set(this.deepestRouteIsWide());
      });
  }

  private deepestRouteIsWide(): boolean {
    let current = this.route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current.snapshot.data[WIDE_ROUTE_FLAG] === true;
  }
}
