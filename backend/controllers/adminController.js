const bcrypt = require("bcrypt");
const db = require("../config/db");

const jwt = require("jsonwebtoken");

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const {
    generateOTP,
    getOTPExpiryTime
} = require("../utils/otpGenerator");

const {
    sendOTPEmail
} = require("../services/emailService");

const registerAdmin = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const usernameValue = username?.trim();
        const passwordValue = password?.trim();
        const adminRole =  role || "ADMIN";

        if (
            adminRole === "LIBRARIAN" &&
            req.admin.role !== "LIBRARIAN"
        ){
            return res.status(403).json({
                success:false,
                message:
                    "Only librarians can create another librarian."
            });
        }

        const allowedRoles = [
            "ADMIN",
            "LIBRARIAN"
        ];

        if (!allowedRoles.includes(adminRole)) {

            return res.status(400).json({
                success: false,
                message: "Invalid role."
            });

        }

        if (!usernameValue || !passwordValue) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        if (!passwordRegex.test(passwordValue)) {

            return res.status(400).json({
            success: false,
            message:
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        });

}

        const [existing] = await db.query(
            `
            SELECT id
            FROM admins
            WHERE username = ?
            `,
            [usernameValue]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(passwordValue, 10);

        const [result] = await db.query(
            `
            INSERT INTO admins
            (
                username,
                password,
                role
            )
            VALUES (?, ?, ?)
            `,
            [
                usernameValue,
                hashedPassword,
                adminRole
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                adminId: result.insertId,
                username: usernameValue,
                role: adminRole
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error registering admin",
            error: error.message
        });

    }
};


const loginAdmin = async (req, res) => {
    try {

        const { username, password } = req.body;

        const usernameValue = username?.trim();

        if (!usernameValue || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const [rows] = await db.query(
            `
            SELECT *
            FROM admins
            WHERE username = ?
            `,
            [usernameValue]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const admin = rows[0];

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }
        
        if(!process.env.JWT_SECRET){
            throw new Error("JWT_SECRET is missing");
        }

        const token = jwt.sign(
            {
                adminId: admin.id,
                username: admin.username,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data:{

                adminId:
                admin.id,

                username:
                admin.username,

                role: admin.role,

                token
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        });

    }
};

const changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        const adminId =
            req.admin.adminId;

        if (
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (currentPassword === newPassword) {

            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from the current password."
            });

        }

        if (!passwordRegex.test(newPassword)) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
            });

        }

        const [rows] = await db.query(
            `
            SELECT *
            FROM admins
            WHERE id = ?
            `,
            [adminId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const admin = rows[0];

        const validPassword =
            await bcrypt.compare(
                currentPassword,
                admin.password
            );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const samePassword =
            await bcrypt.compare(
                newPassword,
                admin.password
            );

        if (samePassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from current password"
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        await db.query(
            `
            UPDATE admins
            SET password = ?
            WHERE id = ?
            `,
            [
                hashedPassword,
                adminId
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error changing password",
            error: error.message
        });

    }
};

const deleteAdmin = async (req, res) => {

    try {

        const { id } = req.params;

        const adminId = Number(id);

        if (!Number.isInteger(adminId) || adminId <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid admin ID."
            });

        }

        // Prevent deleting yourself
        if (adminId === req.admin.adminId) {

            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account."
            });

        }

        const [rows] = await db.query(
            `
            SELECT
                id,
                role
            FROM admins
            WHERE id = ?
            `,
            [adminId]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });

        }

        const admin = rows[0];

        // Prevent deleting the last librarian
        if (admin.role === "LIBRARIAN") {

            const [count] = await db.query(
                `
                SELECT COUNT(*) AS total
                FROM admins
                WHERE role = 'LIBRARIAN'
                `
            );

            if (count[0].total === 1) {

                return res.status(400).json({
                    success: false,
                    message: "The last librarian cannot be deleted."
                });

            }

        }

        await db.query(
            `
            DELETE FROM admins
            WHERE id = ?
            `,
            [adminId]
        );

        return res.status(200).json({
            success: true,
            message: "Admin deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete Admin Error:", error
        );

        return res.status(500).json({
            success: false,
            message: "Error deleting admin.",
            error: error.message
        });

    }

};

const getAllAdmins = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT
                id,
                username,
                role
            FROM admins
            ORDER BY
                role DESC,
                username ASC
            `
        );

        return res.status(200).json({
            success: true,
            admins: rows
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error fetching admins."
        });

    }

};

const sendOTP = async (req, res) => {

    try {

        const { email, purpose } = req.body;

        if (!email || !purpose) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and purpose are required."

            });

        }

        if (
            purpose !== "CHANGE_PASSWORD" &&
            purpose !== "FORGOT_PASSWORD"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid OTP purpose."

            });

        }

        const [rows] =
            await db.query(

                `
                SELECT
                    id,
                    username,
                    email
                FROM admins
                WHERE email = ?
                `,
                [email]

            );

        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "No account found with this email."

            });

        }

        // Delete previous OTP

        await db.query(

            `
            DELETE FROM password_otps
            WHERE email = ?
            `,
            [email]

        );

        const otp =
            generateOTP();

        const expiresAt =
            getOTPExpiryTime();

        await db.query(

            `
            INSERT INTO password_otps
            (
                email,
                otp,
                purpose,
                expires_at
            )
            VALUES
            (
                ?, ?, ?, ?
            )
            `,

            [
                email,
                otp,
                purpose,
                expiresAt
            ]

        );

        await sendOTPEmail(
            email,
            otp
        );

        return res.status(200).json({

            success: true,

            message:
                "OTP sent successfully."

        });

    } catch (error) {

        console.error(error.message);

if (error.response) {
    console.error(error.response);
}

console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Failed to send OTP."

        });

    }

};

module.exports = {
   registerAdmin,
   loginAdmin,
   sendOTP,
   changePassword,
   deleteAdmin,
   getAllAdmins
}