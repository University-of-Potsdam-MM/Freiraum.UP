
export interface IErrors {
  exist: boolean;
  inValidation: any[];
}

export interface IRequest {
  date: string;
}

export interface IEvent2 {
  id: string;
  eid: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  seen: string;
  place_id: string;
  lastChanged: string;
  pic?: any;
  pic_square?: any;
  pic_big?: any;
  ticket_uri: string;
  sourceType: string;
  venue: string;
  DateString: string;
}

export interface IPlace {
  id: string;
  name: string;
  mapping: string;
  lat: string;
  lng: string;
  adresse: string;
  plz: string;
  ort: string;
  fb_page_id: string;
  fb_user_id: string;
  fb_search: string;
  icalExportUrl: string;
  feed: string;
}

export interface IEvent {
  Event: IEvent2;
  Place: IPlace;
  Link: any[];
}

export interface IPlaces {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
}

export interface IBrowser {
  name: string;
}

export interface IVars {
  authUser?: any;
  flashMessage?: any;
  errors: IErrors;
  requestUrl: string;
  model: string;
  action: string;
  domain: string;
  webroot: string;
  request: IRequest;
  events: IEvent[];
  places: IPlaces;
  requestMethod: string;
  browser: IBrowser;
  isAjax: boolean;
  loggedIn: boolean;
}

export interface IErrors2 {
  exist: boolean;
  inValidation: any[];
}

export interface IBrowser2 {
  name: string;
}

export interface IEventsResponse {
  passedArgs: any[];
  vars: IVars;
  errors: IErrors2;
  message?: any;
  url: string;
  action: string;
  controller: string;
  model: string;
  base: string;
  webroot: string;
  browser: IBrowser2;
  here: string;
  hereRel: string;
  routeUrl: string;
}

