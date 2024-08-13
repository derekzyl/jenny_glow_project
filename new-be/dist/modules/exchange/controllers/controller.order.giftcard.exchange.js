/* eslint-disable import/no-cycle */
// controllers/giftCardController.ts
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { exchangeGiftCardService } from '..';
import { ApiError } from '../../errors';
import { catchAsync, pick } from '../../utils';
export const createGiftCardOrder = catchAsync(async (req, res) => {
    const { user } = req;
    const newOrder = await exchangeGiftCardService.createGiftCardExchange(Object.assign(Object.assign({}, req.body), { userId: user.id }));
    res.send(newOrder);
});
export const creditGiftCardOrder = catchAsync(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params['orderId']);
    const { user } = req;
    const updatedOrder = await exchangeGiftCardService.creditGiftCard({
        orderId: id,
        amount: req.body.amount,
        userId: user.id,
    });
    res.send(updatedOrder);
});
export const getAllGiftCardOrders = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['userId', 'giftCardId', 'orderStatus', 'ref', 'cardPin']);
    const options = pick(req.query, ['sort', 'limit', 'page']);
    const orders = await exchangeGiftCardService.getGiftCardOrders(filter, options);
    res.send(orders);
});
export const getGiftCardOrder = catchAsync(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params['orderId']);
    const order = await exchangeGiftCardService.getGiftCardOrderById(id);
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    res.send(order);
});
export const getGiftCardOrdersByUser = catchAsync(async (req, res) => {
    const { user } = req;
    const options = pick(req.query, ['sort', 'limit', 'page']);
    const orders = await exchangeGiftCardService.getGiftCardOrdersByUserId(user.id, options);
    res.send(orders);
});
export const deleteGiftCardOrder = catchAsync(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params['orderId']);
    await exchangeGiftCardService.deleteGiftCardOrderById(id);
    res.send({ message: 'Order deleted successfully' });
});
export const updateGiftCardOrderUser = catchAsync(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params['orderId']);
    const { user } = req;
    const updatedOrder = await exchangeGiftCardService.updateGiftCardOrderByUser({ userId: user.id, id }, req.body);
    res.send(updatedOrder);
});
export const updateGiftCardOrder = catchAsync(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params['orderId']);
    const updatedOrder = await exchangeGiftCardService.updateGiftCardOrderById(id, req.body, req.user.id);
    res.send(updatedOrder);
});
//# sourceMappingURL=controller.order.giftcard.exchange.js.map