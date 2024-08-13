/* eslint-disable import/no-cycle */
import ApiError from '@modules/errors/ApiError';
import { logger } from '@modules/logger';
import { IOptions, QueryResult } from '@modules/paginate/paginate';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { cryptoCurrencyCodes, currencyTypes } from '../../setting/currencies';
import { walletBitpwrApi } from '../api';
import { requestCoins } from '../api/api.crypt.wallet';
import { CoinDataResponse } from '../api/interface.api.wallet.ts/interface.api.crypto';
import { ICurrencyDoc, NewCreatedCurrency, UpdateCurrencyBody } from '../interfaces/interfaces.currency.wallet';
import CRYPTO_HD_WALLETS from '../models/model.crypto.wallet';
import CURRENCIES from '../models/model.currency.wallet';
import FIAT_WALLETS from '../models/model.fiat.wallet';
import { getMainAccount } from './service.crypto.wallet';

/**
 * Add a new currency/coin
 * @param {NewCreatedCurrency} currencyBody
 * @returns {Promise<ICurrencyDoc>}
 */
export const addNewCurrency = async (currencyBody: Partial<NewCreatedCurrency>): Promise<ICurrencyDoc> => {
  if (await CURRENCIES.isCodeTaken(currencyBody.code!)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code already taken');
  }
  return CURRENCIES.create(currencyBody);
};

/**
 * Query for currencies
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCurrencies = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const currencies = await CURRENCIES.paginate(filter, options);
  return currencies;
};

export const queryUserCurrencies = async (userId: mongoose.Types.ObjectId) => {
  const currencies = await CURRENCIES.find();
  const getUsersWalletsCrypto = await CRYPTO_HD_WALLETS.find({ userId });
  const getUserFiatWallet = await FIAT_WALLETS.find({ userId });
  const combined = [...getUserFiatWallet, ...getUsersWalletsCrypto];

  const res = currencies.filter((e) => combined.some((v) => v.currencyCode === e.code));
  return res;
};

/**
 * Get currency by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICurrencyDoc | null>}
 */
export const getCurrencyById = async (id: mongoose.Types.ObjectId): Promise<ICurrencyDoc | null> => {
  const res = await CURRENCIES.findById(id);
  return res;
};

/**
 * Get currency by code
 * @param {string} code
 * @returns {Promise<ICurrencyDoc | null>}
 */
export const getCurrencyByCode = async (code: string): Promise<ICurrencyDoc | null> => CURRENCIES.findOne({ code });

/**
 * Update currency by id
 * @param {mongoose.Types.ObjectId} currencyId
 * @param {UpdateCurrencyBody} updateBody
 * @returns {Promise<ICurrencyDoc | null>}
 */
export const updateCurrencyById = async (
  currencyId: mongoose.Types.ObjectId,
  updateBody: UpdateCurrencyBody
): Promise<ICurrencyDoc | null> => {
  const currency = await getCurrencyById(currencyId);
  if (!currency) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
  }
  if (updateBody.code && (await CURRENCIES.isCodeTaken(updateBody.code, currencyId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code already taken');
  }
  Object.assign(currency, updateBody);
  await currency.save();
  return currency;
};

/**
 * Delete currency by id
 * @param {mongoose.Types.ObjectId} currencyId
 * @returns {Promise<ICurrencyDoc | null>}
 */
export const deleteCurrencyById = async (currencyId: mongoose.Types.ObjectId): Promise<ICurrencyDoc | null> => {
  const currency = await getCurrencyById(currencyId);
  if (!currency) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
  }
  await currency.deleteOne();
  return currency;
};

/**
 * Deactivate currency by id
 * @param {mongoose.Types.ObjectId} currencyId
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ICurrencyDoc | null>}
 */
export const deactivateCurrencyById = async (
  currencyId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<ICurrencyDoc | null> => {
  const updateBody: UpdateCurrencyBody = { isActive: false, updatedByUserId: userId };
  const currency = await updateCurrencyById(currencyId, updateBody);
  return currency;
};

/**
 * The function `getAllTradableAssets` retrieves all tradable assets associated with the main account.
 *
 * @return the data of tradable assets.
 */
export async function getAllTradableAssets() {
  const mainAccount = await getMainAccount();

  if (!mainAccount) throw new ApiError(httpStatus.NOT_FOUND, 'Main account not found');
  const assets = await walletBitpwrApi.getBitpwrAdminAssetsByAccountId(mainAccount.uid);

  if (!assets || assets.status === 'error') throw new ApiError(httpStatus.NOT_FOUND, 'Assets not found');

  // for (const asset of assets.data) {
  //   const getCurrencyByCd = await getCurrencyByCode(asset.assetType);
  //   if (!getCurrencyByCd) {
  //     const data: Partial<NewCreatedCurrency> = {
  //       name: asset.label,
  //       symbol: asset.assetType,
  //       code: asset.assetType,
  //       currencyType: currencyTypes.crypto,
  //       uid: asset.uid,
  //       mode: asset.mode,
  //       label: asset.label,
  //       network: asset.network,
  //       createdByUserId: new mongoose.Types.ObjectId(123456),
  //       updatedByUserId: new mongoose.Types.ObjectId(123456),
  //       isActive: true,
  //     };

  //     const addNew = await addNewCurrency(data);
  //     if (!addNew) '';
  //   }
  // }

  return assets.data;
}

export async function updateDbTradableAssets() {
  const assets = await getAllTradableAssets();
  const authenticatedUserId = 1234567;
  const d = await requestCoins();
  const promises = assets.map(async (asset) => {
    const da = d.find((coin) => {
      return asset.assetType.toUpperCase() === coin.symbol.toUpperCase();
    });
    logger.info(`coins = ${JSON.stringify(da)}`);
    const getCurrencyByCd = await getCurrencyByCode(asset.assetType);
    if (!getCurrencyByCd) {
      const data: Partial<NewCreatedCurrency> = {
        image: da?.image ?? '',
        name: asset.label,
        symbol: asset.assetType,
        code: asset.assetType,
        currencyType: currencyTypes.crypto,
        uid: asset.uid,
        mode: asset.mode,
        label: asset.label,
        network: asset.network,
        createdByUserId: new mongoose.Types.ObjectId(authenticatedUserId),
        updatedByUserId: new mongoose.Types.ObjectId(authenticatedUserId),
        isActive: true,
      };

      await addNewCurrency(data);
    } else {
      const updateData: UpdateCurrencyBody = {
        image: da?.image ?? '',
        name: asset.label,
        symbol: asset.assetType,
        code: asset.assetType,
        currencyType: currencyTypes.crypto,
        uid: asset.uid,
        mode: asset.mode,
        label: asset.label,
        network: asset.network,
        updatedByUserId: new mongoose.Types.ObjectId(authenticatedUserId),
        isActive: true,
      };

      await CURRENCIES.updateOne({ code: asset.assetType }, updateData);
    }
  });

  await Promise.all(promises);
}

/**
 * The function "getAllTradableAssetsTypes" retrieves all tradable assets and returns an array of their
 * types.
 *
 * @return an array of asset types.
 */
export async function getAllTradableAssetsTypes(): Promise<Array<string>> {
  // todo const assets = await getAllTradableAssets();

  // todo const assetsTypes = assets.map((asset) => asset.assetType.toUpperCase());

  // return assetsTypes;
  return cryptoCurrencyCodes;
}

/**
 * The function `getAssetByType` retrieves a tradable asset by its type and throws an error if the
 * asset is not found.
 *
 * @param assetType The `assetType` parameter is a string that represents the type of asset you want to
 * retrieve.
 *
 * @return a promise that resolves to an asset object.
 */
export async function getAssetByType(assetType: string) {
  const assets = await getAllTradableAssets();
  logger.info(`assetType = ${assetType}  assets: ${JSON.stringify(assets)}`);
  // logger.info(`assets = ${JSON.stringify(assets)}`);)
  const asset = assets.find((asse) => asse.assetType.toUpperCase() === assetType.toUpperCase());
  let rem = null;

  if (asset) {
    const { balance, ...d } = asset;

    rem = d;
  }

  return rem;
}

/**
 * The function "tradableAssetsPlusIcons" returns an array of coin data responses for tradable assets
 * that have icons.
 *
 * @return an array of CoinDataResponse objects.
 */
export async function tradableAssetsPlusIcons(): Promise<Array<CoinDataResponse>> {
  const assets = cryptoCurrencyCodes; /* await getAllTradableAssetsTypes() */
  assets.map((asset) => asset.toUpperCase());

  const data = await requestCoins();

  return data.filter((coin) => assets.includes(coin.symbol.toUpperCase()));
}

/**
 * The function `addCryptoAssets` creates a new crypto asset, checks if it already exists, and adds it
 * to the database.
 *
 * @param assetType The `assetType` parameter is a string that represents the type of crypto asset
 * being added. It could be something like "Bitcoin" or "Ethereum".
 * @param label The `label` parameter is a string that represents the label or name of the crypto
 * asset. It is used to identify the asset and can be any string value.
 * @param userId The `userId` parameter is of type `mongoose.Types.ObjectId` and represents the unique
 * identifier of the user who is adding the crypto asset.
 *
 * @return the `asset.data` object.
 */
export async function addCryptoAssets(assetType: string, label: string, userId: mongoose.Types.ObjectId) {
  const checkIfAssetExist = await getAssetByType(assetType);
  logger.info(`${assetType} ${JSON.stringify(checkIfAssetExist)}`);
  if (checkIfAssetExist) throw new ApiError(httpStatus.BAD_REQUEST, 'Asset already exist');
  const mainAccount = await getMainAccount();
  if (!mainAccount) throw new ApiError(httpStatus.NOT_FOUND, 'Main account not found');
  const asset = await walletBitpwrApi.createBitpwrAssetsByAdmin({
    accountId: mainAccount.uid,
    asset: assetType,
    label,
  });
  if (!asset || asset.status === 'error') throw new ApiError(httpStatus.BAD_REQUEST, 'Error creating asset');
  const d = await requestCoins();

  const da = d.find((coin) => assetType === coin.symbol.toUpperCase());

  const data: Partial<NewCreatedCurrency> = {
    image: da?.image ?? '',
    name: label,
    symbol: asset.data.assetType,
    code: asset.data.assetType,
    currencyType: currencyTypes.crypto,
    uid: asset.data.uid,
    mode: asset.data.mode,
    label: asset.data.label,
    network: asset.data.network,
    createdByUserId: userId,
    updatedByUserId: userId,
    isActive: true,
  };

  await addNewCurrency(data);

  return asset.data;
}
