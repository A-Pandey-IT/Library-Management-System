import { useEffect, useState } from "react";
import api from "../services/api";
import ActionsDropdown from "../components/ActionsDropdown";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function PurchasePage({
    refreshData,
    onViewPurchase
}) {

    const [purchases,
        setPurchases] =
        useState([]);

    const [filteredPurchases,
        setFilteredPurchases] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    const [search,
        setSearch] =
        useState("");

    useEffect(() => {
        fetchPurchases();
    }, [refreshData]);

    const fetchPurchases =
        async () => {

            try {

                setLoading(true);

                const response =
                    await api.get(
                        "/purchase"
                    );

                const data =
                    response.data.data || [];

                setPurchases(data);

                setFilteredPurchases(
                    data
                );

            } catch (error) {

                console.error(error);

                toast.error(
                    "Failed to load purchases"
                );

            } finally {

                setLoading(false);
            }
        };

    const handleSearch =
        (value) => {

            setSearch(value);

            const keyword =
                value.toLowerCase();

            const filtered =
                purchases.filter(
                    purchase =>

                        String(
                            purchase.id
                        ).includes(keyword)

                        ||

                        purchase.student_name
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        purchase.book_title
                            ?.toLowerCase()
                            .includes(keyword)
                );

            setFilteredPurchases(
                filtered
            );
        };

    const totalRevenue =
        purchases.reduce(
            (
                total,
                purchase
            ) =>
                total +
                Number(
                    purchase.total_price
                ),
            0
        );

    const totalQuantity =
        purchases.reduce(
            (
                total,
                purchase
            ) =>
                total +
                Number(
                    purchase.quantity
                ),
            0
        );

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    return (

        <div
            className="mt-15"
        >

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-4
                    mb-6
                "
            >

                <div
                    className="
                        bg-white
                        dark:bg-gray-800
                        p-4
                        rounded-lg
                        shadow
                    "
                >
                    <h3>
                        Total Purchases
                    </h3>

                    <p
                        className="
                            text-2xl
                            font-bold
                        "
                    >
                        {
                            purchases.length
                        }
                    </p>

                </div>

                <div
                    className="
                        bg-white
                        dark:bg-gray-800
                        p-4
                        rounded-lg
                        shadow
                    "
                >
                    <h3>
                        Books Sold
                    </h3>

                    <p
                        className="
                            text-2xl
                            font-bold
                        "
                    >
                        {
                            totalQuantity
                        }
                    </p>

                </div>

                <div
                    className="
                        bg-white
                        dark:bg-gray-800
                        p-4
                        rounded-lg
                        shadow
                    "
                >
                    <h3>
                        Total Revenue
                    </h3>

                    <p
                        className="
                            text-2xl
                            font-bold
                            text-green-600
                        "
                    >
                        ₹
                        {
                            totalRevenue.toFixed(
                                2
                            )
                        }
                    </p>

                </div>

            </div>

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
                    PURCHASES
                </h2>

                <input
                    type="text"
                    placeholder="
                        Search Purchase
                    "
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
                                Student
                            </th>

                            <th className="p-4 text-left">
                                Book
                            </th>

                            <th className="p-4 text-left">
                                Quantity
                            </th>

                            <th className="p-4 text-left">
                                Price
                            </th>

                            <th className="p-4 text-left">
                                Date
                            </th>

                            <th className="p-4 text-left">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredPurchases.map(
                                purchase => (

                                    <tr
                                        key={
                                            purchase.id
                                        }
                                        className="
                                            border-b
                                            dark:border-gray-700
                                        "
                                    >

                                        <td className="p-4">
                                            {
                                                purchase.id
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                purchase.student_name
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                purchase.book_title
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                purchase.quantity
                                            }
                                        </td>

                                        <td className="p-4">
                                            ₹
                                            {
                                                purchase.total_price
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                new Date(
                                                    purchase.purchased_date
                                                ).toLocaleDateString()
                                            }
                                        </td>

                                        <td className="p-4">

                                            <ActionsDropdown
                                                actions={[
                                                    {
                                                        label:
                                                            "View Details",

                                                        onClick:
                                                            () =>
                                                                onViewPurchase?.(
                                                                    purchase
                                                                )
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

export default PurchasePage;