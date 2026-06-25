const express = require("express");

const router = express.Router();

const verifyToken =
require("../middleware/authMiddleware");

const {
    getAllBooks,
    searchBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    getBookStats
} = require("../controllers/bookController");

router.get("/", getAllBooks)

router.get("/stats/summary", getBookStats);

router.get("/search", searchBooks);

router.get("/:id", getBookById);

router.post("/", verifyToken, addBook);

router.put("/:id", verifyToken, updateBook);

router.delete("/:id",verifyToken, deleteBook);


module.exports = router;

