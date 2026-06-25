const express = require("express");
require("dotenv").config();
const cors = require("cors");

const db = require("./config/db");

const studentRoutes = require
("./routes/studentRoutes");

const bookRoutes = require
("./routes/bookRoutes");

const issueRoutes = require
("./routes/issueRoutes");

const returnRoutes = require
("./routes/returnRoutes");

const purchaseRoutes = require
("./routes/purchaseRoutes");

const transactionRoutes = require
("./routes/transactionRoutes");

const adminRoutes = require
("./routes/adminRoutes");

const dashboardRoutes =
require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);

app.use("/books", bookRoutes);

app.use("/issues", issueRoutes);

app.use("/returns", returnRoutes);

app.use("/transaction", transactionRoutes);

app.use("/purchase", purchaseRoutes);

app.use("/admin", adminRoutes);

app.use("/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("Library Backend Running");
});

db.getConnection()
    .then(connection => {
        console.log("Database Connected");
        connection.release();
    })
    .catch(error => {
        console.error(
            "Database Connection Failed:",
            error.message
        );
    });

console.log("PORT:", process.env.PORT);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

app.listen(process.env.PORT, () => {
    console.log(
        `Server running on port ${process.env.PORT}`
    );
});