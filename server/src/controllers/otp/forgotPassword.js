import bcrypt from "bcrypt";
import { formatResponse } from "../../utils/formatResponse.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function forgotPassword(req, res) {
  try {
    const { id: otp, password } = req.params;
    if (!otp) {
      return formatResponse(
        res,
        400,
        STANDARD_MESSAGES["BAD_REQUEST"],
        {
          message: "OTP are required.",
        }
      );
    }
    const otpRecord = await prisma.otp.findFirst({
      where: {
        token: otp,
        used: false,
        expiryDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!otpRecord) {
      return formatResponse(
        res,
        400,
        STANDARD_MESSAGES["BAD_REQUEST"],
        {
          message: "Invalid or expired OTP.",
        }
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: otpRecord.userId },
    });

    if (!user) {
      return formatResponse(
        res,
        404,
        STANDARD_MESSAGES["NOT_FOUND"],
        {
          message: "User not found.",
        }
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      data: {
        password: hashPassword,
      },
      where: { id: user.id },
    });
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["UPDATE_SUCCESS"],
      {
        message: "password updated successfully",
      }
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
