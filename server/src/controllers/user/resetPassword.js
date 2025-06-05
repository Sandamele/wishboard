import bcrypt from "bcrypt";
import { formatResponse } from "../../utils/formatResponse.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function resetPassword(req, res) {
  try {
    const { id, provider } = req.user;
    console.log(req.user);
    if (provider == "google") {
      return formatResponse(res, 403, STANDARD_MESSAGES["FORBIDDEN"], {
        message: "Oauth cannot reset password",
      });
    }
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return formatResponse(res, 404, STANDARD_MESSAGES["NOT_FOUND"], {
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return formatResponse(
        res,
        401,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        "Invalid current password"
      );
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      data: {
        password: hashPassword,
      },
      where: { id },
    });
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["UPDATE_SUCCESS"],
      { message: "Password updated" }
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}