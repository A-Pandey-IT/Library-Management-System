const express = require("express");

const router = express.Router();

const {
    verifyToken,
    requireLibrarian
} = require("../middleware/authMiddleware");

const verifyResetToken = 
    require("../middleware/verifyResetToken");

const {
    registerAdmin,
    loginAdmin,
    sendOTP,
    verifyOTP,
    changePassword,
    resetPassword,
    deleteAdmin,
    getAllAdmins
} = require("../controllers/adminController");

router.post(
    "/register",
    verifyToken,
    requireLibrarian,
    registerAdmin
);

router.post(
    "/login",
    loginAdmin
);

router.post(
    "/send-otp",
    sendOTP
);

router.post(
    "/verify-otp",
    verifyOTP
);

router.put(
    "/change-password",
    verifyToken,
    changePassword
);

router.put(
    "/reset-password",
    verifyResetToken,
    resetPassword
);

router.delete(
"/:id",
verifyToken,
requireLibrarian,
deleteAdmin
);

router.get(
    "/",
    verifyToken,
    requireLibrarian,
    getAllAdmins
);

module.exports = router;