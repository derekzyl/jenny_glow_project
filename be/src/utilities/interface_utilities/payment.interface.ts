export enum CurrencyE {
  NGN = "NGN",
  GHS = "GHS",
  USD = "USD",
  ZAR = "ZAR",
}
export interface PaystackI {
  amount: number;
  email: string;
  currency: CurrencyE;
  reference: string;
  plan: string;
  invoice_limit: number;
  callback_url: string;
  matadata: string;
  split_code: string;
  subaccount: string;
  transaction_charge: string;
  bearer: string;
}
