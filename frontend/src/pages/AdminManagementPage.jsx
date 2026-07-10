import { useEffect, useState } from "react";
import api from "../services/api";

import LoadingSpinner from "../components/LoadingSpinner";

import toast from "react-hot-toast";

function AdminManagementPage({

    refreshData,

    onAddAdmin,

    onDeleteAdmin

}) {

    const [admins, setAdmins] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchAdmins();

    }, [refreshData]);

    const fetchAdmins = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/admin");

            setAdmins(
                response.data.admins
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch admins."
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
                bg-white
                dark:bg-gray-800
                rounded-lg
                shadow
                mt-15
                p-6
            "
        >

            <div
                className="
                    flex
                    justify-between
                    items-center
                    mb-5
                "
            >

                <h2
                    className="
                        text-2xl
                        font-bold
                    "
                >
                    Admin Management
                </h2>

                <button
                    onClick={onAddAdmin}
                    className="
                        bg-blue-600
                        text-white
                        px-4
                        py-2
                        rounded
                    "
                >
                    Add Admin
                </button>

            </div>

            <table
                className="
                    w-full
                    border-collapse
                "
            >

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Username</th>

                        <th>Role</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        admins.map((admin) => (

                            <tr key={admin.id}>

                                <td>{admin.id}</td>

                                <td>{admin.username}</td>

                                <td>{admin.role}</td>

                                <td>

                                    <button

                                        onClick={() =>
                                            onDeleteAdmin(admin)
                                        }

                                        className="
                                            bg-red-600
                                            text-white
                                            px-3
                                            py-1
                                            rounded
                                        "

                                    >

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default AdminManagementPage;