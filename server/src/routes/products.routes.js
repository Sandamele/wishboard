import express from "express";
import { productValidator } from "../validators/product/productValidator.js";
import { validateRequest } from "../middleware/validationResult.js";
import { productController } from "../controllers/index.js";
import { rateLimit } from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})
const route = express.Router();
route.use(limiter)
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
