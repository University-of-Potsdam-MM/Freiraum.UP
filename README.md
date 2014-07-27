http://workspaces.local/rauminfo/index.html?now=2013-11-18T12%3A53%3A06.000Z&campus=3&house=6

# Anforderung

- 46 zoll
- 15-26 Seminarräume, 7 HS

# Ansichten

- Welche Räume sind gerade frei?
- Welche Veranstaltungen laufen gerade?
- Welche Veranstaltungen kommen bald?
- Hinweis, wenn das Netz nicht verfügbar ist!

# Tasks

- Konfigurationsdatei für URL's / Endpoints
- Dokumentation der Einbindung weiterer Darstellungsseiten
- Darstellung
- ? Soap-Client
- ? Framework für views


## Infos aus PULS zu Haus 4

0.02
0.04
0.22

1.02
1.03

2.01
2.14

## Infos aus PULS zu Haus 6

H01
H02
H03
H04
H05

S12
S15
S16
S17
S18
S22
S23
S25
S27

## Infos aus PULS zu Haus 6

6 Räume (0.12, 0.13, ...)
8 Hörsäale (H01, H02, ...)
8 Seminarräume (S14, S15, ..., S28)

## Anwender

### Alice (39%)

* 1. Semester
* Weiß dass sie heute ab 10:00, "Staatsrecht I" bei Herrn "M.M." hat
* Weiß nicht ob sich der Raum geändert hat

### Bob (60%)

* 5. Semester
* Sucht einen Raum für seine Übungsgruppe

### Carl (1%)

* Kein Semester, ist Gastredner
* Möchte am "Kolloquium für Master im Bereich Internationale Politik" (von K.K., R.R. und H.H.) von 12:00 bis 14:00 teilnehmen

## Architektur

- Webanwendung
  - `index.html`
  - `js/ShowRooms.js`
- Zugriff von der Webanwendung per `Bearer`-Token auf die roomsAPI
- roomsAPI auf dem USB
  - `/rooms4Time`
  - `/reservations` 

## Technologien der Webanwendung

Die folgenden Technologien werden bei der Umsetzung der `rooms` Webanwendung benutzt:

- bower http://bower.io
  - Zur Installation der Webbibliotheken
- bootstrap http://getbootstrap.com
  - HTML/CSS-Framework für das Layout 
- require.js http://requirejs.org
  - Dependency Library für Javascript
- jsb.js
  - Library um Javascript-Verhalten ohne Inline-JS auf HTML-Elemente zu tun
- html5shiv
  - Polyfill damit HTML5-Elemente auch in älteren Browsern funktionieren
- respond.js
  - Media-Query Polyfill für ältere IE-Browser
- Composer und Doctrine-Cache
  - Für xml.php (als Fallback falls die externe Api nicht verfügbar ist oder CORS-Header nicht richtig gesetzt sind)

## Schnittstellen

### API Aufruf nach `/reservations`

``` xml
<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
    <S:Body>
      <ns2:reservationsResponse xmlns:ns2="http://rooms.provider.elis.unipotsdam.de/">
        <return>
          <endTime>2014-02-04T18:00:00+01:00</endTime>
          <startTime>2014-02-04T16:00:00+01:00</startTime>
          <roomList>
            <room>3.01.H10</room>
          </roomList>
          <personList>
            <person>Jochen Bley</person>
          </personList>
          <veranstaltung>V/G1 - Öffentliches Wirtschaftsrecht I</veranstaltung>
        </return>
        <!-- weitere <return> -->
      </ns2:reservationsResponse>
    </S:Body>
</S:Envelope>
```
### API Aufruf nach `/rooms4Time`

Parameter:

- endTime: aktuelle Zeit als ISO-Zeit String
- startTime: aktuelle Zeit als ISO-Zeit String
- campus: Nummer des Campus
- cb: Cachebuster Parameter (zufällige Zahl)

Beispielantwort:

``` xml
<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
  <S:Body>
    <ns2:rooms4TimeResponse xmlns:ns2="http://rooms.provider.elis.unipotsdam.de/">
      <return>3.01.1.14</return>
      <return>3.01.1.50</return>
    </ns2:rooms4TimeResponse>
  </S:Body>
</S:Envelope>
```