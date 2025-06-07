import { body } from "express-validator";

export const resetPasswordValidator = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required"),
  body("newPassword")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
