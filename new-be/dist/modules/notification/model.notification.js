import toJSON from '../toJSON/toJSON';
import mongoose from 'mongoose';
const NotificationSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
NotificationSchema.plugin(toJSON);
const NOTIFICATIONS = mongoose.model('NOTIFICATION', NotificationSchema);
export default NOTIFICATIONS;
//# sourceMappingURL=model.notification.js.map