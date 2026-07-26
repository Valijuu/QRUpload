# QRUpload

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Zugriffs-Token konfigurieren

Der Zugriff auf die Seite wird über einen Token gesteuert, der **nicht** im Repository liegt:

1. `src/environments/environment.prod.example.ts` nach `src/environments/environment.prod.ts` kopieren.
2. Dort einen eigenen, zufälligen `accessToken`-Wert eintragen.
3. Denselben Wert als `?token=...`-Parameter in der QR-Code-URL verwenden.
4. `src/environments/environment.prod.ts` ist in `.gitignore` und darf niemals committet werden.

Für die lokale Entwicklung (`ng serve`) wird automatisch `src/environments/environment.ts` mit einem Platzhalter-Token verwendet.

**Hinweis zu den Grenzen dieses Schutzes:** Diese Anwendung hat kein eigenes Backend. Der Token landet dadurch zwangsläufig im ausgelieferten JavaScript-Bundle und lässt sich von technisch versierten Personen über die Browser-Entwicklertools auslesen. Der Token schützt also nur vor zufälligen Besuchern, nicht vor gezieltem Zugriff. Für echten Schutz der hochgeladenen Fotos sollte zusätzlich der Nextcloud-Freigabelink (in `action-service.ts`) mit einem Passwort abgesichert werden.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
