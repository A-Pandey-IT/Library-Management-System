const express = require("express");

const router = express.Router();

const verifyToken =
require("../middleware/authMiddleware");

const {
    registerAdmin,
    loginAdmin,
    changePassword
} = require("../controllers/adminController");

router.post(
    "/register",
    verifyToken,
    registerAdmin
);

router.post(
    "/login",
    loginAdmin
);

router.put(
    "/change-password",
    verifyToken,
    changePassword
);

module.exports = router;