import { PrismaClient } from "@prisma/client";
import { createSecureJWT } from "../../utils/createSecureJWT.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
const prisma = new PrismaClient();
export async function verifyOtp(req, res) {
  try {
    const otp = req.params.id;
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
      return formatResponse(res, 404, STANDARD_MESSAGES["NOT_FOUND"], {
        message: "User not found.",
      });
    }

    // OTP is valid – return success or issue a reset token
    return formatResponse(res, 200, STANDARD_MESSAGES["SUCCESS"], {
      message: "OTP verified successfully.",
      jwt: createSecureJWT({ id: user.id }, "10m"),
    });
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}