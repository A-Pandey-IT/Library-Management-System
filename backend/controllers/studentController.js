const db = require("../config/db");
const bcrypt = require("bcrypt");

/* ------------------------------------------
   Constants
------------------------------------------ */

const studentFields = `
    id,
    name,
    email,
    phone,
    max_books_allowed,
    created_at,
    is_active
`;

const DEFAULT_PASSWORD_SUFFIX = "@1234";

/* ------------------------------------------
   Helper Functions
------------------------------------------ */

const isValidId = (id) => {

    const number = Number(id);

    return Number.isInteger(number) && number > 0;

};

const isValidEmail = (email) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

};

const isValidPhone = (phone) => {

    return /^\d{10}$/.test(phone);

};

const generateDefaultPassword = (email) => {

    const username =
        email
            .trim()
            .split("@")[0];

    return `${username}${DEFAULT_PASSWORD_SUFFIX}`;

};

/* ------------------------------------------
   Get All Students
------------------------------------------ */

const getAllStudents = async (req, res) => {

    try {

        const [students] =
            await db.query(
                `
                SELECT
                    ${studentFields}
                FROM students
                ORDER BY id DESC
                `
            );

        return res.status(200).json({
            success: true,
            data: students
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error fetching students."
        });

    }

};

/* ------------------------------------------
   Search Students
------------------------------------------ */

const searchStudents = async (req, res) => {

    try {

        const {
            id,
            name,
            email,
            phone
        } = req.query;

        if (
            !id &&
            !name &&
            !email &&
            !phone
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Provide at least one search field."
            });

        }

        let query = `
            SELECT
                ${studentFields}
            FROM students
            WHERE 1 = 1
        `;

        const params = [];

        if (id) {

            if (!isValidId(id)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid student ID."
                });

            }

            query += " AND id = ?";

            params.push(Number(id));

        }

        if (name) {

            query +=
                " AND name LIKE ?";

            params.push(
                `%${name.trim()}%`
            );

        }

        if (email) {

            if (!isValidEmail(email)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid email."
                });

            }

            query +=
                " AND email LIKE ?";

            params.push(
                `%${email.trim()}%`
            );

        }

        if (phone) {

            if (!isValidPhone(phone)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Phone number must contain exactly 10 digits."
                });

            }

            query +=
                " AND phone LIKE ?";

            params.push(
                `%${phone.trim()}%`
            );

        }

        query +=
            " ORDER BY id DESC";

        const [students] =
            await db.query(
                query,
                params
            );

        if (
            students.length === 0
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "No students found."
            });

        }

        return res.status(200).json({
            success: true,
            data: students
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Error searching students."
        });

    }

};

/* ------------------------------------------
   Get Student By ID
------------------------------------------ */

const getStudentById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!isValidId(id)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid student ID."
            });

        }

        const [students] =
            await db.query(
                `
                SELECT
                    ${studentFields}
                FROM students
                WHERE id = ?
                `,
                [Number(id)]
            );

        if (students.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Student not found."
            });

        }

        return res.status(200).json({
            success: true,
            data: students[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Error fetching student."
        });

    }

};

/* ------------------------------------------
   Add Student
------------------------------------------ */

const addStudent = async (req, res) => {

    try {

        const {
            name,
            email,
            phone
        } = req.body;

        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Name is required."
            });

        }

        if (!email || !isValidEmail(email)) {

            return res.status(400).json({
                success: false,
                message: "Valid email is required."
            });

        }

        if (
            phone &&
            !isValidPhone(phone)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Phone number must contain exactly 10 digits."
            });

        }

        const defaultPassword =
            generateDefaultPassword(
                email
            );

            const hashedPassword =
                await bcrypt.hash(
                    defaultPassword,
                    10
                );

        const [result] =
            await db.query(
                `
                INSERT INTO students
                (
                    name,
                    email,
                    phone,
                    password,
                    is_active,
                    must_change_password
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    TRUE,
                    TRUE
                )
                `,
                [
                    name.trim(),
                    email.trim(),
                    phone?.trim() || null,
                    hashedPassword
                ]
            );

        return res.status(201).json({

            success: true,

            message:
                "Student added successfully.",

            studentId:
                result.insertId

        });

    } catch (error) {

        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Email already exists."

            });

        }

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Error adding student."

        });

    }

};

/* ------------------------------------------
   Update Student
------------------------------------------ */

const updateStudent = async (req, res) => {

    try {

        const { id } =
            req.params;

        if (!isValidId(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid student ID."

            });

        }

        const {
            name,
            email,
            phone,
            is_active,
            resetPassword
        } = req.body;

        const [students] =
            await db.query(
                `
                SELECT
                    id,
                    name,
                    email,
                    phone,
                    is_active
                FROM students
                WHERE id = ?
                `,
                [Number(id)]
            );

        if (
            students.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Student not found."

            });

        }

        const student =
            students[0];

        const updatedName =
            name
                ? name.trim()
                : student.name;

        const updatedEmail =
            email
                ? email.trim()
                : student.email;

        const emailChanged = 
        updatedEmail.trim().toLowerCase() !== 
        student.email.trim().toLowerCase();

        const updatedPhone =
            phone !== undefined
                ? (
                    phone?.trim() ||
                    null
                )
                : student.phone;

        const updatedStatus =
            typeof is_active ===
            "boolean"

                ? is_active

                : student.is_active;

        if (!updatedName) {

            return res.status(400).json({

                success: false,

                message:
                    "Name is required."

            });

        }

        if (
            !isValidEmail(
                updatedEmail
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Valid email is required."

            });

        }

        if (
            updatedPhone &&
            !isValidPhone(
                updatedPhone
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Phone number must contain exactly 10 digits."

            });

        }

        let query = 
            `
            UPDATE students
            SET
                name = ?,
                email = ?,
                phone = ?,
                is_active = ?
            `;

        const params =
            [
                updatedName,
                updatedEmail,
                updatedPhone,
                updatedStatus
            ]
        ;

        if(emailChanged && 
            resetPassword === true
        ){
            query += 
            `
                , password = ?,
                must_change_password = TRUE
            `;

            const defaultPassword =
                generateDefaultPassword(updatedEmail);

            const hashedPassword =
                await bcrypt.hash(defaultPassword, 10);

            params.push(hashedPassword);
        }

        query += ` WHERE id = ?`;

        params.push(Number(id));

        await db.query(query, params);

        return res.status(200).json({

            success: true,

            message:
                emailChanged && resetPassword
                ? "Student updated and password reset successfully."
                : "Student updated successfully."

        });

    } catch (error) {

        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Email already exists."

            });

        }

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Error updating student."

        });

    }

};

/* ------------------------------------------
   Delete Student
------------------------------------------ */


const deleteStudent = async (req, res) => {

    try {

        const { id } = req.params;

        if (!isValidId(id)) {

            return res.status(400).json({
                message: "Invalid student ID."
            });

        }

        const [issuedBooks] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM issued_books
            WHERE
                student_id = ?
                AND status = 'ISSUED'
            `,
            [Number(id)]
        );

        if (issuedBooks[0].total > 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Student has active issued books. Return all books first."
            });

        }

        const [result] = await db.query(
            `
            DELETE FROM students
            WHERE id = ?
            `,
            [Number(id)]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Student not found."
            });

        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error deleting student.",
            error: error.message
        });

    }

};



/* ------------------------------------------
   Reset Student Password
------------------------------------------ */

const resetStudentPassword = async (req, res) => {

    try {

        const { id } = req.params;

        if (!isValidId(id)) {

            return res.status(400).json({
                message: "Invalid student ID."
            });

        }

        const [students] = await db.query(
            `
            SELECT
                email
            FROM students
            WHERE id = ?
            `,
            [Number(id)]
        );

        if (students.length === 0) {

            return res.status(404).json({
                message: "Student not found."
            });

        }

        const defaultPassword =
            generateDefaultPassword(students[0].email);

            const hashedPassword =
            await bcrypt.hash(defaultPassword, 10);

        await db.query(
            `
            UPDATE students
            SET
                password = ?,
                must_change_password = TRUE
            WHERE id = ?
            `,
            [
                hashedPassword,
                Number(id)
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error resetting password.",
            error: error.message
        });

    }

};



module.exports = {

    getAllStudents,

    searchStudents,

    getStudentById,

    addStudent,

    updateStudent,
  
    deleteStudent,

    resetStudentPassword

};