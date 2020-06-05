export interface MensaResponse {
  meal: Meal[];
  campus: string;
  iconHashMap: MensaIconMap;
}

export interface Meal {
  order?: number;
  allergens?: MensaAllergenes[];
  description?: string;
  type?: string[];
  prices?: MensaPrices;
  date?: string;
  title?: string;
}

export interface MensaAllergenes {
  description: string;
  descriptionType: string;
  longName: string;
  shortName: string;
  type: string;
}

export interface MensaPrices {
  guest: number;
  staff: number;
  student: number;
}

export interface MensaIconMap {
  entry: MensaIcon[];
}

export interface MensaIcon {
  key: string;
  value: string;
}
