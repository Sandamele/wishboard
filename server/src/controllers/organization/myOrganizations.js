import { PrismaClient } from "@prisma/client";
import { serverError } from "../../utils/serverError.js";
import { findUser } from "../../utils/findUser.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
import { paginate } from "../../utils/paginate.js";
const prisma = new PrismaClient();
export async function myOrganizations(req, res) {
  try {
  const { page, pageSize } = req.query;
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
    const organizations = await paginate(
        prisma.organization.findMany,
        prisma.organization.count,
        {page, pageSize, where: { userId: id}}
    )
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["FETCH_SUCCESS"],
      organizations
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
