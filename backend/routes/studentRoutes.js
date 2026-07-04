const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    getAllStudents,
    searchStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
    resetStudentPassword
} = require("../controllers/studentController");

router.get("/", verifyToken, getAllStudents);

router.get("/search", verifyToken, searchStudents);

router.get("/:id", verifyToken, getStudentById);

router.post("/", verifyToken, addStudent);

router.put("/:id", verifyToken, updateStudent);

router.delete("/:id", verifyToken, deleteStudent);

router.put("/:id/reset-password", verifyToken, resetStudentPassword);

module.exports = router;

