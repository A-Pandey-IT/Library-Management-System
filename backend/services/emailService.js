const nodemailer = require("nodemailer");

const transporter =
    nodemailer.createTransport({

        host:
            process.env.BREVO_SMTP_HOST,

        port:
            Number(process.env.BREVO_SMTP_PORT),

        secure: false,

        auth: {

            user:
                process.env.BREVO_SMTP_USER,

            pass:
                process.env.BREVO_SMTP_KEY

        }

    });

const sendOTPEmail =
async (
    email,
    otp
) => {

    await transporter.sendMail({

        from: `"Library Management System" <${process.env.BREVO_SMTP_USER}>`,

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

            <p>
                If you did not request this OTP,
                please ignore this email.
            </p>
        `

    });

};

module.exports = {

    sendOTPEmail

};