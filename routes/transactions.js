import express from "express"
import { checkAuth, isValidAdmin } from "../middleware/authorization.js";
import { fetchHandler, createHandler, updateHandler, deleteHandler } from '../controllers/book-transaction-controller.js';

const router = express.Router()

router.get("/all-transactions", [checkAuth], fetchHandler);

// Create book request transaction
router.post("/add-transaction", [checkAuth, isValidAdmin], createHandler);

/* Update book request transaction */
router.put("/update-transaction/:recordId", [checkAuth, isValidAdmin], updateHandler);

/* Remove book request transactioin */
router.delete("/delete-transaction/:recordId", [checkAuth, isValidAdmin], deleteHandler)


export default router