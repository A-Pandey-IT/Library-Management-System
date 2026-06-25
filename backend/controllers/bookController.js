const db = require("../config/db");

const getAllBooks = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT 
              id, 
              title, 
              author, 
              category, 
              price, 
              quantity
            FROM books
            ORDER BY id DESC
            `
        );

        res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetching books",
            error: error.message
        });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { title, category, author } = req.query;

        if (
            (!title || title.trim() === "") && 
            (!category || category.trim() === "") && 
            (!author || author.trim() === "")
        ) {
            return res.status(400).json({
                success: false,
                message: "At least one search parameter (title, category, or author) is required"
            });
        }

        let query = 
        `   SELECT 
              id,
              title,
              author,
              category,
              price,
              quantity
            FROM books WHERE 1=1`;

        const values = [];

        if (title?.trim()) {
            query += " AND LOWER(title) LIKE LOWER(?)";
            values.push(`%${title?.trim()}%`);
        }

        if (category?.trim()) {
            query += " AND LOWER(category) LIKE LOWER(?)";
            values.push(`%${category?.trim()}%`);
        }

        if (author?.trim()) {
            query += " AND LOWER(author) LIKE LOWER(?)";
            values.push(`%${author?.trim()}%`);
        }

        query += "  ORDER BY title ASC LIMIT 100";

        const [rows] = await db.query(query, values);

        if (rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No books found",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            message: "Books found",
            data: rows
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error searching books",
            error: error.message
        });
    }
};


const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const bookId = Number(id);

        if (!Number.isInteger(bookId) || bookId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid book ID is required"
            });
        }

        const [rows] = await db.query(
        `
            SELECT 
              id,
              title,
              author,
              category,
              price,
              quantity
            FROM books WHERE id = ?
        `,
            [bookId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Book not found with ID ${id}`
            });
        }

        return res.status(200).json({
            success: true,
            message: "Book fetched successfully",
            data: rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching book",
            error: error.message
        });
    }
};

const addBook = async(req, res) => {

    try{

        const {
            title,
            author,
            category,
            price,
            quantity
        } = req.body;

        if(!title || title.trim() === ""){
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        if(!author || author.trim() === ""){
            return res.status(400).json({
                success: false,
                message: "Author is required"
            });
        }

        if(!category || category.trim() === ""){
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }

        if(price == null || isNaN(Number(price)) || Number(price) <= 0){
            return res.status(400).json({
                success: false,
                message: "Price is required"
            });
        }

        if(quantity == null || isNaN(Number(quantity)) || Number(quantity) < 0){
            return res.status(400).json({
                success: false,
                message: "Quantity is required"
            });
        }

        const [existing] = await db.query(
            "SELECT id FROM books WHERE title = ? AND author = ?",
            [title.trim(), author.trim()]
        );

        if(existing.length > 0){
            return res.status(409).json({
                success: false,
                message: "Book already exists"
            })
        }
        
        const query = `
            INSERT INTO books   
            (title, author, category, price, quantity)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(
            query,
            [title.trim(),
                author.trim(),
                category.trim(),
                Number(price),
                Number(quantity)
            ]
        )

        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: {
                bookId: result.insertId
            }
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error adding Book",
            error: error.message
        })
    }
}

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            author,
            category,
            price,
            quantity
        } = req.body;

        const bookId = Number(id);

        if (!Number.isInteger(bookId) || bookId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid book ID is required"
            });
        }

        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        if (!author || author.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Author is required"
            });
        }

        if (!category || category.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }

        if (price == null || isNaN(Number(price)) || Number(price) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid price is required"
            });
        }

        if (quantity == null || isNaN(Number(quantity)) || Number(quantity) < 0) {
            return res.status(400).json({
                success: false,
                message: "Valid quantity is required"
            });
        }

        const [rows] = await db.query(
            "SELECT id FROM books WHERE id = ?",
            [bookId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Book not found with ID ${id}`
            });
        }

        const [duplicate] = await db.query(
            `
            SELECT id
            FROM books
            WHERE title = ?
            AND author = ?
            AND id != ?
            `,
            [title?.trim(), 
                author?.trim(),
                bookId
            ]            
        );

        if(duplicate.length > 0){
            return res.status(409).json({
                success: false,
                message: "Book already exists"
            })
        }

        const query = `
            UPDATE books
            SET
                title = ?,
                author = ?,
                category = ?,
                price = ?,
                quantity = ?
            WHERE id = ?
        `;

        await db.query(query, [
            title.trim(),
            author.trim(),
            category.trim(),
            Number(price),
            Number(quantity),
            bookId
        ]);

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: null
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating book",
            error: error.message
        });
    }
};

const deleteBook = async (req, res) => {

    try {

        const { id } = req.params;

        const bookId = Number(id);

        if(!Number.isInteger(bookId) || bookId <= 0){
            return res.status(400).json({
                success: false,
                message: "Valid book ID is required"
            })
        }

        const [issued] = await db.query(
        `
            SELECT COUNT(*) AS total
            FROM issued_books
            WHERE book_id = ?
            AND status = 'ISSUED'
            `,
            [bookId]
        );

        if (issued[0].total > 0) {
            return res.status(400).json({
                success: false,
                message:
                "Book is currently issued and cannot be deleted"
            });
        }

        const [result] = await db.query(
            "DELETE FROM books WHERE id = ?",
            [bookId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error deleting book",
            error: error.message
        });

    }
};

const getBookStats = async (
    req,
    res
) => {

    try {

        const [[totalBooks]] =
        await db.query(
        `
        SELECT COUNT(*) AS total
        FROM books
        `
        );

        const [[categories]] =
        await db.query(
        `
        SELECT COUNT(
            DISTINCT category
        ) AS total
        FROM books
        `
        );

        const [[lowStock]] =
        await db.query(
        `
        SELECT COUNT(*) AS total
        FROM books
        WHERE quantity <= 5
        `
        );

        const [[inventoryValue]] =
        await db.query(
        `
        SELECT
            COALESCE(
                SUM(
                    quantity * price
                ),
                0
            ) AS total
        FROM books
        `
        );

        return res.status(200).json({
            success: true,
            data: {
                totalBooks:
                    totalBooks.total,

                categories:
                    categories.total,

                lowStock:
                    lowStock.total,

                inventoryValue:
                    inventoryValue.total
            }
        });

    } catch(error){

        return res.status(500).json({
            success: false,
            message:
                "Error fetching stats",
            error:
                error.message
        });
    }
};

module.exports = {
    getAllBooks,
    searchBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    getBookStats
};