// Base config Object
export interface Config {
  // general config of the application
  general: GeneralConfig;
  // configuration of the API service
  api: ApiConfig;

  // configuration of the available pages
  footer: FooterConfig;
  news: NewsConfig;
  twitter: TwitterConfig;
  rooms: RoomsConfig;
  lectures: LecturesConfig;
  events: EventsConfig;
  transport: TransportConfig;
  campusMap: CampusMapConfig;
  mensa: MensaConfig;
  ads: AdsPageConfig;
}

export interface GeneralConfig {
  // definition of rules for the layout
  layout: Layout;
  // defines if the application starts as interactive or non interactive
  interactiveMode: boolean;
  // language of the application, default is 'de'
  default_language: string;
  // frequency at which the pages will be switched
  page_switching_frequency: number;
  // location of the device running the application
  location: Location;
  // the frequency at which the current timeslot (e.g. 14-16) will be updated
  timeslot_update_frequency: number;
  // the timeout duration after which the timeout modal will appear
  timeout_time: number;
  // the timeout time after which the timeout modal is dismissed automatically
  timeout_modal_countdown_time: number;
  // frequency at which the currently displayed time is updated
  time_update_frequency: number;
  // momentjs format of the current time that is shown in the header
  time_format: string;
  // defines when the screensaver should be shown. If it should never be shown just use "00:00-24:00".
  operation_time: {
    // how often the current time should be checked for being within the defined boundaries (in seconds)
    check_frequency: number,
    // begin of the operation time, in format hh:mm. E.g. "08:00"
    on: string,
    // end of the operation time,  in format hh:mm. E.g. "22:00"
    off: string
  };
}

// Configuration of the footer section at the bottom of the application
export interface FooterConfig extends PageConfig {
  // configures the public transport section
  public_transport: {
    // whether it should be displayed
    display: boolean;
    // how many items to show
    count: number
  };
  // configures the free rooms section
  rooms_free: {
    // whether it should be displayed
    display: boolean;
  };
  // configures the running text section
  running_text: {
    // whether it should be displayed
    display: boolean;
    // text to be shown. Must be the key to a text defined in one of the i18n files.
    textI18nKey: string;
    // optionally a md-icon can be shown before and after the text
    icon_before: string;
    icon_after: string;
    // the speed at which the text should be running
    speed: number;
  };
}

export interface Timeslot {
  begin: string;
  end: string;
}

export interface ApiConfig {
  // Token to be used for usage of webservices
  authorization: string;
  // base_url of the API to be used
  base_url: string;
  // frequency at which the webservices will be called
  default_frequency: number;
  // definition of the endpoints that can be used
  endpoints: {[name: string]: {url: string, frequency?: number}};
}

export interface TransportConfig extends PageConfig {
  // how many departures to show on one page
  count: number;
  // station_id to be used
  station_id: string;
  // station name to be displayed
  station_name: string;
  // list of the means of transport that will be displayed.
  // is used for displaying the correct icon for each departure
  meansOfTransport: {
    // name of the means of transport, should correspond to the schema the endpoint uses
    name: string,
    // name of the icon file, eg 'bahn.svg'
    iconFileName: string
  }[];
}

export interface Layout {
  // width of the content area in landscape mode. In percent, eg "80%"
  content_width_landscape: string;
  // breakpoint in pixels from landscape to portrait mode, default is 1080
  breakpoint_landscape: string;
}

export interface Location {
  // coordinates of the device running the application
  coordinates: [number, number];
  // pretty name of the campus, eg. "Neues Palais"
  campus_name: string;
  // short name of the campus, eg. "NeuesPalais". Some APIs use this name.
  campus_name_short: string;
  // number of the campus
  campus: number;
  // number of the building
  building: number;
  // level inside the building
  level: number;
}

export interface PageConfig {
  // add this option with 'true' as value to a pages config to disable it
  disabled?: boolean;
  // enable page even when disabled through not matching "interactiveMode"
  force_enabled?: boolean;
  // add this attribute to any pages config to specify its order of appearance. If no order is given, pages are sorted
  // alphabetically.
  order?: number;
}

export interface NewsConfig extends PageConfig {
  // list of news categories
  categories: {
    // Name MUST correspond to the NewsSource names used by the newsAPI
    name: string;
    // switches this specific NewsSource on or off
    enabled: boolean
  }[];
  combine: {name: string, newId: number, categories: string[]}[];
  // how many entries to show
  showOnly: boolean;
}

export type AvailableTimeslot = 'now' | 'soon';

// tslint:disable-next-line:no-empty-interface
export interface RoomsConfig extends PageConfig {
  timeslots: AvailableTimeslot[];
}

export interface LecturesConfig extends PageConfig {
  timeslots: AvailableTimeslot[];
}

// tslint:disable-next-line:no-empty-interface
export interface EventsConfig extends PageConfig {
  // filters events until [amount] [units] in the future (e.g. 4 weeks)
  filter_events_until: {amount: number, unit: string};
  // how many entries to show
  showOnly: boolean;
}

export interface TwitterConfig extends PageConfig {
  // contains the channels that can be used by the TwitterPage
  feeds: {name: string; url: string}[];
}

export interface MensaConfig extends PageConfig {
  // list of the canteens that are available in the application
  canteens: {enabled: boolean, name: string}[];
  // filename with extension of the icons that will used for each category
  icons: {[name: string]: string};
}

export interface CampusMapConfig extends PageConfig {
  // List of the campus that will be displayed
  campi: Campus[];
}

export interface AdsPageConfig extends PageConfig {
  // how often the ads should be updated (in seconds)
  update_frequency: number;
  // ads config file name
  adsConfig: string;
  // URL of the ads config file. Must be a JSON file matching the interface 'AdConfig'
  url: string;
}

export interface Campus {
  // id of one of the campus
  id: number;
  // name of the campus
  name: string;
  // pretty name of the campus
  pretty_name: string;
  // central coordinates of the campus
  coordinates: Coordinates;
  // bounding rectangle of the campus
  lat_long_bounds: LatLongBounds;
}

export type LatLongBounds = [number, number][];

export interface Coordinates {
  latitude: number;
  longitude: number;
}
