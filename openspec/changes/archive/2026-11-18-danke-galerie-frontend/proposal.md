# Proposal

## Why

Die Hochzeit ist vorbei. Die Einladungsseite (Tagesablauf, Speisen, Weddingpros, QR-Upload) wird nicht mehr gebraucht. Gäste sollen stattdessen die Fotos in hoher Auflösung ansehen und herunterladen können, auch bequem auf dem Handy.

## What Changes

- Startseite wird zur Dankesseite: gleiches Design und gleiches Foto wie bisher, neuer Dankestext ("Danke, dass ihr da wart …") und genau ein Button zur Galerie (statt fünf).
- Neue Login-Seite mit einem einzigen Passwortfeld (gemeinsames Passwort für alle Gäste).
- Neue Galerie mit quadratischen Kacheln (mindestens 2 nebeneinander auf dem Handy), Lightbox, Einzel-Download und Paket-Download (mehrere Original-ZIPs plus ein ZIP in Handy-Qualität).
- **BREAKING**: Die alten Seiten (Weddingpros, Tagesablauf, Speisen & Getränke), das QR-Token-Login (`?token=`, `TokenService`, `authGuard` mit Token) und die vier weiteren Startseiten-Buttons entfallen. Der Datum/Ort-Block der Startseite entfällt.
- Die Sitzung läuft über ein HttpOnly-Cookie (`__session`) statt über ein JWT im `localStorage`.
- Firebase Hosting leitet `/api/**` per Rewrite an das Backend auf Cloud Run weiter (gleiche Domain, kein CORS).

## Capabilities

### New Capabilities
- `thank-you-page`: Startseite mit Dankestext und einem Button zur Galerie.
- `gallery-login`: Passwort-Abfrage, Fehlerzustände und Schutz der Galerie-Route.
- `photo-gallery`: Kachel-Grid, Lightbox, Einzel-Download und Paket-Download.

### Modified Capabilities

(keine, es gibt noch keine Specs im Projekt)

## Impact

- Frontend (`QRUpload`): Routen (`app.routes.ts`), `Home`, `buttons`, `auth.guard.ts`, `token-service.ts`, neue Komponenten für Login und Galerie, `firebase.json` (Rewrite), Entfernen der alten Komponenten.
- Backend (`qrupload-backend-public`): siehe Change `danke-galerie-backend` (Endpunkte `/api/login`, `/api/gallery`, signierte Links).
- Betrieb: Firebase Hosting, Cloud Run, Cloudflare R2.
