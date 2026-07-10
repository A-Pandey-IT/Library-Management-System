import { useState } from "react";
import api from "../services/api";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

function ReturnBookForm({
    issue,
    onSuccess,
    onClose
}) {

    const [returning, setReturning] =
    useState(false);

    const handleReturn =
        async () => {

            try {

                setReturning(true);

                const response =
                    await api.post(
                        "/returns",
                        {
                            student_id:
                                issue.student_id,

                            book_id:
                                issue.book_id
                        }
                    );

                let message =
                    response.data.message;

                if (
                    response.data.fine > 0
                ) {

                    message +=
                        `\nFine: ₹${response.data.fine}`;

                    message +=
                        `\nOverdue Days: ${response.data.overdueDays}`;
                }

                onSuccess?.();

                onClose?.();

                toast.success(message);

            } catch (error) {

                console.error(error);

                toast.error(
                    error.response?.data?.message ||
                    "Failed to return book"
                );

            } finally {

                setReturning(false);
            }
        };

    if (!issue) {

        return (
            <p>
                No issue selected
            </p>
        );
    }

    return (

        <div
            className="
                flex
                flex-col
                gap-4
            "
        >

            <div
                className="
                    bg-gray-100
                    dark:bg-gray-800
                    p-4
                    rounded-lg
                "
            >

                <p>
                    <strong>
                        Student:
                    </strong>
                    {" "}
                    {
                        issue.student_name
                    }
                </p>

                <p>
                    <strong>
                        Book:
                    </strong>
                    {" "}
                    {
                        issue.book_title
                    }
                </p>

                <p>
                    <strong>
                        Issue Date:
                    </strong>
                    {" "}
                    {
                        new Date(
                            issue.issue_date
                        ).toLocaleDateString()
                    }
                </p>

                <p>
                    <strong>
                        Due Date:
                    </strong>
                    {" "}
                    {
                        new Date(
                            issue.due_date
                        ).toLocaleDateString()
                    }
                </p>

            </div>

            <button
                type="button"
                onClick={handleReturn}
                disabled={returning}
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
                        returning
                            ? "bg-orange-400 cursor-not-allowed"
                            : "bg-orange-600 hover:bg-orange-700"
                    }
                `}
            >

                {
                    returning
                        ? (
                            <>
                                <FaSpinner
                                    className="animate-spin"
                                />

                                Returning Book...
                            </>
                        )
                        : (
                            "Return Book"
                        )
                }

        </button>

        </div>
    );
}

export default ReturnBookForm;