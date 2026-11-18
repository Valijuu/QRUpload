# gallery-login Specification

## Purpose
Schützt die Galerie mit einem gemeinsamen Passwort und führt Gäste ohne gültige Sitzung zur Passwort-Abfrage.

## Requirements

### Requirement: Passwort-Abfrage mit einem Feld
Die Login-Seite SHALL genau ein Passwortfeld und einen Bestätigen-Button zeigen. Das Passwort SHALL nur zum Backend gesendet werden und nicht im Browser gespeichert oder in der URL stehen.

#### Scenario: Richtiges Passwort
- **WHEN** der Gast das richtige Passwort abschickt
- **THEN** wird er zur Galerie geleitet

#### Scenario: Falsches Passwort
- **WHEN** der Gast ein falsches Passwort abschickt
- **THEN** sieht er eine Fehlermeldung ohne Hinweis auf das richtige Passwort
- **AND** bleibt auf der Login-Seite

#### Scenario: Zu viele Versuche
- **WHEN** das Backend wegen zu vieler Versuche mit HTTP 429 antwortet
- **THEN** sieht der Gast den Hinweis, es später erneut zu versuchen

### Requirement: Galerie nur mit gültiger Sitzung
Die Galerie-Route SHALL nur mit gültiger Sitzung (Cookie `__session`) erreichbar sein. Der Browser-Code SHALL das Cookie nicht lesen können (HttpOnly).

#### Scenario: Aufruf ohne Sitzung
- **WHEN** ein Gast die Galerie ohne gültige Sitzung öffnet
- **THEN** wird er zur Login-Seite geleitet

#### Scenario: Sitzung läuft ab
- **WHEN** das Backend eine Anfrage der Galerie mit HTTP 401 beantwortet
- **THEN** wird der Gast zur Login-Seite geleitet
