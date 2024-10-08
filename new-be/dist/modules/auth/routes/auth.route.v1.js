import { validate } from '../../validate';
import express from 'express';
import { auth, authController, authValidation } from '..';
const router = express.Router();
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
router.post('/check-email-existence', validate(authValidation.checkIfEmailExist), authController.checkEmailExistence);
export default router;
//# sourceMappingURL=auth.route.v1.js.map