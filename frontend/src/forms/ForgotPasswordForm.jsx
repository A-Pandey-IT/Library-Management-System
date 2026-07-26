import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPasswordForm({ userType = "admin" }) {
    const navigate = useNavigate();

    const baseEndpoint =
        userType === "member"
            ? "/member"
            : "/admin";

    const resetPasswordRoute =
        userType === "member"
            ? "/member/reset-password"
            : "/reset-password";

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        return `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    const handleSendOTP = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            if (!email.trim()) {
                setError("Email is required.");
                return;
            }

            const res = await api.post(
                `${baseEndpoint}/send-otp`,
                {
                    email: email.trim(),
                    purpose: "FORGOT_PASSWORD",
                }
            );

            setMessage(res.data.message);
            setOtpSent(true);
            setTimer(600);
            setOtp("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to send OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        sessionStorage.removeItem("resetToken");

        try {

            if (!/^\d{6}$/.test(otp.trim())) {
                setError("Please enter a valid 6-digit OTP.");
                setLoading(false);
                return;
            }
            const res = await api.post(
                `${baseEndpoint}/verify-otp`,
                {
                    email: email.trim(),
                    otp: otp.trim(),
                }
            );

            sessionStorage.setItem(
                "resetToken",
                res.data.resetToken
            );

            navigate(resetPasswordRoute);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {message && (
                <p className="text-green-600 text-sm mb-4 text-center">
                    {message}
                </p>
            )}

            {error && (
                <p className="text-red-600 text-sm mb-4 text-center">
                    {error}
                </p>
            )}

            <label
                className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                    mb-2
                "
            >
                Email
            </label>

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                disabled={otpSent}
                onChange={(e) => setEmail(e.target.value)}
                className="
                    w-full
                    px-4
                    py-3
                    border
                    rounded-lg
                    mb-4
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    dark:bg-gray-800
                    dark:border-gray-700
                    dark:text-white
                "
            />

            {!otpSent && (
                <button
                    onClick={handleSendOTP}
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
                    {loading ? "Sending..." : "Send OTP"}
                </button>
            )}

            {otpSent && (
                <>
                    <label
                        className="
                            block
                            text-sm
                            font-medium
                            text-gray-700
                            dark:text-gray-300
                            mt-5
                            mb-2
                        "
                    >
                        OTP
                    </label>

                    <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        placeholder="Enter 6-digit OTP"
                        onChange={(e) => setOtp(e.target.value)}
                        className="
                            w-full
                            px-4
                            py-3
                            border
                            rounded-lg
                            mb-4
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            dark:bg-gray-800
                            dark:border-gray-700
                            dark:text-white
                        "
                    />

                    <button
                        onClick={handleVerifyOTP}
                        disabled={
                            loading ||
                            !/^\d{6}$/.test(otp)
                        }
                        className="
                            w-full
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            py-3
                            rounded-lg
                            font-semibold
                            transition
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>

                    <div className="text-center mt-4">
                        {timer > 0 ? (
                            <p className="text-gray-600 dark:text-gray-300">
                                OTP expires in{" "}
                                <span className="font-semibold">
                                    {formatTime()}
                                </span>
                            </p>
                        ) : (
                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="
                                    text-blue-600
                                    hover:underline
                                    disabled:opacity-50
                                "
                            >
                                {loading
                                    ? "Sending..."
                                    : "Resend OTP"}
                            </button>
                        )}
                    </div>
                </>
            )}

            <div className="text-center mt-6">
                <Link
                    to={
                        "/"
                    }
                    className="
                        text-blue-600
                        hover:underline
                    "
                >
                    Back to Login
                </Link>
            </div>
        </>
    );
}

export default ForgotPasswordForm;