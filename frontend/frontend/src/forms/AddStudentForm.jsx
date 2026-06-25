import { useState } from "react";
import api from "../services/api";

function AddStudentForm({
    onSuccess,
    onClose
}) {

    const [formData,
        setFormData] =
        useState({
            name: "",
            email: "",
            phone: ""
        });

    const [loading,
        setLoading] =
        useState(false);

    const handleChange =
        (e) => {

            setFormData({
                ...formData,
                [e.target.name]:
                    e.target.value
            });
        };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                if (
                    !formData.name.trim()
                ) {

                    alert(
                        "Name is required"
                    );

                    return;
                }

                if (
                    !formData.email.trim()
                ) {

                    alert(
                        "Email is required"
                    );

                    return;
                }

                setLoading(true);

                const response =
                    await api.post(
                        "/students",
                        formData
                    );

                alert(
                    response.data.message ||
                    "Student added successfully"
                );

                onSuccess?.();

                onClose?.();

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to add student"
                );

            } finally {

                setLoading(false);
            }
        };

    return (

        <form
            onSubmit={
                handleSubmit
            }
            className="
                flex
                flex-col
                gap-4
            "
        >

            <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={
                    formData.name
                }
                onChange={
                    handleChange
                }
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={
                    formData.email
                }
                onChange={
                    handleChange
                }
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            <input
                type="text"
                name="phone"
                placeholder="Phone (Optional)"
                value={
                    formData.phone
                }
                onChange={
                    handleChange
                }
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            <button
                type="submit"
                disabled={
                    loading
                }
                className="
                    bg-gradient-to-r
                    from-cyan-800
                    to-cyan-700
                    text-white
                    py-3
                    rounded

                    hover:from-cyan-700
                    hover:to-cyan-600
                "
            >
                {
                    loading
                        ? "Saving..."
                        : "Add Member"
                }
            </button>

        </form>
    );
}

export default AddStudentForm;