import { useEffect, useState } from "react";

import api from "../services/api";

import LoadingSpinner from "../components/LoadingSpinner";

import ActionsDropdown from "../components/ActionsDropdown";

import toast from "react-hot-toast";

function StudentPurchases({
    student,
    onViewPurchase
}) {

    const [
        purchases,
        setPurchases
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    useEffect(() => {

        if (student) {
            fetchPurchases();
        }

    }, [student]);

    const fetchPurchases =
        async () => {

            try {

                setLoading(true);

                const response =
                   await api.get(`/purchase/student?id=${student.id}`);

                setPurchases(

                    response.data.data || []

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

    if (loading) {

        return (
            <LoadingSpinner />
        );

    }

    return (

        <div
            className="
                space-y-3
                max-h-96
                overflow-y-auto
            "
        >

            {

                purchases.length === 0

                ? (

                    <p>
                        No purchases found.
                    </p>

                )

                : (

                    purchases.map(

                        (purchase) => (

                            <div
                                key={purchase.id}
                                className="
                                    border
                                    rounded-lg
                                    p-4
                                    flex
                                    justify-between
                                    items-start
                                    gap-4

                                    dark:border-gray-700
                                "
                            >

                                <div
                                    className="space-y-2"
                                >

                                    <h3
                                        className="
                                            font-bold
                                            text-lg
                                        "
                                    >
                                        {
                                            purchase.book_title
                                        }
                                    </h3>

                                    <p>

                                        <strong>
                                            Quantity:
                                        </strong>

                                        {" "}

                                        {
                                            purchase.quantity
                                        }

                                    </p>

                                    <p>

                                        <strong>
                                            Total Price:
                                        </strong>

                                        {" "}

                                        ₹
                                        {
                                            purchase.total_price
                                        }

                                    </p>

                                    <p>

                                        <strong>
                                            Purchased:
                                        </strong>

                                        {" "}

                                        {

                                            new Date(

                                                purchase.purchased_date

                                            ).toLocaleString(
                                                "en-IN"
                                            )

                                        }

                                    </p>

                                </div>

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

                            </div>

                        )

                    )

                )

            }

        </div>

    );

}

export default StudentPurchases;