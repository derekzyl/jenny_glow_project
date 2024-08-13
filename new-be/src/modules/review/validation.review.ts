
import { objectId } from '@modules/validate';
import Joi from 'joi';

const createReviewSchema = {
  product: Joi.string().required().custom(objectId),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().required().max(500),
  isReviewed: Joi.boolean().default(false),
  isApproved: Joi.boolean().forbidden(), // User cannot set this value
};

export const createReview = {
  body: Joi.object().keys(createReviewSchema),
};

export const getOneReview = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const getManyReviewSchema = {
  product: Joi.string().custom(objectId).optional(),
  userId: Joi.string().custom(objectId).optional(),
  isApproved: Joi.boolean().optional(),
  isReviewed: Joi.boolean().optional(),
};

export const getManyReview = {
  query: Joi.object().keys(getManyReviewSchema),
};

const updateReviewSchema = {
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().max(500).optional(),
};

export const updateReview = {
  body: Joi.object().keys(updateReviewSchema),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

export const updateUserReview = {
  body: Joi.object().keys({
    ...updateReviewSchema,
  }),
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

export const approveReview = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

export const deleteReview = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

export const getApprovedProductReviews = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  query: Joi.object().keys({
    ...getManyReviewSchema,
    isApproved: Joi.boolean().valid(true).required(),
  }),
};

export const getPendingReviewByUser = {
  query: Joi.object().keys({
    ...getManyReviewSchema,
    isReviewed: Joi.boolean().valid(false).required(),
  }),
};
