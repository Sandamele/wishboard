import jwt from "jsonwebtoken";
import { createSecureJWT } from "../../utils/createSecureJWT.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";

export function handleGoogleCallback(req, res) {
  const authType = req.session?.authType || "login";

  delete req.session?.authType;
  delete req.session?.role;

  if (authType === "register") {
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["CREATE_SUCCESS"],
      {
        register: true,
      }
    );
  }
  delete req.user.googleId;
  delete req.user.password;
  const jwtPayload = {
    id: req.user.id,
    email: req.user.email,
    role: req.user.roles,
    provider: req.user.provider,
    isActive: req.user.isActive,
  };
  const token = createSecureJWT(jwtPayload);
  const decoded = jwt.decode(token);
  return formatResponse(res, 200, STANDARD_MESSAGES["FETCH_SUCCESS"], {
    login: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.roles,
      provider: req.user.provider,
    },
    jwt: token,
    jwtExpireAt: new Date(decoded.exp * 1000).toISOString(),
  });
}
