const db = require("../config/db");


const issueBook = async (req, res) => {
    let connection;

    try {

        connection = await db.getConnection();

        const { student_id, book_id} = req.body;

        const studentId = Number(student_id);
        const bookId = Number(book_id);

        if(!Number.isInteger(studentId) || 
            studentId <= 0 
        ){
            return res.status(400).json({
                success: false,
                message: "Valid student ID is required"
            });
        }

        if(!Number.isInteger(bookId) || 
            bookId <= 0 
        ){
            return res.status(400).json({
                success: false,
                message: "Valid book ID is required"
            });
        }

        await connection.beginTransaction();

        const [studentRows] = await connection.query(
            `
            SELECT *
            FROM students
            WHERE id = ?
            `, [studentId]
        )

        if (studentRows.length === 0){
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const student = studentRows[0];

        const [bookRows] = await connection.query(
            `
            SELECT *
            FROM books
            WHERE id = ?
            `, [bookId]
        )

        if (bookRows.length === 0){
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        const book = bookRows[0];


        if(book.quantity <= 0){
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Book out of stock"
            });
        }

        const [countRows] = await connection.query(
            `
            SELECT COUNT(*) AS total
            FROM issued_books
            WHERE student_id = ?
            AND status = 'ISSUED'
            `,[studentId]
        );

        const activeBooks = countRows[0].total;

        if(activeBooks >= 
            student.max_books_allowed
        ){
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Maximum book limit reached. return a book first."
            });
        }

        const [existingIssues] = await connection.query(
            `SELECT 
              student_id,
              book_id,
              issue_date,
              return_date,
              status
            FROM issued_books
            WHERE student_id = ?
            AND book_id = ?
            AND status = 'ISSUED'
            `,[studentId, bookId]
        );

        if(existingIssues.length > 0){
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "This book is already issued"
            });
        }

        await connection.query(
            `
            INSERT INTO issued_books
            (
              student_id,
              book_id,
              issue_date,
              due_date,
              status
            )
            VALUES (
              ?, ?, CURDATE(), 
              DATE_ADD(CURDATE(), INTERVAL 15 DAY),
              'ISSUED'
              )
            `,
            [studentId, bookId]
        );

        await connection.query(
            `
            INSERT INTO transactions
            (
              student_id,
              book_id,
              transaction_type,
              transaction_date
            )
            VALUES (?, ?, 'ISSUE', NOW())
            `,
            [
                studentId,
                bookId,
            ]
        );

        await connection.query(
            `
            UPDATE books
            SET quantity = quantity - 1
            WHERE id = ?
            `,[bookId]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Book issued successfully"
        });

    } catch(error){

        try {
            await connection.rollback();
        }catch{}

        return res.status(500).json({
            success: false,
            message: "Error issuing book",
            error: error.message
        });
    } finally{
        if(connection){
            connection.release();
        }
    }

};

const getIssuedBooks = async (req, res) => {
    try {

        const [rows] = await db.query(
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
                ib.fine,
                ib.status
                FROM issued_books ib
                JOIN students s
                ON ib.student_id = s.id
            JOIN books b
            ON ib.book_id = b.id
            ORDER BY ib.issue_date DESC
            `
        );

        res.status(200).json({
            success: true,
            message: "Issued books fetched successfully",
            data: rows
        })

    }catch(error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching issued books",
            error: error.message
        })
    }
};

const getIssueById = async (req, res) => {
    try {

        const { id } = req.params;

        const issueId = Number(id);

        if (!Number.isInteger(issueId) || issueId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid issue ID is required"
            });
        }

        const [rows] = await db.query(
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
              ib.fine,
              ib.status
            FROM issued_books ib
            JOIN students s
              ON ib.student_id = s.id
            JOIN books b
              ON ib.book_id = b.id
            WHERE ib.id = ?
            `,
            [issueId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Issue record not found with ID ${issueId}`
            });
        }

        return res.status(200).json({
            success: true,
            message: "Issue record fetched successfully",
            data: rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching issue record",
            error: error.message
        });
    }
};

const getActiveIssuedBooks = async (req, res) => {
    try {

        const [rows] = await db.query(
            `
            SELECT
              ib.id AS issue_id,
              s.id AS student_id,
              s.name AS student_name,
              b.id AS book_id,
              b.title AS book_title,
              ib.issue_date,
              ib.due_date,
              ib.status
            FROM issued_books ib
            JOIN students s
              ON ib.student_id = s.id
            JOIN books b
              ON ib.book_id = b.id
            WHERE ib.status = 'ISSUED'
            ORDER BY ib.issue_date DESC
            `
        );

        if (rows.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                message: "No active issued books found",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            message: "Active issued books fetched successfully",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching active issued books",
            error: error.message
        });
    }
};

const getIssuedBooksByMember = async (req, res) => {
    try {

        const { id, name } = req.query;

        const studentId = Number(id);

        if (
            (!id && !name?.trim()) ||
            (id && (!Number.isInteger(studentId) || studentId <= 0))
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide either valid student ID or name"
            });
        }

        let query = `
            SELECT
              ib.id AS issue_id,
              s.id AS student_id,
              s.name AS student_name,
              b.id AS book_id,
              b.title AS book_title,
              ib.issue_date,
              ib.due_date,
              ib.return_date,
              ib.fine,
              ib.status
            FROM issued_books ib
            JOIN students s ON ib.student_id = s.id
            JOIN books b ON ib.book_id = b.id
            WHERE 1=1
        `;

        const values = [];

        if (studentId) {
            query += " AND s.id = ?";
            values.push(studentId);
        }

        if (name?.trim()) {
            query += " AND s.name LIKE ?";
            values.push(`%${name.trim()}%`);
        }

        query += " ORDER BY ib.issue_date DESC";

        const [rows] = await db.query(query, values);

        return res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching student issue records",
            error: error.message
        });
    }
};

const getIssuedBooksByBook = async (req, res) => {
    try {

        const { bookId, title } = req.query;

        const id = Number(bookId);

       
        if (
            (!bookId && !title?.trim()) ||
            (bookId && (!Number.isInteger(id) || id <= 0))
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide either valid bookId or title"
            });
        }

        let query = `
            SELECT
              ib.id AS issue_id,
              s.id AS student_id,
              s.name AS student_name,
              b.id AS book_id,
              b.title AS book_title,
              ib.issue_date,
              ib.due_date,
              ib.return_date,
              ib.fine,
              ib.status
            FROM issued_books ib
            JOIN students s ON ib.student_id = s.id
            JOIN books b ON ib.book_id = b.id
            WHERE 1=1
        `;

        const values = [];

        if (bookId) {
            query += " AND b.id = ?";
            values.push(id);
        }

        if (title?.trim()) {
            query += " AND b.title LIKE ?";
            values.push(`%${title.trim()}%`);
        }

        query += " ORDER BY ib.issue_date DESC";

        const [rows] = await db.query(query, values);

        if (rows.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                message: "No issue records found for this book",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            book: {
                bookId: rows[0].book_id,
                bookTitle: rows[0].book_title
            },
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching book issue records",
            error: error.message
        });
    }
};

module.exports = {
    issueBook,
    getIssuedBooks,
    getActiveIssuedBooks,
    getIssuedBooksByMember,
    getIssuedBooksByBook,
    getIssueById
}

