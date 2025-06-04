import { formatResponse } from "./formatResponse.js";
import { STANDARD_MESSAGES } from "./statusMessage.js";

export const serverError = (res) => {
  return formatResponse(res, 500, STANDARD_MESSAGES["SERVER_ERROR"]);
};
