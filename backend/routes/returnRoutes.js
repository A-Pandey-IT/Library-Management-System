const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    returnBook,
    getReturnedBooks
} = require("../controllers/returnController");

router.post("/", verifyToken, returnBook);

router.get("/", getReturnedBooks);

module.exports = router;