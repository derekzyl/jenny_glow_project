import { auth } from '../../auth';
import { Router } from 'express';
import { allPermissions } from '../../setting/roles';
import { validate } from '../../validate';
import { refController, refValidation } from '..';
const router = Router();
router
    .route('/referral/')
    .post(auth(), validate(refValidation.createReferral), refController.createReferral)
    .get(auth(allPermissions.Referrals.GetRef), refController.getAllReferrals);
router
    .route('/referral/:referralId')
    .get(auth(allPermissions.Referrals.GetRef), validate(refValidation.getReferral), refController.getReferral)
    .patch(auth(allPermissions.Referrals.ManageRef), validate(refValidation.updateReferral), refController.updateReferral)
    .delete(auth(allPermissions.Referrals.ManageRef), validate(refValidation.deleteReferral), refController.deleteReferral);
router.route('/referral/get/user').get(auth(), refController.getReferralByUserId);
router.route('/refbonus/').post(auth(), refController.createRefBonus).get(auth(), refController.getAllRefBonus);
router.route('/refbonus/:userId').get(auth(), refController.getRefBonus);
router
    .route('/refbonus/id/:refId')
    .get(auth(), refController.getRefBonusById)
    .delete(auth(), refController.deleteRefBonusById);
router.route('/reftrans/').post(auth(), refController.createRefTransaction).get(auth(), refController.getAllRefTransactions);
router.route('/reftrans/user/id').get(auth(), refController.getRefTransaction);
router
    .route('/reftrans/id/:refId')
    .get(auth(), refController.getRefTransactionById)
    .delete(auth(), refController.deleteRefTransactionById);
router.route('/refuser/').post(auth(), refController.addToUserRefs).get(auth(), refController.getAllUserRefs);
router.route('/refuser/user/id').get(auth(), refController.getUserRefs);
router.route('/refuser/id/:refId').get(auth(), refController.getUserRefById).delete(auth(), refController.deleteUserRefById);
router.route('/refuser/update-total-amount').patch(auth(), refController.updateUserRefTotalAmount);
export default router;
//# sourceMappingURL=referral.route.v1.js.map