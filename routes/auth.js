import express from "express";
import { createHandler, loginHandler } from "../controllers/auth-controller.js";
import { checkAuth, isValidAdmin } from "../middleware/authorization.js";

const router = express.Router();

/* User Registration */
router.post("/register", [checkAuth, isValidAdmin], createHandler);
/* User Login */
router.post("/login", loginHandler);


export default router;
