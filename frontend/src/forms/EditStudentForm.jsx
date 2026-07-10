import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function EditStudentForm({
    student,
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

                    toast.error(
                        "Name is required"
                    );

                    return;
                }

                if (
                    !formData.email.trim()
                ) {

                    toast.error(
                        "Email is required"
                    );

                    return;
                }

                setLoading(true);

                const response =
                    await api.put(
                        `/students/${student.id}`,
                        formData
                    );

                toast.success(
                    response.data.message ||
                    "Student updated successfully"
                );

                onSuccess?.();

                onClose?.();

            } catch (error) {

                console.error(
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to update student"
                );

            } finally {

                setLoading(false);
            }
        };

    useEffect(() => {

        if(student){

            setFormData({
                name: student.name || "",
                email: student.email || "",
                phone: student.phone || ""
            });

        }

    }, [student]);

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
                    bg-green-600
                    text-white
                    py-3
                    rounded

                    hover:bg-green-700
                "
            >
                {
                    loading
                        ? "Saving..."
                        : "Update Student"
                }
            </button>

        </form>
    );
}

export default EditStudentForm;