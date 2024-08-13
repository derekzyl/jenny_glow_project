/* eslint-disable import/prefer-default-export */
import { easyReferenceGenerator, GeneratekeyE, GeneratePrefixType } from '../utils/referenceGenerator';
// eslint-disable-next-line import/no-extraneous-dependencies
import { generateDynamicSchema } from 'expressbolt';
import mongoose from 'mongoose';
const chatSchema = new mongoose.Schema({
    ref: {
        type: String,
        required: true,
        default: easyReferenceGenerator({
            prefix: GeneratePrefixType.CHAT,
            addDash: false,
            size: 16,
            type: GeneratekeyE.alphanumUpper,
        }),
    },
    staff: [
        {
            handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'USERS' },
            transferredTo: { type: mongoose.Schema.Types.ObjectId, ref: 'USERS' },
            transferredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'USERS' },
            date: { type: Date, default: Date.now() },
        },
    ],
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'USERS',
    },
    title: { type: String },
    isClosed: {
        type: Boolean,
        default: false,
    },
});
export const CHAT = mongoose.model('CHATS', chatSchema);
const messageSchema = generateDynamicSchema({
    modelName: 'MESSAGES',
    fields: {
        chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'CHATS' },
        isRead: { type: Boolean },
        message: { type: String },
        sender: { type: mongoose.Schema.Types.ObjectId },
    },
    schemaOptions: { timestamps: true },
});
export const { model: MESSAGES } = messageSchema;
//# sourceMappingURL=model.chat.js.map