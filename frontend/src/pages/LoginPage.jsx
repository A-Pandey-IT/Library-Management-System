import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../forms/LoginForm";
import { Link } from "react-router-dom";


function LoginPage({
    setIsLoggedIn,
    onClose
}) {
    const navigate = useNavigate();

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
            <button
                type="button"
                onClick={() => {
                    onClose?.();
                    navigate("/forgot-password");
                }}
            >
                Forgot Password?
            </button>
        </AuthLayout>

    );
}

export default LoginPage;