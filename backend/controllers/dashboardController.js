const db = require("../config/db");

const getDashboardStats = async (req, res) => {
    try {

        const [[books]] = await db.query(`
            SELECT COUNT(*) AS totalBooks
            FROM books
        `);

        const [[students]] = await db.query(`
            SELECT COUNT(*) AS totalStudents
            FROM students
        `);

        const [[issued]] = await db.query(`
            SELECT COUNT(*) AS totalIssuedBooks
            FROM issued_books
            WHERE status = 'ISSUED'
        `);

        const [[purchases]] = await db.query(`
            SELECT COUNT(*) AS totalPurchases
            FROM purchases
        `);

        const [[sales]] = await db.query(`
            SELECT
                COALESCE(
                    SUM(total_price),
                    0
                ) AS totalRevenue
            FROM purchases
        `);

        return res.status(200).json({
            success: true,
            data: {
                totalBooks: books.totalBooks,
                totalStudents: students.totalStudents,
                totalIssuedBooks: issued.totalIssuedBooks,
                totalPurchases: purchases.totalPurchases,
                totalRevenue: sales.totalRevenue
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching dashboard statistics",
            error: error.message
        });

    }
};

const getRecentTransactions = async (req, res) => {
    try {

        const limit =
            Number(req.query.limit) || 10;

        if (
            !Number.isInteger(limit) ||
            limit <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid limit"
            });
        }

        const [rows] = await db.query(
            `
            SELECT
                t.id,
                s.id AS student_id,
                s.name AS student_name,
                b.id AS book_id,
                b.title AS book_title,
                t.transaction_type,
                t.transaction_date
            FROM transactions t
            LEFT JOIN students s
                ON t.student_id = s.id
            LEFT JOIN books b
                ON t.book_id = b.id
            ORDER BY t.transaction_date DESC
            LIMIT ?
            `,
            [limit]
        );

        return res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching recent transactions",
            error: error.message
        });

    }
};

const getLowStockBooks = async (req, res) => {
    try {

        const threshold =
            Number(req.query.threshold) || 5;

        if (
            !Number.isInteger(threshold) ||
            threshold < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid threshold"
            });
        }

        const [rows] = await db.query(
            `
            SELECT
                id,
                title,
                author,
                category,
                quantity
            FROM books
            WHERE quantity <= ?
            ORDER BY quantity ASC
            `,
            [threshold]
        );

        return res.status(200).json({
            success: true,
            count: rows.length,
            threshold,
            data: rows
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching low stock books",
            error: error.message
        });

    }
};
module.exports = {
    getDashboardStats,
    getRecentTransactions,
    getLowStockBooks 
}