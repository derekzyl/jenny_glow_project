import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'CHATS' },
    isRead: { type: Boolean },
    message: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'USERS' },
}, {
    timestamps: true,
});
export const MESSAGES = mongoose.model('MESSAGES', messageSchema);
//# sourceMappingURL=model.messages.js.map