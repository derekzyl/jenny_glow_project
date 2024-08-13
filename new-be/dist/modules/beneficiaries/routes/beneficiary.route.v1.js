import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
import { beneficiaryController, beneficiaryValidator } from '..';
const router = express.Router();
router
    .route('/')
    .post(auth(), validate(beneficiaryValidator.createBeneficiaries), beneficiaryController.createBeneficiariesController)
    .get(auth(), validate(beneficiaryValidator.getManyBeneficiary), beneficiaryController.getManyBeneficiaryController);
router
    .route('/:id')
    .get(auth(), validate(beneficiaryValidator.getBeneficiary), beneficiaryController.getOneBeneficiaryByIdController)
    .delete(auth(), beneficiaryController.deleteOneBeneficiaryByIdController);
router
    .route('/user/get')
    .get(auth(), validate(beneficiaryValidator.getBeneficiary), beneficiaryController.getManyBeneficiaryByUserIdController);
export default router;
//# sourceMappingURL=beneficiary.route.v1.js.map