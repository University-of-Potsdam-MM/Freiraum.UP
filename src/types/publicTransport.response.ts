export interface PublicTransportResponse {
  Departure: Departure[];
  serverVersion: string;
  dialectVersion: string;
  errorCode?: string;
  errorText?: string;
}

export interface JourneyDetailRef {
  ref: string;
}

export interface Product {
  name: string;
  num: string;
  line: string;
  catOut: string;
  catIn: string;
  catCode: string;
  catOutS: string;
  catOutL: string;
  operatorCode: string;
  operator: string;
  admin: string;
}

export interface Departure {
  JourneyDetailRef: JourneyDetailRef;
  Product: Product;
  name: string;
  type: string;
  stop: string;
  stopid: string;
  rtTrack: string;
  stopExtId: string;
  time: string;
  date: string;
  direction: string;
  cancelled: string;
  trainNumber: string;
  trainCategory: string;
  track: string;
}


