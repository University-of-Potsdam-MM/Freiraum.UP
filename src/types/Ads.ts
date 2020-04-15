export interface AdsConfig {
  ads: {name: string, startDate: string, endDate: string}[];
}

export interface Ad {
  html: string;
  startDate: string;
  endDate: string;
}
