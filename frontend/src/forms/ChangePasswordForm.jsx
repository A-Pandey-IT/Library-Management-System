import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../services/api";
import toast, { useToasterStore } from "react-hot-toast";

function ChangePasswordForm({ 
    endpoint,
    onSuccess,
    buttonText = "Update Password"
 }) {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const validatePassword = (password) => {
        return {
            minLength: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            specialChar:
                /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    };

    const passwordRules = validatePassword(
        formData.newPassword
    );

    const isPasswordValid = Object.values(
        passwordRules
    ).every(Boolean);

    const passwordsMatch =
        formData.newPassword ===
        formData.confirmPassword;

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error(
                "Password does not meet all security requirements."
            );
            return;
        }

        if (!passwordsMatch) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const requestBody =
                endpoint === "/member/changeUserPassword"
                ? {
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                }
                : {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                };
            console.log("Endpoint:", endpoint);
            console.log("Request Body:", requestBody);

            await api.put(
                endpoint,
                requestBody
            );

            toast.success(
                "Password changed successfully."
            );
            onSuccess?.();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to update password."
            );
        } finally {
            setLoading(false);
        }
    };

    const PasswordToggle = ({
        show,
        setShow,
    }) => (
        <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
            {show ? <FaEyeSlash /> : <FaEye />}
        </button>
    );

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
                    required
                    className="border p-3 rounded w-full pr-12"
                />

                <PasswordToggle
                    show={showCurrentPassword}
                    setShow={
                        setShowCurrentPassword
                    }
                />
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
                    required
                    className="border p-3 rounded w-full pr-12"
                />

                <PasswordToggle
                    show={showNewPassword}
                    setShow={setShowNewPassword}
                />
            </div>

            {/* Password Rules */}
            <div className="text-sm space-y-1">
                <p
                    className={
                        passwordRules.minLength
                            ? "text-green-600"
                            : "text-red-500"
                    }
                >
                    ✓ Minimum 8 characters
                </p>

                <p
                    className={
                        passwordRules.uppercase
                            ? "text-green-600"
                            : "text-red-500"
                    }
                >
                    ✓ At least one uppercase letter
                </p>

                <p
                    className={
                        passwordRules.lowercase
                            ? "text-green-600"
                            : "text-red-500"
                    }
                >
                    ✓ At least one lowercase letter
                </p>

                <p
                    className={
                        passwordRules.number
                            ? "text-green-600"
                            : "text-red-500"
                    }
                >
                    ✓ At least one number
                </p>

                <p
                    className={
                        passwordRules.specialChar
                            ? "text-green-600"
                            : "text-red-500"
                    }
                >
                    ✓ At least one special character
                </p>
            </div>

            {/* Confirm Password */}
            <div className="relative">
                <input
                    type={
                        showConfirmPassword
                            ? "text"
                            : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={
                        formData.confirmPassword
                    }
                    onChange={handleChange}
                    required
                    className="border p-3 rounded w-full pr-12"
                />

                <PasswordToggle
                    show={showConfirmPassword}
                    setShow={
                        setShowConfirmPassword
                    }
                />
            </div>

            {formData.confirmPassword && (
                <p
                    className={
                        passwordsMatch
                            ? "text-green-600 text-sm"
                            : "text-red-500 text-sm"
                    }
                >
                    {passwordsMatch
                        ? "Passwords match"
                        : "Passwords do not match"}
                </p>
            )}

            <button
                type="submit"
                disabled={
                    loading ||
                    !isPasswordValid ||
                    !passwordsMatch
                }
                className={`py-3 rounded text-white ${
                    loading ||
                    !isPasswordValid ||
                    !passwordsMatch
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                }`}
            >
                {loading
                    ? "Updating..."
                    : buttonText
                }
            </button>
        </form>
    );
}

export default ChangePasswordForm;