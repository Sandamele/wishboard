import bcrypt from "bcrypt";
import { formatResponse } from "../../utils/formatResponse.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
import { PrismaClient } from "@prisma/client";
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
