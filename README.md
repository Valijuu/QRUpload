# QRUpload

Eine gästefreundliche Hochzeits-Website: Gäste scannen einen QR-Code auf ihrer Einladung, gelangen auf eine per Token/JWT geschützte Seite und können dort direkt Fotos zu einer gemeinsamen Nextcloud-Galerie hochladen, den Tagesablauf und die Speisekarte einsehen sowie die Dienstleister der Hochzeit kennenlernen.

Frontend (dieses Repo) und Backend bilden zusammen die Anwendung:

| Repo | Zweck |
|---|---|
| **QRUpload** (dieses Repo) | Angular-Frontend, ausgeliefert über Firebase Hosting |
| [qrupload-backend](https://github.com/Valijuu/qrupload-backend) | Spring-Boot-Backend, prüft den Zugriffstoken und stellt JWTs aus |

> Hinweis: Namen, Fotos und Social-Links auf der „Hochzeitsprofis"-Seite sind in diesem öffentlichen Repo durch Platzhalterdaten ersetzt (siehe [`weddingpros-service.ts`](src/app/services/weddingpros/weddingpros-service.ts)).

## Features

- **QR-Code-Zugang:** Der Token aus der QR-Code-URL wird gegen das Backend geprüft; bei Erfolg wird ein JWT ausgestellt und lokal gespeichert (`authGuard`, `TokenService`).
- **Foto-Upload & Galerie:** Buttons öffnen die konfigurierten Nextcloud-Freigabelinks für Upload bzw. Galerie in einem neuen Tab.
- **Tagesablauf & Speisen/Getränke:** Statische Infoseiten mit dem Ablauf des Tages und der Menükarte.
- **Hochzeitsprofis:** Übersicht der Dienstleister (Moderation, Fotografie, DJ, Floristik, Tanzschule) mit Website- und Instagram-Links.
- **Zugriffsschutz:** Ungültige oder fehlende Tokens landen auf einer eigenen „Zugang verweigert"-Seite statt auf dem eigentlichen Inhalt.

## Tech-Stack

- [Angular 21](https://angular.dev/) mit Standalone-Components und dem neuen Control-Flow (`@for`)
- TypeScript, RxJS
- [Vitest](https://vitest.dev/) für Unit-Tests
- Firebase Hosting für das Deployment
- Kommunikation mit dem Spring-Boot-Backend über `HttpClient` (Fetch-basiert)

## Architektur: Zugriffsschutz

```
QR-Code-URL (?token=…)
        │
        ▼
  authGuard  ──► POST /api/auth/validate (Backend)
        │                  │
        │           gültig?│ liefert JWT
        ▼                  ▼
  TokenService speichert JWT lokal, prüft exp-Claim bei jedem Seitenaufruf
        │
        ▼
  Seite wird gerendert (Route hinter authGuard)
```

Details zum Backend (JWT-Ausstellung, CORS, Deployment) stehen im [Backend-README](https://github.com/Valijuu/qrupload-backend#readme).

## Entwicklung

Voraussetzung: Node.js (LTS empfohlen) und npm.

```bash
npm install
ng serve
```

Die App läuft dann unter `http://localhost:4200`. Für die lokale Entwicklung wird automatisch `src/environments/environment.ts` mit Platzhalterwerten verwendet; `apiBaseUrl` zeigt standardmäßig auf `http://localhost:8080` (das lokal laufende Backend).

### Environment konfigurieren (Produktion)

Backend-URL, Nextcloud-Links und das Hochzeitsfoto werden über eine Environment-Datei konfiguriert, die **nicht** im Repository liegt:

1. `src/environments/environment.prod.example.ts` nach `src/environments/environment.prod.ts` kopieren.
2. Werte eintragen:
   - `apiBaseUrl`: URL des deployten Spring-Boot-Backends (z. B. die Cloud-Run-URL)
   - `uploadUrl` / `galleryUrl`: echte Nextcloud-Freigabelinks
   - `weddingImageUrl`: URL zu eurem Foto (z. B. ein privater/unlisted Link, kein Pfad im Repo)
3. Den Zugangs-Token (identisch mit `WEDDING_ACCESS_TOKEN` im Backend) als `?token=...`-Parameter in der QR-Code-URL verwenden.

`environment.prod.ts` ist in `.gitignore` und darf niemals committet werden.

**Grenzen dieses Schutzes:** Upload-Link und Bild-URL landen im ausgelieferten JavaScript-Bundle und lassen sich von technisch versierten Personen über die Browser-Entwicklertools auslesen. Der Zugangs-Token wird serverseitig geprüft, steht aber offen in der QR-Code-URL und schützt daher nur vor zufälligen Besuchern, nicht vor gezieltem Zugriff. Für echten Schutz der hochgeladenen Fotos sollte zusätzlich der Nextcloud-Freigabelink selbst mit einem Passwort abgesichert werden.

## Tests

```bash
ng test          # Unit-Tests (Vitest)
```

## Build & Deployment

```bash
ng build --configuration production   # Output nach dist/QRUpload/browser
firebase deploy --only hosting
```

Projekt-Zuordnung steht in `.firebaserc`.

## Projektstruktur

```
src/
  app/
    guards/       # authGuard: prüft Token/JWT vor jeder Route
    services/      # TokenService, ActionService, WeddingprosService
    interfaces/
  components/
    home/ welcome/ buttons/ date/            # Startseite
    tagesablauf/ speisen-getraenke/          # Infoseiten
    weddingpros/                              # Dienstleister-Übersicht
    access-denied/                            # Fallback bei ungültigem Token
  environments/
```
