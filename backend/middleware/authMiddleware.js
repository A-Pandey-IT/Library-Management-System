const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    console.log("===== VERIFY TOKEN =====");
    console.log("Headers:", req.headers);

    const authHeader = req.headers.authorization;

    console.log("Authorization:", authHeader);

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {
        console.log("NO AUTH HEADER");

        return res.status(401).json({
            success: false,
            message: "Access denied"
        });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token);

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("Decoded:", decoded);

        req.admin = decoded;

        next();

    } catch (error) {

        console.log("JWT Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

const requireLibrarian =
(
req,
res,
next
)=>{

if(
req.admin.role !==
"LIBRARIAN"
){

return res.status(403).json({

success:false,

message:
"Only librarians can access this resource."

});

}

next();

};

module.exports = { verifyToken, requireLibrarian };