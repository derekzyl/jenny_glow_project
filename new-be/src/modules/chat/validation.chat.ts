import { objectId } from '@modules/validate';
import Joi from 'joi';

// Create Chat Validator
const createChatBody = {
  title: Joi.string().required(),
  message: Joi.string().required(),
};

export const createChat = {
  body: Joi.object().keys(createChatBody),
};

// Get Chat By Id Validator
export const getChatById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

// Delete Chat By Id Validator
export const deleteChatById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

// Get All Chats Validator
const getAllChatsQuery = {
  ref: Joi.string(),
  title: Joi.string(),
  userId: Joi.string().custom(objectId),
  isClosed: Joi.boolean(),
  sort: Joi.string(),

  projectBy: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
};

export const getAllChats = {
  query: Joi.object().keys(getAllChatsQuery),
};

// Create Message Validator
const createMessageBody = {
  message: Joi.string().required(),
};

export const createMessage = {
  body: Joi.object().keys(createMessageBody),
  params: Joi.object().keys({
    chatId: Joi.string().custom(objectId).required(),
  }),
};

// Get Message By Id Validator
export const getMessageById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

// Delete Message By Id Validator
export const deleteMessageById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

// Get All Messages Validator
const getAllMessagesQuery = {
  chatId: Joi.string().custom(objectId),
  senderId: Joi.string().custom(objectId),
  isRead: Joi.boolean(),
};

export const getAllMessages = {
  query: Joi.object().keys(getAllMessagesQuery),
};

// Transfer Chat Validator
const transferChatBody = {
  handledBy: Joi.string().custom(objectId).required(),
  transferredTo: Joi.string().custom(objectId).required(),
  // Other properties for transferring chat as defined in StaffChatT interface
};

export const transferChat = {
  body: Joi.object().keys(transferChatBody),
  params: Joi.object().keys({
    chatId: Joi.string().custom(objectId),
  }),
};

// Add Staff To Chat Validator
const addStaffToChatBody = {
  staffId: Joi.string().custom(objectId).required(),
  chatId: Joi.string().custom(objectId).required(),
};

export const addStaffToChat = {
  body: Joi.object().keys(addStaffToChatBody),
};

// Close Chat Validator
export const closeChat = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

// Get Chat And Messages By Id Validator
export const getChatAndMessagesById = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object(), // Assuming any query parameter is allowed
};

// Get Users Current Chat Validator
export const getUsersCurrentChat = {
  query: Joi.object(), // Assuming any query parameter is allowed
};

// Get Chat By Ref Validator
export const getChatByData = {
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
    ref: Joi.string(),
    userId: Joi.string().custom(objectId),
    isClosed: Joi.boolean(),
  }),
};

// Get Many Chat Validator (similar to Get All Chats)
export const getManyChat = {
  query: Joi.object().keys(getAllChatsQuery),
};
