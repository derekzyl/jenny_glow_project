import { auth } from '../../auth';
import { MULTER_UPLOAD, formFileHandler } from '../../utils/file_handler/middleware.file';
import { validate } from '../../validate';
import express from 'express';
import { kycController, kycValidation } from '..';
import { allPermissions } from '../../setting/roles';
const router = express.Router();
// user
router
    .route('/applications')
    .post(auth(allPermissions.Users.UserOnly), validate(kycValidation.createKycUser), MULTER_UPLOAD.fields([
    { name: 'userPhoto', maxCount: 1 },
    { name: 'documentImage', maxCount: 1 },
]), formFileHandler([{ name: 'userPhoto' }, { name: 'documentImage' }]), kycController.createKycUserProfile)
    .get(auth(allPermissions.Users.UserOnly), validate(kycValidation.getKycUser), kycController.getKycUserProfile)
    .patch(auth(allPermissions.Users.UserOnly), validate(kycValidation.updateKycUser), MULTER_UPLOAD.fields([
    { name: 'userPhoto', maxCount: 1 },
    { name: 'documentImage', maxCount: 1 },
]), formFileHandler([{ name: 'userPhoto' }, { name: 'documentImage' }]), kycController.updateKycUserProfile);
router.route('/applications/user/kyc-status').get(auth(allPermissions.Users.UserOnly), kycController.getKycUserStatus);
router.route('/applications/user/check-if-kyc').get(auth(allPermissions.Users.UserOnly), kycController.getKycUserIfExist);
router
    .route('/applications/:userId/kycByUserId')
    .get(auth(allPermissions.Users.VerifyKyc), validate(kycValidation.getKycUser), kycController.getKycUserById);
// admin
router
    .route('applications/:kycId/verify')
    .patch(auth(allPermissions.Users.VerifyKyc), validate(kycValidation.updateKycUserVerificationStatus), kycController.updateKycUserVerificationStatus);
router
    .route('/applications/all/kycs')
    .get(auth(allPermissions.Users.VerifyKyc), validate(kycValidation.getKycUsers), kycController.getKycUsers);
router
    .route('/applications/:kycId/kyc-status')
    .get(auth(allPermissions.Users.VerifyKyc), validate(kycValidation.getKycUser), kycController.getKycUserStatusById);
router
    .route('/applications/:kycId/kyc')
    .get(auth(allPermissions.Users.VerifyKyc), validate(kycValidation.getKycUsers), kycController.getKycUserById);
router
    .route('/applications/:userId/kycByUserId')
    .get(auth(allPermissions.Users.VerifyKyc), validate(kycValidation.getKycUser), kycController.getKycUserById);
// router.route('/applications/all/kyc/count').get(auth(allPermissions.Users.VerifyKyc), validate(kycValidation.getKycUsersCount), kycController.)
export default router;
//# sourceMappingURL=kyc.route.v1.js.map