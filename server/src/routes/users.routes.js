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

const router = express.Router();

router.post("/auth/register/local", registerValidator, validateRequest, authController.emailRegister);
router.post("/auth/login/local", authController.emailLogin);
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
router.post("/otp", otpController.requestOtp);
router.get("/otp/verify/:id", otpController.verifyOtp);
router.post("/auth/forgot-password", otpController.forgotPassword);
router.post(
  "/auth/reset-password",
  authentication,
  userController.resetPassword
);
export default router;
