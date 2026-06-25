import { useEffect, useState } from "react";
import api from "../services/api";

function HomeDashboard() {

    const [stats,
        setStats] =
        useState(null);

    const [recentTransactions,
        setRecentTransactions] =
        useState([]);

    const [lowStockBooks,
        setLowStockBooks] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    useEffect(() => {

        fetchDashboardData();

    }, []);

    const fetchDashboardData =
        async () => {

            try {

                const [
                    statsResponse,
                    transactionResponse,
                    stockResponse
                ] = await Promise.all([
                    api.get(
                        "/dashboard/status"
                    ),
                    api.get(
                        "/dashboard/recent-transactions"
                    ),
                    api.get(
                        "/dashboard/low-stock"
                    )
                ]);

                setStats(
                    statsResponse.data.data
                );

                setRecentTransactions(
                    transactionResponse.data.data || []
                );

                setLowStockBooks(
                    stockResponse.data.data || []
                );

            } catch (error) {

                console.error(error);

                alert(
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);
            }
        };

    if (loading) {

        return (
            <div
                className="
                    text-center
                    text-xl
                "
            >
                Loading Dashboard...
            </div>
        );
    }

    return (

        <div
            className="
                space-y-8
            "
        >

            <h2
                className="
                    text-3xl
                    font-bold
                "
            >
                Dashboard
            </h2>

            {/* Stats Cards */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-5
                    gap-4
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
                        Students
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        {
                            stats.totalStudents
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
                        Issued Books
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        {
                            stats.totalIssuedBooks
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
                        Purchases
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        {
                            stats.totalPurchases
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
                        Revenue
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        ₹{
                            stats.totalRevenue
                        }
                    </p>
                </div>

            </div>

            {/* Recent Transactions */}

            <div
                className="
                    bg-white
                    dark:bg-gray-800
                    rounded-lg
                    shadow
                    p-5
                "
            >

                <h3
                    className="
                        text-xl
                        font-bold
                        mb-4
                    "
                >
                    Recent Transactions
                </h3>

                {
                    recentTransactions.length === 0
                    ? (
                        <p>
                            No transactions found
                        </p>
                    )
                    : (
                        <div
                            className="
                                space-y-3
                            "
                        >
                            {
                                recentTransactions.map(
                                    (transaction) => (

                                        <div
                                            key={
                                                transaction.id
                                            }
                                            className="
                                                border-b
                                                pb-2
                                                dark:border-gray-700
                                            "
                                        >

                                            <strong>
                                                {
                                                    transaction.student_name
                                                }
                                            </strong>

                                            {" - "}

                                            {
                                                transaction.book_title
                                            }

                                            {" - "}

                                            {
                                                transaction.transaction_type
                                            }

                                        </div>

                                    )
                                )
                            }
                        </div>
                    )
                }

            </div>

            {/* Low Stock Books */}

            <div
                className="
                    bg-white
                    dark:bg-gray-800
                    rounded-lg
                    shadow
                    p-5
                "
            >

                <h3
                    className="
                        text-xl
                        font-bold
                        mb-4
                    "
                >
                    Low Stock Books
                </h3>

                {
                    lowStockBooks.length === 0
                    ? (
                        <p>
                            No low stock books
                        </p>
                    )
                    : (
                        <div
                            className="
                                space-y-3
                            "
                        >

                            {
                                lowStockBooks.map(
                                    (book) => (

                                        <div
                                            key={
                                                book.id
                                            }
                                            className="
                                                flex
                                                justify-between
                                                border-b
                                                pb-2
                                                dark:border-gray-700
                                            "
                                        >

                                            <span>
                                                {
                                                    book.title
                                                }
                                            </span>

                                            <span
                                                className="
                                                    font-bold
                                                    text-red-500
                                                "
                                            >
                                                Stock:
                                                {" "}
                                                {
                                                    book.quantity
                                                }
                                            </span>

                                        </div>

                                    )
                                )
                            }

                        </div>
                    )
                }

            </div>

        </div>
    );
}

export default HomeDashboard;