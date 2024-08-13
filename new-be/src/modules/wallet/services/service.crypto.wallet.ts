/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { FXS } from '@modules/admin/exchangeWallets';
import { TransferCryptoBitpwrResponseI } from '@modules/bitpwr/interfaces/interface.transfer.bitpwr';
import ApiError from '@modules/errors/ApiError';
import { getExchangeRateInUSDT, getFirstExchange } from '@modules/exchange/services/service.engine.exchange';
import { logger } from '@modules/logger';
import { sendNotification } from '@modules/notification/service.notification';
import { IOptions, QueryResult } from '@modules/paginate/paginate';
import {
  ICryptoTransactionDoc,
  NewCreatedCryptoTransaction,
} from '@modules/transactions/interfaces/interfaces.crypto.transactions';
import { addNewCryptoPaymentTransaction } from '@modules/transactions/services/service.crypto.transactions';
import { getUserById } from '@modules/user/service.user';
import { generateAlphanumericReference, generateReference } from '@modules/utils';
import { GeneratePrefixType, GeneratekeyE } from '@modules/utils/referenceGenerator';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { walletCurrencyService } from '..';
import config from '../../../config/config';
import { transactionTypes } from '../../../config/transactions';
import { CryptoCurrencyCodesT } from '../../setting/currencies';
import { walletBitpwrApi } from '../api';
import { simpleSendCryptoAPI } from '../api/api.crypto.wallet';
import {
  ICryptoHDWalletDoc,
  NewCreatedHDWallet,
  NewCryptoTransactionPayload,
  NewRegisteredHDWallet,
  UpdateHDWalletBody,
} from '../interfaces/interfaces.crypto.wallet';
import CRYPTO_HD_WALLETS from '../models/model.crypto.wallet';
import { CRYPTO_SUB_ACCOUNT } from '../models/model.subaccount.wallet';
import { getAllTradableAssets, getAssetByType } from './service.currency.wallet';

export async function getMainAccount() {
  const response = await walletBitpwrApi.getAccountBitpwrAdminAccounts({ page: 1 });
  // logger.info(`${JSON.stringify(response.data)}`);

  const data = response.data.filter(
    (x) =>
      x.isDeleted === false &&
      x.isArchived === false &&
      ((config.env !== 'production' && x.mode === 'TEST' && x.network === 'TESTNET') ||
        (config.env === 'production' && x.mode === 'LIVE' && x.network === 'MAINNET'))
  );

  const account = data[0];

  if (!account) throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');

  return account;
}

export async function createCryptoSubAccount(userId: mongoose.Types.ObjectId) {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  // find if sub account already exists
  const subAcct = await CRYPTO_SUB_ACCOUNT.findOne({ userId: user.id });
  if (subAcct) return subAcct;

  const account = await getMainAccount();

  const response = await walletBitpwrApi.createUserSubAccount({
    metaData: { fullName: `${user.firstName} ${user.lastName}` },
    accountId: account.uid,
    name: `${user.firstName} ${user.lastName}`,
    externalId: user.id,
  });
  if (!response.data) throw new ApiError(httpStatus.NOT_FOUND, 'Sub account not created');

  // create sub Account
  const subAccount = await CRYPTO_SUB_ACCOUNT.create({
    userId,
    addressesId: [],
    externalId: response.data.externalId,
    uid: response.data.uid,
    isArchived: response.data.isArchived,
    isDeleted: response.data.isDeleted,
    mode: response.data.mode,
    network: response.data.network,
    organizationId: response.data.organizationId,
    name: response.data.name,
  });

  return subAccount;
  // update subaccount balance
}

/**
 * The function `getSubAccount` retrieves a sub account based on the provided user ID and throws an
 * error if the sub account is not found.
 *
 * @param userId The `userId` parameter is of type `mongoose.Types.ObjectId`. It represents the unique
 * identifier of a user.
 *
 * @return the subAccount object.
 */
export async function getSubAccount(userId: mongoose.Types.ObjectId) {
  const subAccount = await CRYPTO_SUB_ACCOUNT.findOne({ userId });
  if (!subAccount) throw new ApiError(httpStatus.NOT_FOUND, 'Sub account not found');

  return subAccount;
}

/**
 * The function `getSubAccountByUid` retrieves a sub account by its UID and throws an error if it is
 * not found.
 *
 * @param uid The `uid` parameter is a string that represents the unique identifier of a sub account.
 *
 * @return the subAccount object.
 */
export async function getSubAccountByUid(uid: string) {
  const subAccount = await CRYPTO_SUB_ACCOUNT.findOne({ uid });
  if (!subAccount) throw new ApiError(httpStatus.NOT_FOUND, 'Sub account not found');

  return subAccount;
}

/*
  Cryptocurrency Wallets
*/

/**
 * Create a cryptocurrency wallet
 * @param {NewRegisteredHDWallet} walletPayload
 * @param {boolean} isExchange
 * @returns {Promise<ICryptoHDWalletDoc>}
 */
export const createCryptoWallet = async (
  walletPayload: NewRegisteredHDWallet & { userId: mongoose.Types.ObjectId },
  isExchange: boolean = false
): Promise<ICryptoHDWalletDoc> => {
  // check if user has reached a certain kyc level
  const user = await getUserById(walletPayload.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // check if user has an hd wallet before
  if (await CRYPTO_HD_WALLETS.isExists(walletPayload.userId, walletPayload.currencyCode)) {
    throw new ApiError(httpStatus.CONFLICT, 'Wallet already exists');
  }

  const account = await getMainAccount();
  let subAccount = await CRYPTO_SUB_ACCOUNT.findOne({ USER: walletPayload.userId });
  if (!subAccount) {
    subAccount = await createCryptoSubAccount(walletPayload.userId);
  }
  // create a deposit address for the user

  // check if wallet address is create able
  const getAsset = await getAssetByType(walletPayload.currencyCode);
  if (!getAsset) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }

  const walletResult = await walletBitpwrApi.createCryptoWalletAddress({
    accountId: account.uid,
    subAccountId: subAccount.uid,
    label: `${user.firstName} ${user.lastName}`,
    asset: walletPayload.currencyCode,
  });

  // for each currency available create a wallet for the user
  if (!walletResult || walletResult.status !== 'success') {
    throw new ApiError(httpStatus.FAILED_DEPENDENCY, 'Error while creating deposit address');
  }
  // get the user account balance
  const getBalance = await walletBitpwrApi.getWalletAddressAccountBalance(walletResult.data.uid);
  if (getBalance.status !== 'success')
    throw new ApiError(httpStatus.FAILED_DEPENDENCY, 'Error while getting account balance');
  // create a deposit address for the user
  const currencyImage = await walletCurrencyService.tradableAssetsPlusIcons();

  const getImage = currencyImage?.find((e) => e.symbol && e.symbol.toUpperCase() === walletPayload.currencyCode);

  const walletBody: NewCreatedHDWallet = {
    userId: walletPayload.userId, // could encrypt before saving just like user.password
    currencyCode: walletResult.data.assetType,
    image: getImage?.image ?? '',

    address: walletResult.data.address,
    addressContractIdentifier: walletResult.data.addressContractIdentifier,
    addressType: walletResult.data.addressType,

    balance: getBalance.data.balance,
    blocked: getBalance.data.blocked,
    pending: getBalance.data.pending,
    received: getBalance.data.received,
    sent: getBalance.data.sent,

    derivationIndex: walletResult.data.derivationIndex,
    isChangeAddress: walletResult.data.isChangeAddress,
    bal: getBalance.data,
    isContract: walletResult.data.isContract,
    lastUsedAt: walletResult.data.lastUsedAt,
    used: walletResult.data.used,
    addressRef: walletResult.data.addressRef,
    assetId: walletResult.data.assetId,
    assetType: walletResult.data.assetType,

    chain: walletResult.data.chain,
    deploymentParams: walletResult.data.deploymentParams,
    label: walletResult.data.label,
    network: walletResult.data.network,
    guid: walletResult.data.guid,

    mode: walletResult.data.mode,
    organizationId: walletResult.data.organizationId,
    uid: walletResult.data.uid,

    isActive: true,
    isExchange, // if the user creating the wallet is not a customer - might not be secure
  };

  const res = await CRYPTO_HD_WALLETS.create(walletBody);
  return res;
};

/**
 * Query for crypto wallets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCryptoWallets = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const wallets = await CRYPTO_HD_WALLETS.paginate(filter, options);
  let rsult = [];

  rsult = wallets.results as any;

  // Promise.all(
  //   wallets.results.map(async (e: any) => {
  //     const data = await syncCryptoWalletWithBitPwr(e.id);
  //     rsult.push(data as any);
  //   })
  // );

  return { ...wallets, results: rsult };
};

/**
 * Get wallet by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICryptoHDWalletDoc | null>}
 */
export const getCryptoWalletById = async (id: mongoose.Types.ObjectId): Promise<ICryptoHDWalletDoc | null> => {
  const wallet = await CRYPTO_HD_WALLETS.findById(id);
  // if (wallet) {
  //   wallet = await syncCryptoWalletWithBitPwr(wallet.id);
  // }
  return wallet;
};
/**
 * Get wallet by id and currency code
 * @param {mongoose.Types.ObjectId} id
 * @param {SupportedCoinPaymentsSymbol} currencyCode
 * @returns {Promise<ICryptoHDWalletDoc | null>}
 */
export const getCryptoWalletByIdAndCurrencyCode = async (
  id: mongoose.Types.ObjectId,
  currencyCode: CryptoCurrencyCodesT
): Promise<ICryptoHDWalletDoc | null> => {
  let data = await CRYPTO_HD_WALLETS.findById(id).findOne({ currencyCode });
  if (data) {
    data = await syncCryptoWalletWithBitPwr(data.id);
  }
  return data;
};

export async function getAllUsersCryptoAccounts(userId: mongoose.Types.ObjectId): Promise<ICryptoHDWalletDoc[]> {
  const wallets = await CRYPTO_HD_WALLETS.find({ userId });
  if (!wallets) throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');

  // const tot: ICryptoHDWalletDoc[] = [];

  // if (wallets) {
  //   await Promise.all(wallets.map(async (e) => tot.push(await syncCryptoWalletWithBitPwr(e.id))));
  //   return tot;
  // }
  // return tot;
  return wallets;
}
export async function syncCryptoWalletWithBitPwr(id: mongoose.Types.ObjectId) {
  const wallet = await CRYPTO_HD_WALLETS.findById(id);

  if (!wallet) throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  const getBalance = await walletBitpwrApi.getWalletAddressAccountBalance(wallet.uid);
  if (getBalance.status !== 'success')
    throw new ApiError(httpStatus.FAILED_DEPENDENCY, 'Error while getting account balance');

  wallet.balance = getBalance.data.balance;
  wallet.blocked = getBalance.data.blocked;
  wallet.pending = getBalance.data.pending;
  wallet.received = getBalance.data.received;
  wallet.sent = getBalance.data.sent;
  await wallet.save();
  return wallet;
}
/**
 * Get wallet by user id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ICryptoHDWalletDoc | null>}
 */
export const getCryptoWalletsByUserId = async (userId: mongoose.Types.ObjectId): Promise<QueryResult> =>
  queryCryptoWallets({ userId }, {});

export const getCryptoWalletCumulativeBalanceByUserId = async (userId: mongoose.Types.ObjectId) => {
  const wallets = await getAllUsersCryptoAccounts(userId);
  let totalValueInUsd = 0;
  if (wallets) {
    await Promise.all(
      wallets.map(async (wallet) => {
        const priceInUsdt = await getExchangeRateInUSDT(wallet.currencyCode);
        const balance = Number(wallet.balance) * Number(priceInUsdt);

        totalValueInUsd += balance;
      })
    );
  }
  return totalValueInUsd;
};

/**
 * Get wallet by user id and currency code
 * @param {mongoose.Types.ObjectId} userId
 * @param {string} currencyCode
 * @returns {Promise<ICryptoHDWalletDoc | null>}
 */
export const getCryptoWalletByUserIdAndCurrencyCode = async (
  userId: mongoose.Types.ObjectId,
  currencyCode: string
): Promise<ICryptoHDWalletDoc | null> => {
  let c = await CRYPTO_HD_WALLETS.findOne({ userId, currencyCode });
  if (c) {
    c = await syncCryptoWalletWithBitPwr(c._id);
  }

  return c;
};

/**
 * The function `getExchangeCryptoWallet` retrieves the address for a given cryptocurrency code, checks
 * if it exists in the database, and creates it if it doesn't.
 *
 * @param currencyCode The `currencyCode` parameter is a string that represents the code of the
 * cryptocurrency for which we want to get the exchange wallet.
 *
 * @return The function `getExchangeCryptoWallet` returns the `address` object.
 */
export const getExchangeCryptoWallet = async (currencyCode: CryptoCurrencyCodesT) => {
  const getAssets = await getAllTradableAssets();
  const getAsset = getAssets.find(
    (asset) =>
      asset.assetType === currencyCode &&
      (config.env === 'development' ? asset.mode === 'TEST' : asset.mode === 'LIVE') &&
      (config.env === 'development' ? asset.network === 'TESTNET' : asset.network === 'MAINNET')
  );
  if (!getAsset) throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  // get address next
  logger.info(`asset here ${JSON.stringify(getAsset)}`);
  const addresses = await walletBitpwrApi.getBitpwrAssetsAddressByAssetId(getAsset.uid);
  logger.info(` ${currencyCode} Data here ${JSON.stringify(addresses.data)}`);
  if (addresses.status !== 'success') throw new ApiError(httpStatus.NOT_FOUND, ' Address not found');

  const address = addresses.data.find((ad) =>
    config.env === 'development'
      ? ad.mode === 'TEST' &&
        ad.network === 'TESTNET' &&
        ad.derivationIndex === 0 &&
        ad.isChangeAddress === false &&
        ad.assetType === currencyCode
      : ad.derivationIndex === 0 &&
        ad.isChangeAddress === false &&
        ad.assetType === currencyCode &&
        ad.mode === 'LIVE' &&
        ad.network === 'MAINNET'
  );
  if (!address) throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  // lets move to checking our db if the address does exist and create it if it doesn't

  const findInDb = await CRYPTO_HD_WALLETS.findOne({ currencyCode, isExchange: true });
  const getBalance = await walletBitpwrApi.getWalletAddressAccountBalance(address.uid);
  if (getBalance.status !== 'success') throw new ApiError(httpStatus.NOT_FOUND, 'Balance not found');
  // create a deposit address for the user
  const currencyImage = await walletCurrencyService.tradableAssetsPlusIcons();

  const getImage = currencyImage?.find((e) => e.symbol && e.symbol.toUpperCase() === currencyCode);
  if (!findInDb) {
    const walletBody: NewCreatedHDWallet = {
      userId: new mongoose.Types.ObjectId(123456),
      currencyCode: address.assetType,
      image: getImage?.image ?? '',
      address: address.address,
      addressContractIdentifier: address.addressContractIdentifier,
      addressType: address.addressType,

      balance: getBalance.data.balance,
      blocked: getBalance.data.blocked,
      pending: getBalance.data.pending,
      received: getBalance.data.received,
      sent: getBalance.data.sent,

      derivationIndex: address.derivationIndex,
      isChangeAddress: address.isChangeAddress,
      bal: getBalance.data,
      isContract: address.isContract,
      lastUsedAt: address.lastUsedAt,
      used: address.used,
      addressRef: address.addressRef,
      assetId: address.assetId,
      assetType: address.assetType,

      chain: address.chain,
      deploymentParams: address.deploymentParams,
      label: address.label,
      network: address.network,
      guid: address.guid,

      mode: address.mode,
      organizationId: address.organizationId,
      uid: address.uid,

      isActive: true,
      isExchange: true, // if the user creating the wallet is not a customer - might not be secure
    };
    await CRYPTO_HD_WALLETS.create(walletBody);
  }
  if (findInDb) {
    if (
      findInDb.address !== address.address ||
      findInDb.addressContractIdentifier !== address.addressContractIdentifier ||
      findInDb.addressType !== address.addressType
    ) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Address not found clarify error');
    }
  }
  return address;
};

/**
 * The function updates a cryptocurrency wallet by its ID and currency code.
 *
 * @param walletId The ID of the crypto wallet that needs to be updated. It is of type
 * `mongoose.Types.ObjectId`.
 * @param currencyCode The `currencyCode` parameter is of type `SupportedCoinPaymentsSymbol`. It
 * represents the code of the cryptocurrency for which the wallet is being updated.
 * @param updateBody The `updateBody` parameter is an object that contains the properties and values
 * that need to be updated in the crypto wallet.
 *
 * @return a Promise that resolves to either an ICryptoHDWalletDoc object or null.
 */
export const updateCryptoWalletById = async (
  walletId: mongoose.Types.ObjectId,
  currencyCode: CryptoCurrencyCodesT,
  updateBody: UpdateHDWalletBody
): Promise<ICryptoHDWalletDoc | null> => {
  const wallet = await getCryptoWalletByIdAndCurrencyCode(walletId, currencyCode);
  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }

  Object.assign(wallet, updateBody);
  await wallet.save();

  return wallet;
};

/**
 * The function `deleteCryptoWalletById` deletes a crypto wallet by its ID after checking if it exists
 * and throws an error if it doesn't.
 *
 * @param id The `id` parameter is of type `mongoose.Types.ObjectId`. It represents the unique
 * identifier of the crypto wallet that needs to be deleted.
 *
 * @return a Promise that resolves to either an ICryptoHDWalletDoc object or null.
 */
export const deleteCryptoWalletById = async (id: mongoose.Types.ObjectId): Promise<ICryptoHDWalletDoc | null> => {
  const wallet = await getCryptoWalletById(id);
  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }

  // TODO: Before deleting move funds to another wallet
  // await wallet.deleteOne();
  return wallet;
};

/**
 * withdraw crypto to address
 * @param {NewCryptoTransactionPayload} transactionPayload
 * @returns {Promise<ICryptoTransactionDoc>}
 */
export const withdrawCrypto = async (
  transactionPayload: NewCryptoTransactionPayload & { userId: mongoose.Types.ObjectId }
): Promise<ICryptoTransactionDoc> => {
  const coinCode = transactionPayload.currencyCode as CryptoCurrencyCodesT;

  const wallet = await getCryptoWalletByUserIdAndCurrencyCode(transactionPayload.userId, coinCode);
  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  }

  if (transactionPayload.userId.toString() !== wallet.userId.toString()) {
    // TODO: use userId to check user roles/permissions
    throw new ApiError(httpStatus.FORBIDDEN, 'Access to Wallet not permitted');
  }

  if (Number(transactionPayload.amount) <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid amount, amount should be > 0');
  }

  if (Number(wallet.balance) < Number(transactionPayload.amount)) {
    throw new ApiError(httpStatus.PAYMENT_REQUIRED, 'Insufficient balance');
  }
  const exchange = await getFirstExchange();
  if (!exchange) {
    throw new ApiError(httpStatus.NOT_FOUND, 'error getting exchange rate');
  }
  const getAdmin = await getMainAccount();
  if (!getAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  const getSubAcct = await getSubAccount(transactionPayload.userId);
  if (!getSubAcct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const getWallet = await getCryptoWalletByUserIdAndCurrencyCode(transactionPayload.userId, transactionPayload.currencyCode);
  if (!getWallet) throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  const exchangeWallet = await FXS.findOne({
    currencyCode: coinCode,
  }); /* getExchangeCryptoWallet(coinCode); */
  if (!exchangeWallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Exchange Wallet not found');
  }

  const feeAmount = (Number(transactionPayload.amount) * Number(exchange.withdrawalFee)) / 100;
  const creditAmount = Number(transactionPayload.amount) - feeAmount;

  const cryptoTx = await simpleSendCryptoAPI({
    accountId: getAdmin.uid,
    toAddress: transactionPayload.toAddress,
    subAccountId: getSubAcct.uid,
    toAmount: creditAmount,
    fromAddress: getWallet.address,
    coinCode,
  });

  await simpleSendCryptoAPI({
    accountId: getAdmin.uid,
    coinCode,
    toAddress: exchangeWallet.address,
    fromAddress: getWallet.address,
    toAmount: feeAmount,
    description: `transfer from user to admin withdrawal fee${generateAlphanumericReference(
      15,
      GeneratekeyE.alphanum,
      GeneratePrefixType.TRANSFER
    )}`,
    subAccountId: getSubAcct.uid,
  });
  if (!cryptoTx) {
    throw new ApiError(httpStatus.FAILED_DEPENDENCY, 'Error while sending crypto to address');
  }

  const transactionBody: NewCreatedCryptoTransaction = {
    userId: wallet.userId,
    walletId: wallet.id,
    type: transactionTypes.cryptoTransfer,
    uid: cryptoTx.data.uid,
    assetType: cryptoTx.data.assetType,
    chain: cryptoTx.data.chain,
    fee: cryptoTx.data.fee,
    bitpwrType: 'TRANSFER',
    category: 'transfer',
    description: cryptoTx.data.description,
    referenceId: `C-${new Date().getFullYear()}-${generateReference(16)}`,
    amount: transactionPayload.amount,
    fromAddress: wallet.address,
    network: cryptoTx.data.network,
    ref: cryptoTx.data.ref,
    toAddress: transactionPayload.toAddress,

    status: cryptoTx.data.status,
  };

  await sendNotification({
    body: ` You are sending 
    ${transactionPayload.amount} ${transactionPayload.currencyCode} to ${transactionPayload.toAddress} \n Transaction ID: ${cryptoTx.data.uid}, Reference ID: ${transactionBody.referenceId} \n Status: ${cryptoTx.data.status}`,
    nType: 'both',
    title: ' Crypto Withdrawal',
    userId: wallet.userId,
    type: 'crypto withdrawal',
  });
  return addNewCryptoPaymentTransaction(transactionBody);
};

/**
 * The function `exchangeCrypto` exchanges a specified amount of cryptocurrency between a user's wallet
 * and an exchange wallet.
 *
 * @param userWallet The userWallet parameter is of type ICryptoHDWalletDoc, which represents a
 * document in a database that contains information about a user's cryptocurrency wallet. It likely
 * includes properties such as the user's wallet address, balance, and payment port ID.
 * @param currencyCode The `currencyCode` parameter represents the code of the cryptocurrency that you
 * want to exchange. It should be a string value.
 * @param amount The amount of cryptocurrency to be exchanged. It should be a string representing the
 * numeric value of the amount.
 * @param mode The `mode` parameter is a string that specifies the type of transaction to perform. It
 * can have two possible values: 'SEND' or 'RECEIVE'.
 *
 * @return The function `exchangeCrypto` returns a Promise that resolves to a `SendResultAPI` object.
 */
export const exchangeCrypto = async (
  userWallet: ICryptoHDWalletDoc,
  currencyCode: CryptoCurrencyCodesT,
  amount: number,
  mode: 'SEND' | 'RECEIVE'
): Promise<TransferCryptoBitpwrResponseI> => {
  try {
    const coinCode = currencyCode as CryptoCurrencyCodesT;

    // const exchangeWallet = await getExchangeCryptoWallet(coinCode);
    // if (!exchangeWallet) {
    //   throw new ApiError(httpStatus.NOT_FOUND, 'Exchange Wallet not found');

    const exchangeWallet = await FXS.findOne({ currencyCode: coinCode });
    if (!exchangeWallet) throw new ApiError(httpStatus.NOT_FOUND, 'Exchange Wallet not found');

    const getAdmin = await getMainAccount();
    if (!getAdmin) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    const getSubAcct = await getSubAccount(userWallet.userId);
    if (!getSubAcct) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (Number(amount) <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid amount, amount should be > 0');
    }

    if (Number(userWallet.balance) < Number(amount)) {
      throw new ApiError(httpStatus.PAYMENT_REQUIRED, 'Insufficient balance');
    }

    let cryptoTx: TransferCryptoBitpwrResponseI;
    let transactionBody: NewCreatedCryptoTransaction;

    /* The above code is a switch statement in TypeScript. It is used to execute different code blocks
  based on the value of the variable "mode". The code inside the switch statement will be executed
  when the value of "mode" matches one of the cases defined in the switch statement. */
    switch (mode) {
      case 'SEND': // the user is sending to the admin
        cryptoTx = await simpleSendCryptoAPI({
          accountId: getAdmin.uid,
          coinCode: currencyCode,
          toAddress: exchangeWallet.address,
          fromAddress: userWallet.address,
          toAmount: Number(amount),
          description: `${generateAlphanumericReference(15, GeneratekeyE.alphanum, GeneratePrefixType.TRANSFER)}`,
          subAccountId: getSubAcct.uid,
        });
        transactionBody = {
          userId: userWallet.userId,
          bitpwrType: 'SWAP',
          category: 'swap',
          walletId: userWallet.id,
          type: transactionTypes.cryptoTransfer,
          uid: cryptoTx.data.uid,
          assetType: cryptoTx.data.assetType,
          chain: cryptoTx.data.chain,
          fee: cryptoTx.data.fee,
          description: cryptoTx.data.description,
          referenceId: `C-${new Date().getFullYear()}-${generateReference(16)}`,
          amount: String(amount),

          fromAddress: userWallet.address,
          network: cryptoTx.data.network,
          ref: cryptoTx.data.ref,
          toAddress: 'admin',

          status: String(cryptoTx.data.status).toUpperCase(),
        };
        break;
      case 'RECEIVE': // the admin is sending to the user
        cryptoTx = await simpleSendCryptoAPI({
          accountId: getAdmin.uid,
          coinCode,
          toAddress: userWallet.address /* exchangeWallet.address */,
          toAmount: Number(amount),
          description: `${generateAlphanumericReference(15, GeneratekeyE.alphanum, GeneratePrefixType.TRANSFER)}`,
        });
        transactionBody = {
          userId: new mongoose.Types.ObjectId(123456),
          walletId: new mongoose.Types.ObjectId(654321),
          type: transactionTypes.cryptoTransfer,
          uid: cryptoTx.data.uid,
          assetType: cryptoTx.data.assetType,
          chain: cryptoTx.data.chain,
          fee: cryptoTx.data.fee,
          bitpwrType: 'SWAP',
          category: 'swap',
          description: cryptoTx.data.description,
          referenceId: `C-${new Date().getFullYear()}-${generateReference(16)}`,
          amount: String(amount),
          fromAddress: 'admin',
          network: cryptoTx.data.network,
          ref: cryptoTx.data.ref,
          toAddress: userWallet.address,

          status: String(cryptoTx.data.status),
        };
        break;
    }

    if (!cryptoTx) {
      throw new ApiError(httpStatus.FAILED_DEPENDENCY, `Error occurred in crypto exchange: ${mode} ${coinCode}`);
    }

    await sendNotification({
      userId: userWallet.userId,
      body: ` You are swapping 
    ${amount} ${currencyCode}  \n Transaction ID: ${cryptoTx.data.uid}, Reference ID: ${cryptoTx.data.ref} \n Status: ${cryptoTx.data.status}`,
      nType: 'both',
      title: ` Crypto swap`,
      type: `crypto swap`,
    });
    await addNewCryptoPaymentTransaction(transactionBody);
    return cryptoTx;
  } catch (error: any) {
    logger.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, `${error.message}`);
  }
};

export async function getWalletByWalletAddress(address: string) {
  const wallet = await CRYPTO_HD_WALLETS.findOne({ address });
  if (!wallet) throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  return wallet;
}

export async function getUserWalletById(walletId: mongoose.Types.ObjectId) {
  const wallet = await CRYPTO_HD_WALLETS.findOne({ id: walletId });
  if (!wallet) throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
  return wallet;
}
