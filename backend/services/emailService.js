const axios = require("axios");

const sendOTPEmail =
async (
    email,
    otp
) => {

    try {

        const response =
            await axios.post(

                "https://api.brevo.com/v3/smtp/email",

                {

                    sender: {

                        name:
                            process.env.BREVO_SENDER_NAME,

                        email:
                            process.env.BREVO_SENDER_EMAIL

                    },

                    to: [

                        {
                            email
                        }

                    ],

                    subject:
                        "Library Management System - OTP Verification",

                    htmlContent: `
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

                },

                {

                    headers: {

                        "api-key":
                            process.env.BREVO_API_KEY,

                        "Content-Type":
                            "application/json"

                    }

                }

            );

        console.log("Brevo Response:");
        console.log("Status:", response.status);
        console.log(response.data);

    } catch (error) {

        console.error(
            "Brevo Error:"
        );

        if (error.response) {

            console.error(
                error.response.data
            );

        } else {

            console.error(
                error.message
            );

        }

        throw error;

    }

};

module.exports = {

    sendOTPEmail

};