const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    purchaseBook,
    getAllPurchased,
    getPurchasedById,
    getPurchasedByStudent,
    getPurchasedByBook,
    getPurchasesByDate,
    getTotalSales
} = require("../controllers/purchaseController");

router.post("/", verifyToken, purchaseBook);

router.get("/", verifyToken, getAllPurchased);

router.get("/student",verifyToken, getPurchasedByStudent);

router.get("/book", verifyToken, getPurchasedByBook);

router.get("/date", verifyToken, getPurchasesByDate);

router.get("/sales", verifyToken, getTotalSales);

router.get("/:id", verifyToken, getPurchasedById);

module.exports = router;