# photo-gallery Specification

## Purpose
Zeigt die Hochzeitsfotos als Kacheln, erlaubt die Ansicht in groß und das Herunterladen einzelner Fotos und ganzer Pakete, auf Handy und Desktop.

## Requirements

### Requirement: Fotos als quadratische Kacheln
Die Galerie SHALL Vorschaubilder als quadratisch zugeschnittene Kacheln in einem Raster zeigen. Das Raster SHALL auf dem Handy mindestens 2 Spalten haben, auf Tablets 3–4, auf Desktops 5–6.

#### Scenario: Handy-Ansicht
- **WHEN** die Galerie auf einem Handy (schmale Breite) geöffnet wird
- **THEN** liegen mindestens 2 Kacheln nebeneinander
- **AND** keine Kachel nimmt die volle Breite allein ein

#### Scenario: Nur Vorschaubilder in den Kacheln
- **WHEN** die Kacheln geladen werden
- **THEN** werden nur die Vorschaubilder (Thumbnails) geladen, nicht die Originale

#### Scenario: Nachladen beim Scrollen
- **WHEN** der Gast scrollt
- **THEN** werden Vorschaubilder außerhalb des sichtbaren Bereichs erst bei Bedarf geladen

### Requirement: Lightbox mit vollständigem Foto
Ein Tipp auf eine Kachel SHALL das Foto in einer Lightbox in voller Ansicht ohne Zuschnitt zeigen. Die Lightbox SHALL Vor und Zurück, Wischen auf dem Handy und Schließen erlauben.

#### Scenario: Foto öffnen
- **WHEN** der Gast eine Kachel antippt
- **THEN** öffnet sich die Lightbox mit dem Foto in Handy-Qualität (scharf, nicht zugeschnitten)

#### Scenario: Zum nächsten Foto
- **WHEN** der Gast in der Lightbox nach links wischt oder "Weiter" wählt
- **THEN** erscheint das nächste Foto

#### Scenario: Schließen
- **WHEN** der Gast die Lightbox schließt
- **THEN** sieht er wieder das Raster an der vorherigen Scroll-Position

### Requirement: Einzel-Download in Originalqualität
Die Lightbox SHALL einen Download-Button für das Foto in Originalqualität anbieten.

#### Scenario: Original herunterladen
- **WHEN** der Gast den Download-Button antippt
- **THEN** startet der Download der Originaldatei

### Requirement: Paket-Download
Die Galerie SHALL alle vom Backend gelieferten ZIP-Pakete auflisten, getrennt nach Originalqualität (mehrere Pakete) und Handy-Qualität (ein Paket), mit Paketnummer (z. B. „Paket 1 von 3“) und Größe.

#### Scenario: Pakete anzeigen
- **WHEN** der Gast den Bereich "Alle herunterladen" öffnet
- **THEN** sieht er die Original-Pakete (nummeriert) und das Handy-Qualität-Paket mit jeweils der Dateigröße

#### Scenario: Paket herunterladen
- **WHEN** der Gast ein Paket wählt
- **THEN** startet der Download dieses ZIPs

### Requirement: Lade- und Fehlerzustände
Die Galerie SHALL einen Ladezustand und bei Fehlern eine verständliche Meldung mit Wiederholen-Möglichkeit zeigen.

#### Scenario: Liste kann nicht geladen werden
- **WHEN** die Foto-Liste nicht geladen werden kann
- **THEN** sieht der Gast eine Fehlermeldung und kann es erneut versuchen

### Requirement: Abgelaufene Sitzung wird erkannt
Die Galerie SHALL beim Laden von Bildern, beim Öffnen der Lightbox und beim Öffnen des Download-Bereichs prüfen, ob die Sitzung noch gilt, und bei einer abgelaufenen Sitzung zur Login-Seite führen. Eine zwischengespeicherte Foto-Liste SHALL höchstens 60 Sekunden gelten.

#### Scenario: Offener Tab am nächsten Tag
- **WHEN** ein Gast nach Ablauf der Sitzung wieder die Galerie öffnet
- **THEN** wird er zum Login geführt statt kaputte Bilder zu sehen

#### Scenario: Bild lässt sich nicht laden
- **WHEN** ein Vorschaubild nicht geladen werden kann und die Sitzung abgelaufen ist
- **THEN** wird der Gast zum Login geführt

### Requirement: Bedienbare Lightbox
Die Lightbox SHALL den Fokus beim Öffnen in den Dialog setzen, Tab im Dialog halten, beim Schließen den Fokus zur auslösenden Kachel zurückgeben, das Scrollen der Seite dahinter sperren und Vor/Zurück auch auf dem Handy für Screenreader und Tastatur erreichbar halten.

#### Scenario: Öffnen und Schließen per Tastatur
- **WHEN** ein Gast per Tastatur eine Kachel öffnet und die Lightbox mit Escape schließt
- **THEN** liegt der Fokus beim Öffnen im Dialog und danach wieder auf der Kachel

#### Scenario: Scrollen hinter der Lightbox
- **WHEN** die Lightbox offen ist und der Gast scrollt oder wischt
- **THEN** bleibt das Raster dahinter an seiner Position

### Requirement: Leere Galerie
Die Galerie SHALL bei null Fotos einen Hinweis statt eines leeren Rasters zeigen.

#### Scenario: Noch keine Fotos
- **WHEN** das Backend eine leere Foto-Liste liefert
- **THEN** sieht der Gast den Hinweis „Noch keine Fotos“

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
