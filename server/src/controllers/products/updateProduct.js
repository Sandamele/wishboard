import { PrismaClient } from "@prisma/client";
import { findUser } from "../../utils/findUser.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { generateSlug } from "../../utils/generateSlug.js";
const prisma = new PrismaClient();
export async function updateProduct(req, res) {
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
        { message: "Only admins can update products" }
      );
    }
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        userId,
      },
    });
    if (!product) {
      return formatResponse(
        res,
        404,
        STANDARD_MESSAGES["NOT_FOUND"],
        { message: "Product not found" }
      );
    }
    const { name, description, logoUrl } = req.body;
    const data = {
      ...(name && { name, slug: generateSlug(name) }),
      ...(description && { description }),
      ...(logoUrl && { logoUrl }),
    };
    const updateProduct = await prisma.product.update({
      data,
      where: { id: productId },
    });
    return formatResponse(
      res,
      200,
      STANDARD_MESSAGES["UPDATE_SUCCESS"],
      { ...updateProduct }
    );
  } catch (error) {
    console.error(error);
    return serverError(res);
  }
}
