const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

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

router.get("/", getAllPurchased);

router.get("/student", getPurchasedByStudent);

router.get("/book", getPurchasedByBook);

router.get("/date", getPurchasesByDate);

router.get("/sales", getTotalSales);

router.get("/:id", getPurchasedById);

module.exports = router;