import { useEffect, useRef } from "react";

import {
    FaTimes,
    FaUsers,
    FaBook,
    FaExchangeAlt,
    FaReceipt,
    FaShoppingCart,
    FaSignOutAlt,
    FaKey,
    FaHome
} from "react-icons/fa";

function Sidebar({
    isOpen,
    isLoggedIn,
    userType,
    role,
    setActivePage,
    logout,
    onLogin,
    onMemberLogin,
    closeSidebar
}) {

    const sidebarRef = useRef(null);

    useEffect(() => {

    const handleClickOutside =
        (event) => {

            if (
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(
                    event.target
                )
            ) {

                closeSidebar();
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, [isOpen, closeSidebar]);

    return (

        <div
            
        >

            {
        isOpen && 
        (
            <div
                className="
                    fixed
                    inset-0
                    bg-black/60
                    z-100
                "
                onClick={closeSidebar}
            />
        )
    }

        <div
            ref={sidebarRef}
            className={`
                fixed
                top-0
                -left-4
                h-screen
                w-64
                bg-[rgba(0,0,0.65)]
                text-white
                shadow-[8px_0px_10px_rgba(255,255,255,0.3)]
                z-150
                transition-transform
                duration-300

                ${
                    isOpen
                        ? "translate-x-4"
                        : "-translate-x-full"
                }
            `}
        >

            <div
                className="
                    flex
                    justify-between
                    items-center
                    p-5
                    border-b
                    border-gray-700
                "
            >

                <h2
                    className="
                        font-bold
                    "
                >
                    Library
                </h2>

                <button
                    onClick={
                        closeSidebar
                    }
                >
                    <FaTimes 
                        className="
                            text-[26px]
                            p-1
                            rounded-full
                            cursor-pointer
                            hover:bg-gray-800
                            transition-all
                            duration-300
                        "
                    />
                </button>

            </div>

            <ul
                className="
                    flex
                    flex-col
                    gap-3
                    p-4
                    space-y-4
                "
            >

                <li
                    onClick={() => {
                        setActivePage(
                            "dashboard"
                        );
                        closeSidebar();
                    }}
                    className="
                        cursor-pointer
                        px-3
                        py-2
                        rounded-lg
                        hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]
                        transition-all
                        duration-200
                    "
                >
                    <FaHome
                        className="
                            inline
                            mr-2
                        "
                    />
                    Dashboard
                </li>

                {
                    isLoggedIn && 
                    userType === "staff" &&
                    (

                        <li
                            onClick={() =>{
                                setActivePage(
                                    "users"
                                );
                                closeSidebar();
                            }}
                            className="
                                cursor-pointer
                                px-3
                                py-2
                                rounded-lg
                                hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]
                                transition-all
                                duration-200
                            "
                        >
                            <FaUsers
                                className="
                                    inline
                                    mr-2
                                "
                            />
                            Users
                        </li>

                    )
                }

                {
                    isLoggedIn &&
                    userType === "staff" &&
                    (<li
                        onClick={() =>{
                            setActivePage(
                                "books"
                            );
                            closeSidebar();
                        }}
                        className="
                            cursor-pointer
                            px-3
                            py-2
                            rounded-lg
                            hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]
                            transition-all
                            duration-200
                        "
                    >
                        <FaBook
                            className="
                                inline
                                mr-2
                            "
                        />
                        Books
                    </li>)
                }

                <li
                    onClick={() =>{
                        setActivePage(
                            "issues"
                        );
                        closeSidebar();
                    }}
                    className="
                        cursor-pointer
                        px-3
                        py-2
                        rounded-lg
                        hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]
                        transition-all
                        duration-200
                    "
                >
                    <FaExchangeAlt
                        className="
                            inline
                            mr-2
                        "
                    />
                    {
                        userType === "member"
                        ? "My Issues"
                        : "Issues"
                    }
                </li>

                <li
                    onClick={() =>{
                        setActivePage(
                            "transactions"
                        );
                        closeSidebar();
                    }}
                    className="
                        cursor-pointer
                        px-3
                        py-2
                        rounded-lg
                        hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]
                        transition-all
                        duration-200
                    "
                >
                    <FaReceipt
                        className="
                            inline
                            mr-2
                        "
                    />
                    {
                        userType === "member"
                        ? "My Transactions"
                        : "Transactions"
                    }
                </li>

                {
                    isLoggedIn &&
                    userType === "staff" &&
                    (<li
                        onClick={() => {
                            setActivePage(
                                "purchase"
                            );
                            closeSidebar();
                        }}
                        className="
                            cursor-pointer
                            px-3
                            py-2
                            rounded-lg
                            hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]
                            transition-all
                            duration-200
                        "
                    >
                        <FaShoppingCart
                            className="
                                inline
                                mr-2
                            "
                        />
                        Purchase
                    </li>)
                }

                {
                    isLoggedIn &&
                    (<li
                        onClick={() => {
                            setActivePage(
                                "changePassword"
                            );
                            closeSidebar();
                        }}
                        className="
                            cursor-pointer
                            px-3
                            py-2
                            rounded-lg
                            hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]
                            transition-all
                            duration-200
                        "
                    >
                        <FaKey
                            className="
                                inline
                                mr-2
                            "
                        />
                        Change Password
                    </li>)
                }

                {
                    isLoggedIn ? (

                        <li
                            onClick={logout}
                            className="
                                cursor-pointer
                                px-3
                                py-2
                                rounded-lg
                                hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]
                                transition-all
                                duration-200
                            "
                        >
                            <FaSignOutAlt
                                className="
                                    inline
                                    mr-2
                                "
                            />
                            Logout
                        </li>

                    ) : (

                        <>

                            <li
                                onClick={() => {

                                    onLogin?.();

                                    closeSidebar();

                                }}
                                className="
                                    cursor-pointer
                                    px-3
                                    py-2
                                    rounded-lg
                                    hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]
                                    transition-all
                                    duration-200
                                "
                            >
                                <FaSignOutAlt
                                    className="
                                        inline
                                        mr-2
                                    "
                                />
                                Staff Login
                            </li>

                            <li
                                onClick={() => {

                                    onMemberLogin?.();

                                    closeSidebar();

                                }}
                                className="
                                    cursor-pointer
                                    px-3
                                    py-2
                                    rounded-lg
                                    hover:shadow-[0px_0px_10px_rgba(255,255,255,0.5)]
                                    transition-all
                                    duration-200
                                "
                            >
                                <FaSignOutAlt
                                    className="
                                        inline
                                        mr-2
                                    "
                                />
                                Member Login
                            </li>

                        </>

                    )
                }

                {

                    role === "LIBRARIAN" && (

                        <li
                            onClick={() => {
                                setActivePage("admins");
                                closeSidebar();
                            }}
                            className="..."
                        >
                            Admin Management
                        </li>
                    )
                }
            </ul>

        </div>
        </div>
    );
}

export default Sidebar;