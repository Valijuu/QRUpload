# Spec Delta

## Purpose

Zeigt die Hochzeitsfotos als Kacheln, erlaubt die Ansicht in groß und das Herunterladen einzelner Fotos und ganzer Pakete, auf Handy und Desktop.

## ADDED Requirements

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
Die Galerie SHALL alle vom Backend gelieferten ZIP-Pakete auflisten, getrennt nach Originalqualität (mehrere Pakete) und Handy-Qualität (ein Paket), mit Name und Größe.

#### Scenario: Pakete anzeigen
- **WHEN** der Gast den Bereich "Alle herunterladen" öffnet
- **THEN** sieht er die Original-Pakete und das Handy-Qualität-Paket mit jeweils der Dateigröße

#### Scenario: Paket herunterladen
- **WHEN** der Gast ein Paket wählt
- **THEN** startet der Download dieses ZIPs

### Requirement: Lade- und Fehlerzustände
Die Galerie SHALL einen Ladezustand und bei Fehlern eine verständliche Meldung mit Wiederholen-Möglichkeit zeigen.

#### Scenario: Liste kann nicht geladen werden
- **WHEN** die Foto-Liste nicht geladen werden kann
- **THEN** sieht der Gast eine Fehlermeldung und kann es erneut versuchen
