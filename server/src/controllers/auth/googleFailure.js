import { formatResponse } from "../../utils/formatResponse.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";

export function googleFailure(req, res) {
  const messages = req.session?.messages || [];

  req.session.messages = [];

  return formatResponse(res, 401, STANDARD_MESSAGES["BAD_REQUEST"], {
    success: false,
    message:
      messages.length > 0
        ? messages[0]
        : "Google authentication failed.",
  });
}
