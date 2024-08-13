import Flutterwave from '../../flutterwave';
import { CountryCodesEnum } from '../../flutterwave/interfaces/interface.flutterwave';
import logger from '../../logger/logger';
import config from '../../../config/config';
const flw = new Flutterwave(String(config.flutterwaveAPI.key), String(config.flutterwaveAPI.secret));
export const createTransfer = async (request) => {
    try {
        const createTrans = await flw.Transfers.initiateTransfer(request);
        return createTrans;
    }
    catch (error) {
        logger.error('failed to create transfer', error);
        throw error;
    }
};
export const getBanks = async (country = CountryCodesEnum.Nigeria) => {
    try {
        const createTrans = await flw.Transfers.getBanks(country);
        return createTrans;
    }
    catch (error) {
        logger.error('failed to get banks', error);
        throw new Error('failed to get banks');
    }
};
export const getBankBranches = async (id) => {
    try {
        const createTrans = await flw.Transfers.getBankBranches(id);
        return createTrans;
    }
    catch (error) {
        logger.error('failed to get bank branches', error);
        throw new Error('failed to get bank branches');
    }
};
export const verifyAccountNumber = async (payload) => {
    try {
        const data = Object.assign(Object.assign({}, payload), { country: CountryCodesEnum.Nigeria });
        const createTrans = await flw.Transfers.verifyBankAccount(data);
        return createTrans;
    }
    catch (error) {
        logger.error('failed to verify account', error);
        throw new Error('failed to verify account');
    }
};
export const createBulkTransfer = async (request) => {
    try {
        const createTrans = await flw.Transfers.bulk(request);
        return createTrans;
    }
    catch (error) {
        logger.error('failed to create bulk transfer', error);
        throw new Error('failed to create bulk transfer');
    }
};
export const getTransferById = async (transferId) => {
    try {
        const getTrans = await flw.Transfers.fetchTransferById({ id: transferId });
        return getTrans;
    }
    catch (error) {
        logger.error('failed to get transfer', error);
        throw new Error('failed to get transfer');
    }
};
export const getTransferFee = async (request) => {
    try {
        const getTransF = await flw.Transfers.fee(request);
        return getTransF;
    }
    catch (error) {
        logger.error('failed to get transfer fee', error);
        throw new Error('failed to get transfer fee');
    }
};
export const getAllTransfers = async (param) => {
    try {
        const getTrans = await flw.Transfers.getAllTransfers(param);
        return getTrans;
    }
    catch (error) {
        logger.error('failed to get transfer', error);
        throw new Error('failed to get transfer');
    }
};
export const walletToWallet = async (request) => {
    try {
        const getTrans = await flw.Transfers.walletToWallet(request);
        return getTrans;
    }
    catch (error) {
        logger.error('failed transfer to another wallet', error);
        throw new Error('failed to get transfer');
    }
};
export const retryTransfer = async (transferId) => {
    try {
        const getTrans = await flw.Transfers.retryTransfer({ id: transferId });
        return getTrans;
    }
    catch (error) {
        logger.error('failed to retry transfer', error);
        throw new Error('failed to retry transfer');
    }
};
//# sourceMappingURL=api.transfers.js.map