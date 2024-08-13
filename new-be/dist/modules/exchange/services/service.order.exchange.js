/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
import ApiError from '../../errors/ApiError';
import logger from '../../logger/logger';
import { refBonusService, refService } from '../../referral';
import { verifyUserWithPin } from '../../user/service.user';
import { exchangeCrypto, getCryptoWalletByUserIdAndCurrencyCode } from '../../wallet/services/service.crypto.wallet';
import { getCurrencyById } from '../../wallet/services/service.currency.wallet';
import { exchangeFiat, getFiatWalletByUserIdAndCurrencyCode } from '../../wallet/services/service.fiat.wallet';
import httpStatus from 'http-status';
import { FeeTypes } from '../../../config/exchanges';
import { transactionTypes } from '../../../config/transactions';
import { FiatCurrencyCodes, cryptoCurrencyCodes } from '../../setting/currencies';
import EXCHANGE_CURRENCY_ORDERS from '../models/model.order.currency-pair.exchange';
import { getExchangeById, getExchangeRateInUSDT, getFirstExchange } from './service.engine.exchange';
// import { getGiftcardById } from '../../wallet/services/service.giftcard.wallet';
// import { getGiftcardExchangeRateByCurrencyId } from './service.giftcard.rate.exchange';
// import { NewCreatedGiftcardOrder, IGiftcardOrderDoc } from '../interfaces/interfaces.giftcard.order.exchange';
// import EXCHANGE_GIFTCARD_ORDERS from '../models/model.giftcard.order.exchange';
/*
    EXCHANGE ENGINE => ORDERS
*/
export async function getOrderByReference({ isAdminRef, reference, }) {
    const payload = isAdminRef ? { adminRef: reference } : { ref: reference };
    const order = await EXCHANGE_CURRENCY_ORDERS.findOne(payload);
    return order;
}
/**
 * Create a new currency exchange order
 * @param {NewCreatedCurrencyOrder} currencyOrderBody
 * @returns {Promise<ICurrencyOrderDoc>}
 */
export const createCurrencyExchangeOrder = async (currencyOrderBody) => {
    // if (await EXCHANGE_CURRENCY_ORDERS.isExists(exchangeBody.createdByUserId, exchangeBody.type, exchangeBody.volume)) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Exchange already created');
    // }
    return EXCHANGE_CURRENCY_ORDERS.create(currencyOrderBody);
};
/**
 * Query for exchange orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCurrencyExchangeOrders = async (filter, options) => {
    const orders = await EXCHANGE_CURRENCY_ORDERS.paginate(filter, options);
    return orders;
};
/**
 * Get currency exchange order by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICurrencyOrderDoc | null>}
 */
export const getCurrencyExchangeOrderById = async (id) => EXCHANGE_CURRENCY_ORDERS.findById(id);
/**
 * The function `getCurrencyExchangeOrderByRef` retrieves a currency exchange order document based on a
 * given reference.
 *
 * @param ref The "ref" parameter is a string that represents the reference number of a currency
 * exchange order.
 */
export const getCurrencyExchangeOrderByRef = async (ref) => EXCHANGE_CURRENCY_ORDERS.findOne({ ref });
/**
 * Update exchange orders by id
 * @param {mongoose.Types.ObjectId} id
 * @param {UpdateCurrencyOrderBody} updateBody
 * @returns {Promise<ICurrencyOrderDoc | null>}
 */
export const updateCurrencyExchangeOrderById = async (id, updateBody) => {
    const order = await getCurrencyExchangeOrderById(id);
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Exchange Order not found');
    }
    // if (updateBody.id && (await EXCHANGE_CURRENCY_ORDERS.isExists(updateBody.currencyPairId, id))) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Currency Pair Rate already added');
    // }
    Object.assign(order, updateBody);
    await order.save();
    return order;
};
/*
  UTILS
*/
export const getWallet = async (user, currency, isCrypto) => {
    const walletType = isCrypto ? 'crypto' : 'fiat';
    const wallet = await (isCrypto
        ? getCryptoWalletByUserIdAndCurrencyCode(user.id, currency.code)
        : getFiatWalletByUserIdAndCurrencyCode(user.id, currency.code));
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, `${walletType} wallet not found`);
    }
    return wallet;
};
/**
 * The function `detectCurrencies` asynchronously retrieves details of base and quote currencies for a
 * user and handles errors centrally.
 *
 * @param user The `user` parameter in the `detectCurrencies` function is of type `IUserDoc`, which
 * likely represents a document or object containing information about a user. This parameter is used
 * to retrieve wallet information for the user.
 * @param currencyPair The `currencyPair` parameter in the `detectCurrencies` function is an object
 * that contains two properties:
 *
 * @return The `detectCurrencies` function is returning an object containing details about the base
 * currency, quote currency, their respective wallets, currency types, and a boolean indicating if the
 * base and quote currencies are of the same type. This object is returned as a Promise of type
 * `NewCreatedCurrencyOrderDetails | null`.
 */
export const detectCurrencies = async (user, currencyPair) => {
    try {
        logger.info(` currencies ${JSON.stringify(currencyPair)}`);
        const [baseCurrency, quoteCurrency] = await Promise.all([
            getCurrencyById(currencyPair.baseCurrency) || null,
            getCurrencyById(currencyPair.quoteCurrency) || null,
        ]);
        if (!baseCurrency) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Base currency not found');
        }
        if (!quoteCurrency) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Quote currency not found');
        }
        const baseCurrencyWallet = await getWallet(user, baseCurrency, baseCurrency.currencyType !== 'FIAT');
        const quoteCurrencyWallet = await getWallet(user, quoteCurrency, quoteCurrency.currencyType !== 'FIAT');
        const same = baseCurrency.currencyType === quoteCurrency.currencyType;
        const currencies = {
            baseCurrencyDetails: {
                currency: baseCurrency,
                wallet: baseCurrencyWallet,
                currencyType: baseCurrency.currencyType,
            },
            quoteCurrencyDetails: {
                currency: quoteCurrency,
                wallet: quoteCurrencyWallet,
                currencyType: quoteCurrency.currencyType,
            },
            same,
        };
        return currencies;
    }
    catch (error) {
        // Handle errors centrally
        logger.error(`detectCurrencies error: ${error}`);
        throw new ApiError(httpStatus.NOT_FOUND, `${error}`);
    }
};
/**
 * Calculate and take fee for a currency order
 * @param {IFiatWalletDoc | ICryptoHDWalletDoc} currencyWallet - Currency wallet
 * @param {FiatCurrencyCodes | CryptoCurrencyCodesT} currencyCode - Currency code
 * @param {ICurrencyOrderDoc} currencyOrder - Currency order doc
 * @param {ICurrencyPairRateDoc} currencyPairRate - Currency pair rate doc
 * @param {'FIAT' | 'CRYPTO'} mode - Transaction mode
 * @returns {Promise<NewCreatedCurrencyOrderFeeDetails | null>}
 */
export const calculateAndTakeFee = async ({ baseCurrencyCode, quoteCurrencyCode, exchangeId, currencyOrder, type = 'SWAP', }) => {
    try {
        // Deduct the base currency amount from the user and credit the quote currency amount
        // Also need to check for enough exchange liquidity
        const exchange = await getExchangeById(exchangeId);
        if (!exchange) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
        }
        const rawAmount = Number(currencyOrder.amount);
        let feeAmount;
        let creditAmt;
        let creditAmount;
        const fiatTypes = Object.values(FiatCurrencyCodes);
        const cryptoTypes = Object.values(cryptoCurrencyCodes);
        switch (type) {
            case 'WITHDRAWAL': {
                feeAmount = (rawAmount * exchange.withdrawalFee) / 100;
                creditAmount = rawAmount - feeAmount;
                const currencyOrderFee = {
                    order: currencyOrder,
                    feeAmount,
                    debitAmount: rawAmount,
                    creditAmount,
                };
                return currencyOrderFee;
            }
            case 'SWAP': {
                // lets get exchange rate in usd`
                // imagine the rate will now be 394006
                if (!fiatTypes.includes(baseCurrencyCode) && cryptoTypes.includes(baseCurrencyCode)) {
                    // base currency
                    // this block is strictly crypto
                    const baseExchangeRate = await getExchangeRateInUSDT(baseCurrencyCode);
                    const cvrtToUSDT = rawAmount * baseExchangeRate;
                    // bear in mind the creditAmt is in USD
                    switch (exchange.feeType) {
                        case FeeTypes.fixed:
                            feeAmount = exchange.fee;
                            creditAmt = cvrtToUSDT - feeAmount;
                            break;
                        case FeeTypes.percentage:
                            feeAmount = (cvrtToUSDT * exchange.fee) / 100;
                            creditAmt = cvrtToUSDT - feeAmount;
                            break;
                        case FeeTypes.fxRate:
                            creditAmt = (cvrtToUSDT * exchange.fee) / exchange.ngnToUsd;
                            feeAmount = cvrtToUSDT - creditAmt;
                            break;
                    }
                }
                else {
                    // base currency
                    // fiat exchange
                    const cvrtToUSDT = rawAmount / exchange.ngnToUsd;
                    switch (exchange.feeType) {
                        case FeeTypes.fixed:
                            feeAmount = exchange.fee;
                            creditAmt = cvrtToUSDT - feeAmount;
                            break;
                        case FeeTypes.percentage:
                            feeAmount = (cvrtToUSDT * exchange.fee) / 100;
                            creditAmt = cvrtToUSDT - feeAmount;
                            break;
                        case FeeTypes.fxRate:
                            creditAmt = (cvrtToUSDT * exchange.fee) / exchange.ngnToUsd;
                            feeAmount = cvrtToUSDT - creditAmt;
                            break;
                    }
                }
                if (!fiatTypes.includes(quoteCurrencyCode) && cryptoTypes.includes(quoteCurrencyCode)) {
                    // quote currency
                    // crypto
                    const quoteExchangeRate = await getExchangeRateInUSDT(quoteCurrencyCode);
                    const cvrtToUSDT = creditAmt / quoteExchangeRate;
                    creditAmount = cvrtToUSDT;
                }
                else {
                    // quote currency
                    // fiat
                    const cvrtToNGN = creditAmt * exchange.ngnToUsd;
                    creditAmount = cvrtToNGN;
                }
                const currencyOrderFee = {
                    order: currencyOrder,
                    feeAmount,
                    debitAmount: rawAmount,
                    creditAmount,
                };
                return currencyOrderFee;
            }
        }
    }
    catch (error) {
        // Handle errors centrally
        logger.error(error);
        throw new ApiError(httpStatus.BAD_GATEWAY, error);
    }
};
/**
 * Perform a same-currency type swap
 * @param {NewCreatedCurrencyOrderDetails} currencies - Details of the currencies involved in the swap
 * @param {ICurrencyOrderDoc} currencyOrder - Currency order document
 * @returns {Promise<ICurrencyOrderDoc>}
 */
export const performSameCurrencySwap = async (exchangeId, currencies, currencyOrder) => {
    var _a;
    try {
        logger.info('performSameCurrencySwap');
        const { baseCurrencyDetails } = currencies;
        const { quoteCurrencyDetails } = currencies;
        if (baseCurrencyDetails.currencyType !== 'FIAT') {
            const baseCurrencyWallet = baseCurrencyDetails.wallet;
            const baseCurrencyCode = baseCurrencyDetails.currency.code;
            const quoteCurrencyCode = quoteCurrencyDetails.currency.code;
            const feeCryptoExchangeTx = await calculateAndTakeFee({
                exchangeId,
                type: 'SWAP',
                baseCurrencyCode,
                quoteCurrencyCode,
                currencyOrder,
            });
            if (!feeCryptoExchangeTx) {
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to deduct exchange fees');
            }
            const sendBaseToCryptoExchangeTx = await exchangeCrypto(baseCurrencyWallet, baseCurrencyCode, feeCryptoExchangeTx.debitAmount, 'SEND');
            if (sendBaseToCryptoExchangeTx.status === 'success') {
                //         "status": "PENDING",
                // "amount": "0.0003",
                // "uid": "e90cce8b-27c6-409f-847a-44e862129628",
                // "assetType": "BTC",
                // "chain": "BITCOIN",
                // "network": "TESTNET",
                // "fee": "0.00001695",
                // "description": null,
                // "ref": "BTP-UbBJF1zrMfZwDGoM8TDuMKIcHP1omH"
                currencyOrder.baseCurrencySent = false;
                currencyOrder.amount = Number(sendBaseToCryptoExchangeTx.data.amount);
                currencyOrder.uid = sendBaseToCryptoExchangeTx.data.uid;
                currencyOrder.networkFee = Number(sendBaseToCryptoExchangeTx.data.fee);
                currencyOrder.network = sendBaseToCryptoExchangeTx.data.network;
                currencyOrder.chain = sendBaseToCryptoExchangeTx.data.chain;
                currencyOrder.creditAmount = Number(feeCryptoExchangeTx.creditAmount);
                currencyOrder.debitAmount = Number(feeCryptoExchangeTx.debitAmount);
                currencyOrder.ref = sendBaseToCryptoExchangeTx.data.ref;
                currencyOrder.status = sendBaseToCryptoExchangeTx.data.status;
                currencyOrder.description = (_a = sendBaseToCryptoExchangeTx.data.description) !== null && _a !== void 0 ? _a : '';
                currencyOrder.fee = feeCryptoExchangeTx.feeAmount;
                await currencyOrder.save();
            }
            //! please note: the sending will be handled from the webhook
            // const sendQuoteToCryptoUserTx = await exchangeCrypto(
            //   quoteCurrencyWallet,
            //   quoteCurrencyCode,
            //   String(feeCryptoExchangeTx.creditAmount),
            //   'RECEIVE'
            // );
            // if (sendQuoteToCryptoUserTx.isConfirmed) {
            //   currencyOrder.quoteCurrencyReceived = true;
            //   await currencyOrder.save();
            // }
            // // successful?
            // if (currencyOrder.feeReceived && currencyOrder.baseCurrencySent && currencyOrder.quoteCurrencyReceived) {
            //   currencyOrder.filled = true;
            //   await currencyOrder.save();
            //   return currencyOrder;
            // }
        }
        return currencyOrder;
    }
    catch (error) {
        // Handle errors centrally
        logger.error(error);
        throw error;
    }
};
/**
 * Perform a different-currency type swap
 * @param {NewCreatedCurrencyOrderDetails} currencies - Details of the currencies involved in the swap
 * @param {ICurrencyOrderDoc} currencyOrder - Currency order document
 * @returns {Promise<ICurrencyOrderDoc>}
 */
export const performDifferentCurrencySwap = async (exchangeId, currencies, currencyOrder) => {
    var _a, _b, _c;
    try {
        logger.info('perform differentCurrencySwap');
        const exchange = await getFirstExchange();
        if (!exchange) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
        }
        if (currencies.baseCurrencyDetails.currencyType !== 'FIAT') {
            const baseCurrencyWallet = currencies.baseCurrencyDetails.wallet;
            // const quoteCurrencyWallet = currencies.quoteCurrencyDetails.wallet as IFiatWalletDoc;
            const baseCurrencyCode = currencies.baseCurrencyDetails.currency.code;
            const quoteCurrencyCode = currencies.quoteCurrencyDetails.currency.code;
            const feeExchangeTx = await calculateAndTakeFee({
                exchangeId,
                type: 'SWAP',
                baseCurrencyCode,
                quoteCurrencyCode,
                currencyOrder,
            });
            if (!feeExchangeTx) {
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to deduct exchange fees');
            }
            const sendBaseToCryptoExchangeTx = await exchangeCrypto(baseCurrencyWallet, baseCurrencyCode, Number(feeExchangeTx.debitAmount), 'SEND');
            // if (sendBaseToCryptoExchangeTx.isConfirmed) {
            //   currencyOrder.baseCurrencySent = true;
            //   await currencyOrder.save();
            // }
            if (sendBaseToCryptoExchangeTx.status === 'success') {
                //         "status": "PENDING",
                // "amount": "0.0003",
                // "uid": "e90cce8b-27c6-409f-847a-44e862129628",
                // "assetType": "BTC",
                // "chain": "BITCOIN",
                // "network": "TESTNET",
                // "fee": "0.00001695",
                // "description": null,
                // "ref": "BTP-UbBJF1zrMfZwDGoM8TDuMKIcHP1omH"
                currencyOrder.baseCurrencySent = false;
                currencyOrder.amount = Number(sendBaseToCryptoExchangeTx.data.amount);
                currencyOrder.uid = sendBaseToCryptoExchangeTx.data.uid;
                currencyOrder.networkFee = Number(sendBaseToCryptoExchangeTx.data.fee);
                currencyOrder.network = sendBaseToCryptoExchangeTx.data.network;
                currencyOrder.chain = sendBaseToCryptoExchangeTx.data.chain;
                currencyOrder.creditAmount = Number(feeExchangeTx.creditAmount);
                currencyOrder.debitAmount = Number(feeExchangeTx.debitAmount);
                currencyOrder.ref = sendBaseToCryptoExchangeTx.data.ref;
                currencyOrder.status = sendBaseToCryptoExchangeTx.data.status;
                currencyOrder.description = (_a = sendBaseToCryptoExchangeTx.data.description) !== null && _a !== void 0 ? _a : '';
                currencyOrder.fee = feeExchangeTx.feeAmount;
                await currencyOrder.save();
            }
            //! please note: the sending will be handled from the webhook
            // const sendQuoteToFiatUserTx = await exchangeFiat(
            //   quoteCurrencyWallet,
            //   quoteCurrencyCode,
            //   feeExchangeTx.creditAmount,
            //   'RECEIVE'
            // );
            // if (sendQuoteToFiatUserTx.isComplete) {
            //   currencyOrder.quoteCurrencyReceived = true;
            //   await currencyOrder.save();
            // }
            // // successful?
            // if (currencyOrder.feeReceived && currencyOrder.baseCurrencySent && currencyOrder.quoteCurrencyReceived) {
            //   currencyOrder.filled = true;
            //   await currencyOrder.save();
            //   return currencyOrder;
            // }
        }
        else {
            const baseCurrencyWallet = currencies.baseCurrencyDetails.wallet;
            const quoteCurrencyWallet = currencies.quoteCurrencyDetails.wallet;
            const baseCurrencyCode = currencies.baseCurrencyDetails.currency.code;
            const quoteCurrencyCode = currencies.quoteCurrencyDetails.currency.code;
            const exchangeFeeTx = await calculateAndTakeFee({
                exchangeId,
                type: 'SWAP',
                baseCurrencyCode,
                quoteCurrencyCode,
                currencyOrder,
            });
            if (!exchangeFeeTx) {
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to deduct exchange fees');
            }
            // send to admin some fiat
            const sendBaseToFiatExchangeTx = await exchangeFiat(baseCurrencyWallet, baseCurrencyCode, exchangeFeeTx.debitAmount, 'SEND');
            if (sendBaseToFiatExchangeTx.isComplete) {
                const getRef = await refService.getReferralByUserId(currencyOrder.userId);
                const bonus = (exchange.localExchangeRateToUsd * exchangeFeeTx.feeAmount * 10) / 100;
                if (getRef && getRef.refBy) {
                    // create ref bonus
                    await refBonusService.createRefBonus({
                        bonus,
                        details: 'swap bonus from your referral ',
                        referral: getRef.userId,
                        type: 'SWAP',
                        userId: getRef.refBy,
                    });
                }
                currencyOrder.baseCurrencySent = true;
                currencyOrder.amount = Number(sendBaseToFiatExchangeTx.amount);
                currencyOrder.uid = sendBaseToFiatExchangeTx.uid;
                currencyOrder.feeReceived = true;
                currencyOrder.creditAmount = Number(exchangeFeeTx.creditAmount);
                currencyOrder.debitAmount = Number(exchangeFeeTx.debitAmount);
                currencyOrder.ref = sendBaseToFiatExchangeTx.ref;
                currencyOrder.status = sendBaseToFiatExchangeTx.status;
                currencyOrder.description = (_b = sendBaseToFiatExchangeTx.description) !== null && _b !== void 0 ? _b : '';
                currencyOrder.fee = exchangeFeeTx.feeAmount;
                await currencyOrder.save();
                const sendQuoteToCryptoUserTx = await exchangeCrypto(quoteCurrencyWallet, quoteCurrencyCode, Number(exchangeFeeTx.creditAmount), 'RECEIVE');
                if (String(sendQuoteToCryptoUserTx.status).toLowerCase() === 'success') {
                    currencyOrder.baseCurrencySent = true;
                    currencyOrder.creditAmount = Number(sendQuoteToCryptoUserTx.data.amount);
                    currencyOrder.networkFee = Number(sendQuoteToCryptoUserTx.data.fee);
                    currencyOrder.network = sendQuoteToCryptoUserTx.data.network;
                    currencyOrder.adminChain = sendQuoteToCryptoUserTx.data.chain;
                    currencyOrder.creditAmount = Number(exchangeFeeTx.creditAmount);
                    currencyOrder.debitAmount = Number(exchangeFeeTx.debitAmount);
                    currencyOrder.adminRef = sendQuoteToCryptoUserTx.data.ref;
                    currencyOrder.adminStatus = sendQuoteToCryptoUserTx.data.status;
                    currencyOrder.adminUid = sendQuoteToCryptoUserTx.data.uid;
                    currencyOrder.description = (_c = sendQuoteToCryptoUserTx.data.description) !== null && _c !== void 0 ? _c : '';
                    currencyOrder.fee = exchangeFeeTx.feeAmount;
                    await currencyOrder.save();
                }
            }
        }
        return currencyOrder;
    }
    catch (error) {
        // Handle errors centrally
        logger.error(error);
        throw error;
    }
};
/*
    Exchange Services (Asset Orders)
*/
/**
 * Swap currencies
 * @param {NewRegisteredCurrencyOrder} currencyOrderBody - Details of the currency order to be swapped
 * @returns {Promise<ICurrencyOrderDoc>} - The resulting currency order document after the swap
 */
export const swapCurrencies = async (currencyOrderBody) => {
    try {
        const user = await verifyUserWithPin(currencyOrderBody.userId, currencyOrderBody.userTransactionPin);
        // lets check the balance before we continue
        const exchange = await getExchangeById(currencyOrderBody.exchangeId);
        if (!exchange) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
        }
        // Detect both currency wallets
        if (currencyOrderBody.quoteCurrencyId === currencyOrderBody.baseCurrencyId)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Base and quote currency cannot be the same');
        const currencies = await detectCurrencies(user, {
            baseCurrency: currencyOrderBody.baseCurrencyId,
            quoteCurrency: currencyOrderBody.quoteCurrencyId,
        });
        if (!currencies) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while processing currency pair');
        }
        // lets check the balance before we continue
        if (currencies.baseCurrencyDetails.currencyType === 'FIAT') {
            const baseCurrencyWallet = currencies.baseCurrencyDetails.wallet;
            if (Number(baseCurrencyWallet.balance) < Number(currencyOrderBody.amount)) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient funds in the base currency wallet');
            }
        }
        else {
            const currency = currencies.baseCurrencyDetails.wallet;
            const getAcct = await getCryptoWalletByUserIdAndCurrencyCode(currencyOrderBody.userId, currency.currencyCode);
            if (!getAcct) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
            }
            if (Number(getAcct.balance) < Number(currencyOrderBody.amount)) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient funds in the base currency wallet');
            }
        }
        // Create a new order
        const newCurrencyOrderBody = Object.assign(Object.assign({}, currencyOrderBody), { baseCurrencyCode: currencies.baseCurrencyDetails.currency.code, quoteCurrencyCode: currencies.quoteCurrencyDetails.currency.code, baseCurrencyTransactionType: transactionTypes.sell, quoteCurrencyTransactionType: transactionTypes.buy, filled: false, baseCurrencySent: false, quoteCurrencyReceived: false, feeReceived: false, fee: 0, userId: currencyOrderBody.userId, ref: '', chain: '', uid: '', description: '', status: 'PENDING', networkFee: 0, baseCurrencyId: currencies.baseCurrencyDetails.currency.id, quoteCurrencyId: currencies.quoteCurrencyDetails.currency.id, network: '', debitAmount: 0, creditAmount: 0, adminChain: '', adminRef: '', adminStatus: '', adminUid: '' });
        const newCurrencyOrder = await createCurrencyExchangeOrder(newCurrencyOrderBody);
        // Perform currency swap based on whether the currencies are the same or different
        const swapCurrencyOrder = currencies.same
            ? await performSameCurrencySwap(exchange.id, currencies, newCurrencyOrder)
            : await performDifferentCurrencySwap(exchange.id, currencies, newCurrencyOrder);
        return swapCurrencyOrder;
    }
    catch (error) {
        // Handle errors centrally
        logger.error(error);
        throw error;
    }
};
/**
 * The function `getSwapQuote` calculates the fee, debit amount, and credit amount for a currency swap
 * based on the provided amount and currency IDs.
 *
 * @param  - `amount`: The amount of currency to be swapped.
 *
 * @return an object of type `NewCreatedCurrencyOrderFeeDetails` with the properties `feeAmount`,
 * `debitAmount`, and `creditAmount`.
 */
export async function getSwapQuote({ amount, baseCurrencyCode, quoteCurrencyCode, }) {
    const baseCurrencyCod = baseCurrencyCode.toUpperCase();
    const quoteCurrencyCod = quoteCurrencyCode.toUpperCase();
    const exchange = await getFirstExchange();
    if (!exchange) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
    }
    if (!baseCurrencyCod || !quoteCurrencyCod) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
    }
    const rawAmount = Number(amount);
    let feeAmount;
    let creditAmt;
    let creditAmount;
    const fiatTypes = Object.values(FiatCurrencyCodes);
    const cryptoTypes = Object.values(cryptoCurrencyCodes);
    if (!fiatTypes.includes(baseCurrencyCod) && cryptoTypes.includes(baseCurrencyCod)) {
        const baseExchangeRate = await getExchangeRateInUSDT(baseCurrencyCod);
        const cvrtToUSDT = rawAmount * baseExchangeRate;
        // bear in mind the creditAmt is in USD
        switch (exchange.feeType) {
            case FeeTypes.fixed:
                feeAmount = exchange.fee;
                creditAmt = cvrtToUSDT - feeAmount;
                break;
            case FeeTypes.percentage:
                feeAmount = (cvrtToUSDT * exchange.fee) / 100;
                creditAmt = cvrtToUSDT - feeAmount;
                break;
            case FeeTypes.fxRate:
                creditAmt = (cvrtToUSDT * exchange.fee) / exchange.ngnToUsd;
                feeAmount = cvrtToUSDT - creditAmt;
                break;
            default:
                feeAmount = exchange.fee;
                creditAmt = cvrtToUSDT - feeAmount;
        }
    }
    else {
        const cvrtToUSDT = rawAmount / exchange.ngnToUsd;
        switch (exchange.feeType) {
            case FeeTypes.fixed:
                feeAmount = exchange.fee;
                creditAmt = cvrtToUSDT - feeAmount;
                break;
            case FeeTypes.percentage:
                feeAmount = (cvrtToUSDT * exchange.fee) / 100;
                creditAmt = cvrtToUSDT - feeAmount;
                break;
            case FeeTypes.fxRate:
                creditAmt = (cvrtToUSDT * exchange.fee) / exchange.ngnToUsd;
                feeAmount = cvrtToUSDT - creditAmt;
                break;
            default:
                feeAmount = exchange.fee;
                creditAmt = cvrtToUSDT - feeAmount;
        }
    }
    if (!fiatTypes.includes(quoteCurrencyCod) && cryptoTypes.includes(quoteCurrencyCod)) {
        const quoteExchangeRate = await getExchangeRateInUSDT(quoteCurrencyCod);
        const cvrtToUSDT = creditAmt / quoteExchangeRate;
        creditAmount = cvrtToUSDT;
    }
    else {
        const cvrtToNGN = creditAmt * exchange.ngnToUsd;
        creditAmount = cvrtToNGN;
    }
    const currencyOrderFee = {
        feeAmount: `${feeAmount} USD`,
        debitAmount: `${rawAmount} ${baseCurrencyCod}`,
        creditAmount: `${creditAmount} ${quoteCurrencyCod}`,
    };
    return currencyOrderFee;
}
//# sourceMappingURL=service.order.exchange.js.map