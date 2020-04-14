# Freiraum.UP (ionic 4)

Dies ist die Neuimplementierung der Anwendung *Freiraum.UP* in ionic 4.

## Lokales Ausführen

```bash
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

Damit die Anwendung funktioniert muss eine Datei `config.json` im Verzeichnis `src/assets/` platziert werden. Diese Datei konfiguriert die gesamte Anwendung. Im folgenden wird ein Beispiel gelistet. Dieses Beispiel kann direkt verwendet werden, es muss lediglich die Variable `api.authorization` gesetzt werden.

```json
{
  "general": {
    "interactiveMode": false,
    "default_language": "de",
    "page_switching_frequency": 15,
    "timeout_time": 20,
    "timeout_modal_countdown_time": 10,
    "timeslot_update_frequency": 60,
    "time_update_frequency":  1,
    "location": {
      "coordinates": [52.39354, 13.13022],
      "campus_name": "Griebnitzsee",
      "campus_name_short": "griebnitzsee",
      "campus": 3,
      "building": 1,
      "level": 0
    },
    "operation_time": {
      "on": "06:00",
      "off": "22:00"
    }
  },
  "api": {
    "authorization": "API_TOKEN",
    "base_url": "https://apiup.uni-potsdam.de/endpoints/",
    "default_frequency": "300",
    "endpoints": {
      "transport": {
        "url": "https://apiup.uni-potsdam.de/endpoints/transportAPI/2.0/departureBoard",
        "frequency": 60
      },
      "reservedRooms": {
        "url":"https://apiup.uni-potsdam.de/endpoints/roomsAPI/1.0/reservations"
      },
      "freeRooms":{
        "url":"https://apiup.uni-potsdam.de/endpoints/roomsAPI/1.0/rooms4Time"
      },
      "news": {
        "url":"https://apiup.uni-potsdam.de/endpoints/newsAPI/news/"
      },
      "events":{
        "url":"https://apiup.uni-potsdam.de/endpoints/newsAPI/events/"
      },
      "maps": {
        "url":"https://apiup.uni-potsdam.de/endpoints/mapsAPI"
      },
      "mensa":{
        "url":"https://apiup.uni-potsdam.de/endpoints/mensaAPI/meals"
      }
    }
  },
  "transport":{
    "station_id": "900230003",
    "count": 10,
    "local_traffic_count": 3,
    "station_name": "S-Griebnitzsee"
  },
  "news": {
    "categories": [
      {"name": "Uni Nachrichten", "enabled": true},
      {"name": "Uni Medienmitteilungen", "enabled": true},
      {"name": "Zur Quelle", "enabled": true},
      {"name": "speakUP", "enabled": true},
      {"name": "AStA Pressemitteilungen", "enabled": true},
      {"name": "AStA Thementexte", "enabled": true},
      {"name": "AStA Protokolle", "enabled": true}
    ]
  },
  "mensa": {
    "canteens": [
      {"name": "Griebnitzsee", "enabled": true},
      {"name": "UlfsCafe", "enabled": true},
      {"name": "Golm", "enabled": false},
      {"name": "NeuesPalais", "enabled": false}
    ],
    "icons": {
      "Regional": "su_regional.png",
      "Rind": "su_rind_r.png",
      "Hahn": "su_hahn_g.png",
      "Schwein": "su_schwein_s.png",
      "Vegetarisch": "su_vegetarisch_v.png",
      "Alkohol": "su_alkohol_a.png",
      "Knoblauch": "su_knoblauch_k.png",
      "Fisch": "su_fisch_f.png",
      "Vegan": "su_vegan_w.png"
    }
  },
  "twitter": {
    "channels": {
      "twitter-up": "https://twitter.com/unipotsdam?ref_src=twsrc%5Etfw",
      "twitter-asta": "https://twitter.com/unipotsdam/lists/freiraum-306?ref_src=twsrc%5Etfw"
    }
  },
  "campusmap": {
    "campi": [
      {
        "id": 1,
        "name": "neuespalais" ,
        "pretty_name": "Neues Palais",
        "coordinates": {
          "latitude": 52.40105,
          "longitude": 13.01207
        },
        "lat_long_bounds": [
          [52.4038, 13.0078],
          [52.39706, 13.01884]
        ]
      },
      {
        "id": 2,
        "name": "golm",
        "pretty_name": "Golm",
        "coordinates": {
          "latitude": 52.41527,
          "longitude": 12.96941
        },
        "lat_long_bounds": [
          [52.413, 12.9721],
          [52.4057, 12.9802]
        ]
      },
      {
        "id": 3,
        "name": "griebnitzsee",
        "pretty_name": "Griebnitzsee",
        "coordinates": {
          "latitude": 52.39281,
          "longitude": 13.1288
        },
        "lat_long_bounds": [
          [52.3945, 13.1258],
          [52.3912, 13.1338]
        ]
      }
    ]
  }
}
```

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
- `icon`: definiert das zu verwendende material design icon.
- `interactiveModes`: bestimmt, für welche Werte von `config.general.interactiveMode` die Seite aktiv sein soll. [true, false] würde also bedeuten, die Seite ist sowohl im interaktiven als auch nicht-interaktiven Modus benutzbar. Muss ein Array sein.

Die so definierten Komponenten werden in der Hauptkomponente `src/app/home/home.page.ts` importiert und dann eingebettet.

## Erstellung neuer Seiten

Eine neue Seite wird im Verzeichnis `src/app/pages/` angelegt. Dafür kann zum Beispiel das Skript `ionic g component $NAME` verwendet werden (sollte in jenem Verzeichnis ausgeführt werden). Um die Seite dann zu verwenden muss ein Eintrag in der bereits erwähnten Datei `src/app/pages.config.ts` für diese erstellt werden.

Um auf die Funktionen der abstrakten Seite (`src/app/components/basic-page`) zugreifen zu können sollte die neue Komponente noch die `BasicPageComponent` extenden (`NewPage extends BasicPageComponent`).
