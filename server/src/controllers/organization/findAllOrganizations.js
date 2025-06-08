import { PrismaClient } from "@prisma/client";
import { serverError } from "../../utils/serverError.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
import { paginate } from "../../utils/paginate.js";
const prisma = new PrismaClient();
export async function findAllOrganizations(req, res) {
  const { page, pageSize } = req.query;
  try {
    const organization = await paginate(
      prisma.organization.findMany,
      prisma.organization.count,
      {
        page: page || 1,
        pageSize: pageSize || 10,
        select: {
          id: true,
          name: true,
        },
      }
    );
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["FETCH_SUCCESS"],
      organization.data
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
