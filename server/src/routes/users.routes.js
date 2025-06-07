import express from "express";
import passport from "passport";
import { authentication } from "../middleware/authentication.js";
import {
  authController,
  otpController,
  userController,
} from "../controllers/index.js";
import { registerValidator } from "../validators/auth/registerValidator.js";
import { validateRequest } from "../middleware/validationResult.js";
import { loginValidator } from "../validators/auth/loginValidator.js";
import { forgotPasswordValidator } from "../validators/otp/forgotPasswordValidator.js";
import { otpRequestValidator } from "../validators/otp/otpRequestValidator.js";
import { resetPasswordValidator } from "../validators/auth/resetPasswordValidator.js";
import { rateLimit } from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})
const router = express.Router();
router.use(limiter)
router.post(
  "/auth/register/local",
  registerValidator,
  validateRequest,
  authController.emailRegister
);
router.post(
  "/auth/login/local",
  loginValidator,
  validateRequest,
  authController.emailLogin
);
router.get("/auth/register/google", authController.googleRegister);
router.get("/auth/login/google", authController.googleLogin);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/users/auth/google/failture",
    failureMessage: true,
  }),
  authController.handleGoogleCallback
);
router.get("/auth/google/failture", authController.googleFailure);
router.get("/me", authentication, userController.getUser);
router.post(
  "/otp",
  otpRequestValidator,
  validateRequest,
  otpController.requestOtp
);
router.get("/otp/verify/:id", otpController.verifyOtp);
router.post(
  "/auth/forgot-password",
  forgotPasswordValidator,
  validateRequest,
  otpController.forgotPassword
);
router.post(
  "/auth/reset-password",
  authentication,
  resetPasswordValidator,
  validateRequest,
  userController.resetPassword
);
export default router;
