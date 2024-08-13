/* eslint-disable import/no-cycle */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { exchangeOrderService } from '..';
import { ApiError } from '../../errors';
import { verifyUserWithPin } from '../../user/service.user';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import { getFirstExchange } from '../services/service.engine.exchange';
/*
    EXCHANGE Order ENGINE
*/
// admin access only
export const getAllCurrencyPairOrdersByUser = catchAsync(async (req, res) => {
    const filter = { userId: req.user.id };
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await exchangeOrderService.queryCurrencyExchangeOrders(filter, options);
    res.send(result);
});
/*
  Currencies [crypto, fiat]
*/
export const SwapCurrencies = catchAsync(async (req, res) => {
    const exchange = await getFirstExchange();
    if (!exchange) {
        throw new ApiError(httpStatus.NOT_FOUND, 'error getting exchange rate');
    }
    await verifyUserWithPin(req.user.id, req.body.userTransactionPin);
    const currency = await exchangeOrderService.swapCurrencies(Object.assign(Object.assign({}, req.body), { userId: req.user.id, exchangeId: exchange.id }));
    res.status(httpStatus.OK).send(currency);
});
// export const deleteCurrencyOrder = catchAsync(async (req: Request, res: Response) => {
//   const id = new mongoose.Types.ObjectId(req.params['orderId']);
//   await exchangeOrderService.delete(id);
//   res.send({ message: 'Order deleted successfully' });
// });
export const updateCurrencyOrderUser = catchAsync(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params['orderId']);
    const updatedOrder = await exchangeOrderService.updateCurrencyExchangeOrderById(id, req.body);
    res.send(updatedOrder);
});
export const updateCurrencyOrder = catchAsync(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params['orderId']);
    const updatedOrder = await exchangeOrderService.queryCurrencyExchangeOrders(id, req.body);
    res.send(updatedOrder);
});
export const getCurrencyOrderById = catchAsync(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params['orderId']);
    const order = await exchangeOrderService.getCurrencyExchangeOrderById(id);
    res.send(order);
});
export const getCurrencyOrderByRef = catchAsync(async (req, res) => {
    const ref = req.params['reference'];
    if (!ref) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'reference is required');
    }
    const order = await exchangeOrderService.getCurrencyExchangeOrderByRef(ref);
    res.send(order);
});
export const queryCurrencyOrders = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['userId', 'exchangeId', 'currencyPairId']);
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const orders = await exchangeOrderService.queryCurrencyExchangeOrders(filter, options);
    res.send(orders);
});
export const getSwapQuote = catchAsync(async (req, res) => {
    const { amount, baseCurrencyCode, quoteCurrencyCode } = req.body;
    const quote = await exchangeOrderService.getSwapQuote({ amount, baseCurrencyCode, quoteCurrencyCode });
    res.send(quote);
});
// Add more functions as needed based on your application's requirements
//# sourceMappingURL=controller.order.exchange.js.map