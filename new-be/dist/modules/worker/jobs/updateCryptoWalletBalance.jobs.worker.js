import { cryptoCurrencyCodes } from '../../setting/currencies';
import { getCryptoWalletByUserIdAndCurrencyCode, queryCryptoWallets } from '../../wallet/services/service.crypto.wallet';
/**
 * update crypto wallet balance
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<QueryResult>}
 */
const updateCryptoBalance = async (userId, logger) => {
    try {
        // eslint-disable-next-line no-console
        console.log('userId => ', userId);
        Object.values(cryptoCurrencyCodes).forEach(async (currencyCode) => {
            // add a bypass for other coins
            if (currencyCode !== 'BTC') {
                return;
            }
            const wallet = await getCryptoWalletByUserIdAndCurrencyCode(userId, currencyCode);
            if (!wallet) {
                throw new Error('Error while fetching wallet');
            }
            // const coinCode = currencyCode as SupportedCoinPaymentsSymbol;
            // const balanceResult = await getCoinBalanceAPI(wallet.payPortId, coinCode);
            // const updateBody: UpdateHDWalletBody = {
            //   unconfirmedBalance: balanceResult.unconfirmedBalance,
            //   balance: balanceResult.spendableBalance,
            // };
            // wallet = await updateCryptoWalletById(wallet.id, currencyCode, updateBody);
            // if (!wallet) {
            //   throw new Error('Error while updating wallet balance');
            // }
            // get transactions and store it
            // const cryptoTx = await simpleSendCryptoAPI(
            //   wallet.payPortId,
            //   transactionPayload.toAddress,
            //   transactionPayload.amount,
            //   coinCode
            // );
            // if (!cryptoTx) {
            //   throw new ApiError(httpStatus.FAILED_DEPENDENCY, 'Error while sending crypto to address');
            // }
            // const transactionBody: NewCreatedCryptoTransaction = {
            //   userId: wallet.userId,
            //   walletId: wallet.id,
            //   type: allTransactionTypes.withdraw,
            //   txHash: cryptoTx.id,
            //   referenceId: `${new Date().getFullYear()}-${generateReference(16)}`,
            //   amount: Number(transactionPayload.amount),
            //   fromAddress: wallet.address,
            //   toAddress: transactionPayload.toAddress,
            //   isConfirmed: false,
            //   status: allTransactionStatus.failed,
            // };
            // return addNewCryptoPaymentTransaction(transactionBody);
        });
    }
    catch (error) {
        logger.error(`Error updating wallet balance: ${error}`);
        return false;
    }
    return true;
};
// Function to fetch all users balance and save in the database
async function updateAllCryptoWalletBalance(logger) {
    try {
        // fetch user from a db event
        const filter = {}; // Empty filter to get all currency pairs
        const options = {}; // No specific options needed
        // Call the queryCryptoWallets function to get all wallets
        const queryResults = await queryCryptoWallets(filter, options);
        const cryptoWallets = queryResults.results;
        cryptoWallets.forEach(async (cryptoWallet) => {
            if (!(await updateCryptoBalance(cryptoWallet.userId, logger))) {
                logger.info(`failed to updated wallet with id => ${cryptoWallet.id.toString()}`);
            }
        });
    }
    catch (error) {
        logger.error('Error updating wallet balance:', error);
    }
}
export default updateAllCryptoWalletBalance;
//# sourceMappingURL=updateCryptoWalletBalance.jobs.worker.js.map