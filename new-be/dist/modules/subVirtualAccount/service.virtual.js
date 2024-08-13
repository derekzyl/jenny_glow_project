/* eslint-disable @typescript-eslint/no-use-before-define */
import { ApiError } from '../errors';
import { CountryCodesEnum } from '../flutterwave/interfaces/interface.flutterwave';
import { logger } from '../logger';
import { sendNotification, sendNotificationToStaffs } from '../notification/service.notification';
import { allPermissions } from '../setting/roles';
import { transferService } from '../tranfers';
import { generateAlphanumericReference } from '../utils';
import { GeneratePrefixType, GeneratekeyE, easyReferenceGenerator } from '../utils/referenceGenerator';
import { FIAT_WALLETS, fiatWalletService } from '../wallet';
import httpStatus from 'http-status';
import { kycService } from '../kyc';
import { FiatCurrencyCodes } from '../setting/currencies';
import { balanceSubAccount, createSubAccount, transactionsSubAccount } from './api/api.account';
import BVN_DATA from './models/model.bvn-data';
import VIRTUAL_SUB_ACCOUNTS from './models/model.virtual';
export const initCreateVirtualAccount = async (request) => {
    try {
        // const data = { firstname: request.user.firstName, lastname: request.user.lastName, bvn: request.bvn };
        // const response = await initCreateSubAccount(data);
        // if (!response) throw new ApiError(httpStatus.BAD_REQUEST, 'failed to initialize create account');
        let createBvn;
        const checkBvn = await BVN_DATA.isBvnExists(request.bvn, request.user._id);
        if (checkBvn) {
            logger.error(`check the authenticity of this bvn ${request.bvn} required by the user ${request.user._id}`);
            await sendNotificationToStaffs({
                type: 'error',
                body: `check the authenticity of this bvn ${request.bvn} in KYC section </br> 
         required by the user ${request.user._id}  cause its already registered to another account`,
                title: 'BVN verification',
                permissions: [allPermissions.Kyc.Manage],
            });
            throw new ApiError(httpStatus.BAD_REQUEST, 'bvn already taken by another user');
        }
        const findBvnData = await BVN_DATA.findOne({ userId: request.user._id });
        const transRef = generateAlphanumericReference(16, GeneratekeyE.alphanumLower, GeneratePrefixType.VIRTUAL_ACCOUNT);
        if (findBvnData) {
            createBvn = await BVN_DATA.findOneAndUpdate({ userId: request.user._id }, { bvn: request.bvn, bvnRef: transRef });
        }
        else {
            createBvn = new BVN_DATA({ bvn: request.bvn, bvnRef: transRef, userId: request.user._id });
            await createBvn.save();
        }
        const bvn = await createVirtualAccount({ bvnRef: transRef, user: request.user, phoneNumber: request.phoneNumber, bvn: request.bvn }, false);
        return bvn;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Failed to initialize virtual account ${error}`);
    }
};
/**
 * The function `createVirtualAccount` is an asynchronous function that creates a virtual account based
 * on the provided request payload and stores the account details in the database.
 *
 * @param request The `request` parameter is an object that contains the following properties:
 * @param isWebhook isWebhook is a boolean parameter that indicates whether the function is being
 * called from a webhook or not. If isWebhook is true, it means the function is being called from a
 * webhook. If isWebhook is false or not provided, it means the function is not being called from a
 * webhook
 *
 * @return nothing (undefined).
 */
export const createVirtualAccount = async (request, isWebhook = false) => {
    var _a, _b;
    const transRef = generateAlphanumericReference(16, GeneratekeyE.alphanumUpper, GeneratePrefixType.VIRTUAL_ACCOUNT);
    const psaRef = easyReferenceGenerator({ prefix: GeneratePrefixType.PSA, type: GeneratekeyE.alphanumUpper, size: 20 });
    try {
        const data = {
            bvnRef: request.bvnRef,
            user: request.user,
            phoneNumber: request.phoneNumber,
            bvn: request.bvn,
            trxRef: psaRef,
        };
        let walletId = await FIAT_WALLETS.findOne({ userId: request.user._id, currencyCode: FiatCurrencyCodes.NGN });
        if (!walletId)
            walletId = await FIAT_WALLETS.create({ userId: request.user._id, currencyCode: FiatCurrencyCodes.NGN });
        const findBvnData = await BVN_DATA.findOne({ userId: request.user._id, bvnRef: request.bvnRef });
        if (!findBvnData)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to find bvn');
        const getKyc = await kycService.getKycUserByUserId(request.user._id);
        if (!getKyc) {
            await kycService.createKycUser({
                phoneNumber: request.phoneNumber,
                userId: request.user.id,
                bvn: findBvnData.bvn,
                createdByUserId: request.user.id,
                updatedByUserId: request.user.id,
            });
        }
        else {
            kycService.updateKycProfileById(request.user._id, { bvn: findBvnData.bvn, phoneNumber: request.phoneNumber }, request.user.id);
        }
        const createNewAccount = await createSubAccount(data, isWebhook);
        if (!createNewAccount)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create virtual account ');
        if (createNewAccount.bvn && isWebhook) {
            const bvn = createNewAccount.bvn.data;
            const bv = bvn.bvn_data;
            const bvnData = {
                additionalInfo1: bv.additionalInfo1,
                branchName: bv.branchName,
                nin: bv.nin,
                bvnRef: request.bvnRef,
                phoneNumber1: bv.phoneNumber1,
                phoneNumber2: bv.phoneNumber2,
                productReference: bv.productReference,
                stateOfResidence: bv.stateOfResidence,
                status: bvn.status,
                callbackUrl: bvn.callback_url,
                dateOfBirth: bv.dateOfBirth,
                email: bv.email,
                gender: bv.gender,
                firstName: bv.firstName,
                lastName: bvn.last_name,
                middleName: bv.middleName,
                enrollBankCode: bv.enrollBankCode,
                enrollmentDate: bv.enrollmentDate,
                lgaOfResidence: bv.lgaOfResidence,
                lgaOfCapture: bv.lgaOfCapture,
                maritalStatus: bv.maritalStatus,
                stateOfOrigin: bv.stateOfOrigin,
                stateOfCapture: bv.stateOfCapture,
                enrollUserName: bv.enrollUserName,
                surname: bv.surname,
                watchlisted: bv.watchlisted,
                faceImage: bv.faceImage,
                serialNo: bv.serialNo,
                lgaOfOrigin: bv.lgaOfOrigin,
                nameOnCard: bv.nameOnCard,
                landmarks: bv.landmarks,
                userId: request.user._id,
                bvnId: bvn.id,
                AccountId: bvn.AccountId,
            };
            const updateBvnTable = await BVN_DATA.findOneAndUpdate({ userId: request.user._id, bvnRef: request.bvnRef }, bvnData);
            if (!updateBvnTable) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create update account');
            }
        }
        if (createNewAccount.account && !isWebhook) {
            // const getAccountNumber = await getOtherCurrencyBank({
            //   account_reference: createNewAccount.account.data.account_reference,
            // });
            // if (!getAccountNumber) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to get currency bank account');
            // logger.info(
            //   `get account number ${JSON.stringify(getAccountNumber.data)} and create new account ${JSON.stringify(
            //     createNewAccount.account.data
            //   )}`
            // );
            let bankCode = '035';
            if ((createNewAccount === null || createNewAccount === void 0 ? void 0 : createNewAccount.account) && ((_b = (_a = createNewAccount === null || createNewAccount === void 0 ? void 0 : createNewAccount.account) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.bank_name)) {
                const getBanks = await transferService.getBanksService();
                const banks = getBanks.data.find((bank) => { var _a; return bank.name === ((_a = createNewAccount.account) === null || _a === void 0 ? void 0 : _a.data.bank_name); });
                if (banks) {
                    bankCode = banks.code;
                }
            }
            const outgoing = {
                userId: request.user._id,
                accountReferenceFlw: psaRef,
                country: CountryCodesEnum.Nigeria,
                accountName: `${request.user.firstName} ${request.user.lastName}`,
                accountNumber: createNewAccount.account.data.account_number,
                bankName: createNewAccount.account.data.bank_name,
                createdAt: String(createNewAccount.account.data.created_at),
                bvn: request.bvn,
                note: `created virtual account for ${request.user.email}`,
                phoneNumber: request.phoneNumber,
                bankCode,
                status: 'ACTIVE',
                accFlwId: createNewAccount.account.data.flw_ref,
                accRef: transRef,
                barterId: createNewAccount.account.data.order_ref,
                availableBalance: 0,
                ledgerBalance: 0,
                bvnData: findBvnData._id,
            };
            // const outgoing: VirtualSubAccountAllServicePayloadType = {
            //   userId: request.user._id,
            //   accountReferenceFlw: createNewAccount.account.data.account_reference,
            //   country: createNewAccount.account.data.country,
            //   accountName: createNewAccount.account.data.account_name,
            //   accountNumber: getAccountNumber.data.static_account,
            //   bankName: createNewAccount.account.data.bank_name,
            //   createdAt: createNewAccount.account.data.created_at,
            //   bvn: request.bvn,
            //   note: `created virtual account for ${request.user.email}`,
            //   phoneNumber: request.phoneNumber,
            //   bankCode: createNewAccount.account.data.bank_code,
            //   status: createNewAccount.account.data.status,
            //   accFlwId: createNewAccount.account.data.id,
            //   accRef: transRef,
            //   barterId: createNewAccount.account.data.barter_id,
            //   availableBalance: 0,
            //   ledgerBalance: 0,
            //   bvnData: findBvnData._id,
            // };
            let res;
            const findSubAccount = await getVirtualAccountByUserId(request.user._id);
            if (findSubAccount) {
                await VIRTUAL_SUB_ACCOUNTS.updateOne({ _id: findSubAccount._id }, outgoing);
            }
            else {
                res = new VIRTUAL_SUB_ACCOUNTS(outgoing);
                await res.save();
            }
            // lets create kyc or update it
            sendNotification({
                body: `bank name: ${createNewAccount.account.data.bank_name} \n <br/> account name: ${request.user.firstName} ${request.user.lastName} \n <br/>  account number: ${createNewAccount.account.data.account_number} \n <br/> account type: savings  account`,
                title: 'Account Created',
                nType: 'both',
                userId: request.user._id,
                type: 'success',
            });
        }
        return createNewAccount;
    }
    catch (error) {
        logger.error('failed to create virtual account', error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create virtual account');
    }
};
/**
 * ------------------------------------------------
 * fetch all virtual accounts for the admin access
 * -----------------------------------------------
 *
 * The function `queryVirtualAccounts` is a TypeScript function that queries virtual accounts based on
 * a filter and options, and returns a promise of a query result.
 * @param filter - The `filter` parameter is an object that contains the criteria for filtering the
 * virtual accounts. It can have any number of key-value pairs, where each key represents a field in
 * the virtual account and the corresponding value represents the desired value for that field. The
 * filter is used to retrieve only the virtual accounts
 * @param {IOptions} options - The `options` parameter is an object that contains additional options
 * for the query. It can have the following properties:
 * @returns a Promise that resolves to a QueryResult object.
 */
export const queryVirtualAccounts = async (filter, options) => {
    // Query virtual accounts
    const VirtualSubAccounts = await VIRTUAL_SUB_ACCOUNTS.paginate(filter, options);
    return VirtualSubAccounts;
};
const sanitizeVirtualAccount = (VirtualSubAccount) => {
    // Remove sensitive data from VirtualSubAccount object
    const sanitizedVirtualAccount = Object.assign({}, VirtualSubAccount);
    // Add more sanitization logic as needed
    return sanitizedVirtualAccount;
};
/**
 * The function `getVirtualAccountById` retrieves a virtual account by its ID and returns it after
 * sanitizing the data, or throws an error if the ID is invalid or the virtual account is not found.
 * @param id - The `id` parameter is of type `Types.ObjectId`. It is used to identify a specific
 * virtual account by its unique identifier.
 * @returns The function `getVirtualAccountById` returns a sanitized virtual account object if it
 * exists, otherwise it throws an error.
 */
export const getVirtualAccountById = async (id) => {
    if (!id) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid ID');
    }
    try {
        const VirtualSubAccount = await VIRTUAL_SUB_ACCOUNTS.findById(id);
        if (!VirtualSubAccount) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Virtual account not found');
            // or return a default value
            // return null;
        }
        const sanitizedVirtualAccount = sanitizeVirtualAccount(VirtualSubAccount);
        return sanitizedVirtualAccount;
    }
    catch (error) {
        // Handle the error here
        logger.error(' virtual account not found', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
};
/**
 * The function `getVirtualAccountByUserId` retrieves a virtual account based on a given user ID.
 * @param userId - The `userId` parameter is of type `Types.ObjectId`. It represents the unique
 * identifier of a user.
 * @returns the virtual account associated with the given userId.
 */
export const getVirtualAccountByUserId = async (userId) => {
    const getFiat = await fiatWalletService.getFiatWalletByUserIdAndCurrencyCode(userId, 'NGN');
    if (!getFiat) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Fiat Wallet not found');
    }
    const res = await VIRTUAL_SUB_ACCOUNTS.findOneAndUpdate({ userId }, { ledgerBalance: getFiat.balance }, { new: true }).select('-createdAt -updatedAt -__v -barterId -accountReferenceFlw -accRef -accFlwId -bvn -note -bvnData');
    return res;
};
export const updateVirtualAccount = async () => { };
/**
 * The function `deleteVirtualAccountById` deletes a virtual account by its ID and returns the deleted
 * account.
 * @param id - The `id` parameter is of type `Types.ObjectId`. It represents the unique identifier of
 * the virtual account that needs to be deleted.
 * @returns the deleted virtual account.
 */
export const deleteVirtualAccountById = async (id) => {
    try {
        const VirtualSubAccount = await VIRTUAL_SUB_ACCOUNTS.findByIdAndDelete(id);
        return VirtualSubAccount;
    }
    catch (error) {
        logger.error('failed to delete virtual account', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
};
/**
 * The function deletes a virtual account based on the user ID.
 * @param userId - The `userId` parameter is of type `Types.ObjectId`. It represents the unique
 * identifier of a user.
 * @returns the deleted virtual sub account.
 */
export const deleteVirtualAccountByUserId = async (userId) => {
    try {
        const VirtualSubAccount = await VIRTUAL_SUB_ACCOUNTS.findOneAndDelete({ userId });
        return VirtualSubAccount;
    }
    catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
};
/**
 * The function deletes a virtual account based on the user ID.
 * @param userId - The `userId` parameter is of type `Types.ObjectId`. It represents the unique
 * identifier of a user.
 * @returns the deleted virtual sub account.
 */
export const getSubAccountBalanceByUserId = async (userId) => {
    try {
        const virtualSubAccount = await VIRTUAL_SUB_ACCOUNTS.findOne({ userId });
        if (!virtualSubAccount)
            throw new ApiError(httpStatus.NOT_FOUND, 'Virtual account not found');
        const refId = virtualSubAccount.accountReferenceFlw;
        const balance = await balanceSubAccount({ account_reference: refId });
        virtualSubAccount.availableBalance = balance.data.available_balance;
        virtualSubAccount.ledgerBalance = balance.data.ledger_balance;
        virtualSubAccount.save();
        return balance;
    }
    catch (error) {
        logger.error('failed to get virtual account balance', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
};
/**
 * The function `getSubAccountTransactionByUserId` retrieves sub-account transactions for a given user
 * ID.
 * @param userId - The `userId` parameter is the unique identifier of a user. It is of type
 * `Types.ObjectId`, which is typically used in MongoDB to represent the unique identifier of a
 * document.
 * @param {ITransactionQueryParams} queryDate - The `queryDate` parameter is an object that contains
 * the query parameters for filtering the transactions. It could include properties such as `startDate`
 * and `endDate` to specify a date range for the transactions, or any other relevant parameters for
 * filtering the transactions.
 * @returns The function `getSubAccountTransactionByUserId` returns the result of the
 * `transactionsSubAccount` function call.
 */
export const getSubAccountTransactionByUserId = async (userId, queryDate) => {
    try {
        const virtualSubAccount = await VIRTUAL_SUB_ACCOUNTS.findOne({ userId });
        if (!virtualSubAccount)
            throw new ApiError(httpStatus.NOT_FOUND, 'Virtual account not found');
        const refId = virtualSubAccount.accountReferenceFlw;
        const trans = await transactionsSubAccount({ account_reference: refId }, queryDate);
        return trans;
    }
    catch (error) {
        logger.error('failed to get virtual account balance', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
    }
};
//# sourceMappingURL=service.virtual.js.map