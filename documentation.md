# Projekt: FreiraumUP

## Phase 1: Recherche (2018-11-01 bis 2018-11-7)

  - Theorie
    - Was ist Aufmerksamkeit?
    - Wie generiert man Interesse?
  - State of the art
    - Was ist ein CIS/Guidance System? 
    - Wer setzt das ein und wie? 
    - Wie ist der Erfolg?
  - Technik
    - Welche Vorzüge haben Touchfähige Endgeräte?
  - Umsetzung
    - Welches Framework? Ionic, Angular, oder anderes? und warum? Begründen!
    - Heatmap für jede View erzeugen und interpretieren (`heatmapjs`)
    - Wie eine einzelne Session erkennen und verfolgen?
    - Wie Klickpfade einer Session nachvollziehen?
    - Wie Aussagen aus Heatmaps und Nutzerzahlen folgernß

## Phase 2: Implementation (2018-11-08 bis 2019-02-28)

  - Bestehendes erfassen, umbauen und durch Interaktivität bereichern


| Bestehendes Feature                  | Mehrwert durch Touch                                |
| ------------------------------------ | --------------------------------------------------- |
| Öffentliche Verkehrsmittel           | Öffnen einzelner Verbindungen, Anzeige von Details  |
| Freie Räume                          | Details zur Raumbelegung anzeigen, Zeitpunkt wählen |
| Aktuell stattfindene Veranstaltungen | Details zu Veranstaltungen sehen                    |
| Mensa-Tagesplan                      | Details zu einzelnen Gerichten anzeigen             |
| Anzeigen                             | Generierung eines QR Codes nach Auswahl             |
| Tweets/Facebook-Feed                 | Generierung eines QR Codes nach Auswahl             |

- Neue Module konzipieren und umsetzen
  - Navigation zu Räumen/Personen => Hilfreich in vielen Situationen, könnte auch in Mobile.UP eingebunden werden
      - Benötigt Pläne der Campus und aller Gebäude und Zuordnungen von Personen zu Räumen
      - Vielleicht schwer zu realisieren aufgrund der Vorbedingungen
  - Räume suchen => Lernen der Raumnummer und des Campus-Aufbaus
      - Zufälligen Raum mit Nummer angeben
      - Raum auf Plan des Campus suchen
      - Ebenfalls eventuell schwierig (siehe Navigation)
  - Mensa-Gericht kreieren => Spaß
      - Alle möglichen Zutaten sammeln, kategorisieren und dann kombinieren
      - Erstellte Gerichte zwischenspeichern
      - Möglichkeit, über Gerichte abzustimmen
      - Beliebtestes Gericht vielleicht irgendwann unter Umständen evtl verwirklichen?
      - Sollte einfach zu realisieren sein
  - Kleine IT-Hilfen und Minispiele => Spaß und hilfreich
      - Schaltkreise erstellen
      - Zahlen umrechnen (kann auch extern eingebunden werden)
      - Sollte auch einfach zu realisieren sein
- Zwei Modi implementieren
  - Interaktiver Touch-Modus, der trotzdem nach einer Weile (Timeout) auch eigenständig durchschaltet
  - Nicht-interaktiver Modus, der nur durchschaltet
- Anzeigen-Modul: Anzeigen per pull aus anderem Verzeichnis beziehen? 
- GUI entwerfen
- `heatmapjs` einbauen und jede View tracken
  - Einzelne `click` Events und ausgelöste Aktion speichern 
  - Übergänge von View zu View speichern
  - Rückker zu Home-View nach Timeout speichern
  - Session erfassen
      - *Beginn einer Session*: Bei erster Interaktion nach einem Timeout
      - *Ende einer Session*: Bei Timeout (Ende der Session dann bei Zeitpunkt $T_{Ende}-t_{timeout}$ ) oder wenn die Home-View nicht verlassen wurde bei Timeout nach letzter Interaktion
- Deployment:
  - Pro Gerät direkt mit `ionic serve`
  - Zentral mehrere Instanzen von `ionic serve` ausführen und jedes Endgerät eine der Instanzen darstellen lassen

## Phase 3: Evaluation (2019-03-01 bis 2019-03-30)

### Evaluation I

### Auswertung Evaluation I und Vornehmen von Verbesserungen

### Evluation II: Auswertung der Verbesserung

