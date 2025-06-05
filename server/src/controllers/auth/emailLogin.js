import { formatResponse } from "../../utils/formatResponse.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
import { serverError } from "../../utils/serverError.js";
import { createSecureJWT } from "../../utils/createSecureJWT.js";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
export async function emailLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.provider !== "local") {
      return formatResponse(
        res,
        401,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        {
          message: "Either email or password is incorrect",
        }
      );
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );
    if (!passwordCorrect) {
      return formatResponse(
        res,
        401,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        {
          message: "Either email or password is incorrect",
        }
      );
    }

    const jwtPayload = {
      id: user.id,
      email: user.email,
      role: user.roles,
      provider: user.provider,
      isActive: user.isActive,
    };
    const token = createSecureJWT(jwtPayload);
    const decoded = jwt.decode(token);
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["FETCH_SUCCESS"],
      {
        login: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.roles,
          provider: user.provider,
        },
        jwt: token,
        jwtExpireAt: new Date(decoded.exp * 1000).toISOString(),
      }
    );
  } catch (error) {
    console.error("Email login error:", error);
    return serverError(res);
  }
}