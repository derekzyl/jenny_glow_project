import ApiError from '../../errors/ApiError';
import { getFirstExchange } from '../../exchange/services/service.engine.exchange';
import httpStatus from 'http-status';
import GIFTCARDS from '../models/model.giftcard.wallet';
/**
 * Add a new giftcard
 * @param {NewCreatedGiftcard} giftcardBody
 * @returns {Promise<IGiftcardDoc>}
 */
export const addNewGiftcard = async (giftcardBody) => {
    if (await GIFTCARDS.isExists(giftcardBody.name)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Card already exists');
    }
    return GIFTCARDS.create(giftcardBody);
};
/**
//  * Query for giftcards
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @returns {Promise<QueryResult>}
//  */
// export const queryGiftcards = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
//   const cards = await GIFTCARDS.paginate(filter, options);
//   return cards;
// };
// export const queryGiftcardsByMerchant = async (merchantId: mongoose.Types.ObjectId): Promise<IGiftcardDoc[] | null> => {
//   const cards = await GIFTCARDS.find({ merchant: merchantId });
//   return cards;
// };
export const queryGiftcards = async (filter, options) => {
    const cards = await GIFTCARDS.paginate(filter, options);
    // Handle potential missing exchange rate
    if (!cards || !cards.results || !cards.results.length) {
        return Object.assign({}, cards); // Return empty results or original data if no results found
    }
    const exchangeRate = await getFirstExchange();
    if (!exchangeRate) {
        return Object.assign({}, cards); // Return original data if exchange rate unavailable
    }
    // Efficiently convert documents and calculate prices
    const newEx = cards.results.map((card) => {
        const cardData = card.toObject(); // Convert Mongoose Document to plain object
        return Object.assign(Object.assign({}, cardData), { totalUsdPrice: cardData.amount * cardData.rateInUSD, totalNgnPrice: cardData.amount * cardData.rateInUSD * exchangeRate.localExchangeRateToUsd });
    });
    return Object.assign(Object.assign({}, cards), { results: newEx }); // Return results with added prices
};
export const queryGiftcardsByMerchant = async (merchantId) => {
    const cards = await GIFTCARDS.find({ merchant: merchantId });
    // Handle potential missing exchange rate
    if (!cards || !cards.length) {
        return null; // Return null for empty results or missing cards
    }
    const exchangeRate = await getFirstExchange();
    if (!exchangeRate) {
        return cards; // Return original cards if exchange rate unavailable
    }
    // Efficient conversion and price calculation
    const cardsWithPrices = cards.map((card) => {
        const cardData = card.toObject(); // Convert Mongoose Document to plain object
        return Object.assign(Object.assign({}, cardData), { totalUsdPrice: cardData.amount * cardData.rateInUSD, totalNgnPrice: cardData.amount * cardData.rateInUSD * exchangeRate.localExchangeRateToUsd });
    });
    return cardsWithPrices; // Return enriched card data
};
/**
 * Get giftcard by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IGiftcardDoc | null>}
 */
export const getGiftcardById = async (id) => {
    const res = await GIFTCARDS.findById(id);
    return res;
};
/**
 * Get giftcard by merchant
 * @param {string} merchant
 * @returns {Promise<IGiftcardDoc | null>}
 */
export const getGiftcardByMerchant = async (merchant) => GIFTCARDS.findOne({ merchant });
/**
 * Update giftcard by id
 * @param {mongoose.Types.ObjectId} giftcardId
 * @param {UpdateGiftcardBody} updateBody
 * @returns {Promise<IGiftcardDoc | null>}
 */
export const updateGiftcardById = async (giftcardId, updateBody) => {
    const card = await getGiftcardById(giftcardId);
    if (!card) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
    }
    Object.assign(card, updateBody);
    await card.save();
    return card;
};
/**
 * Delete giftcard by id
 * @param {mongoose.Types.ObjectId} giftcardId
 * @returns {Promise<IGiftcardDoc | null>}
 */
export const deleteGiftcardById = async (giftcardId) => {
    const card = await getGiftcardById(giftcardId);
    if (!card) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
    }
    await card.deleteOne({ id: giftcardId });
    return card;
};
/**
 * Deactivate giftcard by id
 * @param {mongoose.Types.ObjectId} giftcardId
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IGiftcardDoc | null>}
 */
export const deactivateGiftcardById = async (giftcardId, userId) => {
    const updateBody = { isActive: false, updatedByUserId: userId };
    const card = await updateGiftcardById(giftcardId, updateBody);
    return card;
};
//# sourceMappingURL=service.giftcard.wallet.js.map