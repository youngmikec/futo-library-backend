import express from "express"
import Book from "../models/Book.js"
import BookCategory from "../models/BookCategory.js"
import { checkAuth, isValidAdmin } from "../middleware/authorization.js";
import { createHandler, deleteHandler, fetchHandler, fetchPulicHandler, updateHandler } from "../controllers/books-controller.js";

const router = express.Router()

/* Get all books in the db */
router.get("/allbooks/public", fetchPulicHandler);
router.get("/allbooks", [checkAuth], fetchHandler);

/* Get Book by book Id */
router.get("/getbook/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("transactions")
        res.status(200).json(book)
    }
    catch {
        return res.status(500).json(err)
    }
})

/* Get books by category name*/
router.get("/", async (req, res) => {
    const category = req.query.category
    try {
        const books = await BookCategory.findOne({ categoryName: category }).populate("books")
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

/* Adding book */
router.post("/addbook", [checkAuth, isValidAdmin], createHandler);

/* Addding book */
router.put("/updatebook/:recordId", [checkAuth, isValidAdmin], updateHandler);

/* Remove book  */
router.delete("/deletebook/:recordId", [checkAuth, isValidAdmin], deleteHandler)

export default router