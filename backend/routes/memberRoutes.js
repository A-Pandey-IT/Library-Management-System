const express = require("express");

const router = express.Router();

const verifyMemberToken =
require("../middleware/memberMiddleware");

const {
    loginMember,
    changeUserPassword,
    getProfile,
    getMyIssues,
    getMyTransactions
} = require("../controllers/memberController");

router.post("/login", loginMember);

router.put(
    "/changeUserPassword",
    (req, res, next) => {
        console.log("Reached member change password route");
        next();
    },
    verifyMemberToken,
    changeUserPassword
);

router.get("/profile", verifyMemberToken, getProfile);

router.get("/issues", verifyMemberToken, getMyIssues);

router.get("/transactions", verifyMemberToken, getMyTransactions);

module.exports = router;