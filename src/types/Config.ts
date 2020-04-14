export interface Config {
  general: GeneralConfig;
  settings: SettingsConfig;
  api: ApiConfig;
  news: NewsConfig;
  twitter: TwitterConfig;
  rooms: RoomsConfig;
  events: EventsConfig;
  ads: Ads[];
  transport: TransportConfig;
  campusmap: CampusMapConfig;
  home: HomeConfig;
  mensa: MensaConfig;
}

export interface SettingsConfig {
  languages: string[];
}

export interface HomeConfig {
  widgets: string[];
}

export interface Ads {
  url: string;
  startTime?: string;
  endTime?: string;
}

export interface TransportConfig {
  count: number;
  local_traffic_count: number;
  update_frequency: number;
  station_id: string;
  station_name: string;
}

export interface ITimeslot {
  begin: string;
  end: string;
}

export interface GeneralConfig {
  interactiveMode: boolean;
  default_language: string;
  page_switching_frequency: number;
  location: ILocation;
  operation_time: IOperationTime;
  timeslots: {soon: ITimeslot; now: ITimeslot};
  timeslot_update_frequency: number;
  timeout_time: number;
  timeout_modal_countdown_time: number;
  time_update_frequency: number;
}

export interface ApiConfig {
  authorization: string;
  base_url: string;
  default_frequency: number;
  endpoints: {[name: string]: {url: string, frequency?: number}};
}

export interface IOperationTime {
  on: string;
  off: string;
}

export interface ILocation {
  coordinates: [number, number];
  campus_name: string;
  campus_name_short: string;
  campus: number;
  building: number;
  level: number;
}

export interface NewsConfig {
  categories: {name: string; enabled: boolean}[];
}

export interface RoomsConfig {
  update_frequency: number;
}

export interface EventsConfig {
  update_frequency: number;
}

export interface TwitterConfig {
  channels: {[name: string]: string};
}

export interface MensaConfig {
  canteens: {enabled: boolean, name: string}[];
  icons: {[name: string]: string};
}
export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export type ILatLongBounds = [number, number][];

export interface ICampus {
  id: number;
  name: string;
  pretty_name: string;
  coordinates: ICoordinates;
  lat_long_bounds: ILatLongBounds;
}

export interface CampusMapConfig {
  update_frequency: number;
  campi: ICampus[];
}
