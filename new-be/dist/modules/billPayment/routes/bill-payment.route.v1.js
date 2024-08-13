import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
import { billController, billValidation } from '..';
import { allPermissions } from '../../setting/roles';
const router = express.Router();
router
    .route('/')
    .post(auth(allPermissions.Bills.Create), validate(billValidation.createBillPayment), billController.createBillPayment)
    .get(auth(allPermissions.Bills.GetAll), validate(billValidation.getBillPayments), billController.getAllBillPaymentsByUserId);
router
    .route('/validate/bills')
    .get(auth(allPermissions.Bills.Get), validate(billValidation.validateBillPayment), billController.validateBillPaymentDetails);
router.route('/user/bills').get(auth(allPermissions.Bills.Get), 
/*  validate(), */
billController.getAllBillPaymentsByUserId);
router
    .route('/user/bills/:id')
    .get(auth(allPermissions.Bills.Get), validate(billValidation.getBillPayment), billController.getUserBillPayment);
router
    .route('all/bills/:id')
    .get(auth(allPermissions.Bills.GetAll), validate(billValidation.getBillPayment), billController.getBillPayment);
// for staffs and admins
router
    .route('/all/bills')
    .get(auth(allPermissions.Bills.GetAll), validate(billValidation.getBillPayments), billController.getAllBillPayments);
router
    .route('/billing-categories/bills')
    .get(auth(allPermissions.Bills.Get), validate(billValidation.getBillCategories), billController.getBillCategories);
export default router;
//# sourceMappingURL=bill-payment.route.v1.js.map