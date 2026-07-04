const express = require("express");

const router = express.Router();

const {
    verifyToken,
    requireLibrarian
} = require("../middleware/authMiddleware");

const {
    registerAdmin,
    loginAdmin,
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

/*
admin
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJ1c2VybmFtZSI6ImxpYnJhcmlhbiIsInJvbGUiOiJMSUJSQVJJQU4iLCJpYXQiOjE3ODMxNTYzMTQsImV4cCI6MTc4MzI0MjcxNH0.iFYaVxbOwmL8VIeC3BexE8Ve9cvqGlTjTJnABjKGxqc
*/