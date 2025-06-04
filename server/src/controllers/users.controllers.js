import { formatResponse } from "../utils/formatResponse.js";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { STANDARD_MESSAGES } from "../utils/statusMessage.js";
const prisma = new PrismaClient();
export default async function registerWithEmail(req, res) {
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
    if (usernameExist !== null) exist.username = "Username already taken";

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
      provider: "email",
    };
    const user = await prisma.user.create({
      data,
    });
    delete user.password;
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["CREATE_SUCCESS"],
      user
    );
  } catch (error) {
    return formatResponse(res, 500, STANDARD_MESSAGES["SERVER_ERROR"]);
  }
}
