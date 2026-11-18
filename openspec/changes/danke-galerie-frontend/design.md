# Design

## Context

Das Frontend ist Angular 21 (Vitest) auf Firebase Hosting. Aktuell gibt es einen Token-Guard (`authGuard`, `TokenService`), der ein QR-Token beim Backend prüft und das JWT in `localStorage` ablegt. Der Backend-Aufruf nutzt `environment.apiBaseUrl` (Dev: `http://localhost:8080`). Motivation: siehe proposal.md.

## Goals / Non-Goals

**Goals:**
- Einfache Seitenstruktur: Start, Login, Galerie.
- Gute Handy-Nutzung (2 Spalten, Lazy Loading, Wischen).
- Sitzung per HttpOnly-Cookie, damit `<img>` und Downloads ohne Header funktionieren.

**Non-Goals:**
- Kein Upload durch Gäste, keine Konten, keine Kommentare.
- Kein serverseitiges Rendern.

## Decisions

- **Cookie statt `localStorage`:** `<img>`-Tags und Download-Links senden keine Authorization-Header. Das Cookie `__session` (HttpOnly) wird automatisch mitgesendet. Der Name ist durch Firebase Hosting vorgegeben, das nur dieses Cookie an Cloud Run durchreicht. Alternative: signierte URLs mit Token im Query, verworfen (Token in URLs).
- **Rewrite `/api/**` → Cloud Run in `firebase.json`:** gleiche Domain, kein CORS, Cookie funktioniert auch in Safari/iOS. `apiBaseUrl` wird im Produktions-Build zu `''` (relativ). Alternative: Cross-Site-Cookie, verworfen (Safari blockiert Drittanbieter-Cookies).
- **Login-Zustand über Backend:** Der Guard fragt beim Backend (z. B. `GET /api/gallery`), ob die Sitzung gültig ist, statt das JWT im Browser zu dekodieren (HttpOnly, nicht lesbar). Bei 401 geht es zur Login-Seite.
- **Raster mit CSS Grid:** `repeat(auto-fill, minmax(...))` mit festen Mindestspalten per Media Query (Handy 2, Tablet 3–4, Desktop 5–6), `aspect-ratio: 1`, `object-fit: cover`, `loading="lazy"`, `decoding="async"`.
- **Lightbox selbst bauen:** kleine Standalone-Komponente (Tastatur, Wischen mit Pointer-Events). Alternative: Bibliothek, verworfen (Abhängigkeit für wenig Nutzen).
- **Bilder aus Backend-Links:** Die Liste liefert pro Foto relative Adressen (`/api/photos/{id}/thumb|mobile|original`). Das Backend leitet auf einen kurzlebigen signierten R2-Link weiter.
- **Design der Startseite bleibt:** `Home` behält Foto-Karte (`environment.weddingImageUrl`), `Welcome` (nur neue Texte) und `Buttons` (nur noch der Galerie-Button, gleiche Klasse `primary-btn`). Seitenrahmen und Stile in `app.css` bleiben, Login und Galerie nutzen dieselben Klassen. Alternative: neue Komponenten, verworfen (würde das Design duplizieren).
- **Alte Komponenten, `ActionService`-Methoden und `TokenService` löschen** (nach Prüfung, dass nichts sie noch nutzt): `weddingpros`, `tagesablauf`, `speisen-getraenke`, `access-denied` und `date`.

## Dankestext (Entwurf, wird von dir korrigiert)

Aufbau wie bisher in `Welcome` (Eyebrow, Titel, Untertitel, Fließtext):

- **Eyebrow:** DANKE, DASS IHR DA WART
- **Titel:** Ihr habt unseren Tag unvergesslich gemacht
- **Untertitel:** Von Herzen: Danke, dass ihr diesen besonderen Tag mit uns gefeiert habt.
- **Fließtext:** Eure Umarmungen, euer Lachen und eure guten Wünsche haben diesen Tag zu etwas ganz Besonderem gemacht. Wir sind unendlich dankbar, dass ihr dabei wart. Hier findet ihr die Fotos, damit ihr die schönsten Momente noch einmal erleben und mit nach Hause nehmen könnt.
- **Button:** Zu den Fotos

## Risks / Trade-offs

- [Viele Kacheln auf schwachen Handys] → Thumbnails klein (ca. 400 px), Lazy Loading, ggf. Paginierung nach Abschnitten.
- [Lange Weiterleitungen pro Bild belasten das Backend] → Antwort mit `Cache-Control` für die Weiterleitung, signierte Links gelten einige Minuten.
- [Cookie läuft in der Lightbox ab] → 401 führt zum Login, danach Rückkehr zur Galerie.

## Migration Plan

Neue Seite auf dem Feature-Branch bauen, lokal gegen das Backend testen, dann Firebase-Rewrite setzen und deployen. Rückfall: alte Hosting-Version in der Firebase-Konsole zurückholen.
