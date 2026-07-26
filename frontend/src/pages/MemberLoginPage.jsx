import MemberAuthLayout from "../layouts/MemberAuthLayout";
import MemberLoginForm from "../forms/MemberLoginForm";

function MemberLoginPage({
    setIsLoggedIn,
    onSuccess
}) {

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
                Member Login
            </p>

            <MemberLoginForm
                setIsLoggedIn={setIsLoggedIn}
                onSuccess={onSuccess}
            />

        </MemberAuthLayout>

    );

}

export default MemberLoginPage;