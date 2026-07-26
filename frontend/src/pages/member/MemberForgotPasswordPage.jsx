import AuthLayout from "../../components/auth/AuthLayout";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

function MemberForgotPasswordPage() {

    return (

        <AuthLayout
            title="Forgot Password"
            subtitle="Verify your email to reset your password"
        >

            <ForgotPasswordForm
                userType="member"
            />

        </AuthLayout>

    );

}

export default MemberForgotPasswordPage;