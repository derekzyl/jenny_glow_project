import { Paystack } from "./paystack.payment";

class Payment {
  // todo list
  // 1) integrate paystack
  public paystack(key?: string) {
    const paystack = new Paystack(key);
    return paystack;
  }
}

export const PaymentIndex = new Payment();
