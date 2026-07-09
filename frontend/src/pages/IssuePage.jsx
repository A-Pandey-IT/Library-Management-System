import { useEffect, useState } from "react";
import api from "../services/api";
import ActionsDropdown from "../components/ActionsDropdown";
import LoadingSpinner from "../components/LoadingSpinner";

function IssuesPage({
    userType,
    refreshData,
    onReturnBook
}) {

    const [issues, setIssues] =
        useState([]);

    const [filteredIssues,
        setFilteredIssues] =
        useState([]);

    const [search,
        setSearch] =
        useState("");

    const [loading,
        setLoading] =
        useState(true);

    const [stats,
        setStats] =
        useState({
            total: 0,
            active: 0,
            returned: 0,
            overdue: 0
        });

    useEffect(() => {

        fetchIssues();

    }, [refreshData]);

    const fetchIssues =
        async () => {
            setLoading(true);

            try {

                const response =
                    await api.get(
                        userType === "member"
                            ? "/member/issues"
                            : "/issues"
                    );

                const data =
                    userType === "member"
                        ?response.data.issues || []
                        :response.data.data || [];
                setIssues(data);

                setFilteredIssues(data);

                calculateStats(data);

            } catch (error) {

                console.error(error);

                alert(
                    "Failed to load issues"
                );

            } finally {

                setLoading(false);
            }
        };

    const calculateStats =
        (data) => {

            const today =
                new Date();

            setStats({
                total:
                    data.length,

                active:
                    data.filter(
                        item =>
                            item.status ===
                            "ISSUED"
                    ).length,

                returned:
                    data.filter(
                        item =>
                            item.status ===
                            "RETURNED"
                    ).length,

                overdue:
                    data.filter(
                        item =>
                            item.status ===
                            "ISSUED" &&
                            new Date(
                                item.due_date
                            ) < today
                    ).length
            });
        };

    const handleSearch =
        (value) => {

            setSearch(value);

            const keyword =
                value.toLowerCase();

            const filtered =
                issues.filter(
                    issue =>

                        String(
                            issue.issue_id
                        ).includes(keyword)

                        ||

                        String(
                            issue.student_id
                        ).includes(keyword)

                        ||

                        String(
                            issue.book_id
                        ).includes(keyword)

                        ||

                        issue.student_name
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        issue.book_title
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        issue.status
                            ?.toLowerCase()
                            .includes(keyword)
                );

            setFilteredIssues(
                filtered
            );
        };

    const formatDate =
        (date) => {

            if (!date)
                return "-";

            return new Date(date)
                .toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );
        };

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    return (

        <div
            className="mt-15"
        >

            <h2
                className="
                    text-3xl
                    font-bold
                    mb-6
                "
            >
                {
                    userType === "member"
                        ? "My Issues"
                        : "Issues"
                }
            </h2>

            {/* Cards */}

            <div
                className="
                    grid
                    md:grid-cols-4
                    gap-4
                    mb-6
                "
            >

                <StatCard
                    title="Total Issues"
                    value={stats.total}
                />

                <StatCard
                    title="Active"
                    value={stats.active}
                />

                <StatCard
                    title="Returned"
                    value={stats.returned}
                />

                <StatCard
                    title="Overdue"
                    value={stats.overdue}
                    danger
                />

            </div>

            {/* Search */}

            {
                userType !== "member" && 
                <>
                <input
                    type="text"
                    placeholder="
                        Search by Issue ID,
                        Student ID,
                        Student Name,
                        Book ID,
                        Book Title,
                        Status
                    "
                    value={search}
                    onChange={(e) =>
                        handleSearch(
                            e.target.value
                        )
                    }
                    className="
                        w-full
                        border
                        rounded
                        p-3
                        mb-6

                        dark:bg-gray-800
                        dark:border-gray-700
                    "
                />
                </>
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

                            <th className="p-4">
                                Issue ID
                            </th>

                            <th className="p-4">
                                Student
                            </th>

                            <th className="p-4">
                                Book
                            </th>

                            <th className="p-4">
                                Issue Date
                            </th>

                            <th className="p-4">
                                Due Date
                            </th>

                            <th className="p-4">
                                Status
                            </th>

                            {
                                userType !== "member" && (
                                    <th className="p-4">
                                        Actions
                                    </th>
                                )
                            }

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredIssues.map(
                                issue => (

                                    <tr
                                        key={
                                            issue.issue_id
                                        }
                                        className="
                                            border-b
                                            dark:border-gray-700
                                        "
                                    >

                                        <td className="p-4">
                                            {issue.issue_id}
                                        </td>

                                        <td className="p-4">
                                            #{issue.student_id}
                                            <br />
                                            {issue.student_name}
                                        </td>

                                        <td className="p-4">
                                            #{issue.book_id}
                                            <br />
                                            {issue.book_title}
                                        </td>

                                        <td className="p-4">
                                            {
                                                formatDate(
                                                    issue.issue_date
                                                )
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                formatDate(
                                                    issue.due_date
                                                )
                                            }
                                        </td>

                                        <td className="p-4">

                                            <span
                                                className={`
                                                    px-2
                                                    py-1
                                                    rounded
                                                    text-white

                                                    ${
                                                        issue.status === "ISSUED"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-600"
                                                    }
                                                `}
                                            >
                                                {issue.status}
                                            </span>

                                        </td>

                                        {
                                            userType !== "member" && (

                                            <td className="p-4">

                                                <ActionsDropdown
                                                    actions={[
                                                        ...(issue.status === "ISSUED"
                                                            ? [{
                                                                label:
                                                                    "Return Book",
                                                                onClick:
                                                                    () =>
                                                                        onReturnBook?.(
                                                                            issue
                                                                        )
                                                                }]
                                                            : [])
                                                    ]}
                                                />
                                                

                                            </td>)
                                        }

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

function StatCard({
    title,
    value,
    danger
}) {

    return (

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
                {title}
            </h3>

            <p
                className={`
                    text-2xl
                    font-bold

                    ${
                        danger
                            ? "text-red-500"
                            : ""
                    }
                `}
            >
                {value}
            </p>

        </div>
    );
}

export default IssuesPage;