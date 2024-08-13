import ApiError from '@modules/errors/ApiError';
import { getFirstExchange } from '@modules/exchange/services/service.engine.exchange';
import { IOptions, QueryResult } from '@modules/paginate/paginate';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { IGiftcard, IGiftcardDoc, NewCreatedGiftcard, UpdateGiftcardBody } from '../interfaces/interfaces.giftcard.wallet';
import GIFTCARDS from '../models/model.giftcard.wallet';

/**
 * Add a new giftcard
 * @param {NewCreatedGiftcard} giftcardBody
 * @returns {Promise<IGiftcardDoc>}
 */
export const addNewGiftcard = async (giftcardBody: NewCreatedGiftcard): Promise<IGiftcardDoc> => {
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
export const queryGiftcards = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const cards = await GIFTCARDS.paginate(filter, options);

  // Handle potential missing exchange rate
  if (!cards || !cards.results || !cards.results.length) {
    return { ...cards }; // Return empty results or original data if no results found
  }

  const exchangeRate = await getFirstExchange();
  if (!exchangeRate) {
    return { ...cards }; // Return original data if exchange rate unavailable
  }

  // Efficiently convert documents and calculate prices
  const newEx = cards.results.map((card: mongoose.Document<IGiftcard>) => {
    const cardData = card.toObject(); // Convert Mongoose Document to plain object
    return {
      ...cardData,
      totalUsdPrice: cardData.amount * cardData.rateInUSD,
      totalNgnPrice: cardData.amount * cardData.rateInUSD * exchangeRate.localExchangeRateToUsd,
    };
  });

  return { ...cards, results: newEx }; // Return results with added prices
};

export const queryGiftcardsByMerchant = async (
  merchantId: mongoose.Types.ObjectId
): Promise<(IGiftcardDoc & { totalUsdPrice?: number; totalNgnPrice?: number })[] | null> => {
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
  const cardsWithPrices = cards.map((card: mongoose.Document<IGiftcard>) => {
    const cardData = card.toObject(); // Convert Mongoose Document to plain object
    return {
      ...cardData,
      totalUsdPrice: cardData.amount * cardData.rateInUSD,
      totalNgnPrice: cardData.amount * cardData.rateInUSD * exchangeRate.localExchangeRateToUsd,
    };
  });

  return cardsWithPrices; // Return enriched card data
};
/**
 * Get giftcard by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IGiftcardDoc | null>}
 */
export const getGiftcardById = async (id: mongoose.Types.ObjectId): Promise<IGiftcardDoc | null> => {
  const res = await GIFTCARDS.findById(id);
  return res;
};

/**
 * Get giftcard by merchant
 * @param {string} merchant
 * @returns {Promise<IGiftcardDoc | null>}
 */
export const getGiftcardByMerchant = async (merchant: string): Promise<IGiftcardDoc | null> =>
  GIFTCARDS.findOne({ merchant });

/**
 * Update giftcard by id
 * @param {mongoose.Types.ObjectId} giftcardId
 * @param {UpdateGiftcardBody} updateBody
 * @returns {Promise<IGiftcardDoc | null>}
 */
export const updateGiftcardById = async (
  giftcardId: mongoose.Types.ObjectId,
  updateBody: UpdateGiftcardBody
): Promise<IGiftcardDoc | null> => {
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
export const deleteGiftcardById = async (giftcardId: mongoose.Types.ObjectId): Promise<IGiftcardDoc | null> => {
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
export const deactivateGiftcardById = async (
  giftcardId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<IGiftcardDoc | null> => {
  const updateBody: UpdateGiftcardBody = { isActive: false, updatedByUserId: userId };
  const card = await updateGiftcardById(giftcardId, updateBody);
  return card;
};
