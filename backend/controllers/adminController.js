const bcrypt = require("bcrypt");
const db = require("../config/db");

const jwt = require("jsonwebtoken");

const registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const [existing] = await db.query(
            `
            SELECT id
            FROM admins
            WHERE username = ?
            `,
            [username.trim()]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `
            INSERT INTO admins
            (
                username,
                password
            )
            VALUES (?, ?)
            `,
            [
                username.trim(),
                hashedPassword
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                adminId: result.insertId,
                username: username.trim()
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
                username: admin.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                adminId: admin.id,
                username: admin.username,
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

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
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

module.exports = {
   registerAdmin,
   loginAdmin,
   changePassword 
}