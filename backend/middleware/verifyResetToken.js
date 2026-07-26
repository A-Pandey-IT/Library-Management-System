const jwt = require("jsonwebtoken");

const verifyResetToken = (
    req,
    res,
    next
) => {

    try {
        const authHeader =
            req.headers.authorization;
        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Reset token is required."
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.RESET_PASSWORD_SECRET
        );

        if (
            decoded.type !== "RESET_TOKEN" ||
            decoded.purpose !== "RESET_PASSWORD"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid reset token."
            });
        }

        req.resetUser = decoded;
        next();
    }
    catch(error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired reset token."
        });
    }
};

module.exports = verifyResetToken;