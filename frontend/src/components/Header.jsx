import {
    FaBars,
    FaMoon,
    FaSun
} from "react-icons/fa";

function Header({
    toggleSidebar,
    darkMode,
    toggleDarkMode,
    activePage,
    onAddMember
}) {

    const showAddButton =
    activePage === "users" ||
    activePage === "books" ||
    activePage === "purchase";

    return (

        <header
            className="
                fixed
                top-0
                left-0
                right-0 

                h-16
                flex
                items-center
                justify-between
                px-6
                bg-gradient-to-r
                from-purple-500
                to-pink-400
                dark:from-gray-700
                dark:to-gray-700
                shadow
                z-40
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-10
                "
            >

                <button
                    onClick={
                        toggleSidebar
                    }
                >
                    <FaBars
                        
                        className="
                            text-2xl
                            text-white
                            cursor-pointer
                        "
                    />
                </button>

                <h1
                    className="
                        text-xl
                        font-bold
                        text-amber-50                        
                    "
                >
                    Library Management System
                </h1>

            </div>

            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >

                {
                    showAddButton && (
                        <button
                            onClick={onAddMember}
                            className="
                                flex
                                items-center
                                gap-2
                                bg-gradient-to-r
                                from-pink-600
                                to-red-400
                                dark:from-cyan-950
                                dark:to-cyan-700
                                text-white
                                px-3
                                py-2
                                rounded
                                cursor-pointer
                            "
                        >
                            {
                                activePage === "users"
                                    ? "+ Member"
                                : activePage === "books"
                                    ? "+ Book"
                                : "+ Purchase"
                            }
                        </button>
                    )
                }

                <button
                    onClick={()=> {
                        console.log("Clicked");
                        toggleDarkMode()
                    }}
                >
                    {
                        darkMode
                            ?  <FaSun 
                                className="
                                    text-2xl
                                    text-yellow-100
                                    cursor-pointer
                                "
                            />
                            : <FaMoon className="
                                text-2xl
                                    text-gray-800
                                    cursor-pointer
                                " 
                            />
                    }

                    
                </button>

            </div>

        </header>
    );
}

export default Header;