import { paginate } from '../paginate';
import { toJSON } from '../toJSON';
import { Schema, model } from 'mongoose';
// todo: we are coming back to correct the structure of the virtual account model
/* The code is defining a Mongoose schema for a virtual account. */
const VirtualAccountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'USERS',
        required: true,
    },
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'WALLETS',
        required: true,
    },
    flwRef: {
        type: String,
        required: true,
    },
    orderRef: {
        type: String,
        required: true,
    },
    accountName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: String,
    },
    bvn: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
    },
    enrollmentBank: {
        type: String,
        required: true,
    },
    enrollmentBranch: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
    },
}, {
    timestamps: true,
});
/* `VirtualAccountSchema.plugin(toJSON);` is adding a plugin called `toJSON` to the
`VirtualAccountSchema`. */
VirtualAccountSchema.plugin(toJSON);
/* `VirtualAccountSchema.plugin(paginate);` is adding a plugin called `paginate` to the
`VirtualAccountSchema`. This plugin provides pagination functionality to the `VirtualAccount` model,
allowing you to easily paginate through the results of queries. */
VirtualAccountSchema.plugin(paginate);
VirtualAccountSchema.static('isExists', async function (userId, orderRef, excludeVirtualWalletId) {
    const VirtualAccount = await this.findOne({ userId, orderRef, walletId: { $ne: excludeVirtualWalletId } });
    return !!VirtualAccount;
});
/* The line `const VIRTUAL_ACCOUNTS = model<IVirtualAccountDoc,
IVirtualAccountModel>('VIRTUAL_ACCOUNTS', VirtualAccountSchema);` is creating a Mongoose model named
`VIRTUAL_ACCOUNTS` based on the `VirtualAccountSchema` schema. */
const VIRTUAL_ACCOUNTS = model('VIRTUAL_ACCOUNTS', VirtualAccountSchema);
export default VIRTUAL_ACCOUNTS;
//# sourceMappingURL=model.virtual.js.map