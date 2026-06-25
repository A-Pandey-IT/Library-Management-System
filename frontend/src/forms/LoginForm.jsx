import { useState } from "react";
import {
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import api from "../services/api";

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
                            username,
                            password
                        }
                    );

                localStorage.setItem(
                    "token",
                    response.data.data.token
                );

                setIsLoggedIn(true);

                onSuccess?.();

            } catch (error) {

                alert(
                    error.response?.data?.message ||
                    "Login Failed"
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
                        ? "Logging In..."
                        : "Login"
                }
            </button>

        </form>
    );
}

export default LoginForm;