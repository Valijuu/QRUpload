# Danke-Seite und Foto-Galerie – Entwurf

Stand: 2026-11-18 · Repos: `QRUpload` (Frontend, Angular) und `qrupload-backend-public` (Backend, Spring Boot) · Branch je Repo: `feature/danke-galerie`

## Absicht und Warum
Nach der Hochzeit sollen Gäste die Fotos in hoher Auflösung ansehen und herunterladen können. Die bisherige Einladungsseite (Tagesablauf, Speisen, Weddingpros …) wird nicht mehr gebraucht. Stattdessen: ein Dankeschön und ein Button zur Galerie.

## Ziele
- Startseite mit Dankestext ("Danke, dass ihr da wart …") und genau einem Button zur Galerie.
- Zugang zur Galerie über **ein gemeinsames Passwort**.
- Galerie als **Kachel-Grid** mit Vorschaubildern, gut auf Web und Handy (ca. 1000+ Fotos).
- Ansicht groß (Lightbox) und **Einzel-Download** der Originale.
- **Alles-Download** als mehrere ZIPs in Originalqualität plus ein ZIP in Handy-Qualität.
- Kosten praktisch null, auch wenn alle Gäste alles laden.

## Nicht-Ziele
- Kein Foto-Upload durch Gäste, keine Admin-Oberfläche.
- Keine Nutzerkonten, keine Kommentare, keine Likes.
- Keine Live-Bildverarbeitung im Backend.

## Anti-Ziele (wäre ein Fehlschlag, auch wenn es technisch läuft)
- Galerie lädt auf dem Handy langsam oder kaputt (z. B. Originale in den Kacheln, Safari blockiert Cookies).
- Fotos öffentlich erreichbar ohne Passwort.
- Unerwartete Cloud-Kosten.

## Entscheidungen (von dir getroffen)
- **Fotos in Cloudflare R2** (privater Bucket, kein Egress-Kostenrisiko).
- **Du lädst die Fotos selbst hoch**, per Skript und `rclone`.
- **Variante A:** Ein lokales Skript erzeugt vorab Thumbnails und ZIPs.
- **Backend auf Cloud Run**, Frontend auf Firebase Hosting.
- **ZIPs:** mehrere Originalpakete plus ein Handy-Qualität-Paket, die Qualität soll scharf bleiben.

## Ansatz
Bucket-Struktur: `originals/`, `thumbs/` (ca. 400 px), `mobile/` (2560 px, JPEG ca. 85), `zips/`.

**Backend:** Prüft das Passwort, setzt ein Cookie-JWT, listet den Bucket und gibt kurzlebige signierte Links aus (S3-API mit AWS-SDK).
- `POST /api/login` – Passwort prüfen, Cookie setzen.
- `GET /api/gallery` – Liste der Fotos und ZIP-Pakete.
- `GET /api/photos/{id}/thumb|original` und `GET /api/zips/{name}` – Weiterleitung auf signierten Link.

**Frontend:** Neue Startseite, Passwort-Seite und Galerie (CSS-Grid, `loading="lazy"`, Lightbox, Download-Buttons). Alte Seiten und das QR-Token-System entfallen.

**Verbindung:** Firebase Hosting leitet `/api/**` per Rewrite an Cloud Run weiter. So liegt alles auf einer Domain: kein CORS, Cookie funktioniert auch in Safari/iOS.

**Skript** (`tools/prepare-gallery`): Originalordner einlesen, Thumbnails, Handy-Versionen und ZIPs erzeugen und per `rclone` hochladen.

## Alternativen, die wir verworfen haben
- *Thumbnails im Backend bei Erstabruf (B):* braucht viel Rechenzeit, lange Wartezeit für die ersten Gäste.
- *Cloudflare Images (C):* kostet extra und bindet an den Anbieter.
- *Server-Ordner statt Bucket:* Risiko bei Last und Datenverlust.
- *Backend baut das ZIP selbst:* belastet den Server.

## Randbedingungen
- Cookie muss `__session` heißen (nur dieses reicht der Firebase-Rewrite durch), mit `HttpOnly`, `Secure`, `SameSite=Lax`.
- Rate-Limit am Login. Auf Cloud Run `max-instances` klein halten, da das Limit im Speicher liegt.
- Passwortvergleich in konstanter Zeit, Passwort und R2-Zugangsdaten als Secrets.
- Signierte Links gelten nur wenige Minuten und nur für das eine Objekt. Der Bucket bleibt privat.
- Dateinamen kommen aus der Bucket-Liste, nie ungeprüft vom Nutzer.

## Meine Entscheidungen (bitte prüfen)
- Handy-Qualität: 2560 px lange Kante, JPEG ca. 85.
- Thumbnails: ca. 400 px.
- ZIP-Größe: ca. 1 GB pro Paket, nach Fotoreihenfolge.
- Kachel-Layout: **Auf dem Handy immer mindestens 2 Kacheln nebeneinander**, nie eine pro Zeile. Spalten: Handy 2, Tablet 3–4, Desktop 5–6. Kacheln quadratisch zugeschnitten (`object-fit: cover`), kleiner Abstand. Im Lightbox-Modus erscheint das Foto vollständig, ohne Zuschnitt.
- Login-Cookie: Laufzeit wenige Stunden, Limit z. B. 5 Versuche pro Minute und IP.
- Passwort nach dem Anlass rotieren oder Bucket löschen.

## Dem Bauenden überlassen
- Bibliothek für Thumbnails im Skript (z. B. `sharp` oder ImageMagick).
- Genaue Kachelgröße und Breakpoints (Vorgabe: siehe Spaltenzahl oben).
- Lightbox selbst bauen oder kleine Bibliothek.
- Details der Cloud-Run- und Cloudflare-Einrichtung.

## Umsetzung
OpenSpec-Change je Repo (`/opsx:propose`), danach EXACT-TDD (`vaju:tdd`). Frontend und Backend bekommen je einen eigenen Feature-Branch.
