import { useEffect, useState } from "react";
import api from "../services/api";

function IssueBookForm({
    student,
    onSuccess,
    onClose
}) {
    const [search, setSearch] = useState("");

    const [books, setBooks] = useState([]);

    const [selectedBook, setSelectedBook] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [issuing, setIssuing] =
        useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response =
                await api.get("/books");

            const data =
                response.data.data ||
                response.data;

            setBooks(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {
            console.error(error);

            alert(
                "Failed to load books"
            );

        } finally {
            setLoading(false);
        }
    };

    const handleIssueBook =
        async (e) => {

            e.preventDefault();

            if (issuing) return;

            if (!student) {
                alert(
                    "Student not selected"
                );
                return;
            }

            if (!selectedBook) {
                alert(
                    "Please select a book"
                );
                return;
            }

            try {

                setIssuing(true);

                const response =
                    await api.post(
                        "/issues",
                        {
                            student_id:
                                student.id,

                            book_id:
                                selectedBook
                        }
                    );

                alert(
                    response.data.message
                );

                setSearch("");
                setSelectedBook(null);

                onSuccess?.();
                onClose?.();

            } catch (error) {

                console.error(error);

                alert(
                    error.response?.data
                        ?.message ||
                    "Failed to issue book"
                );

            } finally {

                setIssuing(false);
            }
        };

    if (loading) {
        return (
            <div
                className="
                    p-4
                    text-center
                "
            >
                Loading books...
            </div>
        );
    }

    const filteredBooks =
        books.filter((book) =>
            Number(book.quantity) > 0 &&
            (
                book.title
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||

                book.author
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
            )
        );

    const selectedBookData =
        books.find(
            (book) =>
                book.id ===
                selectedBook
        );

    return (
        <div>

            <p
                className="
                    mb-4
                    text-sm
                "
            >
                Student:{" "}
                <strong>
                    {student?.name}
                </strong>
            </p>

            {selectedBookData && (
                <p
                    className="
                        mb-3
                        text-green-600
                        font-medium
                    "
                >
                    Selected:
                    {" "}
                    {
                        selectedBookData.title
                    }
                </p>
            )}

            <form
                onSubmit={
                    handleIssueBook
                }
                className="
                    flex
                    flex-col
                    gap-4
                "
            >

                <input
                    type="text"
                    placeholder="
                        Search by title
                        or author
                    "
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="
                        border
                        p-3
                        rounded
                        w-full

                        dark:bg-gray-700
                        dark:border-gray-600
                    "
                />

                <div
                    className="
                        border
                        rounded
                        max-h-60
                        overflow-y-auto
                    "
                >

                    {
                        filteredBooks
                            .length === 0 ? (

                            <p
                                className="
                                    p-3
                                    text-gray-500
                                "
                            >
                                No books found
                            </p>

                        ) : (

                            filteredBooks.map(
                                (book) => (

                                    <div
                                        key={
                                            book.id
                                        }
                                        onClick={() =>
                                            setSelectedBook(
                                                book.id
                                            )
                                        }
                                        className={`
                                            p-3
                                            cursor-pointer
                                            border-b

                                            ${
                                                selectedBook ===
                                                book.id
                                                    ? "bg-blue-600 text-white"
                                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }
                                        `}
                                    >

                                        <div
                                            className="
                                                font-medium
                                            "
                                        >
                                            {
                                                book.title
                                            }
                                        </div>

                                        <div
                                            className="
                                                text-sm
                                            "
                                        >
                                            Author:
                                            {" "}
                                            {
                                                book.author
                                            }
                                            {" | "}
                                            Stock:
                                            {" "}
                                            {
                                                book.quantity
                                            }
                                        </div>

                                    </div>
                                )
                            )
                        )
                    }

                </div>

                <button
                    type="submit"
                    disabled={
                        issuing ||
                        !selectedBook
                    }
                    className="
                        bg-green-600
                        text-white
                        py-3
                        rounded

                        hover:bg-green-700

                        disabled:bg-gray-400
                        disabled:cursor-not-allowed
                    "
                >
                    {
                        issuing
                            ? "Issuing..."
                            : "Issue Book"
                    }
                </button>

            </form>

        </div>
    );
}

export default IssueBookForm;