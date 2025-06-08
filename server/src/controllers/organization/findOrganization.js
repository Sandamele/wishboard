import { PrismaClient } from "@prisma/client";
import { formatResponse } from "../../utils/formatResponse.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
const prisma = new PrismaClient();
export async function findOrganizations(req, res) {
  try {
    const { id } = req.params;
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
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["FETCH_SUCCESS"],
      organization
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
