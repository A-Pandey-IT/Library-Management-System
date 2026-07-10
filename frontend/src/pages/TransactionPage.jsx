import { useEffect, useState } from "react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function TransactionPage({
    userType
}) {

const [transactions, setTransactions] =
    useState([]);

const [loading, setLoading] =
    useState(true);

const [studentSearch,
    setStudentSearch] =
    useState("");

const [bookSearch,
    setBookSearch] =
    useState("");

useEffect(() => {
    fetchTransactions();
}, []);

const fetchTransactions =
    async () => {

        try {

            setLoading(true);

            const response =
                await api.get(
                    userType === "member"
                        ? "/member/transactions"
                        : "/transaction"
                );

            setTransactions(
                userType === "member"
                    ? response.data.transactions 
                    : response.data.data 
            );

        } catch(error){

            console.error(error);

            toast.error(
                "Failed to load transactions"
            );

        } finally{

            setLoading(false);
        }
    };

const searchByStudent =
    async () => {

        if(
            !studentSearch.trim()
        ){
            fetchTransactions();
            return;
        }

        try {

            setLoading(true);

            const isNumeric =
                !isNaN(studentSearch);

            const response =
                await api.get(
                    "/transaction/student",
                    {
                        params: isNumeric
                            ? {
                                id:
                                studentSearch
                            }
                            : {
                                name:
                                studentSearch
                            }
                    }
                );

            setTransactions(
                response.data.data || []
            );

        } catch(error){

            if(
                error.response?.status === 404
            ){

                setTransactions([]);

            }else{

                console.error(error);

                toast.error(
                    "Failed to search student transactions"
                );
            }

        } finally{

            setLoading(false);
        }
    };

const searchByBook =
    async () => {

        if(
            !bookSearch.trim()
        ){
            fetchTransactions();
            return;
        }

        try {

            setLoading(true);

            const isNumeric =
                !isNaN(bookSearch);

            const response =
                await api.get(
                    "/transaction/book",
                    {
                        params: isNumeric
                            ? {
                                id:
                                bookSearch
                            }
                            : {
                                title:
                                bookSearch
                            }
                    }
                );

            setTransactions(
                response.data.data || []
            );

        } catch(error){

            if(
                error.response?.status === 404
            ){

                setTransactions([]);

            }else{

                console.error(error);

                toast.error(
                    "Failed to search book transactions"
                );
            }

        } finally{

            setLoading(false);
        }
    };

const totalTransactions =
    transactions.length;

const totalIssues =
    transactions.filter(
        t =>
            t.transaction_type ===
            "ISSUE"
    ).length;

const totalReturns =
    transactions.filter(
        t =>
            t.transaction_type ===
            "RETURN"
    ).length;

const totalPurchases =
    transactions.filter(
        t =>
            t.transaction_type ===
            "PURCHASE"
    ).length;

    if (loading) {
        return (
            <LoadingSpinner 
                text="Loading transactions..."
            />
        );
    }

return (

    <div
        className="mt-15"
    >

        <h2
            className="
                text-3xl
                sm:text-2xl
                font-bold
                mb-6
            "
        >
            {
                userType === "member" 
                    ? "My Transactions"
                    : "TRANSACTIONS"
            }
        </h2>

        <div
            className="
                grid
                grid-cols-1
                md:grid-cols-4
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
                    Total Transactions
                </h3>

                <p
                    className="
                        text-3xl
                        font-bold
                    "
                >
                    {totalTransactions}
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
                    Issues
                </h3>

                <p
                    className="
                        text-3xl
                        font-bold
                    "
                >
                    {totalIssues}
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
                    Returns
                </h3>

                <p
                    className="
                        text-3xl
                        font-bold
                    "
                >
                    {totalReturns}
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
                    Purchases
                </h3>

                <p
                    className="
                        text-3xl
                        font-bold
                    "
                >
                    {totalPurchases}
                </p>

            </div>

        </div>

        {   
            userType !== "member" &&(

            <div
                className="
                    grid
                    md:grid-cols-2
                    gap-4
                    mb-6
                "
            >
            
            
    
                <div
                    className="
                        flex
                        gap-2
                    "
                >

                    <input
                        type="text"
                        placeholder="
                            Student Name or ID
                        "
                        value={
                            studentSearch
                        }
                        onChange={(e)=>
                            setStudentSearch(
                                e.target.value
                            )
                        }
                        className="
                            flex-1
                            border
                            rounded
                            px-4
                            py-2

                            dark:bg-gray-800
                        "
                    />

                    <button
                        onClick={
                            searchByStudent
                        }
                        className="
                            bg-blue-600
                            text-white
                            px-4
                            rounded
                        "
                    >
                        Search
                    </button>

                </div>
            

                <div
                    className="
                        flex
                        gap-2
                    "
                >

                    <input
                        type="text"
                        placeholder="
                            Book Title or ID
                        "
                        value={
                            bookSearch
                        }
                        onChange={(e)=>
                            setBookSearch(
                                e.target.value
                            )
                        }
                        className="
                            flex-1
                            border
                            rounded
                            px-4
                            py-2

                            dark:bg-gray-800
                        "
                    />

                    <button
                        onClick={
                            searchByBook
                        }
                        className="
                            bg-green-600
                            text-white
                            px-4
                            rounded
                        "
                    >
                        Search
                    </button>

                </div>
                
            

            </div>
                )
        }

        {
            userType !== "member" &&
            <button
                onClick={
                    fetchTransactions
                }
                className="
                    mb-6
                    bg-gray-700
                    text-white
                    px-4
                    py-2
                    rounded
                "
            >
                Show All Transactions
            </button>
        }

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

                        {
                            userType !== "member" && (
                                <th className="p-4 text-left">
                                    Student
                                </th>
                            )
                        }

                        <th className="p-4 text-left">
                            Book
                        </th>

                        <th className="p-4 text-left">
                            Type
                        </th>

                        <th className="p-4 text-left">
                            Date
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        transactions.map(
                            transaction => (

                                <tr
                                    key={
                                        transaction.transaction_id
                                    }
                                    className="
                                        border-b
                                        dark:border-gray-700
                                    "
                                >

                                    <td className="p-4">
                                        {
                                            transaction.transaction_id
                                        }
                                    </td>

                                    {
                                        userType !== "member" && (
                                            <td className="p-4">
                                                {
                                                    transaction.student_name
                                                }
                                            </td>
                                        )
                                    }

                                    
                                    <td className="p-4">
                                        {
                                            transaction.book_title
                                        }
                                    </td>
                                        
                                    

                                    <td className="p-4">
                                        {
                                            transaction.transaction_type
                                        }
                                    </td>

                                    <td className="p-4">
                                        {
                                            new Date(
                                                transaction.transaction_date
                                            )
                                            .toLocaleDateString()
                                        }
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

export default TransactionPage;
