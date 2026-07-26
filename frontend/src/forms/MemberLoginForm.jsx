import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import api from "../services/api";

import toast from "react-hot-toast";

function MemberLoginForm({

    setIsLoggedIn,
    onSuccess

}) {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
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
                        "/member/login",
                        {
                            email:
                                email.trim(),
                            password
                        }
                    );

                const {
                    member,
                    token,
                    forcePasswordChange
                } = response.data;

                localStorage.setItem(
                    "token",
                    token
                );

                localStorage.setItem(
                    "userType",
                    "member"
                );

                localStorage.setItem(
                    "memberId",
                    member.id
                );

                localStorage.setItem(
                    "memberName",
                    member.name
                );

                localStorage.setItem(
                    "memberEmail",
                    member.email
                );

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "forcePasswordChange",
                    forcePasswordChange ? "true" : "false"
                );

                setIsLoggedIn(true);

                if (forcePasswordChange) {
                    toast(
                        "You must change your password before continuing."
                    );
                }

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
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>
                    setEmail(
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
                    onChange={(e)=>
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
                    onClick={()=>
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
                        ?
                        <FaEyeSlash />
                        :
                        <FaEye />
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
                    ?
                    "Signing In..."
                    :
                    "Member Login"
                }

            </button>

            <button
                type="button"
                onClick={() =>
                    navigate("/member/forgot-password")
                }
                className="
                    text-blue-600
                    hover:underline
                    text-sm
                    mt-2
                "
            >
                Forgot Password?
            </button>

        </form>

    );

}

export default MemberLoginForm;