# Design

## Context

Die Lightbox (`src/components/lightbox/lightbox.ts`) übernimmt heute schon Pointer-Events auf der Bühne für das Wischen, hält den Fokus im Dialog und sperrt das Scrollen dahinter. Die Bühne hat `touch-action: pan-y`, das Bild ist mit `object-fit: contain` eingepasst. Die Handy-Version hat eine lange Kante von 2560 px. Motivation siehe proposal.md.

## Goals / Non-Goals

**Goals:**
- Zoomen und Verschieben fühlen sich auf iPhone und Android wie in einer Foto-App an.
- Die Lightbox-Komponente bleibt übersichtlich: Gesten-Mathematik und Fullscreen-API liegen in eigenen Einheiten.

**Non-Goals:**
- Kein Nachladen des Originals beim Zoomen.
- Kein Zoom mit dem Mausrad oder per Tastatur auf dem Desktop (dort reicht der Download).
- Kein Schwung (Trägheit) beim Verschieben.

## Decisions

**1. Eigene Gesten über Pointer-Events statt Browser-Zoom.** Die Bühne bekommt `touch-action: none`, die Lightbox verfolgt die aktiven Pointer. Zwei Pointer ergeben das Verhältnis der Fingerabstände (Pinch), ein Pointer bei Zoom > 1 verschiebt, ein Pointer bei Zoom = 1 bleibt das bisherige Wischen. Das Bild bekommt ein CSS-`transform: translate(...) scale(...)`.
- Alternative: Browser-Zoom erlauben (`touch-action: pinch-zoom`). Verworfen, weil dann die ganze Seite samt Leiste zoomt und Wischen und Zoom sich nicht sauber trennen lassen.
- Alternative: Bibliothek (z. B. Panzoom). Verworfen: Die Logik ist überschaubar, und eine weitere Abhängigkeit müsste gepinnt und geprüft werden.

**2. Zoom-Mathematik als reine Funktionen.** Eine Datei `zoom-math.ts` enthält Grenzen (Skala 1 bis 3), das Begrenzen der Verschiebung auf die Bildränder und das Zoomen um einen Punkt (Mitte der Finger, Ort des Doppeltipps). Sie kennt kein DOM und ist ohne Browser testbar. Eine kleine Klasse `ZoomGesture` hält den Pointer-Zustand und übersetzt Events in Aufrufe dieser Funktionen. Die Lightbox reicht nur die Events weiter und liest Skala und Verschiebung als Signale.

**3. Doppeltipp und Einzeltipp unterscheiden.** Zwei Tipps innerhalb von 300 ms und 30 px gelten als Doppeltipp. Ein Einzeltipp holt im Vollbild die Bedienelemente zurück, aber erst nach Ablauf der 300 ms, damit ein Doppeltipp nicht nebenbei das Vollbild beendet. Doppeltipp auf ein ungezoomtes Foto zoomt auf 2,5-fach um den Tipp-Punkt.

**4. Vollbild als zwei Ebenen.** Ein Signal `immersive` blendet Leiste, Zähler und Pfeile aus (alle Geräte). Ein `FullscreenService` (in `src/app/services/fullscreen/`) kapselt `requestFullscreen`/`exitFullscreen` samt `webkit`-Präfix (iPad-Safari) und meldet `fullscreenchange`. Beendet der Browser das Vollbild selbst (Escape, Zurück-Geste), setzt die Lightbox `immersive` zurück. Fehlt die API (iPhone), bleibt es beim Ausblenden.
- Alternative: nur den Service ohne Ersatz. Verworfen, weil iPhone-Gäste dann keinen Vollbildmodus hätten.

**5. Barrierefreiheit.** Der Vollbild-Button hat ein `aria-label` und `aria-pressed`. Die Pfeil-Buttons bleiben im DOM, werden im Vollbild aber per `visibility: hidden` aus der Tab-Reihenfolge genommen; der Fokus geht auf die Bühne. Die Bühne bekommt `aria-label` mit dem Hinweis, dass ein Tipp die Bedienung zurückholt.

## Risks / Trade-offs

- [`touch-action: none` verhindert auf der Bühne jedes native Scrollen] → Die Bühne scrollt ohnehin nicht, das Scrollen dahinter ist schon gesperrt.
- [Gesten auf echten Geräten unterscheiden sich von Tests mit synthetischen Pointer-Events] → Sichtprüfung auf iPhone und Android als eigene Aufgabe.
- [Escape im echten Vollbild schließt nur das Vollbild, nicht die Lightbox] → So in der Spec festgehalten; ein zweites Escape schließt die Lightbox wie bisher.
- [Die Handy-Version wird beim 3-fach-Zoom leicht weich] → Vom Nutzer so entschieden; für volle Schärfe gibt es den Original-Download.
