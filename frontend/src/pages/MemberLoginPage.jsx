import MemberAuthLayout from "../layouts/MemberAuthLayout";
import MemberLoginForm from "../forms/MemberLoginForm";

function MemberLoginPage({
    setIsLoggedIn,
    onSuccess
}) {

    return (

        

        <MemberAuthLayout>

            <MemberLoginForm
                setIsLoggedIn={setIsLoggedIn}
                onSuccess={onSuccess}
            />

        </MemberAuthLayout>

    );

}

export default MemberLoginPage;