const db = require("../config/db");

const getAllTransactions = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                t.id,
                t.student_id,
                s.name AS student_name,
                t.book_id,
                b.title AS book_title,
                t.transaction_type,
                t.transaction_date
            FROM transactions t
            LEFT JOIN students s
                ON t.student_id = s.id
            LEFT JOIN books b
                ON t.book_id = b.id
            ORDER BY t.id DESC
        `);

        return res.status(200).json({
            success: true,
            count: rows.length,
            message: "Transaction fetched successfully",
            data: rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error fetching transactions",
            error: error.message
        });
    }
};

const getTransactionById = async (req, res) => {
    try {

        const { id } = req.params;

        const tId = Number(id);

        if(!Number.isInteger(tId) || tId <= 0){
            return res.status(400).json({
                success: false,
                message: "Valid transaction ID is required"
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
            WHERE t.id = ?
            `,
            [tId]
        );

        if(rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "No transaction found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction fetched successfully",
            data: rows[0]
        });
        
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error fetching transaction",
            error: error.message
        })
    }
}

const getTransactionsByStudent = async (req, res) => {
    try {
        const { name, id } = req.query;

        if (!name && !id) {
            return res.status(400).json({
                success: false,
                message: "Provide student ID or name"
            });
        }

        let query = `
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
            WHERE 1=1
        `;

        const values = [];

        if (
            id &&
            (
                !Number.isInteger(Number(id)) ||
                Number(id) <= 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        if (id) {
            query += " AND t.student_id = ?";
            values.push(Number(id));
        }

        if (name) {
            query += " AND s.name LIKE ?";
            values.push(`%${name.trim()}%`);
        }

        query += " ORDER BY t.transaction_date DESC";

        const [rows] = await db.query(query, values);

        if(rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "No transaction found",
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            message: "Transaction fetched successfully",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching student transactions",
            error: error.message
        });
    }
};

const getTransactionsByBook = async (req, res) => {
    try {
        const { title, id } = req.query;

        if (!title && !id) {
            return res.status(400).json({
                success: false,
                message: "Provide book ID or title"
            });
        }

        let query = `
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
            WHERE 1=1
        `;

        const values = [];

        if (
            id &&
            (
                !Number.isInteger(Number(id)) ||
                Number(id) <= 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid book ID"
            });
        }

        if (id) {
            query += " AND t.book_id = ?";
            values.push(Number(id));
        }

        if (title) {
            query += " AND b.title LIKE ?";
            values.push(`%${title.trim()}%`);
        }

        query += " ORDER BY t.transaction_date DESC";

        const [rows] = await db.query(query, values);

        if(rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "No transaction found",
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            message: "Transaction fetched successfully",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching book transactions",
            error: error.message
        });
    }
};

const getTransactionsByType = async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: "Transaction type is required"
            });
        }

        const validTypes = ["ISSUE", "RETURN", "PURCHASE"];

        const transactionType = type.toUpperCase();

        if (!validTypes.includes(transactionType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid transaction type. Allowed values: ${validTypes.join(", ")}`
            });
        }

        const [rows] = await db.query(
            `
            SELECT
                t.id AS transaction_id,
                s.id AS student_id,
                s.name AS student_name,
                b.id AS book_id,
                b.title AS book_title,
                t.transaction_type,
                t.transaction_date
            FROM transactions t
            INNER JOIN students s
                ON t.student_id = s.id
            INNER JOIN books b
                ON t.book_id = b.id
            WHERE t.transaction_type = ?
            ORDER BY t.transaction_date DESC
            `,
            [transactionType]
        );

        if(rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "No transactions found",
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            message: "Transactions fetched successfully",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching transactions by type",
            error: error.message
        });
    }
};

module.exports = {
    getAllTransactions,
    getTransactionsByStudent,
    getTransactionsByBook,
    getTransactionsByType,
    getTransactionById
};
