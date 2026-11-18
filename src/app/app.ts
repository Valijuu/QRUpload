import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { WIDE_ROUTE_FLAG } from './route-paths';

const LOADING_SCREEN_ID = 'app-loading';

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
        document.getElementById(LOADING_SCREEN_ID)?.remove();
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
