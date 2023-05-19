export enum VatE {
  LOCAL = "LOCAL",
  ONLINE = "ONLINE",
}

export interface VatI {
  vat: number;
  vat_name: VatE;
}
