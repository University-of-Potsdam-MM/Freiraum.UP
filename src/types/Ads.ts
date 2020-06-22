export type AdsConfig = AdConfig[];

export interface AdConfig {
  name: string;
  file: string;
  startDate: string;
  endDate: string;
}

export interface Ad {
  name: string;
  html: string;
  startDate: string;
  endDate: string;
}
