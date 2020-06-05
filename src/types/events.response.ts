export interface EventsResponse {
    vars: Vars;
}

export interface Vars {
    events: EventItem[];
    places: {[id: string]: string};
}

export interface EventItem {
  Event: Event;
  Place: Place;
}

export interface Event {
  eid: string;
  name: string;
  description: string;
  pic: string;
  venue: string;
  sourceType: string;
  pic_square: string;
  ticket_uri: string;
  pic_big: string;
  DateString: string;
  id: string;
  startTime: string;
  endTime: string;
  lastChanged: string;
  place_id: string;
}

export interface Place {
  id: number;
  name: string;
  facebookPageId: string;
  rssFeedUrl: string;
  icalExportUrl: string;
  lat: string;
  lng: string;
  adresse: string;
  plz: string;
  ort: string;
}
