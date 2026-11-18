# Tasks

## 1. Aufräumen und Routen

- [x] 1.1 Alte Komponenten (weddingpros, tagesablauf, speisen-getraenke, access-denied, date), `TokenService`, Token-Guard und nicht mehr genutzte `ActionService`-Methoden entfernen (`home`, `welcome`, `buttons` bleiben), nachdem alle Verwendungen geprüft sind; Verifikation: `ng build` und `ng test` laufen ohne Referenzfehler
- [x] 1.2 Routen auf `''` (Dankeseite), `login` und `galerie` reduzieren, unbekannte Pfade auf `''` umleiten; Verifikation: Router-Test für alle drei Routen und den Fallback

## 2. Dankeseite

- [x] 2.1 `Welcome`-Texte auf den Dankestext aus design.md umstellen, `Buttons` auf einen Button "Zu den Fotos" reduzieren, Foto-Karte und Stile unverändert lassen, mit Komponententest für Foto, Text und genau einen Button; Verifikation: Test grün, keine weiteren Links im DOM und Sichtvergleich mit dem `main`-Branch bei 375 und 1280 px

## 3. Login

- [x] 3.1 `AuthService` mit `login(passwort)` (POST `/api/login`) und `checkSession()` (GET `/api/gallery` Kopf) mit Tests für Erfolg, 401 und 429
- [x] 3.2 Login-Komponente mit einem Passwortfeld, Fehler- und Sperr-Meldung und Komponententests
- [x] 3.3 Guard für `galerie`, der ohne Sitzung zu `login` umleitet, mit Test

## 4. Galerie

- [x] 4.1 `GalleryService` (Liste und Pakete laden) mit Tests inkl. Fehlerfall
- [x] 4.2 Raster-Komponente mit quadratischen Kacheln, Lazy Loading und Spalten per Media Query; Verifikation: Komponententest und Sichtprüfung bei 375, 768 und 1280 px Breite
- [x] 4.3 Lightbox (Öffnen, Vor/Zurück, Wischen, Schließen, Download) mit Tests
- [x] 4.4 Bereich "Alle herunterladen" mit Original-Paketen und Handy-Paket (Name und Größe), mit Test
- [x] 4.5 Lade- und Fehlerzustand mit Wiederholen, mit Test

## 5. Betrieb

- [x] 5.1 `firebase.json` um den Rewrite `/api/**` → Cloud Run (Service-ID) und Sicherheits-Header (CSP, `nosniff`, `Referrer-Policy`, `frame-ancestors`) erweitern; Verifikation: lokaler Emulator-Aufruf von `/api/...` erreicht das Backend
- [x] 5.2 `environment.prod` auf relative `apiBaseUrl` umstellen, README und `CHANGELOG.md` aktualisieren; Verifikation: Produktions-Build läuft und README beschreibt den Ablauf
- [x] 5.3 Ende-zu-Ende-Prüfung gegen das lokale Backend (Login, Kacheln, Lightbox, Download) auf Desktop und Handy-Emulation

## Workflow follow-up

- Review (Opus, danach CodeRabbit gegen `main`), `openspec validate --all --strict`, `/opsx:archive`, Rebase auf `main`, Branch löschen.
