import AuthLayout
    from "../../components/auth/AuthLayout";

import ResetPasswordForm
    from "../../components/auth/ResetPasswordForm";

const MemberResetPasswordPage = () => {

    return (

        <AuthLayout>

            <ResetPasswordForm
                userType="member"
            />

        </AuthLayout>

    );

};

export default MemberResetPasswordPage;