import { useState } from "react";
import api from "../services/api";

function ReturnBookForm({
    issue,
    onSuccess,
    onClose
}) {

    const [loading,
        setLoading] =
        useState(false);

    const handleReturn =
        async () => {

            try {

                setLoading(true);

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

                alert(message);

            } catch (error) {

                console.error(error);

                alert(
                    error.response?.data?.message ||
                    "Failed to return book"
                );

            } finally {

                setLoading(false);
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
                onClick={
                    handleReturn
                }
                disabled={
                    loading
                }
                className="
                    bg-red-600
                    text-white
                    py-3
                    rounded

                    hover:bg-red-700

                    disabled:bg-gray-400
                "
            >
                {
                    loading
                        ? "Returning..."
                        : "Return Book"
                }
            </button>

        </div>
    );
}

export default ReturnBookForm;