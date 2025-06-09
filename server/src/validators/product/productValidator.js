import { body } from "express-validator";

export const productValidator = [
  body("name")
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Enter vaild product name"),
  body("description")
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Enter product description"),
  body("organizationId")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Organization is required"),
];
