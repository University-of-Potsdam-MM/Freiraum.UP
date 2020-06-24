# Freiraum.UP

## Vorstellung

Dies ist die Neuimplementierung der Anwendung *Freiraum.UP*.

![img](documentation/Freiraum.UP.png)

Die Anwendung bietet eine Übersicht im Alltag der Studierenden. Freiraum.UP beinhaltet aktuell die Funktionen:

- Mensa-Speiseplan
- Abfahrten öffentlicher Verkehrsmittel
- Anzeige der aktuell freien Räume
- Anzeige der stattfindenden Veranstaltungen
- Einbindung vordefinierter Anzeigen
- Anzeige vordefinierter Twitter-Feeds
- Anzeige von Neuigkeiten und Events

Freiraum.UP kann in zwei verschiedenen Modi (interaktiv, nicht interaktiv) betrieben werden. Außerdem
kann Freiraum.UP sowohl im Hoch- als auch im Querformat verwendet werden. Die Anwendung wurde für den Betrieb
im Format 16:9 entwickelt.

## Lokales Ausführen

```bash
# Abhängigkeiten installieren
$ npm install
# Server starten und Anwendung ausführen
$ ionic serve 
```

## Build

```bash
$ npm install -g cordova ionic
$ ionic cordova platform add browser  
$ ionic cordova prepare browser
$ ionic cordova build browser --release
```

## Konfiguration

Damit die Anwendung funktioniert muss eine Datei `config.json` im Verzeichnis `src/assets/` platziert werden. 
Diese Datei konfiguriert die gesamte Anwendung. Das Verzeichnis [configs](configs) enthält Beispiele solcher Konfigurationen
für manche Gebäude der Universität Potsdam. Diese können bereits verwendet werden, es muss lediglich ein Wert für das zu
verwendende Token in `config.api.authorization` eingetragen werden. 
Eine Dokumentation der möglichen Optionen kann [hier](src/types/Config.ts) vorgefunden werden.

- Die in der Anwendung verwendeten Texte können im Verzeichnis [/i18n](src/assets/i18n) angepasst werden
- Eine Page ist **aktiviert** wenn
  1. ein dem Namen der Page in [page.config.ts](src/app/pages.config.ts) entsprechender Abschnitt in der Datei
     `src/assets/config.json` existiert.
  2. und in diesem Abschnitt das Attribut `disabled` entweder gar nicht erst definiert ist oder den Wert `false` hat.
- Durch setzen des Attributes `force_enabled` in der zu einer Page gehörenden Sektion der `config.json` wird eine Page
  aktiviert, auch wenn diese denn den aktuell gesetzten Wert von `config.general.interactive_mode` nicht unterstützt.

## Funktionsweise

Die in der Anwendung aktiven Seiten können in der Datei `src/app/pages.config.ts` angepasst werden.
Es können neu implementierte Seiten hinzugefügt und bestehende entfernt oder angepasst werden. Eine einzelne Seite
wird als Objekt der folgenden Form konfiguriert.

```ts
  {
    component: MensaPageComponent,
    name: 'mensa',
    icon: 'pizza',
    interactiveModes: [true, false]
  }
```

- `component`: verweist auf die zu verwendende Komponente.
- `name`: legt den internen Namen der Komponente fest.
- `icon`: definiert das zu verwendende [material design icon](https://ionicons.com/).
- `interactiveModes`: bestimmt, für welche Werte von `config.general.interactiveMode` die Seite aktiv sein soll. [true, false] würde also bedeuten, die Seite ist sowohl im interaktiven als auch nicht-interaktiven Modus benutzbar. Muss ein Array sein.

Die so definierten Komponenten werden in der Hauptkomponente `src/app/home/home.page.ts` automatisch importiert und dann eingebettet.

![Komponenten](documentation/Komponenten.svg)

## Erstellung neuer Seiten

Eine neue Seite wird im Verzeichnis `src/app/pages/` angelegt. Dafür kann zum Beispiel das Skript `ionic g component $NAME` verwendet werden (sollte in jenem Verzeichnis ausgeführt werden). Um die Seite dann zu verwenden muss ein Eintrag in der bereits erwähnten Datei `src/app/pages.config.ts` für diese erstellt werden.

Um auf die Funktionen der abstrakten Seite (`src/app/components/basic-page`) zugreifen zu können sollte die neue Komponente noch die `BasicPageComponent` extenden (`NewPage extends BasicPageComponent`).

## Anzeigen

Die Seite `AdsPage` kann Anzeigen darstellen, die von einer vordefinierten URL abgerufen werden. Dazu muss die Konfiguration der `AdsPage` in der `config.json` zum Beispiel folgendes enthalten:

```js
"ads": {
  // Legt fest, dass die verfügbaren Anzeigen jede Stunde geholt werden
  "update_frequency": 3600,
  // Legt die Datei fest, die unter 'url' vorzufinden ist und die Anzeigen definiert.
  // Sie könnte also auch "ads.json" oder nur "anzeigen" heißen. Wichtig ist nur, dass der
  // hier verwendete Bezeichner dem Namen der tatsächlichen Datei entspricht-
  "adsConfig": "ads-config.json",
  // url, unter der sich die ads-config.json und die Anzeigen in Form von HTML-Dateien befinden 
  "url": "https://die.url.fuer.ads.de/"
}
```

Der im Hintergrund laufende `AdsService` ruft dann zuerst die Datei `${url}${adsConfig}` ab. Diese sollte die Anzeigen im folgenden Format enthalten:

```js
[
  {
    // ein Name, der für debugging verwendet werden kann
    "name": "Werbung für irgendwas",
    // der exakte Name der HTML-Datei, die unter ${url} gefunden werden kann
    "file": "sample-ad0.html",
    // Datum, ab dem die Anzeige gezeigt werden soll
    "startDate": "2020-04-01",
    // Datum, bis zu dem die Anzeige gezeigt werden soll
    "endDate": "2020-04-30"
  },
  {
    "name": "Werbung für irgendwas anderes",
    "file": "sample-ad1.html",
    "startDate": "2020-04-01",
    "endDate": "2020-04-30"
  }
]
```

Die hier beschriebenen Anzeigen werden dann sukzessive per HTTP-GET an `${url}${file}` geholt und, falls sie im Moment angezeigt werden sollen, in der `AdsPage` eingebunden.
