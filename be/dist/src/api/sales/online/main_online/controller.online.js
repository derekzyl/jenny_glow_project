"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOnlineSales = exports.createOnlineSales = void 0;
const interface_online_1 = require("../interface_online/interface.online");
const model_address_1 = require("../../../user/address/main_address/model.address");
const custom_error_1 = require("../../../../utilities/custom_error");
const http_response_1 = require("../../../../utilities/http_response");
const model_cart_1 = require("../../../user/cart/main_cart/model.cart");
const service_online_1 = require("./service.online");
const number_checker_1 = require("../../../../utilities/number_checker");
const model_product_1 = require("../../../product/main_product/model.product");
const id_generator_1 = require("../../../../utilities/id_generator");
const interface_sales_1 = require("../../interface_sales/interface.sales");
const id_gen_interface_1 = require("../../../../utilities/interface_utilities/id_gen.interface");
const model_vat_1 = require("../../../admin/vat/main_vat/model.vat");
const interface_vat_1 = require("../../../admin/vat/interface_vat/interface.vat");
const model_online_1 = require("./model.online");
const index_payment_1 = require("../../../../utilities/payment/index.payment");
const model_dispatch_1 = require("../../../admin/dispatch/main_dispatch/model.dispatch");
// 1) create a post online order
// 2) the dispatch rider should be able to maintain the messages on the order dispatch update
// 3) update general update status with update clearance
// 4) get all orders by staff
// 5) get all orders by user
// 6) get one order by staff or user
// 7) customer should be able to review product after purchase
// meaning we can create a new review of the product and review it
const createOnlineSales = async (request, response, next) => {
    try {
        // 1.1) get the request body
        const body = request.body;
        // 1.2 find if the user has any address at all
        const find_address = await model_address_1.ADDRESS.find({ user: request.user.id });
        if (!find_address)
            throw (0, custom_error_1.APP_ERROR)("No address found", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        // 1.3  get the user default address
        // find if the user has a default address
        let user_address = await model_address_1.ADDRESS.findOne({
            user: request.user.id,
            is_default: true,
        });
        if (body.address)
            user_address = await model_address_1.ADDRESS.findById(body.address);
        const shipping_fee = (0, service_online_1.calculateAddressFee)(user_address.id);
        if (!user_address)
            throw (0, custom_error_1.APP_ERROR)("you have no default address", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        const get_vat = await model_vat_1.VAT.findOne({ vat_name: interface_vat_1.VatE.ONLINE });
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
        const products = [];
        // first message
        const message = [
            {
                read_receipt: false,
                created_at: new Date(),
                information: "your order has been created and payment is being confirmed",
                updated_at: new Date(),
                title: "payment initialized",
                message_type: interface_online_1.MessageTypeE.TEXT,
            },
        ];
        for (const cart_item of body.cart_items) {
            const get_cart_item_in_db = await model_cart_1.CART_ITEM.findById(cart_item);
            if (!get_cart_item_in_db)
                throw (0, custom_error_1.APP_ERROR)("cart_item not found");
            const get_product = await model_product_1.PRODUCT.findById(get_cart_item_in_db.product.id);
            if (!get_product)
                throw (0, custom_error_1.APP_ERROR)("cart_item not found");
            // a) calculate total product price
            const product_shipping_fee = (await shipping_fee) * (0, number_checker_1.n)(get_cart_item_in_db.product_total_count);
            const total_product_price = (0, number_checker_1.n)(get_product.price) * (0, number_checker_1.n)(get_cart_item_in_db.product_total_count);
            const total_product_price_and_discount = total_product_price +
                (total_product_price * (0, number_checker_1.n)(get_product.discount_percentage)) / 100;
            const get_total_discount = (total_product_price * (0, number_checker_1.n)(get_product.discount_percentage)) / 100;
            // updating the product data
            const product = {
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
            ? (total_amount * (0, number_checker_1.n)(get_vat?.vat_percentage)) / 100
            : 0;
        // 1.5 get data from cart and update the  online checkout
        // what to omit a payment_method, payment_status, sales_type,
        amount_sold = vat + total_shipping_fee + total_amount;
        const online_checkout = {
            order_id: (0, id_generator_1.generateId)(id_gen_interface_1.IdGenE.WEB_SALES),
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
        };
        const create_online_order = new model_online_1.ONLINE_ORDER(online_checkout);
        const created_order = await create_online_order.save();
        const paystack_data = {
            email: request.user.email,
            amount: created_order.amount_sold * 100,
            reference: created_order.order_id,
            metadata: created_order.products.toString(),
        };
        // lets  now move to paystack payment
        const paystack = index_payment_1.PaymentIndex.paystack;
        const pay = new paystack();
        const init_pay = await pay.initialize(paystack_data);
        return response.redirect(http_response_1.HTTP_RESPONSE.CONTINUE, init_pay.data.authorization_url);
    }
    catch (error) {
        next(error);
    }
};
exports.createOnlineSales = createOnlineSales;
const verifyOnlineSales = async (request, response, next) => {
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
        const paystack = index_payment_1.PaymentIndex.paystack;
        const pay = new paystack();
        const check_if_hash = pay.verifyPaystackHash(request.headers, request.body);
        if (!check_if_hash)
            throw (0, custom_error_1.APP_ERROR)("this is not a valid paystack link");
        const check_paystack = await pay.verifyPayment(get_ref);
        const get_the_data = check_paystack.data.data;
        const get_trans_status = get_the_data.status;
        const find_one_order_with_ref_id = await model_online_1.ONLINE_ORDER.findOne({
            order_id: get_the_data.reference,
        });
        if (find_one_order_with_ref_id) {
            //2) lets handle the failed aspect first because thats is easier
            switch (get_trans_status) {
                case "failed":
                    {
                        find_one_order_with_ref_id.payment_status = interface_sales_1.PaymentStatusE.DECLINED;
                        const message = (0, service_online_1.customMessage)({
                            information: "payment failed",
                            title: "payment status",
                            message_type: interface_online_1.MessageTypeE.TEXT,
                        });
                        find_one_order_with_ref_id.message.push(message);
                    }
                    break;
                case "ongoing":
                    find_one_order_with_ref_id.payment_status = interface_sales_1.PaymentStatusE.PROCESSING;
                    break;
                case "abandoned":
                    {
                        find_one_order_with_ref_id.payment_status = interface_sales_1.PaymentStatusE.DECLINED;
                        const message = (0, service_online_1.customMessage)({
                            information: "payment cancelled by user",
                            title: "payment failed",
                            message_type: interface_online_1.MessageTypeE.TEXT,
                        });
                        find_one_order_with_ref_id.message.push(message);
                    }
                    break;
                case "success":
                    {
                        find_one_order_with_ref_id.payment_status = interface_sales_1.PaymentStatusE.APPROVED;
                        const message = (0, service_online_1.customMessage)({
                            information: "payment process approved",
                            title: "preparing your package for shipping",
                            message_type: interface_online_1.MessageTypeE.TEXT,
                        });
                        //a) create a dispatch query
                        const new_dispatch = await model_dispatch_1.DISPATCH.create({
                            tracking_id: (0, id_generator_1.generateId)(id_gen_interface_1.IdGenE.DISPATCH),
                            order_id: find_one_order_with_ref_id.order_id,
                        });
                        find_one_order_with_ref_id.dispatch = new_dispatch.id;
                        //b) send notification to the online branch admin
                        find_one_order_with_ref_id.message.push(message);
                    }
                    break;
                default:
                    find_one_order_with_ref_id.payment_status = interface_sales_1.PaymentStatusE.PENDING;
            }
            switch (get_the_data.channel) {
                case "bank_transfer":
                    find_one_order_with_ref_id.payment_method =
                        interface_sales_1.PaymentMethodE.BANK_TRANSFERS;
                    break;
                case "card":
                    find_one_order_with_ref_id.payment_method =
                        interface_sales_1.PaymentMethodE.CREDIT_CARD;
            }
            find_one_order_with_ref_id.save();
        }
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOnlineSales = verifyOnlineSales;
