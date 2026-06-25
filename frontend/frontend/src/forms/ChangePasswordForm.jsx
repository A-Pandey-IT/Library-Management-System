import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../services/api";

function ChangePasswordForm({ onBack }) {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.put(
                "/admin/change-password",
                formData
            );

            alert(
                "Password changed successfully. Please Login again."
            );

            localStorage.removeItem("token");

            window.location.reload();

            onBack?.();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            {/* Current Password */}
            <div className="relative">
                <input
                    type={
                        showCurrentPassword
                            ? "text"
                            : "password"
                    }
                    name="currentPassword"
                    placeholder="Current Password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="border p-3 rounded w-full pr-12"
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowCurrentPassword(
                            !showCurrentPassword
                        )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    {showCurrentPassword ? (
                        <FaEyeSlash />
                    ) : (
                        <FaEye />
                    )}
                </button>
            </div>

            {/* New Password */}
            <div className="relative">
                <input
                    type={
                        showNewPassword
                            ? "text"
                            : "password"
                    }
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="border p-3 rounded w-full pr-12"
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowNewPassword(
                            !showNewPassword
                        )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    {showNewPassword ? (
                        <FaEyeSlash />
                    ) : (
                        <FaEye />
                    )}
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white py-3 rounded"
            >
                {loading
                    ? "Updating..."
                    : "Update Password"}
            </button>
        </form>
    );
}

export default ChangePasswordForm;