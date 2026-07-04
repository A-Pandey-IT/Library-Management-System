const db = require("../config/db");



const purchaseBook = async (req, res) => {
    let connection;

    try {

        connection = await db.getConnection();
        const { student_id, book_id, quantity = 1 } = req.body;

        const studentId = Number(student_id);
        const bookId = Number(book_id);
        const qty = Number(quantity);

        if (
            !Number.isInteger(studentId) ||
            studentId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid student ID is required"
            });
        }

        if (
            !Number.isInteger(bookId) ||
            bookId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid book ID is required"
            });
        }

        if (
            !Number.isInteger(qty) ||
            qty <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        await connection.beginTransaction();

        const [students] = await connection.query(
            `
            SELECT id, name
            FROM students
            WHERE id = ?
            `,
            [studentId]
        );

        if (students.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const [books] = await connection.query(
            `
            SELECT
                id,
                title,
                price,
                quantity
            FROM books
            WHERE id = ?
            `,
            [bookId]
        );

        if (books.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        const book = books[0];

        if (book.quantity < qty) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: `Only ${book.quantity} books available in stock`
            });
        }

        const totalPrice = Number(book.price) * qty;

        const [purchaseResult] = await connection.query(
            `
            INSERT INTO purchases
            (
                student_id,
                book_id,
                quantity,
                total_price
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                studentId,
                bookId,
                qty,
                totalPrice
            ]
        );

        await connection.query(
            `
            INSERT INTO transactions
            (
                student_id,
                book_id,
                transaction_type
            )
            VALUES (?, ?, 'PURCHASE')
            `,
            [
                studentId,
                bookId
            ]
        );

        await connection.query(
            `
            UPDATE books
            SET quantity = quantity - ?
            WHERE id = ?
            `,
            [
                qty,
                bookId
            ]
        );

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Book purchased successfully",
            data:{
                purchaseId: purchaseResult.insertId,
                studentId,
                bookId,
                quantity: qty,
                totalPrice
            }
        });

    } catch (error) {

        try{
            await connection.rollback();
        }catch{}

        return res.status(500).json({
            success: false,
            message: "Error purchasing book",
            error: error.message
        });

    } finally {
        connection.release();
    }
};



const getAllPurchased = async (req, res) => {
    try {

        const limit = Number.isInteger(Number(req.query.limit)) &&
                      Number(req.query.limit) > 0
                      ? Number(req.query.limit)
                      : 20;

        const [rows] = await db.query(
            `
            SELECT
                p.id,
                s.id AS student_id,
                s.name AS student_name,
                b.id AS book_id,
                b.title AS book_title,
                p.quantity,
                p.total_price,
                p.purchased_date
            FROM purchases p
            INNER JOIN students s
                ON p.student_id = s.id
            INNER JOIN books b
                ON p.book_id = b.id
            ORDER BY p.purchased_date DESC
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
            message: "Error fetching purchases",
            error: error.message
        });

    }
};



const getPurchasedById = async (req, res) => {
    try {

        const purchaseId = Number(req.params.id);

        if (
            !Number.isInteger(purchaseId) ||
            purchaseId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid purchase ID is required"
            });
        }

        const [rows] = await db.query(
            `
            SELECT
                p.id,
                s.id AS student_id,
                s.name AS student_name,
                b.id AS book_id,
                b.title AS book_title,
                p.quantity,
                p.total_price,
                p.purchased_date
            FROM purchases p
            LEFT JOIN students s
                ON p.student_id = s.id
            LEFT JOIN books b
                ON p.book_id = b.id
            WHERE p.id = ?
            `,
            [purchaseId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching purchase",
            error: error.message
        });

    }
};



const getPurchasedByStudent = async (req, res) => {
    try {

        const { id, name } = req.query;

        if (!id && !name) {
            return res.status(400).json({
                success: false,
                message: "Student ID or Name is required"
            });
        }

        let query = `
            SELECT
                p.id,
                s.id AS student_id,
                s.name AS student_name,
                b.id AS book_id,
                b.title AS book_title,
                p.quantity,
                p.total_price,
                p.purchased_date
            FROM purchases p
            LEFT JOIN students s
                ON p.student_id = s.id
            LEFT JOIN books b
                ON p.book_id = b.id
            WHERE 1=1
        `;

        const values = [];

        if(
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
            query += " AND s.id = ?";
            values.push(Number(id));
        }

        if (name) {
            query += " AND s.name LIKE ?";
            values.push(`%${name.trim()}%`);
        }

        query += " ORDER BY p.purchased_date DESC";

        const [rows] = await db.query(query, values);

        return res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching student purchases",
            error: error.message
        });

    }
};



const getPurchasedByBook = async (req, res) => {
    try {

        const { id, title } = req.query;

        if (!id && !title) {
            return res.status(400).json({
            success: false,
            message: "Book ID or Title is required"
        });
    }

        let query = `
            SELECT
                p.id,
                s.id AS student_id,
                s.name AS student_name,
                b.id AS book_id,
                b.title AS book_title,
                p.quantity,
                p.total_price,
                p.purchased_date
            FROM purchases p
            LEFT JOIN students s
                ON p.student_id = s.id
            LEFT JOIN books b
                ON p.book_id = b.id
            WHERE 1=1
        `;

        const values = [];

        if(
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
            query += " AND b.id = ?";
            values.push(Number(id));
        }

        if (title) {
            query += " AND b.title LIKE ?";
            values.push(`%${title.trim()}%`);
        }

        query += " ORDER BY p.purchased_date DESC";

        const [rows] = await db.query(query, values);

        return res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching book purchases",
            error: error.message
        });

    }
};



const getPurchasesByDate = async (req, res) => {
    try {

        const {
            date,
            startDate,
            endDate,
            limit = Number.isInteger(Number(req.query.limit))
                    && Number(req.query.limit) > 0
                    ? Number(req.query.limit)
                    : 20

        } = req.query;

        let query = `
            SELECT
                p.id,
                s.id AS student_id,
                s.name AS student_name,
                b.id AS book_id,
                b.title AS book_title,
                p.quantity,
                p.total_price,
                p.purchased_date
            FROM purchases p
            LEFT JOIN students s
            ON p.student_id = s.id
            LEFT JOIN books b
            ON p.book_id = b.id
            WHERE 1=1
        `;

        const values = [];

        if(date && isNaN(Date.parse(date))){
            return res.status(400).json({
                success:false,
                message:"Invalid date format"
            });
        }

        if (
            startDate &&
            isNaN(Date.parse(startDate))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid start date"
            });
        }

        if (
            endDate &&
            isNaN(Date.parse(endDate))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid end date"
            });
        }

        if (date) {
            query += " AND DATE(purchased_date) = ?";
            values.push(date);
        }

        else if (startDate && endDate) {
            query += `
                AND DATE(purchased_date)
                BETWEEN ? AND ?
            `;
            values.push(startDate, endDate);
        }

        query += `
            ORDER BY purchased_date DESC
            LIMIT ?
        `;

        values.push(Number(limit));

        const [rows] = await db.query(
            query,
            values
        );

        return res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching purchases",
            error: error.message
        });

    }
};



const getTotalSales = async (req, res) => {
    try {

        const [rows] = await db.query(
            `
            SELECT
                IFNULL(SUM(total_price),0) AS total_sales,
                IFNULL(SUM(quantity),0) AS total_books_sold,
                COUNT(*) AS total_transactions
            FROM purchases
            `
        );

        return res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching sales report",
            error: error.message
        });

    }
};

module.exports = {
    purchaseBook,
    getAllPurchased,
    getPurchasedById,
    getPurchasedByStudent,
    getPurchasedByBook,
    getPurchasesByDate,
    getTotalSales
};