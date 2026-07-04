import MemberAuthLayout from "../layouts/MemberAuthLayout";
import ChangePasswordForm from "../forms/ChangePasswordForm";

function ChangePasswordPage() {

    return (

        <MemberAuthLayout>

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
                Change Password
            </h1>

            <p
                className="
                    text-center
                    text-gray-600
                    dark:text-gray-300
                    mb-6
                "
            >
                Your password must be changed before continuing.
            </p>

        <ChangePasswordForm

            endpoint="/member/changeUserPassword"

            buttonText="Change Password"

            onSuccess={() => {

                localStorage.setItem(
                    "forcePasswordChange",
                    "false"
                );

                localStorage.setItem(
                    "mustChangePassword",
                    "false"
                );

                window.location.reload();

            }}

        />            

        </MemberAuthLayout>

    );

}

export default ChangePasswordPage;