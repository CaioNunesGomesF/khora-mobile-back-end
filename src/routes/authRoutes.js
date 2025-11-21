import express from 'express';
import * as authController from '../controllers/authController.js';
import { registerRules, loginRules, validate } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerRules(), validate, authController.register);

router.post('/login', loginRules(), validate, authController.login);

router.post('/verify-2fa', authController.verifyTwoFactor);

router.post('/resend-2fa', authController.resendTwoFactorCode);

router.post("/request-password", authController.requestPasswordReset);

router.post("/verify-code-reset", authController.validatePasswordResetCode);

router.post("/reset-password", authController.resetPassword);

router.post("/resend-code-email", authController.resendCodeResetPassword);

export default router;
