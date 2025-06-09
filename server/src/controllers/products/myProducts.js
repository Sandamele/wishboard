import { PrismaClient } from "@prisma/client";
import { serverError } from "../../utils/serverError.js";
import { paginate } from "../../utils/paginate.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { findUser } from "../../utils/findUser.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
const prisma = new PrismaClient();
export async function myProducts(req, res) {
  try {
    const { page, pageSize, search = "" } = req.query;
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
    const products = await paginate(
      prisma.product.findMany,
      prisma.product.count,
      {
        page: page || 1,
        pageSize: pageSize || 10,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          logoUrl: true,
        },
        where:
          search !== ""
            ? { name: { contains: search, mode: "insensitive" }, userId: id }
            : { userId: id},
      }
    );
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["FETCH_SUCCESS"],
      products
    );
  } catch (error) {
    console.error(error)
    return serverError(res);
  }
}
