import AuthLayout from "../layouts/AuthLayout";
import ResetPasswordForm from "../forms/ResetPasswordForm";

function ResetPasswordPage() {
    const token =
    sessionStorage.getItem("resetToken");

    if (!token) {
        navigate("/forgot-password");
    }

    useEffect(() => {
        const token =
            sessionStorage.getItem("resetToken");

        if (!token) {
            navigate("/forgot-password");
        }
    }, []);

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
                Reset Password
            </h1>

            <p
                className="
                    text-center
                    text-gray-600
                    dark:text-gray-300
                    mb-6
                "
            >
                Enter your new password.
            </p>

            <ResetPasswordForm />

        </AuthLayout>

    );

}

export default ResetPasswordPage;
