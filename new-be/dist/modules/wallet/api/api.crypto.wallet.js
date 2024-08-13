/* eslint-disable import/prefer-default-export */
import BitPwr from '../../bitpwr';
import config from '../../../config/config';
// const seed =
//   '14109019bf61f2b9290934469986b23dc8ea94a90b74dbcaa68ec5a03103c549fe5737ac803cf4a4e22564e387b03ee35b67d84f99c46f739504abb502782302';
// const cryptoPayments = new CryptoPayments(seed);
const bpwr = new BitPwr(String(config.bitpwr.key), String(config.bitpwr.secret));
// logger.info(cryptoPayments.getPublicConfig());
// // each exchange would also get payport too (optional)
// //! deprecated
// /**
//  * Create a customer's coin payport
//  * @param {ResolveablePayport} payPortId
//  * @param {SupportedCoinPaymentsSymbol} coinCode
//  * @returns {Promise<WalletResultAPI>}
//  * @deprecated use  createUserSubAccount() instead
//  */
// export const createDepositAddressAPI = async (
//   _payPortId: number,
//   _coinCode: SupportedCoinPaymentsSymbol
// ): Promise<WalletResultAPI | null> => {
//   // if (cryptoPayments.coinCode !== coinCode) {
//   //   if (!(await cryptoPayments.changeNetwork(coinCode))) {
//   //     throw new Error('error changing payments network');
//   //   }
//   // }
//   const { address, extraId } = { address: '', extraId: '' };
//   if (address.length !== 0) {
//     const wallet: WalletResultAPI = {
//       address,
//       extraId: !extraId || extraId === undefined ? '' : extraId,
//     };
//     return wallet;
//   }
//   return null;
// };
// //! deprecated
// /**
//  * Get wallet balance
//  * @param {ResolveablePayport} payPortId
//  * @param {SupportedCoinPaymentsSymbol} coinCode
//  * @returns {Promise<BalanceResultAPI>}
//  * @deprecated use getWalletAddressAccountBalance() instead
//  */
// export const getCoinBalanceAPI = async (
//   payPortId: ResolveablePayport,
//   coinCode: SupportedCoinPaymentsSymbol
// ): Promise<BalanceResultAPI> => {
//   try {
//     if (cryptoPayments.coinCode !== coinCode) {
//       if (!(await cryptoPayments.changeNetwork(coinCode))) {
//         throw new Error('error changing payments network');
//       }
//     }
//     const { confirmedBalance, unconfirmedBalance, spendableBalance } = await cryptoPayments.getBalance(payPortId);
//     const response: BalanceResultAPI = {
//       confirmedBalance,
//       unconfirmedBalance,
//       spendableBalance,
//     };
//     return response;
//   } catch (error) {
//     logger.error(`Error while fetching wallet balance: ${error}`);
//     throw new Error(`Error while fetching wallet balance: ${error}`);
//   }
// };
// check each payport for a confirmed balance
// after transaction has been confirmed init a sendSweepTransaction() to one of paypaddy's payport (liquidity pools) => [12345, 039994885]
// /**
//  * Check if Transaction is confirmed
//  * @param {string} txHash
//  * @param {SupportedCoinPaymentsSymbol} coinCode
//  * @returns {Promise<Boolean | null>}
//  */
// export const isTransactionConfirmedAPI = async (txHash: string, coinCode: SupportedCoinPaymentsSymbol): Promise<Boolean> => {
//   if (cryptoPayments.coinCode !== coinCode) {
//     if (!(await cryptoPayments.changeNetwork(coinCode))) {
//       throw new Error('error changing payments network');
//     }
//   }
//   const isConfirmed = await cryptoPayments.transactionIsConfirmed(txHash);
//   return isConfirmed;
// }; // TODO: add to scheduler, do the checking after every 5-10 mins | also getTransactionDetailsAPI()
// we would only check pending transactions
/**
 * Get Transaction details
 * @param {string} txHash
 * @param {SupportedCoinPaymentsSymbol} coinCode
 * @returns {Promise<Boolean | null>}
 */
// export const getTransactionDetailsAPI = async (
//   txHash: string,
//   coinCode: SupportedCoinPaymentsSymbol
// ): Promise<TransactionDetailsResultAPI> => {
//   if (cryptoPayments.coinCode !== coinCode) {
//     if (!(await cryptoPayments.changeNetwork(coinCode))) {
//       throw new Error('error changing payments network');
//     }
//   }
//   const txInfo = await cryptoPayments.transactionDetails(txHash);
//   const response: TransactionDetailsResultAPI = {
//     id: txInfo.id,
//     confirmations: txInfo.confirmations,
//     isConfirmed: txInfo.isConfirmed,
//     fee: txInfo.fee,
//     amount: txInfo.amount,
//     status: txInfo.status,
//     // add more
//   };
//   return response;
// };
/**
 * The function `simpleSendCryptoAPI` is an asynchronous function that sends a cryptocurrency
 * transaction using the Bitpwr API.
 *
 * @param coinCode The `coinCode` parameter is the symbol or code of the cryptocurrency you want to
 * send. It should be one of the supported coin symbols for the CoinPayments API.
 * @param payload The payload parameter is an object that contains the following properties:
 *
 * @return a Promise that resolves to a TransferCryptoBitpwrResponseI object.
 */
export const simpleSendCryptoAPI = async (payload) => {
    //! retired too
    // if (cryptoPayments.coinCode !== payload.coinCode) {
    //   if (!(await cryptoPayments.changeNetwork(payload.coinCode))) {
    //     throw new Error('error changing payments network');
    //   }
    // }
    // if (typeof payload.toAddress === 'string') {
    //   const isAddressCorrect = await cryptoPayments.isValidAddress(payload.toAddress);
    //   if (!isAddressCorrect) {
    //     throw new Error('invalid address');
    //   }
    // }
    try {
        const res = await bpwr.TransferBitpwr.makeTransferBitpwr({
            address: payload.toAddress,
            cryptoAmount: payload.toAmount,
            assetType: payload.coinCode,
            walletId: payload.accountId,
            fromAddress: payload.fromAddress,
            subAccountId: payload.subAccountId,
            description: payload.description,
        });
        //! retired this one but might come for it later
        //    const { id } = await cryptoPayments.sendSimpleTransaction(payPortId, toAddress, toAmount);
        // const txInfo = await cryptoPayments.transactionDetails(id);
        // const response: SendResultAPI = {
        //   id,
        //   confirmations: txInfo.confirmations,
        //   isConfirmed: txInfo.isConfirmed,
        //   status: txInfo.status,
        // };
        // return response;
        return res;
    }
    catch (error) {
        throw new Error(`error while sending transaction:' ${error}`);
    }
};
//# sourceMappingURL=api.crypto.wallet.js.map