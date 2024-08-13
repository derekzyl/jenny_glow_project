import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
import { allPermissions } from '../../setting/roles';
import { transferController, transferValidation } from '..';
const router = express.Router();
router
    .route('/create-transfer')
    .post(auth( /* Specify required permissions */), validate(transferValidation.createTransferServiceValidation), transferController.createTransferServiceController);
router
    .route('/verify-account-number')
    .post(auth( /* Specify required permissions */), validate(transferValidation.verifyAccountNumberServiceValidation), transferController.verifyAccountNumberServiceController);
router
    .route('/get-banks')
    .get(auth( /* Specify required permissions */), validate(transferValidation.getBanksServiceValidation), transferController.getBanksServiceController);
router
    .route('/get-one-bank/:bankCode')
    .get(auth( /* Specify required permissions */), validate(transferValidation.getOneBankServiceValidation), transferController.getOneBankServiceController);
router
    .route('/get-bank-branches/:bankId')
    .get(auth(), validate(transferValidation.getBankBranchesServiceValidation), transferController.getBankBranchesServiceController);
router
    .route('/create-bulk-transfer')
    .post(auth(allPermissions.SuperAdmin /* Specify required permissions */), validate(transferValidation.createBulkTransferServiceValidation), transferController.createBulkTransferController);
router
    .route('/get-transfer-fee')
    .get(auth( /* Specify required permissions */), validate(transferValidation.getTransferFeeServiceValidation), transferController.getTransferFeeController);
router
    .route('/get-all-transfers')
    .get(auth(allPermissions.SuperAdmin /* Specify required permissions */), validate(transferValidation.getAllTransfersFromFlwValidation), transferController.getAllTransfersController);
router
    .route('/get-transfer-by-id-from-flw/:transferId')
    .get(auth(allPermissions.SuperAdmin /* Specify required permissions */), validate(transferValidation.getTransferByIdFromFlwValidation), transferController.getTransferByIdController);
router
    .route('/get-transfer-by-id/:transferId')
    .get(auth( /* Specify required permissions */), validate(transferValidation.getTransferByIdServiceValidation), transferController.getTransferByIdServiceController);
router
    .route('/retry-transfer/:transferId')
    .post(auth( /* Specify required permissions */), validate(transferValidation.retryTransferServiceValidation), transferController.retryTransferController);
router
    .route('/user-transfer/:transferId')
    .get(auth( /* Specify required permissions */), validate(transferValidation.getTransferByIdFromFlwValidation), transferController.getUserTransferController);
router.route('/all-user-transfers').get(auth( /* Specify required permissions */), 
/*  validate(transferValidation.getAllUserTransfersValidation), */
transferController.getAllUserTransfersController);
// router
//   .route('/create-transfer-for-db-user')
//   .post(
//     auth(/* Specify required permissions */),
//     validate(transferValidation.createTransferForDbUserValidation),
//     transferController.createTransferForDbUserController
//   );
// router
//   .route('/update-transfer-with-ref/:referenceId')
//   .put(
//     auth(/* Specify required permissions */),
//     validate(transferValidation.updateTransferServiceWithRefValidation),
//     transferController.updateTransferWithRefController
//   );
// Add more routes for other controllers as needed
export default router;
//# sourceMappingURL=transfers.v1.js.map