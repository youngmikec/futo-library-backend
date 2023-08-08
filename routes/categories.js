import express from "express";
import BookCategory from "../models/BookCategory.js";
import { checkAuth, isValidAdmin } from "../middleware/authorization.js";
import { fetchCategoryHandler, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } from '../controllers/categories-controller.js'

const router = express.Router();

router.get("/allBookcategories", [checkAuth], fetchCategoryHandler);

router.post("/addBookcategory", [checkAuth, isValidAdmin], createCategoryHandler);

/* Update book */
router.put("/updateBookCategory/:recordId", [checkAuth, isValidAdmin], updateCategoryHandler);

/* Remove book  */
router.delete("/deleteBookCategory/:recordId", [checkAuth, isValidAdmin], deleteCategoryHandler)

export default router;
