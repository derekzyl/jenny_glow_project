import toJSON from '@modules/toJSON/toJSON';
import mongoose from 'mongoose';
import { INotification } from './interfaces.notification';

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USERS',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'paypaddy',
    },
    body: {
      type: String,
      required: true,
      default: 'weldone chief',
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
NotificationSchema.plugin(toJSON);

const NOTIFICATIONS = mongoose.model<INotification>('NOTIFICATION', NotificationSchema);

export default NOTIFICATIONS;
