import { useEffect, useState } from "react";
import api from "../services/api";
import ActionsDropdown from "../components/ActionsDropdown";

function UsersPage({
    refreshData,
    onIssueBook,
    onEditStudent,
    onDeleteStudent,
    onViewHistory
}) {

    const [students,
        setStudents] =
        useState([]);

    const [filteredStudents,
        setFilteredStudents] =
        useState([]);

    const [search,
        setSearch] =
        useState("");

    const [loading,
        setLoading] =
        useState(true);

    useEffect(() => {

        fetchStudents();

    }, [refreshData]);

    const fetchStudents =
        async () => {

            try {

                const response =
                    await api.get(
                        "/students"
                    );

                const data =
                    response.data.data ||
                    response.data;

                setStudents(data);

                setFilteredStudents(
                    data
                );

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Failed to load students"
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
                students.filter(
                    (student) =>
                        String(student.id)
                            .includes(keyword) ||

                        student.name
                            ?.toLowerCase()
                            .includes(keyword) ||

                        student.email
                            ?.toLowerCase()
                            .includes(keyword) 
                );

            setFilteredStudents(
                filtered
            );
        };

    if (loading) {

        return (
            <h2>
                Loading...
            </h2>
        );
    }

    return (

        <div
            className="mt-20"
        >

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
                        sm:text-2xl
                        font-bold
                    "
                >
                    USERS
                </h2>

                <input
                    type="text"
                    placeholder="Search Student"
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
                                Name
                            </th>

                            <th className="p-4 text-left">
                                Email
                            </th>

                            <th className="p-4 text-left">
                                 Phone
                            </th>

                            <th className="p-4 text-left">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredStudents.map(
                                (
                                    student
                                ) => (

                                    <tr
                                        key={
                                            student.id
                                        }
                                        className="
                                            border-b
                                            dark:border-gray-700
                                        "
                                    >

                                        <td className="p-4">
                                            {
                                                student.id
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                student.name
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                student.email
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                student.phone
                                            }
                                        </td>

                                        <td className="p-4">

                                            <ActionsDropdown
                                                actions={[
                                                    {
                                                        label: "Issue Book",
                                                        onClick: () =>
                                                            onIssueBook?.(student)
                                                    },
                                                    {
                                                        label: "Edit Student",
                                                            onClick: () =>
                                                                onEditStudent?.(student)
                                                    },
                                                    {
                                                        label: "Delete Student",
                                                        onClick: () =>
                                                            onDeleteStudent?.(student)
                                                    },
                                                    {
                                                        label: "View History",
                                                        onClick: () =>
                                                            onViewHistory?.(student)
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

export default UsersPage;