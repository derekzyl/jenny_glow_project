import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import * as exchangeEngineService from '../services/service.engine.exchange';
/*
  EXCHANGE ENGINE
*/
export const addExchange = catchAsync(async (req, res) => {
    const { user } = req;
    const exchange = await exchangeEngineService.addExchange(Object.assign({ createdByUserId: user.id, updatedByUserId: user.id }, req.body));
    res.status(httpStatus.CREATED).send(exchange);
});
/* The `getAllExchanges` function is an asynchronous function that handles the request to get all
exchanges. */
export const getAllExchanges = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['userId', 'volume', 'type', 'pricePctDifference', 'isActive']);
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await exchangeEngineService.queryExchanges(filter, options);
    res.send(result);
});
/* The `getExchange` function is an asynchronous function that handles the request to get a specific
exchange by its ID. */
export const getExchange = catchAsync(async (req, res) => {
    if (typeof req.params['exchangeId'] === 'string') {
        const exchange = await exchangeEngineService.getExchangeById(new mongoose.Types.ObjectId(req.params['exchangeId']));
        if (!exchange) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
        }
        res.send(exchange);
    }
});
/* The `updateExchange` function is an asynchronous function that handles the request to update an
exchange by its ID. */
export const updateExchange = catchAsync(async (req, res) => {
    if (typeof req.params['exchangeId'] === 'string') {
        const { user } = req;
        const exchange = await exchangeEngineService.updateExchangeById(new mongoose.Types.ObjectId(req.params['exchangeId']), Object.assign({ updatedByUserId: user.id }, req.body));
        res.send(exchange);
    }
});
export const deleteExchange = catchAsync(async (req, res) => {
    if (typeof req.params['exchangeId'] === 'string') {
        await exchangeEngineService.deleteExchangeById(new mongoose.Types.ObjectId(req.params['exchangeId']));
        res.status(httpStatus.NO_CONTENT).send();
    }
});
export const deactivateExchange = catchAsync(async (req, res) => {
    if (typeof req.params['exchangeId'] === 'string') {
        const { user } = req;
        await exchangeEngineService.deactivateExchangeById(new mongoose.Types.ObjectId(req.params['exchangeId']), user.id);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
//# sourceMappingURL=controller.engine.exchange.js.map