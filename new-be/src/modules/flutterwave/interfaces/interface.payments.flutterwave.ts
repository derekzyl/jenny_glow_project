import { FLWResponse } from './interface.flutterwave';

export interface CreatePaymentPayload {
  tx_ref: string; // A unique reference code for the transaction
  amount: number; // The amount to charge the customer
  currency?: string | undefined; // The currency to charge in (default is "NGN" if not provided)
  redirect_url: string; // The URL to redirect the customer to after payment
  customer: {
    email: string; // Email address of the customer (required)
    name?: string; // Name of the customer (optional)
    phonenumber?: string; // Phone number of the customer (optional)
  };
  meta?:
    | {
        consumer_id: number; // Consumer ID (optional)
        consumer_mac: string; // Consumer MAC address (optional)
      }
    | undefined;
  customizations?:
    | {
        title?: string; // Title to customize the payment modal (optional)
        logo?: string; // URL to a logo image (optional)
        description?: string; // Description for the payment (optional)
      }
    | undefined;
  subaccounts?:
    | {
        id: string; // Subaccount ID
        transaction_split_ratio: number; // Ratio to split the payment
      }[]
    | undefined;
  payment_options?: string[] | undefined; // Payment options to be displayed (optional)
}

export interface CreatePaymentResponse extends FLWResponse {
  data: {
    link: string; // The hosted payment link
  };
}
