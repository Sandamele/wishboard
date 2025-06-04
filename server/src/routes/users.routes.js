import express from "express";
import registerWithEmail from "../controllers/users.controllers.js";

const router = express.Router();

router.post("/register/email", registerWithEmail);

export default router;
