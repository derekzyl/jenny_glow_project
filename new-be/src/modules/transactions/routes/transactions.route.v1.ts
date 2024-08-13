import { auth } from '@modules/auth';
import { validate } from '@modules/validate';
import express, { Router } from 'express';

import { transactionsController, transactionsValidation } from '..';
import { allPermissions } from '../../setting/roles';

const router: Router = express.Router();


router
  .route('/history')
  .get(
    auth(allPermissions.Transaction.Manage),
    validate(transactionsValidation.queryTransactionsSchema),
    transactionsController.getTransactions
  );

router
  .route('/:id/trx')
  .get(
    auth(allPermissions.Transaction.Manage),
    validate(transactionsValidation.queryTransactionsSchema),
    transactionsController.getTransaction
  );
router
  .route('/user/history')
  .get(
    auth(allPermissions.Transaction.Get),
    validate(transactionsValidation.queryTransactionsSchema),
    transactionsController.getUserTransactions
  );

router
  .route('/:id/user')
  .get(
    auth(allPermissions.Transaction.Get),
    validate(transactionsValidation.queryTransactionsSchema),
    transactionsController.getUserTransaction
  );


export default router;
