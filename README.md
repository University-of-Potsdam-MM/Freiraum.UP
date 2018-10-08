# rooms

- Build Status: [![Build Status](https://travis-ci.org/University-of-Potsdam-MM/Freiraum.UP.svg)](https://travis-ci.org/University-of-Potsdam-MM/Freiraum.UP)

### Table of Contents
**[Entwicklungsumgebung aufsetzen](#entwicklungsumgebung-aufsetzen)**
**[Release für den Server vorbereiten](#release-für-den-Server-vorbereiten)**
**[Konfiguration](#konfiguration)**
**[Anforderungen](#anforderungen)**
**[Architektur](#architektur)**
**[Technologien der Webanwendung](#technologien-der-Webanwendung)**
**[Nächste Schritte, Credits, Feedback, Lizenz](#next-steps)**


## Entwicklungsumgebung aufsetzen

1. Installiere nodejs von http://nodejs.org/
2. Führe `npm install` im rooms Verzeichnis aus
3. Führe `npm install -g bower` im rooms Verzeichnis aus
4. Führe `bower install` im rooms Verzeichnis aus
5. Öffne die index.html in einem Webbrowser

## Release für den Server vorbereiten

Wenn alle Schritte aus der Entwicklungsumgebung ausgeführt wurde, kann der komplette Ordner als `.zip` oder `.tar.gz`
gepackt werden und auf einem beliebigen Webserver (auch ohne PHP-Unterstützung) platziert werden.

## Konfiguration

Die App beinhaltet direkt eine `config.json`.

``` js
{
    "base_url": "https://apiup.uni-potsdam.de/endpoints/roomsAPI/1.0/",
    "transport_base_url": "https://apiup.uni-potsdam.de/endpoints/transportAPI/2.0/",
    "authorization": "Bearer XXXXX", // Das Token, von apiup.uni-potsdam.de
    "campus": 3, // Auf welchem Campus hängt das Panel?
    "house": 6, // In welchem Haus hängt das Panel?
    "level": 0, // In welcher Etage hängt das Panel?
    "event_location": "Uni-Komplex Griebnitzsee", // Wenn bei Events der Veranstaltungsort übereinstimmt, wird die Veranstaltung mit gehighlighted
    "transport_station_id": "900230003", // ID der Station für die Nahverkehrsinformationen
    "events_rss_feed_url": "./eventsProxy.php", // URL zum Rss-Feed der Veranstaltungen der Uni-Potsdam
    "news_rss_feed_url": "./newsProxy.php", // URL zum Rss-Feed der Nachrichten der Uni-Potsdam
    "news_per_page": 2, // Anzahl der News pro Seite
    "news_per_row": 2,
    "transport_count": 15,
    "transport_local_traffic_count": 3, // Anzahl der nächsten ÖPNV-Einträge auf allen Seiten
    "news_update_frequency": 300, // Nach wievielen Sekunden wird das News RSS-Feed neu abgeholt
    "events_update_frequency": 300, // Nach wievielen Sekunden wird das Events RSS-Feed neu abgeholt
    "transport_update_frequency": 30, // Nach wievielen Sekunden wird die Transport API neu abgefragt
    "rooms_update_frequency": 300, // Nach wievielen Sekunden wird die Veranstaltungs API neu abgefragt
    "switch_page_frequency": 5, // Nach wievielen Sekunden wird zur nächsten Seite geblättert
    "twitter_widget_id": "XXXXX", // die Twitter Widget ID von https://twitter.com/settings/widgets
    "switch_on_at": "06:00", // wann schaltet sich das panel an?
    "switch_off_at": "22:00", // wann schaltet sich das panel ab?
    "force_page": null, // kann erzwingen, dass nur eine Seite angezeigt wird. Sollte per ?page= ondemand überschrieben werden.
    "ads": [
        [
            {"url": "one.html"} // welche Werbung im ersten Slot angezeigt werden soll
        ],
        [
            {"url": "two.html", "startTime": "2018-09-01", "endTime": "2018-09-30"},
            {"url": "three.html", "startTime": "2018-10-01", "endTime": "2018-10-30"},
            {"url": "one.html", "startTime": "2018-10-08", "endTime": "2018-10-09"}
        ],
        [
            {"url": "two.html", "startTime": "2018-09-01", "endTime": "2018-09-30"} // Werbung für den dritten Slot
        ]
    ],
    "builddir": "/"
}
```

Die Parameter campus und house können für einen Seitenaufruf überschrieben werden, in dem man sie hinten an die URL
ranhängt. Zum Beispiel: `/index.html?campus=3&house=1` würde das Panel für Campus 3 und Haus 1 laden.

Zu Testzwecken ist es möglich mit dem URL-Parameter `now` die Uhrzeit und den Tag zu überschrieben. Zum Beispiel würde
`/index.html?campus=3&house=6&now=2014-07-28T10%3A00%3A00.000Z` das Panel für den 28.7.2014 um 10 Uhr laden. Hierbei ist
wichtig zu beachten, dass die Daten nur aus der Zukunft von der `roomsAPI` zurückgegeben werden.

Zu Testzwecken ist es auch möglich mit dem URL-Parameter `page` auf eine bestimmte Seite des Panels zu switchen ohne,
dass das Panel nach der `switch_page_frequency` weiterblättert. Zum Beispiel würde `/index.html?page=0` immer nur die
erste Seite anzeigen.

# Anforderungen

- 46 zoll
- 15-26 Seminarräume, 7 HS

## Ansichten

- Welche Räume sind gerade frei?
- Welche Veranstaltungen laufen gerade?
- Welche Veranstaltungen kommen bald?
- Hinweis, wenn das Netz nicht verfügbar ist!

## Tasks

- Konfigurationsdatei für URL's / Endpoints
- Dokumentation der Einbindung weiterer Darstellungsseiten
- Darstellung
- ? Framework für views

## Use-Cases

Hier einige User die ich mir bei dem Konzeptionieren des Panels überlegt habe.

- Alice (39%)
  - 1. Semester
  - Weiß dass sie heute ab 10:00, "Staatsrecht I" bei Herrn "M.M." hat
  - Weiß nicht ob sich der Raum geändert hat
- Bob (60%)
  -  5. Semester
  - Sucht einen Raum für seine Übungsgruppe

- Carl (1%)
  - Kein Semester, ist Gastredner
  - Möchte am "Kolloquium für Master im Bereich Internationale Politik" (von K.K., R.R. und H.H.) von 12:00 bis 14:00 teilnehmen

# Architektur

- Generell
  - `package.json`, `bower.json`, `.bowerrc` - Konfiguration für die Paketemanager (Bower und NPM)
  - `newsProxy.php` und `eventsProxy.php` sind als Proxy vorhanden bis #22 korrigiert ist
  - `README.md` als README
  - `.gitignore` als Konfiguration welche Dateien nicht im Git landen dürfen
  - `one.html` ein Beispiel für eine Werbe-Datei
- Webanwendung
  - `index.html` - HTML für das vertikale Panel
  - `split.html` - HTML für das horizontale Panel mit Split bei 576 Pixel
  - `static/css/global.css` - CSS für das vertikale und das horizontale Panel
  - `static/css/split.css` - zusätzliches CSS für das horizontale Panel
  - `static/img/*.*` - vom CSS verwendete Bilder
  - `static/js/models/*.js` - die Backbone-Models
  - `static/js/collections/*.js` - die Singletons für instanzierte Backbone-Collections
  - `static/js/views/*.js` - die Backbone-Views + `NightSwitchView.js`
  - `static/js/main.js` - die Konfiguration für externe JS-Libraries (z.B. momentjs)
  - `static/js/config.js` - der Singleton für die Config
  - `config.json` - die Config für diese Panelinstallation
- Tests
  - `.travis.yml` - Konfiguration für die CI Umgebung bei Travis
  - `test/api-test.js` - die CLI Tests mit mocha
- Zugriff von der Webanwendung per `Bearer`-Token auf die roomsAPI
- [roomsAPI](https://apiup.uni-potsdam.de/store/apis/info?name=roomsAPI&version=1.0&provider=admin) auf dem [APIUP](https://apiup.uni-potsdam.de/)
  - `/rooms4Time`
  - `/reservations`

![Maschinen](docs/machines.png)


# Technologien der Webanwendung

Die folgenden Technologien werden bei der Umsetzung der `rooms` Webanwendung benutzt:

| Technologie        | Verwendungszweck           | Link  |
| ------------- |-------------|:-----:|
| backbonejs | Backbone als MVC-Framework | http://backbonejs.org/ |
| nodejs      | zur primären Installation von Bower und für die Tests | http://nodejs.org |
| bower      | Installation der Webbibliotheken | http://bower.io |
| bootstrap | HTML/CSS-Framework für das Layout | http://getbootstrap.com |
| require.js | Dependency Library für Javascript | http://requirejs.org |
| jsb.js | Library um Javascript-Verhalten ohne Inline-JS auf HTML-Elemente zu tun | https://github.com/DracoBlue/jsb |
| html5shiv | Polyfill damit HTML5-Elemente auch in älteren Browsern funktionieren | - |
| respond.js | Media-Query Polyfill für ältere IE-Browser | - |
| mocha | Testframework für die CLI-Tests | https://mochajs.org |

## MVC (JS Objekte)

Die Entitäten sind als Backbone-Models implementiert. Im Verzeichnis `js/models` finden sich alle uninitialisierten
Backbone-Models (z.B. `FreeRoom`, `FreeRoomCollection`. Im Verzeichnis `js/collections` befinden sich
initialisierte und befüllte Singletons der Collections (z.B. `freeRooms`). Das erlaubt an anderer Stelle einfach die
Collection zu `require`n ohne die Collection x mal zu initialisieren.

Die folgende Tabelle zeigt die Models, Collections, Views und ihre Verwendung.

Model | Collection | View(s) | Singleton
--------|-----------------|-------|------
RssItem | EventCollection und NewsCollection extenden BaseRssCollection | EventCollectionView, NewsCollectionView, NewsView, EventView | events, news
Transport | TransportCollection | TransportCollectionView, NextTransportView, TransportView | transports
FreeRoom | FreeRoomCollection | FreeRoomCollectionView, FreeRoomView | freeRooms
BookedRoom | BookedRoomCollection | NowBookedRoomCollectionView, SoonBookedRoomCollectionView, BookedRoomView | bookedRooms
*-* | *-* | TweetsView
*-* | *-* | AdView
*-* | *-* | EscapePlanView


Zusätzlich gibt es noch die `BaseRssCollection` (als Basis für `News`+`EventCollection`), sowie die `BaseView` als Basis für
alle Views.

Außerdem gibt es ein Singleton unter `config`, welches auch ein `Backbone.Model` ist. Darin sind nun die Konfigurationen
aus der config.json verfügbar und das overriding der Options passiert dort (`&page=2` usw.).

Für das Wechseln zwischen den Seiten gibt es den `PageSwitcherView`. Für die Uhrzeit den `CurrentTimeView`.

## Schnittstellen

### API Aufruf nach `/reservations`

``` json
{
  "reservationsResponse": {
    "return": [
      {
        "endTime": "2017-11-13T18:00:00+01:00",
        "startTime": "2017-11-13T16:00:00+01:00",
        "roomList": {
          "room": "3.06.H06"
        },
        "personList": {
          "person": [
            "Vierhaus",
            " Hans-Peter (Hon. Prof.)"
          ]
        },
        "veranstaltung": "V/G1 - Allgemeines Verwaltungsrecht für Nichtjuristen"
      },
      {
        "endTime": "2017-11-13T16:00:00+01:00",
        "startTime": "2017-11-13T14:00:00+01:00",
        "roomList": {
          "room": "3.06.S19"
        },
        "personList": {
          "person": [
            "Petersen",
            " Jens (Prof. Dr.)"
          ]
        },
        "veranstaltung": "RE/G1 - Examinatorium im Bürgerlichen Recht (Simulation mündliche Prüfung)"
      },
      ....
      {
        "endTime": "2017-11-13T16:00:00+01:00",
        "startTime": "2017-11-13T14:00:00+01:00",
        "roomList": {
          "room": [
            "3.06.S13",
            "3.06.S21"
          ]
        },
        "personList": {
          "person": [
            "",
            ""
          ]
        }
      }
    ]
  }
}
```
### API Aufruf nach `/rooms4Time`

Parameter:

- endTime: aktuelle Zeit als ISO-Zeit String
- startTime: aktuelle Zeit als ISO-Zeit String
- campus: Nummer des Campus
- cb: Cachebuster Parameter (zufällige Zahl)

Beispielantwort:

``` json
{
  "rooms4TimeResponse": {
    "return": "3.06.0.15"
  }
}
```

## Neue Seite anlegen

Wenn eine weitere Seite auf dem Panel angezeigt werden soll, ist das relativ einfach.

Es gibt bereits 2 Seiten (soon + now unter dem css-Selektor `.container > .js_page`), will man davor eine Seite hinzufügen, sieht das so aus:

``` html
    <div class="container">

        <!-- neue Seite -->
        <div class="row js_page">
            <h2 class="hidden">Interner Bezeichner für die Seite</h2>
            <table class="table table-striped table-hover">
                <thead>
                <th>Die Überschrift</th>
                </thead>
                <tbody>
                    <tr>
                        <td>Die erste Zeile <strong>mit dickem Text</strong> und <em>hervorgehobene Text</em>.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="row js_page">
            <h2 class="hidden">Laufende Veranstaltungen</h2>
            <table class="js_now table table-striped table-hover">
                <thead>
                    <th class="js_now_headline">Gerade</th>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        <div class="row js_page">
            <h2 class="hidden">Laufende Veranstaltungen</h2>
            <table class="js_soon table table-striped table-hover">
                <thead>
                <th class="js_soon_headline">In 2 Stunden</th>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>

    </div>
```

Das Ergebnis sieht dann ungefähr so aus:

![Neue Seite](docs/example_for_new_page.png)

## Werbung schalten

Um Werbug hinzuzufügen, reicht es eine Datei (z.B. `hans.html`) im rooms-Hauptverzeichnis abzulegen.

Zusätzlich die config.json erweitern, um:

``` json
{
  "ads": [
    [
      {"url": "hans.html"}
    ]
  ]
}
```

und dann wird `hans.html` angezeigt, sobald die AdView angezeigt wird.

Sollen mehrere Ads in einem Slot (bestimmte Position in der Anzeigenreihenfolge) geschaltet werden, so erfolgt das wie folgt am Beispiel von `one.html`und `two.html`.

``` json
{
  "ads": [
    [
      {"url": "one .html"}, {"url": "two.html"}
    ]
  ]
}
```

Zusätzlich können noch Zeiträume für die Werbung angegeben werden, in denen der Inhalt dargestellt werden soll.

``` json
{
  "ads": [
    [
      {"url": "one.html", "startTime": "2018-09-01", "endTime": "2018-09-30"},
      {"url": "two.html", "startTime": "2018-10-01", "endTime": "2018-10-30"},
    ]
  ]
}
```

Wenn die Datei folgenden Tag enthält:

``` html
<meta name="next-page-in" content="260" />
```

wird das Schalten zur nächsten Screen um 260 Sekunden verzögert.

## Benutzung als Split-Panel

Zusätzlich zur index.html gibt es auch eine split.html. Diese ist für ein Video-Panel der Größe 768px x 240px gedacht.
Die 768px teilen sich hierbei nochmal in 576px und 192px auf. Sowohl der 576px breite Teil als auch der 192px breite
Teil haben zusätzlich einen 6 Pixel breiten Rand.

Dadurch ergibt sich der folgende Viewport:

              ________________________
              |               |       |
              |               |  186  |
    6px Rand  |     570x240   |   x   |  6px Rand
              |               |  240  |
              |_______________|_______|

Um Styles aus der `index.html` (`global.css`) wieder zu verwenden, wird in der `split.css` lediglich überschrieben
oder neu definiert, was für die `split.html` zuständig ist.

Der Aufruf funktioniert analog zu index.html, jedoch mit `page=2`, da blättern nicht gewünscht ist:

    /split.html?campus=3&house=6&page=2

## Nachtmodus für das Panel

Im `split.html` ist `views/NightSwitchView.js` inkludiert. Dadurch kann via:

``` json
{
    "switch_on_at": "06:00",
    "switch_off_at": "22:00",
}
```

in der Config.json eingestellt werden, wann sich das Panel schwarz schaltet. Das passiert über die `is-switched-off`
CSS Klasse, welche in der `global.css` für body definiert ist.

## Api-Tests

Unter `test/api-tests.js` befinden sich Tests, welche mit dem Mocha-Framework entwickelt wurden.

Durch den Aufruf von

``` console
$ mocha
```

werden die Tests ausgeführt.

Das Ergebnis ist dann z.B.:

``` console
$ mocha


  collections/bookedRooms
    ✓ should contain all booked rooms (270ms)

  collections/freeRooms
    ✓ should contain all free rooms (161ms)

  collections/transports
    ✓ should contain all transport connections (549ms)

  collections/events
    ✓ should contain all events (4242ms)

  collections/news
    ✓ should contain all news (1854ms)


  5 passing (7s)
```

Es gibt zusätzlich eine `.travis.yml`, welche dafür sorgt, dass die Mocha-Tests nach jedem commit auf [travis-ci](https://travis-ci.org/University-of-Potsdam-MM/rooms)
ausgeführt werden. Der Build-Status kann auch ganz am Anfang der README.md eingesehen werden.

Aktuell fokussieren sich die API-Tests ausschließlich auf den Test und eine Plausibilitätsprüfung der angebundenen
APIs.

#Nächste Schritte

siehe Issues unter https://github.com/University-of-Potsdam-MM/Freiraum.UP/issues

#Credits, Feedback

#Lizenz

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/de/"><img alt="Creative Commons Lizenzvertrag" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/3.0/de/88x31.png" /></a><br />Dieses Werk ist lizenziert unter einer <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/de/">Creative Commons Namensnennung - Nicht-kommerziell - Weitergabe unter gleichen Bedingungen 3.0 Deutschland Lizenz</a>.
