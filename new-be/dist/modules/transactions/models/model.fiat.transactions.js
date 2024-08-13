import paginate from '../../paginate/paginate';
import toJSON from '../../toJSON/toJSON';
import mongoose from 'mongoose';
import { fiatTransactionStatus, transactionTypes } from '../../../config/transactions';
import { FiatCurrencyCodes, paymentProviders } from '../../setting/currencies';
const fiatTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USERS',
        required: true,
    },
    type: {
        type: String,
        required: true,
        uppercase: true,
        enum: transactionTypes,
    },
    ref: {
        type: String,
        required: true,
        unique: true,
    },
    providerTransactionId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currencyCode: {
        type: String,
        uppercase: true,
        enum: FiatCurrencyCodes,
    },
    paymentProvider: {
        type: String,
        uppercase: true,
        enum: paymentProviders,
        default: paymentProviders.flutterwave,
    },
    flwRef: {
        type: String,
    },
    narration: {
        type: String,
    },
    status: {
        type: String,
        uppercase: true,
        enum: fiatTransactionStatus,
        default: fiatTransactionStatus.pending,
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FIAT_WALLETS',
    },
    airtime: {
        network: { type: String },
        airtimeRecipientNumber: { type: String },
    },
    data: {
        network: { type: String },
        airtimeRecipientNumber: { type: String },
    },
    toll: {
        network: { type: String },
        airtimeRecipientNumber: { type: String },
    },
    cable: {
        network: { type: String },
        airtimeRecipientNumber: { type: String },
    },
    internet: {
        network: { type: String },
        airtimeRecipientNumber: { type: String },
    },
    electricity: {
        meterNumber: { type: String },
        meterAddress: { type: String },
        meterToken: { type: String },
    },
    fiatTransfer: {
        recipientFullName: { type: String },
        recipientAccountNumber: { type: String },
        recipientBankName: { type: String },
        recipientBankCode: { type: String },
    },
    cryptoDeposit: {
        hash: { type: String },
        cryptoType: { type: String },
        senderWalletAddress: { type: String },
    },
    cryptoTransfer: {
        hash: { type: String },
        cryptoType: { type: String },
        recipientWalletAddress: { type: String },
    },
    fiatDeposit: {
        senderFullName: { type: String },
        senderAccountNumber: { type: String },
        senderBankName: { type: String },
        senderBankCode: { type: String },
    },
    swap: {
        type: Boolean,
    },
    date: { type: Date },
    fee: { type: Number },
}, {
    timestamps: true,
});
fiatTransactionSchema.plugin(toJSON);
fiatTransactionSchema.plugin(paginate);
fiatTransactionSchema.static('isExists', async function (ref, excludeTxId) {
    const transaction = await this.findOne({ ref, _id: { $ne: excludeTxId } });
    return !!transaction;
});
const FIAT_TRANSACTIONS = mongoose.model('FIAT_TRANSACTIONS', fiatTransactionSchema);
export default FIAT_TRANSACTIONS;
//# sourceMappingURL=model.fiat.transactions.js.map