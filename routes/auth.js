import express from "express";
import { createHandler, loginHandler } from "../controllers/auth-controller.js";

const router = express.Router();

/* User Registration */
router.post("/register", createHandler);
/* User Login */
router.post("/login", loginHandler);


export default router;
