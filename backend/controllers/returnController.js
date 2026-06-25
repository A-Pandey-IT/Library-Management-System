const db = require("../config/db");

const returnBook = async (req, res) => {
    const connection = await db.getConnection();

    try {

        const { student_id, book_id } = req.body;

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

        const [issueRows] = await connection.query(
            `
            SELECT *
            FROM issued_books
            WHERE student_id = ?
            AND book_id = ?
            AND status = 'ISSUED'
            ORDER BY id DESC 
            LIMIT 1
            `, [studentId, bookId]
        );

        if(issueRows.length === 0){
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "No active book found"
            });
        }

        const issue = issueRows[0];
        const issuedId = issue.id;

        if (!issue.due_date) {
            throw new Error("Due date not found");
        }

        const today = new Date();
        const dueDate = new Date(issue.due_date);

        let fine = 0;

        let overdueDays = 0;

        if (today > dueDate){
            overdueDays = Math.ceil(
                (today - dueDate) / 
                (1000 * 60 * 60 * 24)
            );

            fine = overdueDays * 5;
        }

        await connection.query(
            `
            UPDATE issued_books
            SET 
              status = 'RETURNED',
              return_date = NOW(),
              fine = ?
            WHERE id = ?
            `, [fine, issuedId]
        );

        await connection.query(
            `
            UPDATE books
            SET quantity = quantity + 1
            WHERE id = ?
            `,[bookId]
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
            [studentId, bookId]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message: "Book returned successfully",
            fine,
            overdueDays: 
                fine > 0
                ? fine / 5 : 0
        });

    } catch(error){
        try {
            await connection.rollback();
        } catch{}

        return res.status(500).json({
            success: false,
            message: "Failed to return book",
            error: error.message
        })
    } finally{
        connection.release();
    }
};

const getReturnedBooks = async (req, res) => {
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
            WHERE ib.status = 'RETURNED'
            ORDER BY ib.return_date DESC
            `
        );

        if (rows.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                message: "No returned books found",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            message: "Returned books fetched successfully",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching returned books",
            error: error.message
        });
    }
};

module.exports = { 
    returnBook,
    getReturnedBooks
};