const express = require("express");

const router = express.Router();

const {
    verifyToken,
    requireLibrarian
} = require("../middleware/authMiddleware");

const {
    registerAdmin,
    loginAdmin,
    sendOTP,
    changePassword,
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
    verifyToken,
    sendOTP
);

router.put(
    "/change-password",
    verifyToken,
    changePassword
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



