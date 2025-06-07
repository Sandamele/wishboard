import { body } from "express-validator";

export const forgotPasswordValidator = [
  body("otp").trim().notEmpty().withMessage("OTP is required"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
