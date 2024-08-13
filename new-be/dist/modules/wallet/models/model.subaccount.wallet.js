import { toJSON } from '../../toJSON';
import { Schema, model } from 'mongoose';
import { ModeBitpwrE, NetworkBitpwrE } from '../../setting/currencies';
/* The code is defining a Mongoose schema for a crypto sub-account. */
const cryptoSubAccount = new Schema({
    addressesId: [
        {
            type: Schema.Types.ObjectId,
        },
    ],
    externalId: { type: String },
    isArchived: { type: Boolean },
    userId: { type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean },
    mode: { type: String, enum: ModeBitpwrE },
    name: { type: String },
    network: {
        type: String,
        enum: NetworkBitpwrE,
    },
    organizationId: { type: String },
    uid: { type: String },
    balance: {
        received: { type: String, default: '0' },
        sent: { type: String, default: '0' },
        balance: { type: String, default: '0' },
        blocked: { type: String, default: '0' },
        pending: { type: String, default: '0' },
    },
}, {
    timestamps: true,
});
cryptoSubAccount.plugin(toJSON);
/* The line `const CRYPTO_SUB_ACCOUNT = model('CRYPTO_SUB_ACCOUNT', cryptoSubAccount);` is creating a
Mongoose model named "CRYPTO_SUB_ACCOUNT" based on the defined schema "cryptoSubAccount". This model
can be used to interact with the MongoDB collection associated with the "CRYPTO_SUB_ACCOUNT" schema,
such as performing CRUD operations (create, read, update, delete) on the documents in the
collection. */
export const CRYPTO_SUB_ACCOUNT = model('CRYPTO_SUB_ACCOUNT', cryptoSubAccount);
//# sourceMappingURL=model.subaccount.wallet.js.map