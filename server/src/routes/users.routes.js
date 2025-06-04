import express from "express";
import {
  emailRegister,
  getUser,
  googleFailure,
  googleLogin,
  googleRegister,
  handleGoogleCallback,
  requestOtp,
  resetPassword,
  verifyOtp,
} from "../controllers/users.controllers.js";
import passport from "passport";
import { authentication } from "../middleware/authentication.js";

const router = express.Router();

router.post("/auth/register/local", emailRegister);
router.get("/auth/register/google", googleRegister);
router.get("/auth/login/google", googleLogin);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/users/auth/google/failture",
    failureMessage: true,
  }),
  handleGoogleCallback
);
router.get("/auth/google/failture", googleFailure);
router.get("/me", authentication, getUser);
router.post("/otp", requestOtp)
router.get("/otp/verify/:id", verifyOtp)
router.post("/auth/forgot-password", authentication, resetPassword)
export default router;
