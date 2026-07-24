import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState, useEffect } from "react";

import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import { Toaster } from "react-hot-toast";

function App() {

    const [isLoggedIn,
        setIsLoggedIn] =
        useState(
            !!localStorage.getItem("token")
        );

    const [userType,
        setUserType] =
        useState(
            localStorage.getItem("userType") || "guest"
        );

    const [role,
        setRole] =
        useState(
            localStorage.getItem("role") || null
        );

    useEffect(() => {

        const darkMode =
            localStorage.getItem(
                "darkMode"
            ) === "true";

        if (darkMode) {

            document.documentElement
                .classList.add("dark");
        }

    }, []);

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <DashboardPage
                            isLoggedIn={isLoggedIn}
                            setIsLoggedIn={setIsLoggedIn}

                            userType={userType}
                            setUserType={setUserType}

                            role={role}
                            setRole={setRole}
                        />
                    }
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPasswordPage />}
                />

            </Routes>

            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                }}
            />

        </BrowserRouter>
    );
}

export default App;