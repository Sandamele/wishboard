import { PrismaClient } from "@prisma/client";
import { formatResponse } from "../../utils/formatResponse.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
import { findUser } from "../../utils/findUser.js";
const prisma = new PrismaClient();
export async function updateOrganization(req, res) {
  try {
    const { id: organizationId } = req.params;
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
        { message: "Only admins can update organization" }
      );
    }
    const organization = await prisma.organization.findUnique({
      where: { id },
    });
    if (!organization) {
      return formatResponse(
        res,
        404,
        STANDARD_MESSAGES["NOT_FOUND"],
        { message: "Organization not found" }
      );
    }
    const updateOrganization = await prisma.organization.update({
      data: {
        name: req.body.name,
      },
      where: { id: organizationId },
    });
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["UPDATE_SUCCESS"],
      { ...updateOrganization }
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
