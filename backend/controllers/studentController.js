const db = require("../config/db");

const getAllStudents = async (req, res) => {

    try{

        const [rows] = await db.query
            ("SELECT * FROM students ORDER BY id DESC");

        res.status(200).json(rows);

    } catch (error){

        res.status(500).json({
            message: "Error fetching Students",
            error: error.message
        })

    }

}



const searchStudents = async (req, res) => {

    try{

        const { name, id, email } = req.query;

        if(!name && !id && !email){
            return res.status(400).json({
                message: "At least one of id, name, or email is required"
            });
        }

        let query = "SELECT * FROM students WHERE 1=1";
        let params = [];

        if(name){
            query += " AND name LIKE ?";
            params.push(`%${name}%`);
        }

        if(id){
            query += " AND CAST(id AS CHAR) LIKE ?";
            params.push(`%${id}%`);
        }

        if(email){
            query += " AND email LIKE ?";
            params.push(`%${email}%`);
        }

        const [rows] = await db.query(query, params);

        if (rows.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(rows);

    } catch(error){
        res.status(500).json({
            message: "Error searching Student",
            error: error.message
        })
    }
}



const getStudentById = async (req, res) => {

    try{

        const { id } = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                message: "Invalid students id"
            });
        }

        const [rows] = await db.query(
            `
            SELECT * FROM students WHERE id = ?
            `, [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(rows[0]);
        
    } catch(error){
        res.status(500).json({
            message: "Error fetching Student",
            error: error.message
        });
    }

}//http://localhost:5000/students/1



const addStudent = async (req, res) => {

    try{

        const { name, email, phone} = 
        req.body;

        if(!name || name.trim() === ""){
            return res.status(400).json({
                message: "Name is required"
            });
        }

        const emailRegex = 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!email || !emailRegex.test(email)){
            return res.status(400).json({
                message: "Valid email is required"
            });
        }

        if (phone) {
            const phoneRegex = /^\d{10}$/;

            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    message: "Phone number must contain exactly 10 digits"
                });
            }
        }

        const query = `
            INSERT INTO students
            (name, email, phone)
            VALUES (?, ?, ?)
        `;

        const [result] = await db.query(
            query, [name.trim(), email.trim(), phone || null]
        );

        res.status(201).json({
            message: "Student added successfully",
            studentId: result.insertId
        });
        
    } catch(error){

        if(error.code === "ER_DUP_ENTRY"){
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({
            message: "Error adding Student",
            error: error.message
        })
    }

}



const updateStudent = async (req, res) => {

    try{
        
        const { id } = req.params;
        const { name, email, phone } = req.body;

         if(!name || name.trim() === ""){
            return res.status(400).json({
                message: "Name is required"
            });
        }

        const emailRegex = 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!email || !emailRegex.test(email)){
            return res.status(400).json({
                message: "Valid email is required"
            });
        }

        if (phone) {
            const phoneRegex = /^\d{10}$/;

            if (!phoneRegex.test(phone)) {
                return res.status(400).json({
                    message: "Phone number must contain exactly 10 digits"
                });
            }
        }

        const query = `
            UPDATE students
            SET 
                name = ?,
                email = ?,
                phone = ?
            WHERE id = ?
        `;

        const [result] = await db.query(
            query,
            [name, email, phone || null, id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student updated successfully"
        })
        
    }catch(error){
        res.status(500).json({
            message: "Error updating Student",
            error: error.message
        })
    }

}



const deleteStudent = async (req, res) => {

    try {

        const { id } = req.params;

        const sId = Number(id);
        if(!Number.isInteger(Number(sId)) || sId <= 0){
            return res.status(400).json({
                success: false,
                message: "Valid student ID required"
            });
        }

        const [issuedBooks] = await db.query(
        `
            SELECT COUNT(*) AS total
            FROM issued_books
            WHERE student_id = ?
            AND status = 'ISSUED'
            `,
            [sId]
        );

        if(issuedBooks[0].total > 0){
            return res.status(400).json({
                success: false,
                message:
                "Student has active issued books. Return all books first."
            });
        }

        const [result] = await db.query(
            `
            DELETE FROM students WHERE id = ?
            `, [id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }
        res.status(200).json({
            success: true,
            message: `Student ${id} is deleted successfully`
        });
        
    } catch(error){
        res.status(500).json({
            message: "Error deleting Student",
            error: error.message
        });
    }

}


module.exports = {
    getAllStudents,
    searchStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent
}