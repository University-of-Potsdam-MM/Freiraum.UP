export interface IAppConfig {
  general:IGeneralConfig;
  settings:ISettingsConfig;
  api:IApiConfig;
  lrs:ILRS;
  news:INewsConfig;
  twitter:ITwitterConfig;
  rooms:IRoomsConfig;
  events:IEventsConfig;
  ads: IAd[];
  transport:ITransportConfig;
  campusmap:ICampusMapConfig;
  home:IHomeConfig;
  mensa:IMensaConfig;
}

export interface ISettingsConfig {
  languages:string[];
}

export interface ILRS {
  username: string;
  password: string;
  endpoint: string;
  allowFail: boolean;
}

export interface IHomeConfig {
  widgets:string[];
}

export interface IAd {
  url:string;
  startTime?:string;
  endTime?:string;
}

export interface ITransportConfig {
  count: number;
  local_traffic_count: number;
  update_frequency: number;
  station_id: string;
  station_name: string;
}

export interface ITimeslot {
  begin:string;
  end:string;
}

export interface IGeneralConfig {
  mode:string;
  default_language:string;
  page_switching_frequency:number;
  location:ILocation;
  operation_time:IOperationTime;
  timeslots:{soon:ITimeslot; now:ITimeslot};
  timeslot_update_frequency:number;
  timeout_time:number;
  timeout_modal_countdown_time:number;
}

export interface IApiConfig {
  authorization: string;
  base_url: string;
  default_frequency:number;
  endpoints:{[name:string]:{url:string,frequency?:number}};
}

export interface IOperationTime {
  on:string;
  off:string;
}

export interface ILocation {
  coordinates:[number, number];
  campus_name: string;
  campus_name_short: string;
  campus:number;
  building:number;
  level:number;
}

export interface INewsConfig {
  items_per_page: number;
  items_per_row: number;
  update_frequency: number;
}

export interface IRoomsConfig {
 update_frequency: number;
}

export interface IEventsConfig {
  update_frequency: number;
}

export interface ITwitterConfig {
  urls: {[name:string]:string};
}

export interface IMensaConfig {
  update_frequency: number;
}
export interface ICoordinates {
  latitude:number;
  longitude:number;
}

export type ILatLongBounds = [number, number][]

export interface ICampus {
  id:number;
  name:string;
  pretty_name:string;
  coordinates:ICoordinates;
  lat_long_bounds:ILatLongBounds;
}

export interface ICampusMapConfig {
  update_frequency: number;
  campi: ICampus[];
}
