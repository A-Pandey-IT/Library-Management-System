const db = require("../config/db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const {
    sendOTPEmail
} = require("../services/emailService");

const {
    generateOTP,
    getOTPExpiryTime,
    isOTPExpired
} = require("../utils/otpGenerator");

const {
    verifyResetToken
} = require("../middleware/verifyResetToken");

const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const loginMember = async (req, res) => {
    try {

        const { email, password: loginPassword } = req.body;

        // Validate input
        if (!email || !loginPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });
        }

        const trimmedEmail = email.trim();

        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format."
            });
        }

        // Find member by email
        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                email,
                phone,
                created_at,
                max_books_allowed,
                password,
                is_active,
                must_change_password
            FROM students
            WHERE email = ?
            `,
            [trimmedEmail]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password."
            });
        }

        const member = rows[0];

        // Check account status
        if (!member.is_active) {
            return res.status(403).json({
                success: false,
                message: "Account is disabled."
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            loginPassword,
            member.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password."
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: member.id,
                name: member.name,
                email: member.email,
                role: "member"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        // Remove password before sending response
        const {password, ...memberData} = member;

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            member: memberData,
            forcePasswordChange: member.must_change_password
        });

    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error."
        });

    }
};

const changeUserPassword = async (req, res) => {

    try {

        const {
            oldPassword,
            newPassword,
            confirmPassword
        } = req.body;

        if (
            !oldPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Old Password, New Password and Confirm Password are required."
            });

        }

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
            });
        }

        if(
            newPassword !==
            confirmPassword
        ){

            return res.status(400).json({
                success:false,
                message: "Passwords do not match."
            });

        }

        if(
            oldPassword ===
            newPassword
        ){
            return res.status(400).json({
                success:false,
                message:
                "New password must be different from old password."
            });
        }

        const [rows] =
            await db.query(
                `
                SELECT
                    id,
                    password,
                    is_active
                FROM students
                WHERE id = ?
                `,
                [req.member.id]
            );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Member not found"
            });

        }

        const member = rows[0];

        if (!member.is_active) {
            return res.status(403).json({
                success: false,
                message: "Account is disabled."
            });
        }

        const isOldPasswordValid = await bcrypt.compare(
            oldPassword,
            member.password
        );

        if (!isOldPasswordValid) {

            return res.status(401).json({
                success: false,
                message:
                    "Old password is incorrect"
            });

        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        await db.query(
            `
            UPDATE students
            SET
                password = ?,
                must_change_password = FALSE
            WHERE id = ?
            `,
            [hashedPassword, req.member.id]
        );

        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully"
        });

    } catch (error) {

        console.error("Change Password Error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Server Error"
        });

    }

};

const sendMemberOTP = async (req, res) => {

    try {

        const {
            email,
            purpose
        } = req.body;

        const emailValue =
            email?.trim().toLowerCase();

        if (
            !emailValue ||
            !purpose
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and purpose are required."

            });

        }

        if (
            !emailRegex.test(emailValue)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid email address."

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
                    name,
                    email
                FROM students
                WHERE email = ?
                `,
                [emailValue]

            );

        if (
            rows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "No account found with this email."

            });

        }

        await db.query(

            `
            DELETE FROM password_otps
            WHERE email = ?
            `,
            [emailValue]

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
                emailValue,
                otp,
                purpose,
                expiresAt
            ]

        );

        await sendOTPEmail(

            emailValue,
            otp

        );

        return res.status(200).json({

            success: true,

            message:
                "OTP sent successfully."

        });

    } catch (error) {

        console.error(error);

        if (
            error.response
        ) {

            console.error(
                error.response.data
            );

        }

        return res.status(500).json({

            success: false,

            message:
                "Failed to send OTP."

        });

    }

};

const verifyMemberOTP = async (req, res) => {

    try {

        const {
            email,
            otp
        } = req.body;

        const emailValue =
            email?.trim().toLowerCase();

        if (
            !emailValue ||
            !otp
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and OTP are required."

            });

        }

        if (
            !emailRegex.test(emailValue)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid email address."

            });

        }

        const [rows] =
            await db.query(

                `
                SELECT
                    id,
                    name,
                    email
                FROM students
                WHERE email = ?
                `,
                [emailValue]

            );

        if (
            rows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "No account found with this email."

            });

        }

        const [otpRows] =
            await db.query(

                `
                SELECT
                    id,
                    otp,
                    purpose,
                    expires_at,
                    verified,
                    created_at
                FROM password_otps
                WHERE
                    email = ?
                    AND purpose = 'FORGOT_PASSWORD'
                ORDER BY created_at DESC
                LIMIT 1
                `,
                [emailValue]

            );

        if (
            otpRows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "No OTP found. Please request a new OTP."

            });

        }

        const otpRecord =
            otpRows[0];

        if (
            otpRecord.purpose !==
            "FORGOT_PASSWORD"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid OTP purpose."

            });

        }

        if (
            isOTPExpired(
                otpRecord.expires_at
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "OTP is expired. Please request a new OTP."

            });

        }

        if (
            otpRecord.verified
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "OTP has already been used."

            });

        }

        if (
            otpRecord.otp !== otp
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid OTP."

            });

        }

        await db.query(

            `
            UPDATE password_otps
            SET verified = TRUE
            WHERE id = ?
            `,
            [
                otpRecord.id
            ]

        );

        const resetToken =
            jwt.sign(

                {

                    memberId:
                        rows[0].id,

                    email:
                        emailValue,

                    purpose:
                        "RESET_PASSWORD",

                    type:
                        "RESET_TOKEN"

                },

                process.env
                    .RESET_PASSWORD_SECRET,

                {

                    expiresIn:
                        "10m"

                }

            );

        return res.status(200).json({

            success: true,

            message:
                "OTP verified successfully.",

            resetToken

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Failed to verify OTP.",

            error:
                error.message

        });

    }

};

const resetMemberPassword = async (req, res) => {

    try {

        const {
            memberId
        } = req.resetUser;

        const {

            newPassword,

            confirmPassword

        } = req.body;

        if (

            !newPassword ||

            !confirmPassword

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required."

            });

        }

        if (
            newPassword !==
            confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Passwords do not match."

            });

        }

        if (
            !passwordRegex.test(
                newPassword
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."

            });

        }

        const [rows] =
            await db.query(

                `
                SELECT password
                FROM students
                WHERE id = ?
                `,
                [
                    memberId
                ]

            );

        if (
            rows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Member not found."

            });

        }

        const samePassword =
            await bcrypt.compare(

                newPassword,

                rows[0].password

            );

        if (
            samePassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be different from the previous password."

            });

        }

        const hashedPassword =
            await bcrypt.hash(

                newPassword,

                10

            );

        await db.query(

            `
            UPDATE students
            SET password = ?
            WHERE id = ?
            `,

            [

                hashedPassword,

                memberId

            ]

        );

        return res.status(200).json({

            success: true,

            message:
                "Password reset successfully."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Failed to reset password."

        });

    }

};

const getProfile =
async (
    req,
    res
) => {

    try {

        const [rows] =
        await db.query(

            `
            SELECT
                id,
                name,
                email,
                phone,
                created_at,
                max_books_allowed,
                is_active
            FROM students
            WHERE id = ?
            `,

            [
                req.member.id
            ]

        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Member not found."
            });
        }

        return res.status(200).json({

            success: true,

            member: rows[0]

        });

    } catch(error){
        console.error("Get Profile Error:", error);
        return res.status(500).json({

            success:false,

            message:
            "Server Error"

        });

    }

};

const getMyIssues =
async (
    req,
    res
) => {

    try {

        const [rows] =
        await db.query(

            `
            SELECT
                ib.id AS issue_id,
                s.id AS student_id,
                s.name AS student_name,
                b.id AS book_id,
                b.title AS book_title,
                ib.issue_date,
                ib.due_date,
                ib.return_date,
                ib.status,
                ib.fine
            FROM issued_books ib

            INNER JOIN students s
                ON ib.student_id = s.id

            INNER JOIN books b
                ON ib.book_id = b.id

            WHERE ib.student_id = ?

            ORDER BY ib.issue_date DESC;
            `,

            [
                req.member.id
            ]

        );

        return res.status(200).json({

            success:true,

            issues:rows

        });

    }catch(error){

        console.error("Get My Issues Error:", error);

        return res.status(500).json({

            success:false,

            message:
            "Server Error"

        });

    }

};

const getMyTransactions =
async (
    req,
    res
) => {

    try{

        const [rows] =
        await db.query(

            `
            SELECT
                t.id AS transaction_id,
                b.id AS book_id,
                b.title AS book_title,
                b.author,
                s.name AS student_name,
                t.transaction_type,
                t.transaction_date
            FROM transactions t
            INNER JOIN books b
                ON t.book_id = b.id
            INNER JOIN students s
                ON t.student_id = s.id
            WHERE t.student_id = ?
            ORDER BY t.transaction_date DESC;
            `,

            [
                req.member.id
            ]

        );

        return res.status(200).json({

            success:true,

            transactions:rows

        });

    }catch (error) {

    console.error(
        "Get My Transactions Error:",
        error
    );

    return res.status(500).json({
        success: false,
        message: "Server Error"
    });

}};

module.exports = {

    loginMember,
    changeUserPassword,
    sendMemberOTP,
    verifyMemberOTP,
    resetMemberPassword,
    getProfile,
    getMyIssues,
    getMyTransactions

};