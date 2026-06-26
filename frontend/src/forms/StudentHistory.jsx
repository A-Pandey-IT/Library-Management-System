import { useEffect, useState } from "react";
import api from "../services/api";

function StudentHistory({
    student
}) {

    const [history,
        setHistory] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    useEffect(() => {

        if(student){
            fetchHistory();
        }

    }, [student]);

    const fetchHistory =
        async () => {

            try {

                const response =
                    await api.get(
                        `/issues/member?id=${student.id}`
                    );

                setHistory(
                    response.data.data || []
                );

            } catch(error){

                console.error(error);

            } finally{

                setLoading(false);
            }
        };

    if(loading){
        return (
            <p>
                Loading history...
            </p>
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
                history.length === 0
                ? (
                    <p>
                        No records found
                    </p>
                )
                : (
                    history.map(item => (

                        <div
                            key={item.issue_id}
                            className="
                                border
                                p-3
                                rounded
                            "
                        >

                            <h3
                                className="
                                    font-bold
                                "
                            >
                                {item.book_title}
                            </h3>

                            <p>
                                Issue:
                                {" "}
                                {new Date(item.issue_date).toLocaleString("en-IN")}
                            </p>

                            <p>
                                Due:
                                {" "}
                                {new Date(item.due_date).toLocaleDateString("en-IN")}
                            </p>

                            <p>
                                Return:
                                {" "}
                                {
                                    item.return_date 
                                    ? new Date(item.return_date).toLocaleDateString("en-IN")
                                    : "Not Returned"
                                }
                            </p>

                            <p>
                                Fine:
                                ₹{item.fine}
                            </p>

                            <p>
                                Status:
                                {" "}
                                {item.status}
                            </p>

                        </div>
                    ))
                )
            }

        </div>
    );
}

export default StudentHistory;