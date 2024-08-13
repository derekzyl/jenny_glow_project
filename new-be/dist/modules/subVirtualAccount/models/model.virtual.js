/* eslint-disable @typescript-eslint/no-use-before-define */
import { CountryCodesEnum } from '../../flutterwave/interfaces/interface.flutterwave';
import { paginate } from '../../paginate';
import { toJSON } from '../../toJSON';
import { Schema, model } from 'mongoose';
/* The code is defining a Mongoose schema for a virtual account. */
const VirtualSubAccountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'USERS',
        required: true,
        unique: true,
    },
    barterId: { type: String },
    accountReferenceFlw: { required: true, type: String },
    accRef: {
        type: String,
        required: true,
    },
    accFlwId: { type: String },
    accountName: {
        type: String,
        required: true,
        unique: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/cybergenii/image/upload/v1710092160/naira_q0vue4.png',
    },
    createdAt: {
        type: String,
        required: true,
    },
    bvn: {
        type: String,
        required: true,
        /*  set: encrypt.encrypting,
        get: encrypt.decrypting, */
    },
    bankCode: {
        type: String,
    },
    note: {
        type: String,
    },
    status: { type: String },
    phoneNumber: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        enum: CountryCodesEnum,
        default: CountryCodesEnum.Nigeria,
    },
    ledgerBalance: {
        type: Number,
        default: 0,
    },
    bvnData: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'BVN_DATA',
    },
}, {
    timestamps: true,
});
/* The line `VirtualSubAccountSchema.plugin(toJSON);` is adding a plugin called `toJSON` to the
`VirtualSubAccountSchema`. This plugin modifies the schema's `toJSON` method to customize the JSON
representation of the schema's documents. It allows you to specify which fields should be included
or excluded in the JSON output, as well as apply transformations to the data before it is serialized
to JSON. */
VirtualSubAccountSchema.plugin(toJSON);
/* The line `VirtualSubAccountSchema.plugin(paginate);` is adding a plugin called `paginate` to the
`VirtualSubAccountSchema`. This plugin adds pagination functionality to the schema, allowing you to
easily paginate through the documents in the collection. It provides methods like `paginate`,
`paginateAggregate`, and `paginateAggregateStream` to perform pagination queries. */
VirtualSubAccountSchema.plugin(paginate);
VirtualSubAccountSchema.static('isExists', async function (userId, orderRef, excludeVirtualWalletId) {
    const VirtualAccount = await this.findOne({ userId, orderRef, walletId: { $ne: excludeVirtualWalletId } });
    return !!VirtualAccount;
});
VirtualSubAccountSchema.pre('save', async function () {
    /* The line `const account = await VIRTUAL_SUB_ACCOUNTS.findOne({ userId: this.userId });` is querying the
    `VIRTUAL_SUB_ACCOUNTS` collection in the database to find a document that matches the given criteria. The
    criteria is `{ userId: this.userId }`, which means it is searching for a document where the
    `userId` field matches the `userId` value of the current document being saved. */
    const account = await VIRTUAL_SUB_ACCOUNTS.findOne({ userId: this.userId, accountNumber: this.accountNumber });
    if (account) {
        throw new Error('Virtual account already exists');
    }
});
/* The line `const VIRTUAL_ACCOUNTS = model<IVirtualAccountDoc,
IVirtualAccountModel>('VIRTUAL_ACCOUNTS', VirtualAccountSchema);` is creating a Mongoose model named
`VIRTUAL_ACCOUNTS` based on the `VirtualAccountSchema` schema. */
const VIRTUAL_SUB_ACCOUNTS = model('VIRTUAL_SUB_ACCOUNTS', VirtualSubAccountSchema);
export default VIRTUAL_SUB_ACCOUNTS;
//# sourceMappingURL=model.virtual.js.map