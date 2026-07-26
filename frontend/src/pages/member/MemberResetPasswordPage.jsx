import AuthLayout from "../../layouts/AuthLayout";

import ResetPasswordForm from "../../forms/ResetPasswordForm";

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