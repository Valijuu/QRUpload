---
title: Das Startseitenfoto liegt als Datei im Frontend und wird über die Umgebungsdatei eingebunden
author: Valiju
date: 2026-11-22
branch: main
cost: { minutes: 3, tokens: 57893 }
id: l-86d96b84
scope: repo
status: active
src: agent
touches:
  - CHANGELOG.md
  - public/hochzeit-gruppenfoto.jpg
  - src/components/home/home.css
  - src/components/home/home.html
  - src/components/welcome/welcome.ts
  - src/environments/environment.ts
---

## Decided
Das Gruppenfoto wird verkleinert (2000 px, ca. 0,5 MB) im Frontend mitgeliefert, nicht extern gehostet. Die Foto-Karte nutzt 3:2, weil das Bild quer ist und bei 4:5 Gäste abgeschnitten würden.

## Watch out
Die Produktions-Umgebungsdatei ist gitignored. Der Bildpfad muss dort lokal gesetzt sein, sonst zeigt der Build das Platzhalter-Bild. Die Vorlage enthält weiter den Platzhalter.

In the code: public/hochzeit-gruppenfoto.jpg, weddingImageUrl in src/environments/environment.ts und environment.prod.ts, src/components/home/home.css
