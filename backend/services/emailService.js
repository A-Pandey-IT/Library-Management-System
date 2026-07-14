const nodemailer = require("nodemailer");

const transporter =
    nodemailer.createTransport({

        host: "smtp.gmail.com",

        port: 587,

        secure: false,

        auth: {

            user: process.env.EMAIL_USER,

            pass: process.env.EMAIL_PASSWORD

        }

    });

const sendOTPEmail = async (
    email,
    otp
) => {

    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: email,

        subject:
            "Library Management System - OTP Verification",

        html: `
            <h2>Library Management System</h2>

            <p>Your OTP is:</p>

            <h1>${otp}</h1>

            <p>
                This OTP is valid for
                <strong>10 minutes</strong>.
            </p>

        `

    });

};

module.exports = {

    sendOTPEmail

};