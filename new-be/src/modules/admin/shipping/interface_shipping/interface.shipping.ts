import { Document, Model, Types } from "mongoose";

export interface ShippingI {
  country: string;
  countryShippingFee: number;
  states: [{ name: string; stateShippingFee: number }];
  useCountryShippingFeeAsDefault: boolean;
  createdBy: Types.ObjectId;
  updatedBy:Types.ObjectId;
}



export interface ShippingDocI extends ShippingI, Document {}
export interface ShippingModelI extends Model<ShippingDocI> {
  makeUppercase(): void;
}

export type ShippingBodyT = Omit<ShippingI, "created_by">;

export type LocationAddressT = { country?: string; state?: string };




// Interface for the Timezone
interface TimezoneI {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

// Interface for Translations
interface TranslationsI {
  kr: string;
  'pt-BR': string;
  pt: string;
  nl: string;
  hr: string;
  fa: string;
  de: string;
  es: string;
  fr: string;
  ja: string;
  it: string;
  cn: string;
  tr: string;
}

// Interface for State
interface StateI {
  id: number;
  name: string;
  state_code: string;
  latitude: string;
  longitude: string;
  type: string | null;
}

// Main Country Interface
export interface CountryI {
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: TimezoneI[];
  translations: TranslationsI;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
  states: StateI[];
}

