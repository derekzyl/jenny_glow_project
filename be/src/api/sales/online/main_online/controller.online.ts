import { Request, Response, NextFunction } from "express";
import {
  MessageT,
  MessageTypeE,
  OnlineBodyT,
  OnlineI,
} from "../interface_online/interface.online";
import { ADDRESS } from "../../../user/address/main_address/model.address";
import { APP_ERROR } from "../../../../utilities/custom_error";
import { HTTP_RESPONSE } from "../../../../utilities/http_response";
import { CART, CART_ITEM } from "../../../user/cart/main_cart/model.cart";
import { calculateAddressFee, customMessage } from "./service.online";
import { n } from "../../../../utilities/number_checker";
import { PRODUCT } from "../../../product/main_product/model.product";
import { ProductAndCount } from "../../../user/cart/interface_cart/interface.cart";
import { generateId } from "../../../../utilities/id_generator";
import {
  OrderTypeE,
  PaymentMethodE,
  PaymentStatusE,
} from "../../interface_sales/interface.sales";
import { IdGenE } from "../../../../utilities/interface_utilities/id_gen.interface";
import { VAT } from "../../../admin/vat/main_vat/model.vat";
import { VatE } from "../../../admin/vat/interface_vat/interface.vat";
import { ONLINE_ORDER } from "./model.online";
import { PaystackPayI } from "../../../../utilities/interface_utilities/payment.interface";
import { PaymentIndex } from "../../../../utilities/payment/index.payment";
import { Paystack } from "../../../../utilities/payment/paystack.payment";
import { get } from "http";

// 1) create a post online order
// 2) the dispatch rider should be able to maintain the messages on the order dispatch update
// 3) update general update status with update clearance
// 4) get all orders by staff
// 5) get all orders by user
// 6) get one order by staff or user
// 7) customer should be able to review product after purchase
// meaning we can create a new review of the product and review it

export const createOnlineSales = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // 1.1) get the request body

    const body: OnlineBodyT = request.body;
    // 1.2 find if the user has any address at all
    const find_address = await ADDRESS.find({ user: request.user.id });
    if (!find_address)
      throw APP_ERROR("No address found", HTTP_RESPONSE.BAD_REQUEST);
    // 1.3  get the user default address
    // find if the user has a default address
    let user_address = await ADDRESS.findOne({
      user: request.user.id,
      is_default: true,
    });
    if (body.address) user_address = await ADDRESS.findById(body.address);
    const shipping_fee = calculateAddressFee(user_address!.id);

    if (!user_address)
      throw APP_ERROR("you have no default address", HTTP_RESPONSE.BAD_REQUEST);

    const get_vat = await VAT.findOne({ vat_name: VatE.ONLINE });

    // 1.4 get the cart id
    let total_shipping_fee = 0;
    // amount after discount is applied
    let total_amount = 0;

    //amount before discount
    let original_amount = 0;

    //vat shipping fee_total price
    let amount_sold = 0;
    // discount
    let discount = 0;
    // product and count
    const products: ProductAndCount[] = [];

    // first message
    const message: MessageT[] = [
      {
        read_receipt: false,
        created_at: new Date(),
        information:
          "your order has been created and payment is being confirmed",
        updated_at: new Date(),
        title: "payment initialized",
        message_type: MessageTypeE.TEXT,
      },
    ];

    for (const cart_item of body.cart_items) {
      const get_cart_item_in_db = await CART_ITEM.findById(cart_item);
      if (!get_cart_item_in_db) throw APP_ERROR("cart_item not found");
      const get_product = await PRODUCT.findById(
        get_cart_item_in_db.product.id
      );
      if (!get_product) throw APP_ERROR("cart_item not found");

      // a) calculate total product price
      const product_shipping_fee =
        (await shipping_fee) * n(get_cart_item_in_db.product_total_count);
      const total_product_price =
        n(get_product.price) * n(get_cart_item_in_db.product_total_count);
      const total_product_price_and_discount =
        total_product_price +
        (total_product_price * n(get_product.discount_percentage)) / 100;
      const get_total_discount =
        (total_product_price * n(get_product.discount_percentage)) / 100;
      // updating the product data
      const product: ProductAndCount = {
        product: get_product.id,
        product_total_count: get_cart_item_in_db.product_total_count,
        product_total_price: total_product_price_and_discount,
        shipping_fee: product_shipping_fee,
      };
      products.push(product);

      // concatenating the total cumulative data
      original_amount += total_product_price;
      total_amount += total_product_price_and_discount;
      discount += get_total_discount;
      total_shipping_fee += product_shipping_fee;

      //lets start calculations
    }

    const vat = get_vat?.vat_percentage
      ? (total_amount * n(get_vat?.vat_percentage)) / 100
      : 0;
    // 1.5 get data from cart and update the  online checkout
    // what to omit a payment_method, payment_status, sales_type,
    amount_sold = vat + total_shipping_fee + total_amount;
    const online_checkout: Partial<OnlineI> = {
      order_id: generateId(IdGenE.WEB_SALES),
      user: request.user.id,
      address: user_address.id,
      message,
      products,
      vat,
      amount_sold,
      server_amount_sold: amount_sold,
      server_total: total_amount,
      discount,
      total_amount,
      original_amount,
      dispatch: { tracking_id: generateId(IdGenE.DISPATCH) },
    };
    const create_online_order = new ONLINE_ORDER(online_checkout);
    const created_order = await create_online_order.save();

    const paystack_data: PaystackPayI = {
      email: request.user.email,
      amount: created_order.amount_sold * 100,
      reference: created_order.order_id,
      metadata: created_order.products.toString(),
    };

    // lets  now move to paystack payment

    const paystack = PaymentIndex.paystack;
    const pay = new paystack();
    const init_pay = await pay.initialize(paystack_data);
    return response.redirect(
      HTTP_RESPONSE.CONTINUE,
      init_pay.data.authorization_url
    );
  } catch (error) {
    next(error);
  }
};

export const verifyOnlineSales = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 1) get the url message from  Paystack
  // 2) change the order status
  // 3) clear cart
  // 4) update order information
  // 5) alert the branch manager about the OrderTypeE
  // 6) create a review schema

  try {
    // get the body of the webhook from paystack
    const data = request.body.data;
    const get_ref = data.reference;

    //1) check and verify paystack reference and fetch the data
    const paystack = PaymentIndex.paystack;
    const pay = new paystack();
    const check_if_hash = pay.verifyPaystackHash(request.headers, request.body);
    if (!check_if_hash) throw APP_ERROR("this is not a valid paystack link");
    const check_paystack = await pay.verifyPayment(get_ref);
    const get_the_data = check_paystack.data.data;
    const get_trans_status: string = get_the_data.status;

    const find_one_order_with_ref_id = await ONLINE_ORDER.findOne({
      order_id: get_the_data.reference,
    });

    if (find_one_order_with_ref_id) {
      //2) lets handle the failed aspect first because thats is easier

      switch (get_trans_status) {
        case "failed":
          {
            find_one_order_with_ref_id.payment_status = PaymentStatusE.DECLINED;
            const message = customMessage({
              information: "payment failed",
              title: "payment status",
              message_type: MessageTypeE.TEXT,
            });

            find_one_order_with_ref_id.message.push(message);
          }
          break;
        case "ongoing":
          find_one_order_with_ref_id.payment_status = PaymentStatusE.PROCESSING;
          break;
        case "abandoned":
          {
            find_one_order_with_ref_id.payment_status = PaymentStatusE.DECLINED;
            const message = customMessage({
              information: "payment cancelled by user",
              title: "payment failed",
              message_type: MessageTypeE.TEXT,
            });

            find_one_order_with_ref_id.message.push(message);
          }
          break;
        default:
          find_one_order_with_ref_id.payment_status = PaymentStatusE.PENDING;
      }

      switch (get_the_data.channel) {
        case "bank_transfer":
          find_one_order_with_ref_id.payment_method =
            PaymentMethodE.BANK_TRANSFERS;
          break;
        case "card":
          find_one_order_with_ref_id.payment_method =
            PaymentMethodE.CREDIT_CARD;
      }

      find_one_order_with_ref_id.save();
    }
  } catch (error) {
    next(error);
  }
};
