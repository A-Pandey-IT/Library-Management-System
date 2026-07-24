
import AuthLayout from "../layouts/AuthLayout";
import ForgotPasswordForm from "../forms/ForgotPasswordForm.jsx";

function ForgotPasswordPage() {

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
                Forgot Password
            </h1>

            <p
                className="
                    text-center
                    text-gray-600
                    dark:text-gray-300
                    mb-6
                "
            >
                Enter your registered email to receive an OTP.
            </p>

            <ForgotPasswordForm />

        </AuthLayout>

    );

}

export default ForgotPasswordPage;
