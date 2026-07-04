import { useState, useEffect } from "react";

import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashboardPage";

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
        <>
            <DashboardPage
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}

                userType={userType}
                setUserType={setUserType}

                role={role}
                setRole={setRole}
            />
        </>
    );
}

export default App;