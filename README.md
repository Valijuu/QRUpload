# QRUpload

Die Website nach der Hochzeit: eine Dankesseite und eine passwortgeschützte Foto-Galerie. Gäste sehen die Fotos als Kacheln, öffnen sie groß, laden einzelne Originale oder alle Fotos als ZIP-Pakete herunter, am Computer wie am Handy.

Frontend (dieses Repo) und Backend bilden zusammen die Anwendung:

| Repo | Zweck |
|---|---|
| **QRUpload** (dieses Repo) | Angular-Frontend, ausgeliefert über Firebase Hosting |
| [qrupload-backend-public](https://github.com/Valijuu/qrupload-backend-public) | Spring-Boot-Backend auf Cloud Run: Passwort-Login, Foto-Liste, signierte Links in einen privaten Cloudflare-R2-Bucket, Skript zum Vorbereiten der Fotos |

## Features

- **Dankesseite:** Foto, Dankestext und ein Button zur Galerie, im bisherigen Design.
- **Passwort-Login:** ein gemeinsames Passwort für alle Gäste. Das Backend setzt ein `HttpOnly`-Cookie (`__session`), das der Browser-Code nie sieht.
- **Galerie:** quadratische Kacheln (Handy 2, Tablet 3–4, Desktop 5–6 Spalten), nur Vorschaubilder mit Lazy Loading.
- **Lightbox:** Foto in Handy-Qualität ohne Zuschnitt, Wischen, Pfeiltasten, Escape, Download des Originals.
- **Alle herunterladen:** ZIP-Pakete in Originalqualität (ca. 1 GB je Paket) und ein Paket in Handy-Qualität.

## Tech-Stack

- [Angular 21](https://angular.dev/) (Standalone-Components, Signals, zoneless, `@if`/`@for`)
- [Vitest](https://vitest.dev/) für Unit-Tests
- Firebase Hosting, das `/api/**` per Rewrite an Cloud Run weiterleitet

## Architektur

```
Browser ──► Firebase Hosting ──► /api/** (Rewrite) ──► Cloud Run (Spring Boot)
   │              (gleiche Domain, Cookie __session)          │
   │                                                          │ 302 auf signierten Link (5 min)
   └──────────────────────── Bilder & ZIPs ◄── privater R2-Bucket
```

- `POST /api/login` prüft das Passwort und setzt das Cookie.
- `GET /api/gallery` liefert Fotos und Pakete. Der `galleryGuard` nutzt diese Antwort, um zu erkennen, ob die Sitzung gilt (401 → Login).
- Kacheln, Lightbox und Downloads verweisen auf `/api/photos/{id}/{thumb|mobile|original}` bzw. `/api/zips/{name}`. Das Backend leitet dort auf kurzlebige signierte Links weiter.

Weil alles über eine Domain läuft, ist kein CORS nötig, und das Cookie funktioniert auch in Safari/iOS.

## Entwicklung

Voraussetzung: Node.js (LTS) und npm, dazu das Backend lokal auf Port 8080.

```bash
npm ci
npx ng serve
```

`ng serve` leitet `/api` über `proxy.conf.json` an `http://localhost:8080` weiter, wie Firebase Hosting im Betrieb. `apiBaseUrl` bleibt deshalb leer.

### Environment konfigurieren (Produktion)

1. `src/environments/environment.prod.example.ts` nach `src/environments/environment.prod.ts` kopieren.
2. `weddingImageUrl` eintragen (URL zum Foto auf der Dankesseite). `apiBaseUrl` bleibt leer.

`environment.prod.ts` ist in `.gitignore` und wird niemals committet.

## Tests

```bash
npx ng test --watch=false
```

## Build & Deployment

1. In `firebase.json` beim Rewrite `/api/**` die echte Cloud-Run-`serviceId` und Region eintragen.
2. Bilder kommen per Weiterleitung aus R2 (`https://*.r2.cloudflarestorage.com`, in der CSP freigegeben). Liegt das Foto der Dankesseite woanders, dessen Domain in `img-src` der CSP ergänzen.

```bash
npx ng build                      # Output nach dist/QRUpload/browser
firebase deploy --only hosting
```

Projekt-Zuordnung steht in `.firebaserc`. Sicherheits-Header (CSP, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`) setzt `firebase.json`.

## Projektstruktur

```
src/
  app/
    guards/        # galleryGuard: ohne gültige Sitzung zum Login
    services/      # AuthService (Login), GalleryService (Liste, Bild-/Paket-Adressen)
    route-paths.ts # Routen-Konstanten
  components/
    home/ welcome/ buttons/   # Dankesseite
    login/                    # Passwort-Abfrage
    gallery/ lightbox/        # Kacheln, Großansicht, Downloads
  environments/
```
