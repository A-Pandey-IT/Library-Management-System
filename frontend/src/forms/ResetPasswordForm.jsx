import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPasswordForm() {

    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setError("");

        setSuccess("");

        const token = sessionStorage.getItem("resetToken");

        if(!token){
            setError("Reset session expired. Please verify OTP again.");
            setLoading(false);
            setTimeout(() => {
                navigate("/forgot-password");
            }, 1500);
            
            return;
        }

        try {

            if(newPassword !== confirmPassword){
                setError("Passwords do not match.");
                setLoading(false);
                return;
            }

            const res = await api.put(
                "/admin/reset-password",
                {
                    newPassword,
                    confirmPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess(res.data.message);

            sessionStorage.removeItem(
                "resetToken"
            );

            setTimeout(() => {

                navigate("/");

            }, 2000);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to reset password."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            {success && (

                <p className="text-green-600 text-center">

                    {success}

                </p>

            )}

            {error && (

                <p className="text-red-600 text-center">

                    {error}

                </p>

            )}

            <div>

                <label
                    className="
                        block
                        mb-2
                        text-sm
                        font-medium
                        text-gray-700
                        dark:text-gray-300
                    "
                >
                    New Password
                </label>

                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                            e.target.value
                        )
                    }
                    placeholder="Enter new password"
                    required
                    className="
                        w-full
                        px-4
                        py-3
                        border
                        rounded-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        dark:bg-gray-800
                        dark:border-gray-700
                        dark:text-white
                    "
                />

            </div>

            <div>

                <label
                    className="
                        block
                        mb-2
                        text-sm
                        font-medium
                        text-gray-700
                        dark:text-gray-300
                    "
                >
                    Confirm Password
                </label>

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(
                            e.target.value
                        )
                    }
                    placeholder="Confirm new password"
                    required
                    className="
                        w-full
                        px-4
                        py-3
                        border
                        rounded-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        dark:bg-gray-800
                        dark:border-gray-700
                        dark:text-white
                    "
                />

            </div>

            <button
                type="submit"
                disabled={loading}
                className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-3
                    rounded-lg
                    font-semibold
                    transition
                    disabled:opacity-50
                "
            >
                {
                    loading
                        ? "Resetting..."
                        : "Reset Password"
                }
            </button>

        </form>

    );

}

export default ResetPasswordForm;
