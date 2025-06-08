import { PrismaClient } from "@prisma/client";
import { serverError } from "../../utils/serverError.js";
import { findUser } from "../../utils/findUser.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
const prisma = new PrismaClient();
export async function deleteOrganization(req, res) {
  try {
    const { id: organizationId } = req.params;
    const { id: userId } = req.user;
    const user = await findUser({ id: userId });
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
        { message: "Only admins can delete organization" }
      );
    }
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
        userId,
      },
    });
    if (!organization) {
      return formatResponse(
        res,
        404,
        STANDARD_MESSAGES["NOT_FOUND"],
        { message: "Organization not found" }
      );
    }
    const productExist = await prisma.product.findFirst({
      where: {
        userId,
        organizationId
      }
    })
    if (productExist) {
      return formatResponse(
        res,
        409,
        STANDARD_MESSAGES["CONFLICT"],
        { message: "Cannot delete organization with existing products. Please remove associated products first." }
      );
    }
    await prisma.organization.delete({
      where: {
        id: organizationId,
        userId,
      }
    })
    return formatResponse(res, 200, STANDARD_MESSAGES["DELETE_SUCCESS"])
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
