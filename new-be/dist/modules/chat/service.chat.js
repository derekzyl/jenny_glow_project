var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/* eslint-disable @typescript-eslint/no-use-before-define */
import { ApiError } from '../errors';
import { logger } from '../logger';
import { notificationService } from '../notification';
import { allPermissions } from '../setting/roles';
import { CrudService } from 'expressbolt';
import httpStatus from 'http-status';
import { CHAT } from './models/model.chat';
import { MESSAGES } from './models/model.messages';
export async function createChatInDb(data) {
    var _a, _b;
    try {
        let getChat = await CrudService.getOne({
            data: { isClosed: false, userId: data.userId }, modelData: {
                Model: CHAT, select: ['-staff', '-__v']
            }, populate: {}
        });
        if (!getChat) {
            getChat = await CrudService.create({
                modelData: { Model: CHAT, select: ['-__v', '-staff'] },
                check: {},
                data,
            });
            notificationService.sendNotificationToStaffs({
                body: `customer chat with id: ${(_a = getChat['data']) === null || _a === void 0 ? void 0 : _a.ref} has been created`,
                nType: 'notification',
                title: `chat created title: ${(_b = getChat['data']) === null || _b === void 0 ? void 0 : _b.title}`,
                permissions: Object.values(allPermissions.Chat),
                type: 'create chat',
            });
        }
        await createMessageInDb({ chatId: getChat['data']._id, message: data.message, senderId: getChat['data'].userId, isRead: false });
        return getChat;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function transferChat(data) {
    try {
        const { chatId } = data, newData = __rest(data, ["chatId"]);
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
            message: 'chat has been transferred to another staff  please kindly bear with us as we are optimizing to serve you better',
            senderId: data.transferredBy,
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
            userId: data.transferredTo,
        });
        return gottenChat;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occurred accessing chats'}`);
    }
}
export async function addStaffToChat(staffId, chatId) {
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
        const gottenChat = await CrudService.update({
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
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occurred accessing chats'}`);
    }
}
export async function closeChat(chatId, userId) {
    var _a, _b;
    try {
        const getChat = await CHAT.findOne({ _id: chatId });
        if (!getChat) {
            throw new ApiError(httpStatus.NOT_FOUND, 'chat not found');
        }
        if (getChat.isClosed) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'chat is already closed');
        }
        if (getChat.staff) {
            logger.info(`${userId} and user id  ${JSON.stringify((_a = getChat.staff[0]) === null || _a === void 0 ? void 0 : _a.handledBy)} and s ${JSON.stringify(getChat.staff)}`);
        }
        else {
            logger.info(`${userId} not`);
        }
        if (getChat.staff && !((_b = getChat.staff[0]) === null || _b === void 0 ? void 0 : _b.handledBy.equals(userId))) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'chat is not assigned to you');
        }
        const gottenChat = await CrudService.update({
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
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function getChatAndMessagesById(chatId, query) {
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
            doc_length: 0
        };
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function getUsersCurrentChat(query, userId) {
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
            doc_length: 0,
        };
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function getChatById(id) {
    try {
        const chat = await CrudService.getOne({
            modelData: { Model: CHAT, select: ['-__v'] },
            data: { _id: id },
            populate: {},
        });
        return chat;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function deleteChatById(id) {
    try {
        const chat = await CrudService.delete({
            modelData: { Model: CHAT, select: ['-__v'] },
            data: { _id: id },
        });
        return chat;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function getChatByData(data) {
    try {
        const chat = await CrudService.getOne({
            modelData: { Model: CHAT, select: ['-__v'] },
            data,
            populate: {},
        });
        return chat;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function getManyChat(query, filter) {
    try {
        const chats = await CrudService.getMany({
            modelData: { Model: CHAT, select: ['-__v'] },
            filter,
            query: query,
            populate: {},
        });
        return chats;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function createMessageInDb(data) {
    try {
        const getChat = await getChatByData({ _id: data.chatId, isClosed: false });
        if (!getChat) {
            throw new ApiError(httpStatus.NOT_FOUND, 'chat not found');
        }
        await MESSAGES.updateMany({ chatId: data.chatId, senderId: { $ne: data.senderId } }, { isRead: true });
        const createMessage = await CrudService.create({
            modelData: { Model: MESSAGES, select: [] },
            check: {},
            data,
        });
        return createMessage;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function getMessageById(id) {
    try {
        const chat = await CrudService.getOne({
            modelData: { Model: MESSAGES, select: [] },
            data: { _id: id },
            populate: {},
        });
        return chat;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function deleteMessageById(id) {
    try {
        const chat = await CrudService.delete({
            modelData: { Model: MESSAGES, select: [] },
            data: { _id: id },
        });
        return chat;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function getMessageByRef(id) {
    try {
        const chat = await CrudService.getOne({
            modelData: { Model: MESSAGES, select: [] },
            data: { _id: id },
            populate: {},
        });
        return chat;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function getManyMessage(query, filter) {
    try {
        const chats = await CrudService.getMany({
            modelData: { Model: MESSAGES, select: [] },
            filter,
            query: query,
            populate: {},
        });
        return chats;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
export async function getAllMessagesByUser(userId) {
    const chat = await CHAT.findOne({ isClosed: false, userId }).select('-staff');
    if (!chat)
        throw new ApiError(httpStatus.NOT_FOUND, 'chat not found');
    const messages = await getManyMessage({}, { chatId: chat._id });
    return messages;
}
export async function markMessageAsRead(chatId) {
    try {
        await MESSAGES.updateMany({ chatId }, { isRead: true });
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${error && error.message ? error.message : 'error occured accessing chats'}`);
    }
}
//# sourceMappingURL=service.chat.js.map