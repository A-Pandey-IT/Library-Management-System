const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    getAllTransactions,
    getTransactionsByStudent,
    getTransactionsByBook,
    getTransactionsByType,
    getTransactionById
} = require("../controllers/transactionController");

router.get("/", verifyToken, getAllTransactions);

router.get("/student", verifyToken, getTransactionsByStudent);

router.get("/book", verifyToken, getTransactionsByBook);

router.get("/type", verifyToken, getTransactionsByType);

router.get("/:id", verifyToken, getTransactionById);



module.exports = router;

