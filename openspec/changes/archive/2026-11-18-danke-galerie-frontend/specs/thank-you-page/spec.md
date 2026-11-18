# Spec Delta

## Purpose

Zeigt Gästen nach der Hochzeit eine Dankesseite und führt mit einem einzigen Button zur Foto-Galerie.

## ADDED Requirements

### Requirement: Startseite zeigt Foto, Dankestext und einen Galerie-Button
Die Startseite (`/`) SHALL das Hochzeitsfoto, einen Dankestext ("Danke, dass ihr da wart …") und genau einen Button zur Galerie anzeigen. Sie SHALL ohne Login erreichbar sein.

#### Scenario: Gast öffnet die Startseite
- **WHEN** ein Gast die Startseite öffnet
- **THEN** sieht er das Hochzeitsfoto, den Dankestext und genau einen Button zur Galerie
- **AND** es werden keine Links zu Tagesablauf, Speisen oder Weddingpros angezeigt

### Requirement: Gleiches Erscheinungsbild wie die bisherige Startseite
Die Dankesseite SHALL das bisherige Erscheinungsbild der Startseite übernehmen (Farben, Schrift, Foto-Karte, Button-Stil, Seitenrahmen). Login- und Galerie-Seite SHALL denselben Rahmen und Button-Stil nutzen.

#### Scenario: Optik unverändert
- **WHEN** die Dankesseite mit der bisherigen Startseite verglichen wird
- **THEN** sind Foto-Karte, Textblock und Button im gleichen Stil dargestellt
- **AND** nur der Text und die Zahl der Buttons haben sich geändert

#### Scenario: Button führt zur Galerie
- **WHEN** der Gast den Galerie-Button antippt
- **THEN** wird er zur Galerie geleitet (bei fehlender Sitzung zur Passwort-Abfrage)

### Requirement: Alte Einladungsseiten sind nicht mehr erreichbar
Die Routen `weddingpros`, `tagesablauf`, `speisen-getraenke` und `zugang-verweigert` SHALL entfallen. Unbekannte Pfade SHALL auf die Startseite weiterleiten.

#### Scenario: Gast ruft eine alte Adresse auf
- **WHEN** ein Gast `/tagesablauf` aufruft
- **THEN** wird er zur Startseite weitergeleitet
