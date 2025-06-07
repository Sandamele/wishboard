import { formatResponse } from "../utils/formatResponse.js";
import { removeBearer } from "../utils/removeBearer.js";
import { serverError } from "../utils/serverError.js";
import { STANDARD_MESSAGES } from "../utils/statusMessage.js";
import { verifySecureJWT } from "../utils/verifySecureJWT.js";
export const authentication = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return formatResponse(
        res,
        401,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        { message: "You must be login to access this resource." }
      );
    }
    const token = removeBearer(req.headers.authorization);
    if (!token) {
      return formatResponse(
        res,
        401,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        {
          message: "You must be login to access this resource.",
        }
      );
    }
    const verifiedToken = verifySecureJWT(token);
    if (!verifiedToken) {
      return formatResponse(
        res,
        401,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        {
          message: "You must be login to access this resource.",
        }
      );
    }
    req.user = verifiedToken;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return formatResponse(
        res,
        401,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        {
          message: "Invalid token. Please login again.",
        }
      );
    } else if (error.name === "TokenExpiredError") {
      return formatResponse(
        res,
        401,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        {
          message: "Your session has expired. Please login again.",
        }
      );
    }
    return formatResponse(
      res,
      500,
      STANDARD_MESSAGES["SERVER_ERROR"],
      {
        message:
          "An error occurred during authentication. Please try again later.",
      }
    );
  }
};
