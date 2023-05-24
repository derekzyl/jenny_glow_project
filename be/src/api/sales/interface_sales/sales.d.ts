export enum OrderStatusE {
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

export enum PaymentStatusE {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  DISPUTE = "DISPUTE",
  DECLINED = "DECLINED",
}

export enum PaymentMethodE {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PAYPAL = "PAYPAL",
  PAYONEER = "PAYONEER",
  BANK_TRANSFERS = "BANK_TRANSFERS",
  POS = "POS",
}
