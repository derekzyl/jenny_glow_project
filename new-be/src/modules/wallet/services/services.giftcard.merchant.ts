import ApiError from '@modules/errors/ApiError';
import { logger } from '@modules/logger';
import { IOptions, QueryResult } from '@modules/paginate/paginate';
import { imageDeleteHandler } from '@modules/utils/file_handler/files_handler';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import {
  GiftCardMerchantDocI,
  NewCreatedGiftCardMerchant,
  UpdateGiftCardMerchantBody,
} from '../interfaces/interfaces.giftcard.wallet';
import GIFTCARDS from '../models/model.giftcard.wallet';
import GIFT_CARD_MERCHANT from '../models/model.merchant.giftcard';

/**
 * Add a new giftCardMerchant
 * @param {NewCreatedGiftCardMerchant} giftCardMerchantBody
 * @returns {Promise<GiftCardMerchantDocI>}
 */
export const addNewGiftCardMerchant = async (
  giftCardMerchantBody: NewCreatedGiftCardMerchant
): Promise<GiftCardMerchantDocI> => {
  logger.info(JSON.stringify(giftCardMerchantBody));

  if (await GIFT_CARD_MERCHANT.isExists(giftCardMerchantBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Card already exists');
  }
  return GIFT_CARD_MERCHANT.create(giftCardMerchantBody);
};

/**
 * Query for giftCardMerchants
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryGiftCardMerchants = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const cards = await GIFT_CARD_MERCHANT.paginate(filter, options);
  return cards;
};

/**
 * Get giftCardMerchant by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<GiftCardMerchantDocI | null>}
 */
export const getGiftCardMerchantById = async (id: mongoose.Types.ObjectId): Promise<GiftCardMerchantDocI | null> => {
  const data = await GIFT_CARD_MERCHANT.findById(id);
  return data;
};

/**
 * Get giftCardMerchant by merchant
 * @param {string} merchant
 * @returns {Promise<GiftCardMerchantDocI | null>}
 */
export const getGiftCardMerchantByMerchant = async (merchant: string): Promise<GiftCardMerchantDocI | null> => {
  const data = await GIFT_CARD_MERCHANT.findOne({ name: merchant });

  return data;
};

/**
 * Update giftCardMerchant by id
 * @param {mongoose.Types.ObjectId} giftCardMerchantId
 * @param {UpdateGiftCardMerchantBody} updateBody
 * @returns {Promise<GiftCardMerchantDocI | null>}
 */
export const updateGiftCardMerchantById = async (
  giftCardMerchantId: mongoose.Types.ObjectId,
  updateBody: UpdateGiftCardMerchantBody
): Promise<GiftCardMerchantDocI | null> => {
  const card = await getGiftCardMerchantById(giftCardMerchantId);
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
  }
  if (updateBody.image) {
    if (card.image) {
      await imageDeleteHandler(card.image);
    }
  }
  Object.assign(card, updateBody);
  await card.save();
  return card;
};
/**
 * Delete giftCardMerchant by id
 * @param {mongoose.Types.ObjectId} giftCardMerchantId
 * @returns {Promise<GiftCardMerchantDocI | null>}
 */
export const deleteGiftCardMerchantById = async (
  giftCardMerchantId: mongoose.Types.ObjectId
): Promise<GiftCardMerchantDocI | null> => {
  const card = await getGiftCardMerchantById(giftCardMerchantId);
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
  }
  await card.deleteOne({ _id: giftCardMerchantId });
  if (card.image) await imageDeleteHandler(card.image);
  await GIFTCARDS.deleteMany({ merchant: card._id });
  return card;
};

/**
 * Deactivate giftCardMerchant by id
 * @param {mongoose.Types.ObjectId} giftCardMerchantId
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<GiftCardMerchantDocI | null>}
 */
export const deactivateGiftCardMerchantById = async (
  giftCardMerchantId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<GiftCardMerchantDocI | null> => {
  const updateBody: UpdateGiftCardMerchantBody = { active: false, updatedByUserId: userId };
  const card = await updateGiftCardMerchantById(giftCardMerchantId, updateBody);
  return card;
};
