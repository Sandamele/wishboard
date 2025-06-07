import { body } from "express-validator";

export const productValidator = [
  body("name")
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Enter vaild product name"),
  body("description")
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Enter product description"),
];
