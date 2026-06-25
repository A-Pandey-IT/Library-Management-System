function AuthLayout({ children }) {

    return (

        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-100
                dark:bg-gray-900
                transition-colors
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    bg-white
                    dark:bg-gray-800
                    shadow-lg
                    rounded-xl
                    p-8
                "
            >

                {children}

            </div>

        </div>
    );
}

export default AuthLayout;