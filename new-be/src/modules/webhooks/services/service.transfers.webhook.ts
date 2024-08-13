/* eslint-disable import/prefer-default-export */
import { CurrencyCodesEnum } from '@modules/flutterwave/interfaces/interface.flutterwave';
import { CrudService } from '@modules/genCrud';
import { logger } from '@modules/logger';
import { notificationService } from '@modules/notification';
import { paymentProviders } from '@modules/setting/currencies';
import { allPermissions } from '@modules/setting/roles';
import { VIRTUAL_SUB_ACCOUNTS } from '@modules/subVirtualAccount';
import { ITransfer } from '@modules/tranfers/interface.transfers';
import TRANSFERS from '@modules/tranfers/model.transfers';
import { getTransferByIdFromFlw, updateTransferServiceWithRef } from '@modules/tranfers/service.transfers';
import { FIAT_TRANSACTIONS } from '@modules/transactions';
import { verifyTransactionAPI } from '@modules/transactions/api/api.fiat.transactions';
import { IFiatTransaction, IFiatTransactionDoc } from '@modules/transactions/interfaces/interfaces.fiat.transactions';
import { addNewFiatPaymentTransaction } from '@modules/transactions/services/service.transactions';
import { FIAT_WALLETS } from '@modules/wallet';
import { exchangeFiat } from '@modules/wallet/services/service.fiat.wallet';
import { transactionTypes } from '../../../config/transactions';
import { IncomingDepositI, IncomingTransferI } from '../interfaces/transfer.webhook';

/**
 * The `transferWebHook` function processes incoming transfer data, performs various checks and updates
 * related tables, and sends notifications based on the transfer status.
 *
 * @param data The `data` parameter in the `transferWebHook` function represents the incoming transfer
 * data that is being processed. This data includes information such as the transfer reference,
 * transfer ID, status, amount, currency, recipient details, and other relevant transfer details. The
 * function uses this data to perform various operations
 *
 * @return The function `transferWebHook` returns nothing explicitly. It may return `undefined` if none
 * of the conditions inside the function are met.
 */
export const transferWebHook = async (data: IncomingTransferI) => {
  logger.info(`data: ${JSON.stringify(data)}`);

  // find user by  reference
  const findUserByReference = await TRANSFERS.findOne({ reference: data.reference });
  if (!findUserByReference) {
    logger.error(`checked flutterwave: ${data} `);
    await notificationService.sendNotificationToStaffs({
      body: `Transfer with reference ${data.reference} was not found ${JSON.stringify(data)}`,

      title: 'Transfer',
      type: 'TRANSFER',
      permissions: [...Object.values(allPermissions.Transactions)],
    });

    /* throw new ApiError(httpStatus.BAD_REQUEST, 'User not found'); */
    return;
  }
  const walletId = await FIAT_WALLETS.findOne({ userId: findUserByReference.userId });
  if (!walletId) {
    await notificationService.sendNotificationToStaffs({
      body: `Transfer with reference ${data.reference} was not found: error occurred at finding fiat wallet ${JSON.stringify(
        data
      )}`,

      title: 'Transfer',

      type: 'TRANSFER',

      permissions: [...Object.values(allPermissions.Transactions)],
    });
    /* throw new ApiError(httpStatus.BAD_REQUEST, 'Wallet not found'); */
  }
  const getTransfer = await getTransferByIdFromFlw(data.id);
  if (!getTransfer) {
    await notificationService.sendNotificationToStaffs({
      body: `Transfer with reference ${data.reference} the transfer wasn't validated from flutterwave`,

      title: 'Transfer',

      type: 'TRANSFER',

      permissions: [...Object.values(allPermissions.Transactions)],
    });
    /* throw new ApiError(httpStatus.BAD_REQUEST, 'Transfer not found'); */
  }

  /* throw new ApiError(httpStatus.BAD_REQUEST, 'Transfer not found'); */

  const trn = getTransfer.data;
  if (String(trn.status).toUpperCase() !== String(data.status).toUpperCase()) {
    logger.error(`checked flutterwave: ${trn} webhook ${JSON.stringify(data)}`);
    await notificationService.sendNotificationToStaffs({
      body: `checked flutterwave: ${trn} webhook ${JSON.stringify(data)}`,

      title: 'Transfer',

      type: 'TRANSFER',

      permissions: [...Object.values(allPermissions.Transactions)],
    });
    return;
  }

  // update transfer table with reference and status success
  // await TRANSFERS.updateOne({ reference: data.reference }
  await updateTransferServiceWithRef(
    {
      accountNumber: trn.account_number,
      amount: trn.amount,
      debitCurrency: trn.debit_currency,
      bankCode: trn.bank_code,
      bankName: trn.bank_name,
      completeMessage: trn.complete_message,
      createdAt: new Date(trn.created_at),
      meta: trn.meta,
      transferType: 'TRANSFER',
      narration: trn.narration,

      requiresApproval: trn.requires_approval,
      isApproved: trn.is_approved,
      status: trn.status,
      fee: trn.fee,
      currency: trn.currency,
      fullName: trn.full_name,
      txId: trn.id,
    },
    trn.reference
  );

  await CrudService.update<IFiatTransaction, IFiatTransactionDoc>(
    { Model: FIAT_TRANSACTIONS, exempt: '-_v' },
    {
      amount: trn.amount,
      date: new Date(trn.created_at),

      userId: findUserByReference.userId,
      flwRef: String(trn.id),
      fee: trn.fee,
      type: transactionTypes.fiatTransfer,
      paymentProvider: paymentProviders.flutterwave,

      fiatTransfer: {
        recipientAccountNumber: trn.account_number,
        recipientBankName: trn.bank_name,
        recipientBankCode: trn.bank_code,
        recipientFullName: trn.full_name,
      },
      narration: `${trn.narration}  ${trn.complete_message}`,
      providerTransactionId: String(trn.id),
      currencyCode: trn.currency,
      walletId: walletId?._id,
    },
    {
      ref: trn.reference,
    }
  );

  if (trn.status.toUpperCase() === 'SUCCESSFUL') {
    await notificationService.sendNotification({
      userId: findUserByReference.userId,
      body: `Transfer of ${trn.amount}${trn.currency} ${trn.status} \n
     narration: ${trn.complete_message}`,
      type: 'TRANSFER',
      title: 'transfers',
      nType: 'both',
    });
  } else {
    await notificationService.sendNotificationToStaffs({
      body: `Transfer of ${JSON.stringify(trn)} failed for user ${
        findUserByReference.userId
      } check and update their fiat balance `,
      type: 'TRANSFER',
      title: 'Transfer Error',
      nType: 'both',
      permissions: [...Object.values(allPermissions.Transactions)],
    });
  }
};

/**
 * The `depositWebHook` function processes incoming deposits, verifies transactions, updates balances,
 * and creates transfer and payment records.
 *
 * @param data The `depositWebHook` function is designed to handle incoming deposit data. It performs
 * several operations based on the incoming data. Here's a breakdown of the main operations it carries
 * out:
 *
 * @return The function `depositWebHook` returns nothing explicitly. It contains multiple `return;`
 * statements within conditional blocks, but there is no explicit return value specified at the end of
 * the function.
 */
export const depositWebHook = async (data: IncomingDepositI) => {
  logger.info(`data: ${JSON.stringify(data)}`);
  const verifyTransaction = await verifyTransactionAPI(String(data.id));
  if (String(verifyTransaction.status).toLowerCase() !== 'success') {
    await notificationService.sendNotificationToStaffs({
      body: `Transfer with reference \n ${JSON.stringify(data)} \n the transfer wasn't validated from flutterwave`,

      title: 'Transfer',

      type: 'TRANSFER',

      permissions: [...Object.values(allPermissions.Transactions)],
    });
    return;
  }
  const PSA = await VIRTUAL_SUB_ACCOUNTS.findOne({ accountReferenceFlw: verifyTransaction.data.tx_ref });
  if (!PSA) {
    await notificationService.sendNotificationToStaffs({
      body: `Incoming deposit \n ${JSON.stringify(data)} \n couldnt find virtual sub-account`,

      title: 'DEPOSIT',

      type: 'DEPOSIT',

      permissions: [...Object.values(allPermissions.Transactions)],
    });
    return;
  }

  // confirm balance in sub-account

  // credit wallet balance

  // await userTransferToAdminService(PSA.userId, data.amount, transactionTypes.fiatDeposit, 'WEBHOOK');

  // remember flw ref
  const transfer = await TRANSFERS.findOne({ reference: verifyTransaction.data.flw_ref, txId: verifyTransaction.data.id });
  if (transfer) {
    await notificationService.sendNotificationToStaffs({
      body: `this transaction is already settled \n ${JSON.stringify(
        data
      )} \n the transfer wasn't validated from flutterwave`,

      title: 'Transfer',

      type: 'TRANSFER',

      permissions: [...Object.values(allPermissions.Transactions)],
    });
    return;
  }
  // now we use the psa to get transfers table, the transaction table too

  const wallet = await FIAT_WALLETS.findOne({ userId: PSA.userId });
  if (!wallet) {
    await notificationService.sendNotificationToStaffs({
      body: `Incoming deposit \n ${JSON.stringify(verifyTransaction.data)} \n money came in but no wallet found for user ${
        PSA.userId
      } \n the transfer wasn't validated from flutterwave`,

      title: 'DEPOSIT',

      type: 'DEPOSIT',

      permissions: [...Object.values(allPermissions.Transactions)],
    });
    return;
  }
  await exchangeFiat(wallet, CurrencyCodesEnum.Nigeria, verifyTransaction.data.amount, 'RECEIVE');
  const addTransfer: ITransfer = {
    userId: PSA.userId,
    amount: verifyTransaction.data.amount,
    bankCode: verifyTransaction.data.meta.bankname,
    bankName: verifyTransaction.data.meta.bankname,
    completeMessage: `completed`,
    createdAt: new Date(verifyTransaction.data.created_at),
    meta: verifyTransaction.data.meta,
    transferType: 'DEPOSIT',
    narration: verifyTransaction.data.narration,
    requiresApproval: 0,
    isApproved: 1,
    status: verifyTransaction.data.status,
    fee: verifyTransaction.data.app_fee,
    currency: verifyTransaction.data.currency,
    fullName: verifyTransaction.data.meta.originatorname,
    txId: verifyTransaction.data.id,
    reference: verifyTransaction.data.flw_ref,
    merchantName: verifyTransaction.data.meta.bankname,
    accountNumber: verifyTransaction.data.meta.originatoraccountnumber,
    debitCurrency: verifyTransaction.data.currency,
  };

  await TRANSFERS.create(addTransfer);

  await addNewFiatPaymentTransaction({
    amount: verifyTransaction.data.amount,
    date: new Date(verifyTransaction.data.created_at),
    ref: verifyTransaction.data.flw_ref,
    userId: PSA.userId,
    fee: verifyTransaction.data.app_fee,
    paymentProvider: paymentProviders.flutterwave,
    flwRef: String(verifyTransaction.data.id),
    type: transactionTypes.fiatDeposit,
    fiatDeposit: {
      senderAccountNumber: verifyTransaction.data.meta.originatoraccountnumber,
      senderBankName: verifyTransaction.data.meta.bankname,
      senderBankCode: verifyTransaction.data.meta.bankname,
      senderFullName: verifyTransaction.data.meta.originatorname,
    },
    narration: verifyTransaction.data.narration,
    providerTransactionId: String(data.id),
    currencyCode: CurrencyCodesEnum.Nigeria,
    walletId: wallet._id,
  });

  notificationService.sendNotification({
    userId: PSA.userId,
    body: `Deposit of ${data.amount} ${data.currency} was successful`,
    title: 'deposits',
    type: 'DEPOSIT',
    nType: 'both',
  });
  // await notificationService
};
