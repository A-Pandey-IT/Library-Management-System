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
                    mb-6
                    text-gray-800
                    dark:text-white
                "
            >
                Library Management
            </h1>

            <LoginForm
                setIsLoggedIn={
                    setIsLoggedIn
                }
            />

        </AuthLayout>

    );
}

export default LoginPage;