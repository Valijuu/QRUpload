# Spec Delta

## ADDED Requirements

### Requirement: Zoom in der Lightbox
Die Lightbox SHALL das Foto mit zwei Fingern bis auf das Dreifache vergrößern und wieder bis zur ganzen Ansicht verkleinern lassen. Ein gezoomtes Foto SHALL sich mit einem Finger verschieben lassen, ohne dass es ganz aus dem Bild rutscht. Ein Doppeltipp SHALL hineinzoomen bzw. zur ganzen Ansicht zurückkehren.

#### Scenario: Mit zwei Fingern zoomen
- **WHEN** der Gast in der Lightbox zwei Finger auseinanderzieht
- **THEN** wird das Foto vergrößert, höchstens auf das Dreifache
- **AND** die übrige Seite wird nicht mitgezoomt

#### Scenario: Gezoomtes Foto verschieben
- **WHEN** das Foto gezoomt ist und der Gast mit einem Finger wischt
- **THEN** verschiebt sich der sichtbare Ausschnitt
- **AND** es wird nicht zum nächsten Foto gewechselt

#### Scenario: Doppeltipp
- **WHEN** der Gast auf ein nicht gezoomtes Foto doppelt tippt
- **THEN** wird das Foto an dieser Stelle vergrößert
- **AND** ein weiterer Doppeltipp zeigt wieder das ganze Foto

#### Scenario: Fotowechsel setzt Zoom zurück
- **WHEN** der Gast zu einem anderen Foto wechselt
- **THEN** erscheint das neue Foto ganz und nicht gezoomt

### Requirement: Vollbild in der Lightbox
Die Lightbox SHALL einen Vollbild-Button anbieten. Er SHALL Leiste, Zähler und Pfeile ausblenden und, wo der Browser es unterstützt, zusätzlich das echte Vollbild des Geräts aktivieren. Ein Tipp auf das Foto oder Escape SHALL das Vollbild beenden und die Bedienelemente zurückholen; Schließen der Lightbox SHALL das Vollbild ebenfalls beenden.

#### Scenario: Vollbild auf einem Gerät mit Vollbild-Unterstützung
- **WHEN** der Gast den Vollbild-Button antippt und der Browser Vollbild unterstützt
- **THEN** füllt das Foto den ganzen Bildschirm
- **AND** Leiste, Zähler und Pfeile sind ausgeblendet

#### Scenario: Vollbild auf dem iPhone
- **WHEN** der Gast den Vollbild-Button in einem Browser ohne Vollbild-Unterstützung antippt
- **THEN** sind Leiste, Zähler und Pfeile ausgeblendet und nur das Foto ist zu sehen

#### Scenario: Bedienelemente zurückholen
- **WHEN** im Vollbild der Gast einmal auf das Foto tippt
- **THEN** erscheinen Leiste, Zähler und Pfeile wieder
- **AND** das echte Vollbild des Geräts wird beendet

#### Scenario: Escape im Vollbild
- **WHEN** der Gast im Vollbild Escape drückt oder das Vollbild über das Gerät beendet (z. B. Zurück-Geste)
- **THEN** ist das Vollbild beendet und die Bedienelemente erscheinen wieder
- **AND** die Lightbox bleibt mit demselben Foto offen

#### Scenario: Schließen im Vollbild
- **WHEN** der Gast im Vollbild die Bedienelemente zurückholt und die Lightbox schließt
- **THEN** ist das Vollbild beendet und das Raster wieder normal sichtbar

#### Scenario: Wischen im Vollbild
- **WHEN** der Gast im Vollbild ein nicht gezoomtes Foto zur Seite wischt
- **THEN** erscheint das nächste bzw. vorherige Foto und der Vollbildmodus bleibt erhalten
