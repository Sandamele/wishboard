import { validationResult } from "express-validator";
import { formatResponse } from "../utils/formatResponse.js";
import { formatValidationErrors } from "../utils/formatValidationErrors.js";
import { STANDARD_MESSAGES } from "../utils/statusMessage.js";

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return formatResponse(
      res,
      400,
      STANDARD_MESSAGES["BAD_REQUEST"],
      { validation: formatValidationErrors(errors.array()) }
    );
  }
  next();
}
