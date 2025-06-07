import express from "express";
import { productValidator } from "../validators/product/productValidator.js";
import { validateRequest } from "../middleware/validationResult.js";
import { productController } from "../controllers/index.js";

const route = express.Router();

route.post(
  "/",
  productValidator,
  validateRequest,
  productController.addProduct
);
route.get("/", productController.findAllProducts);
route.get("/:id", productController.findProduct);
route.patch("/:id", productController.updateProduct);
route.delete("/:id", productController.deleteProduct);
// route.get("/user", productController.findAllProducts);
export default route;
