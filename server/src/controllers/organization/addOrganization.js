import { PrismaClient } from "@prisma/client";
import { findUser } from "../../utils/findUser.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
const prisma = new PrismaClient()
export async function addOrganization(req, res) {
  try {
    const { id } = req.user;
    const user = await findUser({ id });
    if (!user) {
      return formatResponse(
        res,
        401,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        {
          message: "Invalid user",
        }
      );
    }

    if (user.roles !== "admin") {
      return formatResponse(
        res,
        401,
        STANDARD_MESSAGES["UNAUTHORIZED"],
        { message: "Only admins can create organization" }
      );
    }

    const saveOrganization = await prisma.organization.create({
        data: {
            name: req.body.name,
            userId: user.id,
        }
    })
    return formatResponse(
        res, 
        200, 
        STANDARD_MESSAGES["CREATE_SUCCESS"],
        {...saveOrganization}
    )
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
