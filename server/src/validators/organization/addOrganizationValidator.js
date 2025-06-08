import { body } from "express-validator";

export const addOrganizationValidator = [
    body("name")
    .notEmpty()
    .escape()
    .withMessage("Organization name is required"),
]