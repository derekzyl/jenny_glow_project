import Flutterwave from '../../flutterwave';
import logger from '../../logger/logger';
import config from '../../../config/config';
const flw = new Flutterwave(String(config.flutterwaveAPI.key), String(config.flutterwaveAPI.secret));
/**
 * Transaction Verification API
 * @param {string} id
 * @returns {Promise<VerifyTransactionResponse>}
 */
const verifyTransactionAPI = async (id) => {
    try {
        const idPayload = {
            id,
        };
        const data = await flw.Transactions.verify(idPayload);
        return data;
    }
    catch (error) {
        logger.error(`Failed to verify transaction: ${error}`);
        throw new Error(`Failed to verify transaction: ${error}`);
    }
};
// eslint-disable-next-line import/prefer-default-export
export { verifyTransactionAPI };
//# sourceMappingURL=api.fiat.transactions.js.map