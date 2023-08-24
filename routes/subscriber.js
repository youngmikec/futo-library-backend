import express from "express";
import { checkAuth, isValidAdmin } from "../middleware/authorization.js";
import {
  fetchHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from "../controllers/Subscriber-controller.js";

const router = express.Router();

router.get("/subscribers", [checkAuth, isValidAdmin], fetchHandler);

router.post("/subscribers", createHandler);

router.put("/subscribers/:recordId", [checkAuth, isValidAdmin], updateHandler);

router.delete(
  "/subscribers/:recordId",
  [checkAuth, isValidAdmin],
  deleteHandler
);

export default router;