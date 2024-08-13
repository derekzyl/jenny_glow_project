import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
import { exchangeOrderController, exchangeOrderValidation } from '..';
import { allPermissions } from '../../setting/roles';
const router = express.Router();
router
    .route('/orders')
    .get(auth(allPermissions.Exchanges.GetAll, allPermissions.SuperAdmin), validate(exchangeOrderValidation.queryCurrencyOrders), exchangeOrderController.queryCurrencyOrders);
router
    .route('/orders/:orderId/all')
    .get(auth(allPermissions.Exchanges.GetAll, allPermissions.SuperAdmin), validate(exchangeOrderValidation.getCurrencyOrderById), exchangeOrderController.getCurrencyOrderById)
    .patch(auth(allPermissions.Exchanges.TransactionOps, allPermissions.SuperAdmin), validate(exchangeOrderValidation.updateCurrencyOrder), exchangeOrderController.updateCurrencyOrder);
router
    .route('/orders/swap')
    .post(auth(allPermissions.Users.UserOnly), validate(exchangeOrderValidation.swapCurrencyOrder), exchangeOrderController.SwapCurrencies);
router
    .route('/orders/quote')
    .post(auth(allPermissions.Users.UserOnly), validate(exchangeOrderValidation.getSwapQuote), exchangeOrderController.getSwapQuote);
router
    .route('/orders/:orderRef/quote')
    .get(auth(allPermissions.Exchanges.Get, allPermissions.SuperAdmin), validate(exchangeOrderValidation.getCurrencyOrderByRef), exchangeOrderController.getCurrencyOrderByRef);
export default router;
//# sourceMappingURL=order.route.v1.js.map