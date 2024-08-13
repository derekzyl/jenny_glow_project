import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { logger } from '../../logger';
import axios from 'axios';
import EXCHANGES from '../models/model.engine.exchange';
/**
 * Query for exchanges
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryExchanges = async (filter, options) => {
    const exchanges = await EXCHANGES.paginate(filter, options);
    return exchanges;
};
/**
 * Add a new exchange - for traders/admin
 * @param {NewCreatedExchange} exchangeBody
 * @returns {Promise<IExchangeDoc>}
 */
export const addExchange = async (exchangeBody) => {
    // const exchangeExists = await EXCHANGES.isExists(exchangeBody.createdByUserId, exchangeBody.type, exchangeBody.volume);
    // if (exchangeExists) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Exchange already created');
    // }
    const exchanges = await queryExchanges({}, {});
    if (exchanges.results.length > 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Exchange already created');
    }
    return EXCHANGES.create(exchangeBody);
};
/**
 * Get exchange by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IExchangeDoc | null>}
 */
export const getExchangeById = async (id) => EXCHANGES.findById(id);
/**
 * Get the first exchange by id
 * @returns {Promise<IExchangeDoc | null>}
 */
export const getFirstExchange = async () => {
    const firstExchange = await EXCHANGES.findOne();
    return firstExchange;
};
/**
 * Update exchange by id
 * @param {mongoose.Types.ObjectId} exchangeId
 * @param {UpdateExchangeBody} updateBody
 * @returns {Promise<IExchangeDoc | null>}
 */
export const updateExchangeById = async (exchangeId, updateBody) => {
    const exchange = await getExchangeById(exchangeId);
    if (!exchange) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
    }
    // const exchangeExists = await EXCHANGES.isExists(exchangeId);
    // if (exchangeExists) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Exchange already created');
    // }
    Object.assign(exchange, updateBody);
    await exchange.save();
    return exchange;
};
/**
 * Delete exchange by id
 * @param {mongoose.Types.ObjectId} exchangeId
 * @returns {Promise<IExchangeDoc | null>}
 */
export const deleteExchangeById = async (exchangeId) => {
    const exchange = await getExchangeById(exchangeId);
    if (!exchange) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
    }
    await exchange.deleteOne();
    return exchange;
};
/**
 * Deactivate exchange by id
 * @param {mongoose.Types.ObjectId} exchangeId
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IExchangeDoc | null>}
 */
export const deactivateExchangeById = async (exchangeId, userId) => {
    const updateBody = { isActive: false, updatedByUserId: userId };
    const exchange = await updateExchangeById(exchangeId, updateBody);
    return exchange;
};
/**
 * The function `getExchangeRateInUSDT` retrieves the average price of a given currency in USDT
 * (Tether) using the Binance API.
 *
 * @param currency The `currency` parameter is a string that represents the currency symbol for which
 * you want to get the exchange rate. For example, if you pass "BTC" as the currency parameter, it will
 * fetch the exchange rate for Bitcoin (BTC) against USDT (Tether).
 *
 * @return the average price of the specified currency in USDT (Tether).
 */
export async function getExchangeRateInUSDT(currency) {
    // eslint-disable-next-line new-cap
    try {
        const getPrice = await axios.get(`https://bold-cobra-29.deno.dev?code=${currency.toUpperCase()}`);
        // const exchange = new binance();
        // const baseTicker = await exchange.fetchTicker(`${currency.toUpperCase()}/USDT`);
        // const currencyPrice = (baseTicker.bid + baseTicker.ask) / 2;
        const ticker = getPrice.data;
        if (ticker.base !== currency) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid currency');
        }
        const currencyPrice = (Number(ticker.last) + Number(ticker.converted_last.usd)) / 2;
        return currencyPrice;
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.NOT_FOUND, `error happened while fetching: ${error}`);
    }
}
// Usage
//# sourceMappingURL=service.engine.exchange.js.map