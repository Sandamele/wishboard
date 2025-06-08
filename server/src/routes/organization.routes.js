import express from "express";
import { organizationController } from "../controllers/index.js";
import { validateRequest } from "../middleware/validationResult.js";
import { addOrganizationValidator } from '../validators/organization/addOrganizationValidator.js';

const route = express.Router();
route.post("/", addOrganizationValidator, validateRequest,organizationController.addOrganization);
route.get("/", organizationController.findAllOrganizations);
route.get("/:id", organizationController.findOrganizations);
route.patch("/:id", organizationController.updateOrganization);
route.delete("/:id", organizationController.deleteOrganization);
export default route;