"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentIndex = void 0;
const paystack_payment_1 = require("./paystack.payment");
class Payment {
    // todo list
    // 1) integrate paystack
    paystack(key) {
        const paystack = new paystack_payment_1.Paystack(key);
        return paystack;
    }
}
exports.PaymentIndex = new Payment();
