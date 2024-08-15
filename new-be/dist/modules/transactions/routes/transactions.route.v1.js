import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
import { transactionsController, transactionsValidation } from '..';
import { allPermissions } from '../../setting/roles';
const router = express.Router();
router
    .route('/history')
    .get(auth(allPermissions.Transaction.Manage), validate(transactionsValidation.queryTransactionsSchema), transactionsController.getTransactions);
router
    .route('/:id/trx')
    .get(auth(allPermissions.Transaction.Manage), validate(transactionsValidation.queryTransactionsSchema), transactionsController.getTransaction);
router
    .route('/user/history')
    .get(auth(allPermissions.Transaction.Get), validate(transactionsValidation.queryTransactionsSchema), transactionsController.getUserTransactions);
router
    .route('/:id/user')
    .get(auth(allPermissions.Transaction.Get), validate(transactionsValidation.queryTransactionsSchema), transactionsController.getUserTransaction);
export default router;
//# sourceMappingURL=transactions.route.v1.js.map