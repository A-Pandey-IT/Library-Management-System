const express = require("express");

const router = express.Router();

const verifyMemberToken =
require("../middleware/memberMiddleware");

const verifyResetToken = require("../middleware/verifyResetToken");

const {
    loginMember,
    changeUserPassword,
    sendMemberOTP,
    verifyMemberOTP,
    resetMemberPassword,
    getProfile,
    getMyIssues,
    getMyTransactions
} = require("../controllers/memberController");

router.post("/login", loginMember);

router.put(
    "/changeUserPassword",
    verifyMemberToken,
    changeUserPassword
);

router.get("/profile", verifyMemberToken, getProfile);

router.post("/send-otp",sendMemberOTP);

router.post("/verify-otp", verifyMemberOTP);

router.put("/reset-password", verifyResetToken, resetMemberPassword);

router.get("/issues", verifyMemberToken, getMyIssues);

router.get("/transactions", verifyMemberToken, getMyTransactions);

module.exports = router;