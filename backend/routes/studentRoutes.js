const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getAllStudents,
    searchStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

router.get("/", getAllStudents);

router.get("/search", searchStudents);

router.get("/:id", getStudentById);

router.post("/", verifyToken, addStudent);

router.put("/:id", verifyToken, updateStudent);

router.delete("/:id", verifyToken, deleteStudent);

module.exports = router;

