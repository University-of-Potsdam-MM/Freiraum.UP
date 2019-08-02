# Freiraum.UP

## Benutzung

In das Projektverzeichnis wechseln und folgendes ausführen:

```bash
$ npm install
$ ionic serve
```

## Implementierte Komponenten

- Nächste ÖPNV-Abfahrten
- Mensa
- Freie Räume
- Veranstaltungen
- Minispiel
- Neuigkeiten
- Campus-Lageplan

## Erweiterung

Um die Anwendung um neue Komponenten zu erweitern, muss lediglich eine neue Angular-Komponente im Ordner `src/components` erstellt werden. Diese Komponente muss dann unter `src/app/app.component.ts` in das Objekt `componentsList` eingetragen werden, das im Konstruktor erstellt wird.