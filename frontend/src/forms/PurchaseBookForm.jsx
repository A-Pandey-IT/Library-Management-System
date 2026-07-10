import { useEffect, useState } from "react";
import api from "../services/api";
import { FaSpinner } from "react-icons/fa";

import LoadingSpinner from "../components/LoadingSpinner";

import toast from "react-hot-toast";

function PurchaseBookForm({
    onSuccess,
    onClose
}) {

    const [students, setStudents] =
        useState([]);

    const [books, setBooks] =
        useState([]);

    const [studentSearch,
        setStudentSearch] =
        useState("");

    const [bookSearch,
        setBookSearch] =
        useState("");

    const [selectedStudent,
        setSelectedStudent] =
        useState(null);

    const [selectedBook,
        setSelectedBook] =
        useState(null);

    const [quantity,
        setQuantity] =
        useState(1);

    const [loading,
        setLoading] =
        useState(false);

    const [purchasing, setPurchasing] =
    useState(false);

    useEffect(() => {

        fetchStudents();
        fetchBooks();

    }, []);

    const fetchStudents =
        async () => {

            try {
                setLoading(true);

                const response =
                    await api.get(
                        "/students"
                    );

                const data =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data.data || [];

                setStudents(data);

            } catch (error) {

                console.error(error);

                toast.error(
                    "Failed to load students"
                );
            } finally{
                setLoading(false);
            }
        };

    const fetchBooks =
        async () => {

            try {

                const response =
                    await api.get(
                        "/books"
                    );

                const data =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data.data || [];

                setBooks(data);

            } catch (error) {

                console.error(error);

                toast.error(
                    "Failed to load books"
                );
            }
        };

    const handlePurchase =
        async (e) => {

            e.preventDefault();

            if (
                !selectedStudent ||
                !selectedBook
            ) {

                toast.error(
                    "Please select student and book"
                );

                return;
            }

            try {

                setPurchasing(true);

                const response =
                    await api.post(
                        "/purchase",
                        {
                            student_id:
                                selectedStudent.id,

                            book_id:
                                selectedBook.id,

                            quantity
                        }
                    );

                toast.success(
                    response.data.message
                );

                onSuccess?.();

                onClose?.();

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Purchase failed"
                );

            } finally {

                setPurchasing(false);
            }
        };

    const filteredStudents =
        students.filter(
            (student) =>
                student.name
                    ?.toLowerCase()
                    .includes(
                        studentSearch.toLowerCase()
                    )
        );

    const filteredBooks =
        books.filter(
            (book) =>
                book.title
                    ?.toLowerCase()
                    .includes(
                        bookSearch.toLowerCase()
                    )
        );

    if (loading) {
        return (
            <LoadingSpinner
                text="Loading purchases..."
            />
        );
    }

    return (

        <form
            onSubmit={
                handlePurchase
            }
            className="
                flex
                flex-col
                gap-4
            "
        >

            {/* Student Search */}

            <input
                type="text"
                placeholder="Search Student"
                value={
                    selectedStudent
                        ? selectedStudent.name
                        : studentSearch
                }
                onChange={(e) => {

                    setSelectedStudent(
                        null
                    );

                    setStudentSearch(
                        e.target.value
                    );
                }}
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            {
                !selectedStudent &&
                studentSearch && (

                    <div
                        className="
                            border
                            rounded
                            max-h-32
                            overflow-y-auto
                        "
                    >

                        {
                            filteredStudents.map(
                                (student) => (

                                    <div
                                        key={
                                            student.id
                                        }
                                        onClick={() => {

                                            setSelectedStudent(
                                                student
                                            );

                                            setStudentSearch(
                                                student.name
                                            );
                                        }}
                                        className="
                                            p-3
                                            cursor-pointer
                                            hover:bg-gray-100
                                            dark:hover:bg-gray-700
                                        "
                                    >
                                        {
                                            student.name
                                        }
                                    </div>

                                )
                            )
                        }

                    </div>

                )
            }

            {/* Book Search */}

            <input
                type="text"
                placeholder="Search Book"
                value={
                    selectedBook
                        ? selectedBook.title
                        : bookSearch
                }
                onChange={(e) => {

                    setSelectedBook(
                        null
                    );

                    setBookSearch(
                        e.target.value
                    );
                }}
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            {
                !selectedBook &&
                bookSearch && (

                    <div
                        className="
                            border
                            rounded
                            max-h-32
                            overflow-y-auto
                        "
                    >

                        {
                            filteredBooks.map(
                                (book) => (

                                    <div
                                        key={
                                            book.id
                                        }
                                        onClick={() => {

                                            setSelectedBook(
                                                book
                                            );

                                            setBookSearch(
                                                book.title
                                            );
                                        }}
                                        className="
                                            p-3
                                            cursor-pointer
                                            hover:bg-gray-100
                                            dark:hover:bg-gray-700
                                        "
                                    >
                                        {
                                            book.title
                                        }
                                    </div>

                                )
                            )
                        }

                    </div>

                )
            }

            {/* Quantity */}

            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                    setQuantity(
                        Number(
                            e.target.value
                        )
                    )
                }
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            <button
                type="submit"
                disabled={purchasing}
                className={`
                    w-full
                    py-3
                    rounded
                    text-white
                    flex
                    justify-center
                    items-center
                    gap-2

                    ${
                        purchasing
                            ? "bg-purple-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700"
                    }
                `}
            >

                {
                    purchasing
                        ? (
                            <>
                                <FaSpinner
                                    className="animate-spin"
                                />

                                Purchasing Book...
                            </>
                        )
                        : (
                            "Purchase Book"
                        )
                }

            </button>

        </form>
    );
}

export default PurchaseBookForm;