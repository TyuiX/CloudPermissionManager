import React, {useContext} from 'react';
import {GoogleLogin} from "react-google-login";
import googleAuth from "../../../../utils/GoogleAuth";
import {UserContext} from "../../../../utils/context/UserContext";
import {gapi} from "gapi-script";

export default function LinkGoogleLink() {
    const {user, setGoogleAcc} = useContext(UserContext)

    const onSuccess = async (res) => {
        console.log(res)
        console.log("login success: ", res.profileObj);

        setGoogleAcc(user.email, gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().cu)
    }

    const onFailure = (res) => {
        console.log("login failed: " + res);
    }

    return (
        <div>
            <GoogleLogin
                clientId={googleAuth.clientId}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                buttonText="Link Google account"
            />
        </div>
    )
}