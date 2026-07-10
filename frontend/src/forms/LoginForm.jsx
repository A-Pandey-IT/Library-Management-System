import { useState } from "react";
import {
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import api from "../services/api";

import toast from "react-hot-toast";

function LoginForm({
    setIsLoggedIn,
    onSuccess
}) {

    const [username,
        setUsername] =
        useState("");

    const [password,
        setPassword] =
        useState("");

    const [showPassword,
        setShowPassword] =
        useState(false);

    const [loading,
        setLoading] =
        useState(false);

    const handleLogin =
        async (e) => {

            e.preventDefault();

            try {

                setLoading(true);

                const response =
                    await api.post(
                        "/admin/login",
                        {
                            username: username.trim(),
                            password
                        }
                    );

                const staff =
                    response.data.data;
                    console.log(staff);

                    localStorage.setItem(
                        "token",
                        staff.token
                    );

                    localStorage.setItem(
                        "adminId",
                        staff.adminId
                    );

                    localStorage.setItem(
                        "username",
                        staff.username
                    );

                    localStorage.setItem(
                        "role",
                        staff.role
                    );

                    localStorage.setItem(
                        "userType",
                        "staff"
                    );

                    localStorage.setItem(
                        "isLoggedIn",
                        "true"
                    );

                setIsLoggedIn(true);

                onSuccess?.();

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Unable to login."
                );

            } finally {

                setLoading(false);

            }
        };

    return (

        <form
            onSubmit={handleLogin}
            className="
                flex
                flex-col
                gap-4
            "
        >

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                    setUsername(
                        e.target.value
                    )
                }
                className="
                    border
                    rounded
                    p-3
                    dark:bg-gray-700
                    dark:text-white
                "
                required
            />

            <div
                className="relative"
            >

                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                    className="
                        border
                        rounded
                        p-3
                        pr-12
                        w-full
                        dark:bg-gray-700
                        dark:text-white
                    "
                    required
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowPassword(
                            !showPassword
                        )
                    }
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                    "
                >
                    {
                        showPassword
                            ? <FaEyeSlash />
                            : <FaEye />
                    }
                </button>

            </div>

            <button
                type="submit"
                disabled={loading}
                className="
                    bg-blue-600
                    text-white
                    py-3
                    rounded
                    hover:bg-blue-700
                    disabled:bg-gray-400
                "
            >
                {
                    loading
                        ? "Signing In..."
                        : "Staff Login"
                }
            </button>

        </form>
    );
}

export default LoginForm;