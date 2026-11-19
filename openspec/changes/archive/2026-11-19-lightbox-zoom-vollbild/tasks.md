# Tasks

## 1. Zoom

- [x] 1.1 `zoom-math.ts` mit Skalierungsgrenzen (1 bis 3), Zoom um einen Punkt und Begrenzung der Verschiebung an den Bildrändern. Verifikation: Unit-Tests für Grenzen, Zoom um die Mitte und um einen Randpunkt, Verschiebung über den Rand hinaus
- [x] 1.2 `ZoomGesture` für Pinch mit zwei Pointern, Verschieben mit einem Pointer bei Zoom > 1 und Doppeltipp (300 ms, 30 px, 2,5-fach). Verifikation: Unit-Tests mit synthetischen Pointer-Daten für Pinch, Pan, Doppeltipp und Einzeltipp
- [x] 1.3 In die Lightbox einbinden: `touch-action: none`, `transform` am Bild, Wischen nur bei Zoom = 1, Zoom-Reset beim Fotowechsel. Verifikation: Komponententests für „Gezoomtes Foto verschieben“ (kein Fotowechsel) und „Fotowechsel setzt Zoom zurück“; bestehende Lightbox-Tests bleiben grün

## 2. Vollbild

- [x] 2.1 `FullscreenService` mit `isSupported`, `enter(element)`, `exit()` und Meldung bei `fullscreenchange`, inklusive `webkit`-Präfix. Verifikation: Unit-Tests mit gemocktem `document` für unterstützt, nicht unterstützt und vom Browser beendetes Vollbild
- [x] 2.2 Vollbild-Button und `immersive`-Zustand in der Lightbox: Bedienelemente aus, Einzeltipp und Escape holen sie zurück, Schließen beendet das Vollbild, Wischen bleibt im Vollbild. Verifikation: Komponententests für alle Szenarien der Requirement „Vollbild in der Lightbox“, inklusive Fokus und `aria-pressed`

## 3. Abschluss

- [x] 3.1 `CHANGELOG.md` (Unreleased/Added) ergänzen. Verifikation: `ng test` und `ng build` grün
- [ ] 3.2 Sichtprüfung auf echtem iPhone (Safari) und Android (Chrome) nach dem Deployment: Pinch, Verschieben, Doppeltipp, Wischen, Vollbild an und aus. Verifikation: alle Szenarien der beiden neuen Requirements einmal durchgespielt

## Workflow follow-up

- Review (Opus, danach CodeRabbit gegen `main`), `openspec validate --all --strict`, `/opsx:archive`, Rebase auf `main`, Branch löschen, Frontend neu deployen.
