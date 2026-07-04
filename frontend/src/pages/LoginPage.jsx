import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../forms/LoginForm";

function LoginPage({
    setIsLoggedIn
}) {

    return (

        <AuthLayout>

            <h1
                className="
                    text-3xl
                    font-bold
                    text-center
                    mb-2
                    text-gray-800
                    dark:text-white
                "
            >
                Library Management
            </h1>

            <p
                className="
                    text-center
                    text-gray-600
                    dark:text-gray-300
                    mb-6
                "
            >
                Staff Login
            </p>

            <LoginForm
                setIsLoggedIn={
                    setIsLoggedIn
                }
            />

        </AuthLayout>

    );
}

export default LoginPage;