const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    getDashboardStats,
    getRecentTransactions,
    getLowStockBooks
} = require("../controllers/dashboardController");

router.get("/status", verifyToken, getDashboardStats);

router.get("/recent-transactions", verifyToken, getRecentTransactions);

router.get("/low-stock", verifyToken, getLowStockBooks);

module.exports = router;