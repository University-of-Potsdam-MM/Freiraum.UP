export interface IJourneyDetailRef {
  ref: string;
}

export interface IProduct {
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

export interface IDeparture {
  JourneyDetailRef: IJourneyDetailRef;
  Product: IProduct;
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

export interface ITransportResponse {
  Departure: IDeparture[];
  serverVersion: string;
  dialectVersion: string;
  errorCode?: string;
  errorText?: string;
}

