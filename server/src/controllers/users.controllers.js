import { formatResponse } from "../utils/formatResponse.js";
import { PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";
import { STANDARD_MESSAGES } from "../utils/statusMessage.js";
import { serverError } from "../utils/serverError.js";
import passport from "passport";
import { createSecureJWT } from "../utils/createSecureJWT.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../emailTemplates/otp.js";
const prisma = new PrismaClient();
export async function emailRegister(req, res) {
  try {
    const { email, username, password } = req.body;
    const emailExist = await prisma.user.findUnique({
      where: { email },
    });
    const usernameExist = await prisma.user.findUnique({
      where: { username },
    });

    const exist = {};
    if (emailExist !== null) exist.email = "Email alreay taken";
    if (usernameExist !== null)
      exist.username = "Username already taken";

    if (Object.keys(exist).length > 0) {
      return formatResponse(
        res,
        403,
        STANDARD_MESSAGES["BAD_REQUEST"],
        exist
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const data = {
      ...req.body,
      password: passwordHash,
      provider: "local",
    };
    const user = await prisma.user.create({
      data,
    });
    delete user.password;
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["CREATE_SUCCESS"]
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
export async function emailLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const incorrectCredentialMessage = formatResponse(
      res,
      404,
      STANDARD_MESSAGES["NOT_FOUND"],
      {
        message: "Either email or password is incorrect",
      }
    );

    if (!user || user.provider !== "local") {
      return incorrectCredentialMessage;
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );
    if (!passwordCorrect) {
      return incorrectCredentialMessage;
    }

    const jwtPayload = {
      id: user.id,
      email: user.email,
      role: user.roles,
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
export function googleRegister(req, res, next) {
  req.session.authType = "register";
  req.session.role = req.query.role || "user";

  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}

export function googleLogin(req, res, next) {
  req.session.authType = "login";

  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}

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

export const handleLogout = (req, res) => {
  req.logout(() => res.redirect("/"));
};

export function googleFailure(req, res) {
  // Passport stores failure message in req.session.messages array
  const messages = req.session?.messages || [];
  // Clear messages so they don't persist
  req.session.messages = [];

  return res.status(401).json({
    success: false,
    message:
      messages.length > 0
        ? messages[0]
        : "Google authentication failed.",
  });
}

export async function getUser(req, res) {
  try {
    const { id } = req.user;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return formatResponse(
        res,
        403,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        { message: "Not authorized" }
      );
    }
    delete user.password;
    delete user.googleId;
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["FETCH_SUCCESS"],
      user
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}

export async function requestOtp(req, res) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return formatResponse(res, 404, STANDARD_MESSAGES["NOT_FOUND"], {
        message: "Email not found",
      });
    }
    if (user.provider === "google") {
      return formatResponse(
        res,
        400,
        STANDARD_MESSAGES["BAD_REQUEST"],
        { message: "Not allowed" }
      );
    }
    const generateOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    await prisma.otp.create({
      data: {
        userId: user.id,
        token: generateOtp,
        expiryDate: new Date(Date.now() + 10 * 60 * 1000)
      }
    })
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

export async function verifyOtp (req, res) {
  try {
    const otp = req.params.id;
    if (!otp) {
      return formatResponse(res, 400, STANDARD_MESSAGES["BAD_REQUEST"], {
        message: "OTP are required.",
      });
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
      return formatResponse(res, 400, STANDARD_MESSAGES["BAD_REQUEST"], {
        message: "Invalid or expired OTP.",
      });
    }
    const user = await prisma.user.findUnique({ where: { id: otpRecord.userId } });

    if (!user) {
      return formatResponse(res, 404, STANDARD_MESSAGES["NOT_FOUND"], {
        message: "User not found.",
      });
    }

    // Mark OTP as used
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // OTP is valid – return success or issue a reset token
    return formatResponse(res, 200, STANDARD_MESSAGES["SUCCESS"], {
      message: "OTP verified successfully.",
      jwt: createSecureJWT({id: user.id}, "10m")
    });
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}

export async function resetPassword (req, res) {
  try {
    const {id} = req.user;
    const { password } = req.body;
    const user = await prisma.user.findUnique({ where: { id}});
    if (!user) {
      return formatResponse(
        res, 
        404, 
        STANDARD_MESSAGES["NOT_FOUND"], 
        {message: "User not found"}
      )
    }
    const hashPassword = await bcrypt(password, 10);
    await prisma.user.update({
      data: {
        password: hashPassword
      },
      where: { id }
    })
    return formatResponse(
      res, 
      200, 
      STANDARD_MESSAGES["UPDATE_SUCCESS"], 
      {message: "password updated successfully"}
    )
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}