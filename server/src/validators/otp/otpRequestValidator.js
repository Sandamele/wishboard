import { body } from "express-validator";

export const otpRequestValidator = [
    body("email").isEmail().withMessage("Enter valid email")
]