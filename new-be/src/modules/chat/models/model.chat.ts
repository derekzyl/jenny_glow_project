/* eslint-disable import/prefer-default-export */
import { easyReferenceGenerator, GeneratekeyE, GeneratePrefixType } from '@modules/utils/referenceGenerator';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';
import { ChatI } from '../interface.chat';

const chatSchema = new mongoose.Schema<ChatI>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const CHAT = mongoose.model('CHATS', chatSchema);
