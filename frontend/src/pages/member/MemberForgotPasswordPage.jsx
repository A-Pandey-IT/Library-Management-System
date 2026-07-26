import AuthLayout from "../../layouts/AuthLayout";
import ForgotPasswordForm from "../../forms/ForgotPasswordForm";
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