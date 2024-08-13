import { staffService } from '../admin/staff';
import { logger } from '../logger';
import { chatService } from '.';
export class ChatSocket {
    constructor(socket, user) {
        logger.info(`'ChatSocket created' ${JSON.stringify(user)}`);
        this.user = user;
        this.socket = socket;
        logger.info('ChatSocket created');
        this.socket.on('initiateChat', this.currentChat.bind(this));
        this.socket.on('createChat', this.createChat.bind(this));
        this.socket.on('createMessage', this.createMessage.bind(this));
        this.socket.on('userTyping', this.userTyping.bind(this));
        this.socket.on('getMessages', this.getMessages.bind(this));
        this.socket.on('getMessagesByStaff', this.getMessagesByStaff.bind(this));
    }
    async currentChat() {
        if (!this.user)
            return;
        const getChat = await chatService.getUsersCurrentChat({}, this.user.id);
        if (getChat)
            this.socket.emit('currentChat', getChat);
        else {
            this.socket.emit('currentChat', null);
        }
    }
    async createChat(data) {
        if (!this.user)
            return;
        const updateChat = await chatService.createChatInDb(Object.assign({ userId: this.user.id }, data));
        this.socket.emit('currentChat', updateChat);
    }
    async createMessage(data) {
        if (!this.user)
            return;
        const updateChat = await chatService.createMessageInDb(Object.assign({ senderId: this.user.id }, data));
        this.socket.to(String(data.chatId)).emit('message', updateChat);
        const getChatById = await chatService.getManyMessage({}, { chatId: data.chatId, senderId: this.user.id });
        this.socket.emit('currentMessage', getChatById);
    }
    async getMessages(data) {
        if (!this.user)
            return;
        const getChatById = await chatService.getManyMessage({}, { chatId: data, senderId: this.user.id });
        this.socket.emit('currentMessage', getChatById);
    }
    async getMessagesByStaff(data) {
        if (!this.user)
            return;
        const getStaff = await staffService.getAllStaffsUserId();
        if (!(getStaff === null || getStaff === void 0 ? void 0 : getStaff.includes(this.user.id)))
            return;
        const getChatById = await chatService.getManyMessage({}, { chatId: data });
        this.socket.emit('currentMessage', getChatById);
    }
    async userTyping(data) {
        if (!this.user)
            return;
        this.socket.to(String(data.chatId)).emit('userTyping', data);
    }
}
//# sourceMappingURL=websocket.chat.js.map