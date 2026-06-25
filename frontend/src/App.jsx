import { useState, useEffect } from "react";

import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashboardPage";

function App() {

    const [isLoggedIn,
        setIsLoggedIn] =
        useState(
            !!localStorage.getItem(
                "token"
            )
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
                isLoggedIn={
                    isLoggedIn
                }

                setIsLoggedIn={setIsLoggedIn}
            />
        </>
    );
}

export default App;