# Proposal

## Why

Auf dem Handy lassen sich Details in den Fotos (Gesichter, Gruppenbilder) in der Lightbox nicht ansehen: Die Lightbox übernimmt das Wischen selbst, und der Browser-Zoom vergrößert die ganze Seite statt des Fotos. Außerdem nehmen Leiste und Pfeile Platz weg. Gäste wünschen sich Zoom mit zwei Fingern und einen Vollbildmodus.

## What Changes

- Zoom in der Lightbox: Mit zwei Fingern bis 3-fach zoomen, das gezoomte Foto mit einem Finger verschieben, Doppeltipp zoomt hinein bzw. zurück. Gezoomt wird die Handy-Version, es wird nichts nachgeladen.
- Wischen zum nächsten Foto wirkt nur, solange das Foto nicht gezoomt ist. Beim Fotowechsel wird der Zoom zurückgesetzt.
- Vollbild-Button in der Lightbox: Wo der Browser es unterstützt, echtes Vollbild. Auf allen Geräten (auch iPhone, das für Bilder kein echtes Vollbild kann) werden dabei Leiste, Zähler und Pfeile ausgeblendet. Ein Tipp aufs Foto holt sie zurück. Schließen oder Escape beendet das Vollbild.

## Capabilities

### New Capabilities

_keine_

### Modified Capabilities

- `photo-gallery`: neue Requirements für Zoom und Vollbild in der Lightbox. „Lightbox mit vollständigem Foto“ bleibt unverändert, das Wischen wird in der neuen Zoom-Requirement eingeschränkt.

## Impact

- Code: `src/components/lightbox/` (Template, Styles, Komponente), neue Einheiten für die Zoom-Berechnung und den Zugriff auf die Fullscreen-API.
- Keine Backend-Änderung, keine neuen Abhängigkeiten.
- Tests: Komponenten- und Unit-Tests für Gesten, Zoom-Grenzen und Vollbild; Sichtprüfung auf echtem Handy (iPhone und Android).
