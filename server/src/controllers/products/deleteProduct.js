import { PrismaClient } from "@prisma/client";
import { findUser } from "../../utils/findUser.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
const prisma = new PrismaClient();
export async function deleteProduct(req, res) {
  try {
    const { id: productId } = req.params;
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
        403,
        STANDARD_MESSAGES["FORBIDDEN"],
        { message: "Only admins can delete products" }
      );
    }
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return formatResponse(
        res,
        404,
        STANDARD_MESSAGES["NOT_FOUND"],
        { message: "Product not found" }
      );
    }
    await prisma.product.delete({ where: { id: productId } });
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["DELETE_SUCCESS"]
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
