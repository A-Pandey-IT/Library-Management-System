import { useEffect, useState } from "react";

import api from "../services/api";

import LoadingSpinner from "../components/LoadingSpinner";

function MemberDashboard() {

    const [member, setMember] =
        useState(null);
    const [issues, setIssues] = useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile =
    async () => {

        try {

            const response =
                await api.get(
                    "/member/profile"
                );

            setMember(
                response.data.member
            );

            const issueResponse = 
                await api.get(
                    "/member/issues"
                );

            setIssues(
                issueResponse.data.issues
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to load profile."
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

    const issuedBooks = issues.filter(
        issue =>
            issue.status === "ISSUED"
    ).length;

    const returnedBooks = issues.filter(
        issue => 
            issue.status == "RETURNED"
    ).length;

    const outstandingFine = issues.reduce(
        (total, issue)=>
            total + Number(issue.fine),
        0
    );

    return (

        <div
            className="
                max-w-5xl
                mx-auto
                mt-15
                space-y-6
            "
        >

            {/* Welcome */}

            <div
                className="
                    bg-white
                    dark:bg-gray-800
                    rounded-lg
                    shadow
                    p-6
                "
            >

                <h1
                    className="
                        text-3xl
                        font-bold
                    "
                >

                    Welcome,
                    {" "}
                    {member.name}

                </h1>

                <p
                    className="
                        mt-2
                        text-gray-600
                        dark:text-gray-300
                    "
                >

                    Welcome to the
                    Library Management System.

                </p>

            </div>

            {/* Profile */}

            <div
                className="
                    bg-white
                    dark:bg-gray-800
                    rounded-lg
                    shadow
                    p-6
                "
            >

                <h2
                    className="
                        text-2xl
                        font-semibold
                        mb-5
                    "
                >

                    My Profile

                </h2>

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                    "
                >

                    <InfoCard
                        title="Member ID"
                        value={member.id}
                    />

                    <InfoCard
                        title="Name"
                        value={member.name}
                    />

                    <InfoCard
                        title="Email"
                        value={member.email}
                    />

                    <InfoCard
                        title="Phone"
                        value={
                            member.phone ||
                            "Not Available"
                        }
                    />

                    <InfoCard
                        title="Maximum Books"
                        value={
                            member.max_books_allowed
                        }
                    />

                    <InfoCard
                        title="Account Status"
                        value={
                            member.is_active
                                ? "Active"
                                : "Inactive"
                        }
                    />

                    <InfoCard
                        title="Member Since"
                        value={
                            new Date(
                                member.created_at
                            ).toLocaleDateString()
                        }
                    />

                </div>

            </div>

            {/* Statistics */}

            <div
                className="
                    bg-white
                    dark:bg-gray-800
                    rounded-lg
                    shadow
                    p-6
                "
            >

                <h2
                    className="
                        text-2xl
                        font-semibold
                        mb-5
                    "
                >

                    Library Summary

                </h2>

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-3
                        gap-5
                    "
                >

                    <SummaryCard
                        title="Issued Books"
                        value={issuedBooks}
                    />

                    <SummaryCard
                        title="Returned Books"
                        value={returnedBooks}
                    />

                    <SummaryCard
                        title="Outstanding Fine"
                        value={outstandingFine}
                    />

                </div>

            </div>

        </div>

    );

}

function InfoCard({

    title,

    value

}) {

    return (

        <div
            className="
                border
                rounded-lg
                p-4
                dark:border-gray-700
            "
        >

            <p
                className="
                    text-sm
                    text-gray-500
                "
            >

                {title}

            </p>

            <h3
                className="
                    text-lg
                    font-semibold
                    mt-1
                "
            >

                {value}

            </h3>

        </div>

    );

}

function SummaryCard({

    title,

    value

}) {

    return (

        <div
            className="
                border
                rounded-lg
                p-5
                text-center
                dark:border-gray-700
            "
        >

            <h3
                className="
                    text-lg
                    font-semibold
                "
            >

                {title}

            </h3>

            <p
                className="
                    mt-3
                    text-xl
                    font-bold
                "
            >

                {value}

            </p>

        </div>

    );

}

export default MemberDashboard;