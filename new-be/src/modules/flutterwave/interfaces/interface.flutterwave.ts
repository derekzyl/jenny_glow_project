export interface FLWResponse {
  status: 'success' | 'error';
  message: string;
}

export type Currencies = 'NGN' | 'KES' | 'GHS' | 'USD' | 'ZAR' | 'UGX' | 'TZS' | 'RWF' | 'GBP' | 'XAF' | 'XOF';
export type PaymentTypes = 'card' | 'account' | 'account-ach-us';
export type CardProviders = 'MASTERCARD' | 'VISA' | 'VERVE';
export type Intervals = 'yearly' | 'quarterly' | 'monthly' | 'weekly' | 'daily';

export type ChargeMeta = {
  /**
   * This could be the extra information you want to pass.
   */
  flightID?: string;
  /**
   * This could be any message you'd like to associate with this call.
   */
  sideNote?: string;
  authorization?: {
    transfer_reference: string;
    transfer_account: string;
    transfer_bank: string;
    account_expiration: string;
    transfer_note: string;
    transfer_amount: number;
    mode: string;
    redirect: string;
  };
};

export type PageMeta = {
  page_info: {
    total: number;
    current_page: number;
    total_pages: number;
  };
};

export type IDPayload = {
  id: string;
};

export type CountryCodes = keyof {
  BD: 'Bangladesh';
  BE: 'Belgium';
  BF: 'Burkina Faso';
  BG: 'Bulgaria';
  BA: 'Bosnia and Herzegovina';
  BB: 'Barbados';
  WF: 'Wallis and Futuna';
  BL: 'Saint Barthelemy';
  BM: 'Bermuda';
  BN: 'Brunei';
  BO: 'Bolivia';
  BH: 'Bahrain';
  BI: 'Burundi';
  BJ: 'Benin';
  BT: 'Bhutan';
  JM: 'Jamaica';
  BV: 'Bouvet Island';
  BW: 'Botswana';
  WS: 'Samoa';
  BQ: 'Bonaire, Saint Eustatius and Saba ';
  BR: 'Brazil';
  BS: 'Bahamas';
  JE: 'Jersey';
  BY: 'Belarus';
  BZ: 'Belize';
  RU: 'Russia';
  RW: 'Rwanda';
  RS: 'Serbia';
  TL: 'East Timor';
  RE: 'Reunion';
  TM: 'Turkmenistan';
  TJ: 'Tajikistan';
  RO: 'Romania';
  TK: 'Tokelau';
  GW: 'Guinea-Bissau';
  GU: 'Guam';
  GT: 'Guatemala';
  GS: 'South Georgia and the South Sandwich Islands';
  GR: 'Greece';
  GQ: 'Equatorial Guinea';
  GP: 'Guadeloupe';
  JP: 'Japan';
  GY: 'Guyana';
  GG: 'Guernsey';
  GF: 'French Guiana';
  GE: 'Georgia';
  GD: 'Grenada';
  GB: 'United Kingdom';
  GA: 'Gabon';
  SV: 'El Salvador';
  GN: 'Guinea';
  GM: 'Gambia';
  GL: 'Greenland';
  GI: 'Gibraltar';
  GH: 'Ghana';
  OM: 'Oman';
  TN: 'Tunisia';
  JO: 'Jordan';
  HR: 'Croatia';
  HT: 'Haiti';
  HU: 'Hungary';
  HK: 'Hong Kong';
  HN: 'Honduras';
  HM: 'Heard Island and McDonald Islands';
  VE: 'Venezuela';
  PR: 'Puerto Rico';
  PS: 'Palestinian Territory';
  PW: 'Palau';
  PT: 'Portugal';
  SJ: 'Svalbard and Jan Mayen';
  PY: 'Paraguay';
  IQ: 'Iraq';
  PA: 'Panama';
  PF: 'French Polynesia';
  PG: 'Papua New Guinea';
  PE: 'Peru';
  PK: 'Pakistan';
  PH: 'Philippines';
  PN: 'Pitcairn';
  PL: 'Poland';
  PM: 'Saint Pierre and Miquelon';
  ZM: 'Zambia';
  EH: 'Western Sahara';
  EE: 'Estonia';
  EG: 'Egypt';
  ZA: 'South Africa';
  EC: 'Ecuador';
  IT: 'Italy';
  VN: 'Vietnam';
  SB: 'Solomon Islands';
  ET: 'Ethiopia';
  SO: 'Somalia';
  ZW: 'Zimbabwe';
  SA: 'Saudi Arabia';
  ES: 'Spain';
  ER: 'Eritrea';
  ME: 'Montenegro';
  MD: 'Moldova';
  MG: 'Madagascar';
  MF: 'Saint Martin';
  MA: 'Morocco';
  MC: 'Monaco';
  UZ: 'Uzbekistan';
  MM: 'Myanmar';
  ML: 'Mali';
  MO: 'Macao';
  MN: 'Mongolia';
  MH: 'Marshall Islands';
  MK: 'Macedonia';
  MU: 'Mauritius';
  MT: 'Malta';
  MW: 'Malawi';
  MV: 'Maldives';
  MQ: 'Martinique';
  MP: 'Northern Mariana Islands';
  MS: 'Montserrat';
  MR: 'Mauritania';
  IM: 'Isle of Man';
  UG: 'Uganda';
  TZ: 'Tanzania';
  MY: 'Malaysia';
  MX: 'Mexico';
  IL: 'Israel';
  FR: 'France';
  IO: 'British Indian Ocean Territory';
  SH: 'Saint Helena';
  FI: 'Finland';
  FJ: 'Fiji';
  FK: 'Falkland Islands';
  FM: 'Micronesia';
  FO: 'Faroe Islands';
  NI: 'Nicaragua';
  NL: 'Netherlands';
  NO: 'Norway';
  NA: 'Namibia';
  VU: 'Vanuatu';
  NC: 'New Caledonia';
  NE: 'Niger';
  NF: 'Norfolk Island';
  NG: 'Nigeria';
  NZ: 'New Zealand';
  NP: 'Nepal';
  NR: 'Nauru';
  NU: 'Niue';
  CK: 'Cook Islands';
  XK: 'Kosovo';
  CI: 'Ivory Coast';
  CH: 'Switzerland';
  CO: 'Colombia';
  CN: 'China';
  CM: 'Cameroon';
  CL: 'Chile';
  CC: 'Cocos Islands';
  CA: 'Canada';
  CG: 'Republic of the Congo';
  CF: 'Central African Republic';
  CD: 'Democratic Republic of the Congo';
  CZ: 'Czech Republic';
  CY: 'Cyprus';
  CX: 'Christmas Island';
  CR: 'Costa Rica';
  CW: 'Curacao';
  CV: 'Cape Verde';
  CU: 'Cuba';
  SZ: 'Swaziland';
  SY: 'Syria';
  SX: 'Sint Maarten';
  KG: 'Kyrgyzstan';
  KE: 'Kenya';
  SS: 'South Sudan';
  SR: 'Suriname';
  KI: 'Kiribati';
  KH: 'Cambodia';
  KN: 'Saint Kitts and Nevis';
  KM: 'Comoros';
  ST: 'Sao Tome and Principe';
  SK: 'Slovakia';
  KR: 'South Korea';
  SI: 'Slovenia';
  KP: 'North Korea';
  KW: 'Kuwait';
  SN: 'Senegal';
  SM: 'San Marino';
  SL: 'Sierra Leone';
  SC: 'Seychelles';
  KZ: 'Kazakhstan';
  KY: 'Cayman Islands';
  SG: 'Singapore';
  SE: 'Sweden';
  SD: 'Sudan';
  DO: 'Dominican Republic';
  DM: 'Dominica';
  DJ: 'Djibouti';
  DK: 'Denmark';
  VG: 'British Virgin Islands';
  DE: 'Germany';
  YE: 'Yemen';
  DZ: 'Algeria';
  US: 'United States';
  UY: 'Uruguay';
  YT: 'Mayotte';
  UM: 'United States Minor Outlying Islands';
  LB: 'Lebanon';
  LC: 'Saint Lucia';
  LA: 'Laos';
  TV: 'Tuvalu';
  TW: 'Taiwan';
  TT: 'Trinidad and Tobago';
  TR: 'Turkey';
  LK: 'Sri Lanka';
  LI: 'Liechtenstein';
  LV: 'Latvia';
  TO: 'Tonga';
  LT: 'Lithuania';
  LU: 'Luxembourg';
  LR: 'Liberia';
  LS: 'Lesotho';
  TH: 'Thailand';
  TF: 'French Southern Territories';
  TG: 'Togo';
  TD: 'Chad';
  TC: 'Turks and Caicos Islands';
  LY: 'Libya';
  VA: 'Vatican';
  VC: 'Saint Vincent and the Grenadines';
  AE: 'United Arab Emirates';
  AD: 'Andorra';
  AG: 'Antigua and Barbuda';
  AF: 'Afghanistan';
  AI: 'Anguilla';
  VI: 'U.S. Virgin Islands';
  IS: 'Iceland';
  IR: 'Iran';
  AM: 'Armenia';
  AL: 'Albania';
  AO: 'Angola';
  AQ: 'Antarctica';
  AS: 'American Samoa';
  AR: 'Argentina';
  AU: 'Australia';
  AT: 'Austria';
  AW: 'Aruba';
  IN: 'India';
  AX: 'Aland Islands';
  AZ: 'Azerbaijan';
  IE: 'Ireland';
  ID: 'Indonesia';
  UA: 'Ukraine';
  QA: 'Qatar';
  MZ: 'Mozambique';
};
export enum CountryCodesEnum {
  Bangladesh = 'BD',
  Belgium = 'BE',
  'Burkina Faso' = 'BF',
  Bulgaria = 'BG',
  'Bosnia and Herzegovina' = 'BA',
  Barbados = 'BB',
  'Wallis and Futuna' = 'WF',
  'Saint Barthelemy' = 'BL',
  Bermuda = 'BM',
  Brunei = 'BN',
  Bolivia = 'BO',
  Bahrain = 'BH',
  Burundi = 'BI',
  Benin = 'BJ',
  Bhutan = 'BT',
  Jamaica = 'JM',
  'Bouvet Island' = 'BV',
  Botswana = 'BW',
  Samoa = 'WS',
  'Bonaire, Saint Eustatius and Saba ' = 'BQ',
  Brazil = 'BR',
  Bahamas = 'BS',
  Jersey = 'JE',
  Belarus = 'BY',
  Belize = 'BZ',
  Russia = 'RU',
  Rwanda = 'RW',
  Serbia = 'RS',
  'East Timor' = 'TL',
  Reunion = 'RE',
  Turkmenistan = 'TM',
  Tajikistan = 'TJ',
  Romania = 'RO',
  Tokelau = 'TK',
  'Guinea-Bissau' = 'GW',
  Guam = 'GU',
  Guatemala = 'GT',
  'South Georgia and the South Sandwich Islands' = 'GS',
  Greece = 'GR',
  'Equatorial Guinea' = 'GQ',
  Guadeloupe = 'GP',
  Japan = 'JP',
  Guyana = 'GY',
  Guernsey = 'GG',
  'French Guiana' = 'GF',
  Georgia = 'GE',
  Grenada = 'GD',
  'United Kingdom' = 'GB',
  Gabon = 'GA',
  'El Salvador' = 'SV',
  Guinea = 'GN',
  Gambia = 'GM',
  Greenland = 'GL',
  Gibraltar = 'GI',
  Ghana = 'GH',
  Oman = 'OM',
  Tunisia = 'TN',
  Jordan = 'JO',
  Croatia = 'HR',
  Haiti = 'HT',
  Hungary = 'HU',
  'Hong Kong' = 'HK',
  Honduras = 'HN',
  'Heard Island and McDonald Islands' = 'HM',
  Venezuela = 'VE',
  'Puerto Rico' = 'PR',
  'Palestinian Territory' = 'PS',
  Palau = 'PW',
  Portugal = 'PT',
  'Svalbard and Jan Mayen' = 'SJ',
  Paraguay = 'PY',
  Iraq = 'IQ',
  Panama = 'PA',
  'French Polynesia' = 'PF',
  'Papua New Guinea' = 'PG',
  Peru = 'PE',
  Pakistan = 'PK',
  Philippines = 'PH',
  Pitcairn = 'PN',
  Poland = 'PL',
  'Saint Pierre and Miquelon' = 'PM',
  Zambia = 'ZM',
  'Western Sahara' = 'EH',
  Estonia = 'EE',
  Egypt = 'EG',
  'South Africa' = 'ZA',
  Ecuador = 'EC',
  Italy = 'IT',
  Vietnam = 'VN',
  'Solomon Islands' = 'SB',
  Ethiopia = 'ET',
  Somalia = 'SO',
  Zimbabwe = 'ZW',
  'Saudi Arabia' = 'SA',
  Spain = 'ES',
  Eritrea = 'ER',
  Montenegro = 'ME',
  Moldova = 'MD',
  Madagascar = 'MG',
  'Saint Martin' = 'MF',
  Morocco = 'MA',
  Monaco = 'MC',
  Uzbekistan = 'UZ',
  Myanmar = 'MM',
  Mali = 'ML',
  Macao = 'MO',
  Mongolia = 'MN',
  'Marshall Islands' = 'MH',
  Macedonia = 'MK',
  Mauritius = 'MU',
  Malta = 'MT',
  Malawi = 'MW',
  Maldives = 'MV',
  Martinique = 'MQ',
  'Northern Mariana Islands' = 'MP',
  Montserrat = 'MS',
  Mauritania = 'MR',
  'Isle of Man' = 'IM',
  Uganda = 'UG',
  Tanzania = 'TZ',
  Malaysia = 'MY',
  Mexico = 'MX',
  Israel = 'IL',
  France = 'FR',
  'British Indian Ocean Territory' = 'IO',
  'Saint Helena' = 'SH',
  Finland = 'FI',
  Fiji = 'FJ',
  'Falkland Islands' = 'FK',
  Micronesia = 'FM',
  'Faroe Islands' = 'FO',
  Nicaragua = 'NI',
  Netherlands = 'NL',
  Norway = 'NO',
  Namibia = 'NA',
  Vanuatu = 'VU',
  'New Caledonia' = 'NC',
  Niger = 'NE',
  'Norfolk Island' = 'NF',
  Nigeria = 'NG',
  'New Zealand' = 'NZ',
  Nepal = 'NP',
  Nauru = 'NR',
  Niue = 'NU',
  'Cook Islands' = 'CK',
  Kosovo = 'XK',
  'Ivory Coast' = 'CI',
  Switzerland = 'CH',
  Colombia = 'CO',
  China = 'CN',
  Cameroon = 'CM',
  Chile = 'CL',
  'Cocos Islands' = 'CC',
  Canada = 'CA',
  'Republic of the Congo' = 'CG',
  'Central African Republic' = 'CF',
  'Democratic Republic of the Congo' = 'CD',
  'Czech Republic' = 'CZ',
  Cyprus = 'CY',
  'Christmas Island' = 'CX',
  'Costa Rica' = 'CR',
  Curacao = 'CW',
  'Cape Verde' = 'CV',
  Cuba = 'CU',
  Swaziland = 'SZ',
  Syria = 'SY',
  'Sint Maarten' = 'SX',
  Kyrgyzstan = 'KG',
  Kenya = 'KE',
  'South Sudan' = 'SS',
  Suriname = 'SR',
  Kiribati = 'KI',
  Cambodia = 'KH',
  'Saint Kitts and Nevis' = 'KN',
  Comoros = 'KM',
  'Sao Tome and Principe' = 'ST',
  Slovakia = 'SK',
  'South Korea' = 'KR',
  Slovenia = 'SI',
  'North Korea' = 'KP',
  Kuwait = 'KW',
  Senegal = 'SN',
  'San Marino' = 'SM',
  'Sierra Leone' = 'SL',
  Seychelles = 'SC',
  Kazakhstan = 'KZ',
  'Cayman Islands' = 'KY',
  Singapore = 'SG',
  Sweden = 'SE',
  Sudan = 'SD',
  'Dominican Republic' = 'DO',
  Dominica = 'DM',
  Djibouti = 'DJ',
  Denmark = 'DK',
  'British Virgin Islands' = 'VG',
  Germany = 'DE',
  Yemen = 'YE',
  Algeria = 'DZ',
  'United States' = 'US',
  Uruguay = 'UY',
  Mayotte = 'YT',
  'United States Minor Outlying Islands' = 'UM',
  Lebanon = 'LB',
  'Saint Lucia' = 'LC',
  Laos = 'LA',
  Tuvalu = 'TV',
  Taiwan = 'TW',
  'Trinidad and Tobago' = 'TT',
  Turkey = 'TR',
  'Sri Lanka' = 'LK',
  Liechtenstein = 'LI',
  Latvia = 'LV',
  Tonga = 'TO',
  Lithuania = 'LT',
  Luxembourg = 'LU',
  Liberia = 'LR',
  Lesotho = 'LS',
  Thailand = 'TH',
  'French Southern Territories' = 'TF',
  Togo = 'TG',
  Chad = 'TD',
  'Turks and Caicos Islands' = 'TC',
  Libya = 'LY',
  Vatican = 'VA',
  'Saint Vincent and the Grenadines' = 'VC',
  'United Arab Emirates' = 'AE',
  Andorra = 'AD',
  'Antigua and Barbuda' = 'AG',
  Afghanistan = 'AF',
  Anguilla = 'AI',
  'U.S. Virgin Islands' = 'VI',
  Iceland = 'IS',
  Iran = 'IR',
  Armenia = 'AM',
  Albania = 'AL',
  Angola = 'AO',
  Antarctica = 'AQ',
  'American Samoa' = 'AS',
  Argentina = 'AR',
  Australia = 'AU',
  Austria = 'AT',
  Aruba = 'AW',
  India = 'IN',
  'Aland Islands' = 'AX',
  Azerbaijan = 'AZ',
  Ireland = 'IE',
  Indonesia = 'ID',
  Ukraine = 'UA',
  Qatar = 'QA',
  Mozambique = 'MZ',
}

export enum CurrencyCodesEnum {
  Afghanistan = 'AFN',
  Albania = 'ALL',
  Algeria = 'DZD',
  Andorra = 'EUR',
  Angola = 'AOA',
  'Antigua and Barbuda' = 'XCD',
  Argentina = 'ARS',
  Armenia = 'AMD',
  Australia = 'AUD',
  Austria = 'EUR',
  Azerbaijan = 'AZN',
  Bahamas = 'BSD',
  Bahrain = 'BHD',
  Bangladesh = 'BDT',
  Barbados = 'BBD',
  Belarus = 'BYN',
  Belgium = 'EUR',
  Belize = 'BZD',
  Benin = 'XOF',
  Bhutan = 'BTN',
  Bolivia = 'BOB',
  'Bosnia and Herzegovina' = 'BAM',
  Botswana = 'BWP',
  Brazil = 'BRL',
  Brunei = 'BND',
  Bulgaria = 'BGN',
  'Burkina Faso' = 'XOF',
  Burundi = 'BIF',
  'Cabo Verde' = 'CVE',
  Cambodia = 'KHR',
  Cameroon = 'XAF',
  Canada = 'CAD',
  'Central African Republic' = 'XAF',
  Chad = 'XAF',
  Chile = 'CLP',
  China = 'CNY',
  Colombia = 'COP',
  Comoros = 'KMF',
  Congo = 'XAF',
  'Costa Rica' = 'CRC',
  Croatia = 'HRK',
  Cuba = 'CUP',
  Cyprus = 'EUR',
  'Czech Republic' = 'CZK',
  Denmark = 'DKK',
  Djibouti = 'DJF',
  Dominica = 'XCD',
  'Dominican Republic' = 'DOP',
  'East Timor (Timor-Leste)' = 'USD',
  Ecuador = 'USD',
  Egypt = 'EGP',
  'El Salvador' = 'USD',
  'Equatorial Guinea' = 'XAF',
  Eritrea = 'ERN',
  Estonia = 'EUR',
  Eswatini = 'SZL',
  Ethiopia = 'ETB',
  Fiji = 'FJD',
  Finland = 'EUR',
  France = 'EUR',
  Gabon = 'XAF',
  Gambia = 'GMD',
  Georgia = 'GEL',
  Germany = 'EUR',
  Ghana = 'GHS',
  Greece = 'EUR',
  Grenada = 'XCD',
  Guatemala = 'GTQ',
  Guinea = 'GNF',
  'Guinea-Bissau' = 'XOF',
  Guyana = 'GYD',
  Haiti = 'HTG',
  Honduras = 'HNL',
  Hungary = 'HUF',
  Iceland = 'ISK',
  India = 'INR',
  Indonesia = 'IDR',
  Iran = 'IRR',
  Iraq = 'IQD',
  Ireland = 'EUR',
  Israel = 'ILS',
  Italy = 'EUR',
  Jamaica = 'JMD',
  Japan = 'JPY',
  Jordan = 'JOD',
  Kazakhstan = 'KZT',
  Kenya = 'KES',
  Kiribati = 'AUD',
  'Korea, North' = 'KPW',
  'Korea, South' = 'KRW',
  Kosovo = 'EUR',
  Kuwait = 'KWD',
  Kyrgyzstan = 'KGS',
  Laos = 'LAK',
  Latvia = 'EUR',
  Lebanon = 'LBP',
  Lesotho = 'LSL',
  Liberia = 'LRD',
  Libya = 'LYD',
  Liechtenstein = 'CHF',
  Lithuania = 'EUR',
  Luxembourg = 'EUR',
  Madagascar = 'MGA',
  Malawi = 'MWK',
  Malaysia = 'MYR',
  Maldives = 'MVR',
  Mali = 'XOF',
  Malta = 'EUR',
  'Marshall Islands' = 'USD',
  Mauritania = 'MRU',
  Mauritius = 'MUR',
  Mexico = 'MXN',
  Micronesia = 'USD',
  Moldova = 'MDL',
  Monaco = 'EUR',
  Mongolia = 'MNT',
  Montenegro = 'EUR',
  Morocco = 'MAD',
  Mozambique = 'MZN',
  'Myanmar (Burma)' = 'MMK',
  Namibia = 'NAD',
  Nauru = 'AUD',
  Nepal = 'NPR',
  Netherlands = 'EUR',
  'New Zealand' = 'NZD',
  Nicaragua = 'NIO',
  Niger = 'XOF',
  Nigeria = 'NGN',
  'North Macedonia (Macedonia)' = 'MKD',
  Norway = 'NOK',
  Oman = 'OMR',
  Pakistan = 'PKR',
  Palau = 'USD',
  Panama = 'PAB',
  'Papua New Guinea' = 'PGK',
  Paraguay = 'PYG',
  Peru = 'PEN',
  Philippines = 'PHP',
  Poland = 'PLN',
  Portugal = 'EUR',
  Qatar = 'QAR',
  Romania = 'RON',
  Russia = 'RUB',
  Rwanda = 'RWF',
  'Saint Kitts and Nevis' = 'XCD',
  'Saint Lucia' = 'XCD',
  'Saint Vincent and the Grenadines' = 'XCD',
  Samoa = 'WST',
  'San Marino' = 'EUR',
  'Sao Tome and Principe' = 'STN',
  'Saudi Arabia' = 'SAR',
  Senegal = 'XOF',
  Serbia = 'RSD',
  Seychelles = 'SCR',
  'Sierra Leone' = 'SLL',
  Singapore = 'SGD',
  Slovakia = 'EUR',
  Slovenia = 'EUR',
  'Solomon Islands' = 'SBD',
  Somalia = 'SOS',
  'South Africa' = 'ZAR',
  'South Sudan' = 'SSP',
  Spain = 'EUR',
  'Sri Lanka' = 'LKR',
  Sudan = 'SDG',
  Suriname = 'SRD',
  Sweden = 'SEK',
  Switzerland = 'CHF',
  Syria = 'SYP',
  Taiwan = 'TWD',
  Tajikistan = 'TJS',
  Tanzania = 'TZS',
  Thailand = 'THB',
  Togo = 'XOF',
  Tonga = 'TOP',
  'Trinidad and Tobago' = 'TTD',
  Tunisia = 'TND',
  Turkey = 'TRY',
  Turkmenistan = 'TMT',
  Tuvalu = 'AUD',
  Uganda = 'UGX',
  Ukraine = 'UAH',
  'United Arab Emirates' = 'AED',
  'United Kingdom' = 'GBP',
  'United States' = 'USD',
  Uruguay = 'UYU',
  Uzbekistan = 'UZS',
  Vanuatu = 'VUV',
  'Vatican City' = 'EUR',
  Venezuela = 'VES',
  Vietnam = 'VND',
  Yemen = 'YER',
  Zambia = 'ZMW',
  Zimbabwe = 'ZWL',
}
