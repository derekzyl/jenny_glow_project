import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
import { cryptoTransactionsController, cryptoTransactionsValidation, fiatTransactionsController, fiatTransactionsValidation, } from '..';
import { allPermissions } from '../../setting/roles';
const router = express.Router();
// TODO: fix the permissions (user cannot access certain routes)
// has a security flaw (a user can see the transactions of another wallet if they send the walletId)
// i.e they act as admins in this scenario
// Fiat
router
    .route('/fiat/verify-payment')
    .get(auth(allPermissions.Transactions.Get), validate(fiatTransactionsValidation.verifyPaymentTransaction), fiatTransactionsController.verifyPaymentTransaction);
router
    .route('/fiat/history')
    .get(auth(allPermissions.Transactions.Manage), validate(fiatTransactionsValidation.getFiatTransactions), fiatTransactionsController.getFiatTransactions);
router
    .route('/fiat/:transactionId')
    .get(auth(allPermissions.Transactions.Manage), validate(fiatTransactionsValidation.getFiatTransaction), fiatTransactionsController.getFiatTransaction);
router
    .route('/fiat/user/history')
    .get(auth(allPermissions.Transactions.Get), validate(fiatTransactionsValidation.getFiatTransactions), fiatTransactionsController.getUserFiatTransactions);
router
    .route('/fiat/:transactionId/user')
    .get(auth(allPermissions.Transactions.Get), validate(fiatTransactionsValidation.getFiatTransaction), fiatTransactionsController.getUserFiatTransaction);
// Crypto
router
    .route('/crypto')
    .get(auth(allPermissions.Transactions.Manage), validate(cryptoTransactionsValidation.getCryptoTransactions), cryptoTransactionsController.getCryptoTransactions);
router
    .route('/crypto/:transactionId')
    .get(auth(allPermissions.Transactions.Manage), validate(cryptoTransactionsValidation.getCryptoTransaction), cryptoTransactionsController.getCryptoTransaction);
router
    .route('/crypto/user/history')
    .get(auth(allPermissions.Transactions.Get), validate(cryptoTransactionsValidation.getCryptoTransactions), cryptoTransactionsController.getCryptoTransactionsByUserId);
router
    .route('/crypto/:transactionId/user')
    .get(auth(allPermissions.Transactions.Get), validate(cryptoTransactionsValidation.getCryptoTransaction), cryptoTransactionsController.getCryptoTransactionByUserId);
export default router;
//# sourceMappingURL=transactions.route.v1.js.map