import { PrismaClient } from "@prisma/client";
import { otpEmailTemplate } from "../../emailTemplates/otp.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
const prisma = new PrismaClient();
export async function requestOtp(req, res) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return formatResponse(res, 404, STANDARD_MESSAGES["NOT_FOUND"], {
        message: "Email not found",
      });
    }
    const generateOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    await prisma.otp.create({
      data: {
        userId: user.id,
        token: generateOtp,
        expiryDate: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    const emailSent = await sendEmail(
      email,
      "Password Reset OTP",
      otpEmailTemplate(
        generateOtp,
        "Password Reset Code",
        "Password Reset Request",
        "We received a request to reset your password. Use the OTP code below to continue. It will expire in 10 minutes."
      )
    );
    if (!emailSent.send) {
      console.log(emailSent.error);
      return formatResponse(
        res,
        400,
        STANDARD_MESSAGES["BAD_REQUEST"],
        { error: emailSent.error }
      );
    }
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["CREATE_SUCCESS"],
      { message: "Email sent" }
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}