export enum StatusE {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum SalesTypeE {
  ONLINE_SALES = "ONLINE_SALES",
  STORE_SALES = "STORE_SALES",
}

export enum OrderTypeE {
  WHOLESALE = "WHOLE_SALE",
  RETAIL = "RETAIL",
}

export type ProductT = {
  product: Types.ObjectId;
  quantity_of_product: number;
  total: number;
};

export type MessageT = {
  date: Date;
  message: string;
};
