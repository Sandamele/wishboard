import { PrismaClient } from "@prisma/client";
import { formatResponse } from "../../utils/formatResponse.js";
import { serverError } from "../../utils/serverError.js";
import { STANDARD_MESSAGES } from "../../utils/statusMessage.js";
import { findUser } from "../../utils/findUser.js";
import { generateSlug } from "../../utils/generateSlug.js";
const prisma = new PrismaClient();
export async function addProduct(req, res) {
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
        { message: "Only admins can add products" }
      );
    }

    const organization = await prisma.organization.findUnique({where: { id:req.body.organizationId, userId: id}});
    if(!organization) {
      return formatResponse(
        res,
        404,
        STANDARD_MESSAGES["NOT_FOUND"],
        { message: "Organization not found" }
      );
    }

    let attempts = 0;
    let product = null;
    let success = false;

    while (!success && attempts < 5) {
      const slug = generateSlug(req.body.name);
      const data = { ...req.body, userId: id, slug };

      try {
        product = await prisma.product.create({ data });
        success = true;
      } catch (error) {
        if (
          error.code === "P2002" &&
          error.meta &&
          error.meta.target &&
          error.meta.target.includes("slug")
        ) {
          attempts++;
        } else {
          throw error;
        }
      }
    }

    if (!success) {
      return formatResponse(
        res,
        500,
        STANDARD_MESSAGES["SERVER_ERROR"],
        {
          message:
            "Could not generate a unique slug after several attempts.",
        }
      );
    }

    return formatResponse(
      res,
      201,
      STANDARD_MESSAGES["CREATE_SUCCESS"],
      { ...product }
    );
  } catch (error) {
    console.error(error);
    return serverError;
  }
}
