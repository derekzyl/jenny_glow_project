export enum VatE {
  LOCAL = "LOCAL",
  ONLINE = "ONLINE",
}

export interface VatI {
  vat_percentage: number;
  vat_name: VatE;
}
