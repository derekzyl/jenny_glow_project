/* eslint-disable @typescript-eslint/no-use-before-define */
import { ApiError } from '@modules/errors';
import { logger } from '@modules/logger';
import { notificationService } from '@modules/notification';
import { IOptions } from '@modules/paginate/paginate';
import { allPermissions } from '@modules/setting/roles';
import { CrudService } from 'expressbolt';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ChatI, MessagesI, StaffChatT } from './interface.chat';
import { CHAT } from './models/model.chat';
import { MESSAGES } from './models/model.messages';

export async function createChatInDb(data: Omit<ChatI, 'ref'> & { message: string }) {
  try {
    let getChat = await CHAT.findOne({ isClosed: false, userId: data.userId }).select('-staff');
    if (!getChat) {
      getChat = await CrudService.create<ChatI>({
        modelData: { Model: CHAT, select: ['-__v', '-staff'] },
        check: {},
        data,
      });
      notificationService.sendNotificationToStaffs({
        body: `customer chat with id: ${getChat?.ref} has been created`,
        nType: 'notification',
        title: `chat created title: ${getChat?.title}`,
        permissions: Object.values(allPermissions.Chats),
        type: 'create chat',
      });
    }
    await createMessageInDb({ chatId: getChat!._id!, message: data.message, senderId: getChat!.userId!, isRead: false });
    return getChat;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}

export async function transferChat(data: StaffChatT & { chatId: mongoose.Types.ObjectId }) {
  try {
    const { chatId, ...newData } = data;
    const getChat = await CHAT.findOne({ _id: chatId }).select(' -__v');
    if (!getChat) {
      throw new ApiError(httpStatus.NOT_FOUND, 'chat not found');
    }
    if (getChat.isClosed) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'chat is already closed');
    }
    const gottenChat = await CHAT.findByIdAndUpdate(chatId, {
      staff: getChat.staff ? [...getChat.staff, newData] : [newData],
    });
    await createMessageInDb({
      chatId,
      message:
        'chat has been transferred to another staff  please kindly bear with us as we are optimizing to serve you better',
      senderId: data!.transferredBy!,
      isRead: false,
    });
    await notificationService.sendNotification({
      body: `customer chat with id: ${getChat.ref} has been transferred to another staff please kindly bear with us as we are optimizing to serve you better`,
      nType: 'both',
      title: `chat transfer title: ${getChat.title}`,
      type: 'transfer chat',
      userId: getChat.userId,
    });
    await notificationService.sendNotification({
      body: `customer chat with id: ${getChat.ref} has been transferred to you for handling`,
      nType: 'both',
      title: `chat transfer title: ${getChat.title}`,
      type: 'transfer chat',
      userId: data!.transferredTo!,
    });
    return gottenChat;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occurred accessing chats'}`
    );
  }
}

export async function addStaffToChat(staffId: mongoose.Types.ObjectId, chatId: mongoose.Types.ObjectId) {
  try {
    const getChat = await CHAT.findOne({ _id: chatId }).select('-__v');
    if (!getChat) {
      throw new ApiError(httpStatus.NOT_FOUND, 'chat not found');
    }
    if (getChat.isClosed) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'chat is already closed');
    }
    if (getChat.staff && getChat.staff.length > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'chat is already assigned to a staff');
    }
    const gottenChat = await CrudService.update<ChatI>({
      modelData: { Model: CHAT, select: [] },

      data: { staff: [{ handledBy: staffId }] },
      filter: { _id: chatId },
    });
    await notificationService.sendNotification({
      body: `customer chat with id: ${getChat.ref} has been assigned to a staff`,
      nType: 'both',
      title: `customer service: ${getChat.title}`,
      type: 'transfer chat',
      userId: getChat.userId,
    });
    await notificationService.sendNotification({
      body: `customer chat with id: ${getChat.ref} is now being handled by you`,
      nType: 'both',
      title: `customer service: ${getChat.title}`,
      type: 'transfer chat',
      userId: staffId,
    });
    return gottenChat;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occurred accessing chats'}`
    );
  }
}

export async function closeChat(chatId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
  try {
    const getChat = await CHAT.findOne({ _id: chatId });
    if (!getChat) {
      throw new ApiError(httpStatus.NOT_FOUND, 'chat not found');
    }
    if (getChat.isClosed) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'chat is already closed');
    }
    if (getChat.staff) {
      logger.info(
        `${userId} and user id  ${JSON.stringify(getChat.staff[0]?.handledBy)} and s ${JSON.stringify(getChat.staff)}`
      );
    } else {
      logger.info(`${userId} not`);
    }
    if (getChat.staff && !getChat.staff[0]?.handledBy.equals(userId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'chat is not assigned to you');
    }
    const gottenChat = await CrudService.update<ChatI>({
      modelData: { Model: CHAT, select: [] },

      data: { isClosed: true },
      filter: { _id: chatId },
    });
    await notificationService.sendNotification({
      body: `customer chat with id: ${getChat.ref || 'no ref'} has been closed`,
      nType: 'both',
      title: `customer service: ${getChat.title}`,
      type: 'transfer chat',
      userId: getChat.userId,
    });
    return gottenChat;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}

export async function getChatAndMessagesById(chatId: mongoose.Types.ObjectId, query: IOptions) {
  try {
    const chat = await getChatById(chatId);
    if (!chat) {
      throw new ApiError(httpStatus.NOT_FOUND, 'chat not found');
    }
    const getMessage = await getManyMessage(query, { chatId });

    // message: string;
    // data: T;
    // success: true;
    // doc_length: number | undefined;
    // error?: undefined;
    // stack?: undefined;
    return {
      message: 'chat and messages fetched successfully',
      data: { chat: chat.data, message: getMessage.data },
      success: true,
      doc_length: getMessage.length,
    };
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}

export async function getUsersCurrentChat(query: IOptions, userId: mongoose.Types.ObjectId) {
  try {
    const chat = await CHAT.findOne({ isClosed: false, userId }).select('-staff');

    if (!chat) {
      throw new ApiError(httpStatus.NOT_FOUND, 'chat not found');
    }
    const getMessage = await getManyMessage(query, { chatId: chat._id });

    return {
      message: 'chat and messages fetched successfully',
      data: { chat, message: getMessage.data },
      success: true,
      doc_length: getMessage.length,
    };
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}
export async function getChatById(id: mongoose.Types.ObjectId) {
  try {
    const chat = await CrudService.getOne<ChatI>({
      modelData: { Model: CHAT, select: ['-__v'] },
      data: { _id: id },
      populate: {},
    });
    return chat;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}
export async function deleteChatById(id: mongoose.Types.ObjectId) {
  try {
    const chat = await CrudService.delete<ChatI>({
      modelData: { Model: CHAT, select: ['-__v'] },
      data: { _id: id },
    });
    return chat;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}
export async function getChatByData(
  data: Partial<Pick<ChatI, 'isClosed' | 'ref' | 'title' | 'userId'> & { _id: mongoose.Types.ObjectId }>
) {
  try {
    const chat = await CrudService.getOne<ChatI>({
      modelData: { Model: CHAT, select: ['-__v'] },
      data,
      populate: {},
    });
    return chat;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}

export async function getManyChat(query: IOptions, filter: Partial<Pick<ChatI, 'ref' | 'title' | 'userId' | 'isClosed'>>) {
  try {
    const chats = await CrudService.getMany<ChatI>({
      modelData: { Model: CHAT, select: ['-__v'] },
      filter,
      query: query as any,
      populate: {},
    });
    return chats;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}

export async function createMessageInDb(data: MessagesI) {
  try {
    const getChat = await getChatByData({ _id: data.chatId, isClosed: false });

    if (!getChat) {
      throw new ApiError(httpStatus.NOT_FOUND, 'chat not found');
    }
    await MESSAGES.updateMany({ chatId: data.chatId, senderId: { $ne: data.senderId } }, { isRead: true });
    const createMessage = await CrudService.create<MessagesI>({
      modelData: { Model: MESSAGES, select: [] },
      check: {},
      data,
    });

    return createMessage;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}

export async function getMessageById(id: mongoose.Types.ObjectId) {
  try {
    const chat = await CrudService.getOne<MessagesI>({
      modelData: { Model: MESSAGES, select: [] },
      data: { _id: id },
      populate: {},
    });
    return chat;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}
export async function deleteMessageById(id: mongoose.Types.ObjectId) {
  try {
    const chat = await CrudService.delete<MessagesI>({
      modelData: { Model: MESSAGES, select: [] },
      data: { _id: id },
    });
    return chat;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}
export async function getMessageByRef(id: mongoose.Types.ObjectId) {
  try {
    const chat = await CrudService.getOne<MessagesI>({
      modelData: { Model: MESSAGES, select: [] },
      data: { _id: id },
      populate: {},
    });
    return chat;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}

export async function getManyMessage(query: IOptions, filter: Partial<Pick<MessagesI, 'chatId' | 'isRead' | 'senderId'>>) {
  try {
    const chats = await CrudService.getMany<MessagesI>({
      modelData: { Model: MESSAGES, select: [] },
      filter,
      query: query as any,
      populate: {},
    });
    return chats;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}

export async function getAllMessagesByUser(userId: mongoose.Types.ObjectId) {
  const chat = await CHAT.findOne({ isClosed: false, userId }).select('-staff');
  if (!chat) throw new ApiError(httpStatus.NOT_FOUND, 'chat not found');

  const messages = await getManyMessage({}, { chatId: chat._id });
  return messages;
}

export async function markMessageAsRead(chatId: mongoose.Types.ObjectId) {
  try {
    await MESSAGES.updateMany({ chatId }, { isRead: true });
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${error && error.message ? error.message : 'error occured accessing chats'}`
    );
  }
}
