import { toJSON } from '../../toJSON';
import { Schema, model } from 'mongoose';
// Mongoose schema for Fx
const fxSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'USERS',
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'USERS',
    },
    address: {
        type: String,
        required: true,
    },
    network: {
        type: String,
        enum: ['TESTNET', 'MAINNET'],
    },
    currencyCode: { type: String, uppercase: true, required: true, unique: true },
    currencyName: { type: String, uppercase: true },
    image: { type: String },
}, { timestamps: true });
fxSchema.plugin(toJSON);
const FXS = model('FXS', fxSchema);
export default FXS;
//# sourceMappingURL=model.fx.js.map