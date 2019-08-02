export interface IMensaResponse {
  meal:IMeals[];
  campus:string;
  iconHashMap:IMensaIconMap
}

export interface IMeals {
  order?:number;
  allergens?:IMensaAllergenes[];
  description?:string;
  type?:string[];
  prices?:IMensaPrices;
  date?:string;
  title?:string;
}

export interface IMensaAllergenes {
  description:string;
  descriptionType:string;
  longName:string;
  shortName:string;
  type:string;
}

export interface IMensaPrices {
  guest:number;
  staff:number;
  student:number;
}

export interface IMensaIconMap {
  entry:IMensaIcon[];
}

export interface IMensaIcon {
  key:string;
  value:string;
}
