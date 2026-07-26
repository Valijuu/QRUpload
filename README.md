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

## Zugriffstoken, Upload-Link und Foto konfigurieren

Token, Nextcloud-Upload-Link und das Hochzeitsfoto werden über eine Environment-Datei konfiguriert, die **nicht** im Repository liegt:

1. `src/environments/environment.prod.example.ts` nach `src/environments/environment.prod.ts` kopieren.
2. Dort eintragen:
   - einen eigenen, zufälligen `accessToken`
   - den echten `uploadUrl` (Nextcloud-Freigabelink)
   - eine `weddingImageUrl`, die auf euer Foto zeigt (z. B. ein privater/unlisted Link, kein Pfad im Repo)
3. Denselben Token-Wert als `?token=...`-Parameter in der QR-Code-URL verwenden.
4. `src/environments/environment.prod.ts` ist in `.gitignore` und darf niemals committet werden.

Für die lokale Entwicklung (`ng serve`) wird automatisch `src/environments/environment.ts` mit Platzhalterwerten verwendet (das Foto erscheint dort als gebrochenes Bild, bis eine lokale `weddingImageUrl` gesetzt wird).

**Hinweis zu den Grenzen dieses Schutzes:** Diese Anwendung hat kein eigenes Backend. Token, Upload-Link und Bild-URL landen dadurch zwangsläufig im ausgelieferten JavaScript-Bundle und lassen sich von technisch versierten Personen über die Browser-Entwicklertools auslesen. Der Token schützt also nur vor zufälligen Besuchern, nicht vor gezieltem Zugriff. Für echten Schutz der hochgeladenen Fotos sollte zusätzlich der Nextcloud-Freigabelink selbst in Nextcloud mit einem Passwort abgesichert werden.

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
