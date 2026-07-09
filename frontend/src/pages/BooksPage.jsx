import { useState,useEffect } from "react";

import api from "../services/api";

import ActionsDropdown from
"../components/ActionsDropdown";

import LoadingSpinner from "../components/LoadingSpinner";

function BooksPage({
    onEditBook,
    onDeleteBook,
    onViewHistory,
    refreshData
}) {

     useEffect(() => {

        fetchBooks();
        fetchStats();

    }, [refreshData]);
    

    const [books,
        setBooks] =
        useState([]);

    const [filteredBooks,
        setFilteredBooks] =
        useState([]);

    const [stats,
        setStats] =
        useState({
            totalBooks: 0,
            categories: 0,
            lowStock: 0,
            inventoryValue: 0
        });

    const [search,
        setSearch] =
        useState("");

    const [loading,
        setLoading] =
        useState(true);

    const fetchBooks =
        async () => {

            try {

                const response =
                    await api.get(
                        "/books"
                    );

                const data =
                    response.data.data ||
                    [];

                setBooks(data);

                setFilteredBooks(
                    data
                );

            } catch(error){

                console.error(error);

                alert(
                    "Failed to load books"
                );

            } finally{

                setLoading(false);
            }
        };

    const fetchStats =
        async () => {

            try {

                const response =
                    await api.get(
                        "/books/stats/summary"
                    );

                setStats(
                    response.data.data
                );

            } catch(error){

                console.error(error);
            }
        };

    const handleSearch =
        (value) => {

            setSearch(value);

            const keyword =
                value.toLowerCase();

            const filtered =
                books.filter(
                    (book) =>

                        String(book.id)
                            .includes(keyword)

                        ||

                        book.title
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        book.author
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        book.category
                            ?.toLowerCase()
                            .includes(keyword)
                );

            setFilteredBooks(
                filtered
            );
        };

    if (loading) {

        return (
            <h2>
                Loading Books...
            </h2>
        );
    }

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    

    return (

        <div>

            {/* Cards */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4
                    gap-4
                    mt-15
                    mb-8
                "
            >

                <div 
                    className="
                        bg-white
                        dark:bg-gray-800
                        rounded-lg
                        shadow
                        
                        p-5
                    "
                >
                    <h3>
                        Total Books
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        {
                            stats.totalBooks
                        }
                    </p>
                </div>

                <div
                    className="
                        bg-white
                        dark:bg-gray-800
                        rounded-lg
                        shadow
                        p-5
                    "
                >
                    <h3>
                        Categories
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        {
                            stats.categories
                        }
                    </p>
                </div>

                <div
                    className="
                        bg-white
                        dark:bg-gray-800
                        rounded-lg
                        shadow
                        p-5
                    "
                >
                    <h3>
                        Low Stock
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                            text-red-500
                        "
                    >
                        {
                            stats.lowStock
                        }
                    </p>
                </div>

                <div
                    className="
                        bg-white
                        dark:bg-gray-800
                        rounded-lg
                        shadow
                        p-5
                    "
                >
                    <h3>
                        Inventory Value
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        ₹
                        {
                            Number(
                                stats.inventoryValue
                            ).toFixed(2)
                        }
                    </p>
                </div>

            </div>

            {/* Header */}

            <div
                className="
                    flex
                    justify-between
                    items-center
                    mb-6
                "
            >

                <h2
                    className="
                        text-3xl
                        font-bold
                    "
                >
                    BOOKS
                </h2>

                <input
                    type="text"
                    placeholder="Search Book"
                    value={search}
                    onChange={(e) =>
                        handleSearch(
                            e.target.value
                        )
                    }
                    className="
                        border
                        rounded
                        px-4
                        py-2
                        w-72

                        dark:bg-gray-800
                        dark:border-gray-600
                    "
                />

            </div>

            {/* Table */}

            <div
                className="
                    overflow-x-auto
                "
            >

                <table
                    className="
                        w-full
                        bg-white
                        dark:bg-gray-800
                        rounded-lg
                        shadow
                    "
                >

                    <thead>

                        <tr
                            className="
                                border-b
                                dark:border-gray-700
                            "
                        >

                            <th className="p-4 text-left">
                                ID
                            </th>

                            <th className="p-4 text-left">
                                Title
                            </th>

                            <th className="p-4 text-left">
                                Author
                            </th>

                            <th className="p-4 text-left">
                                Category
                            </th>

                            <th className="p-4 text-left">
                                Price
                            </th>

                            <th className="p-4 text-left">
                                Stock
                            </th>

                            <th className="p-4 text-left">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredBooks.map(
                                (book) => (

                                    <tr
                                        key={
                                            book.id
                                        }
                                        className={`
                                            border-b
                                            dark:border-gray-700
                                            ${
                                                book.quantity <= 5
                                                  ?"text-red-600 dark:text-red-400"
                                                  :""
                                            }
                                        `}
                                    >

                                        <td className="p-4">
                                            {
                                                book.id
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                book.title
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                book.author
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                book.category
                                            }
                                        </td>

                                        <td className="p-4">
                                            ₹
                                            {
                                                book.price
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                book.quantity
                                            }
                                        </td>

                                        <td className="p-4">

                                            <ActionsDropdown
                                            
                                                actions={[
                                                {
                                                    label: "Edit Book",
                                                    onClick: () =>
                                                    onEditBook?.(book)
                                                },
                                                {
                                                    label: "Delete Book",
                                                    onClick: () =>
                                                        onDeleteBook?.(book)
                                                },
                                                {
                                                    label: "View History",
                                                    onClick: () =>
                                                        onViewHistory?.(book)
                                                }
                                            ]}
                                        />

                                        </td>

                                    </tr>
                                )
                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default BooksPage;