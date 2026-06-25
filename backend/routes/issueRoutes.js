const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    issueBook,
    getIssuedBooks,
    getActiveIssuedBooks,
    getIssuedBooksByMember,
    getIssuedBooksByBook,
    getIssueById
} = require("../controllers/issueController");

router.post("/", verifyToken, issueBook);

router.get("/", getIssuedBooks);

router.get("/active", getActiveIssuedBooks);

router.get("/member", getIssuedBooksByMember);

router.get("/book", getIssuedBooksByBook);

router.get("/:id", getIssueById);

module.exports = router;

