import { body } from "express-validator";
export const registerValidator = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("username")
    .isLength({ min: 3 })
    .withMessage("Enter a username"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("roles")
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
];
